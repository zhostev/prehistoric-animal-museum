#!/usr/bin/env python3
"""Narration stage of the animal-onboarding toolchain.

Generates the offline TTS narration for one or more candidate profiles with
the pinned Qwen3-TTS CustomVoice checkpoint, enforces the approved voice
matrix (zh-CN = Serena/Chinese, en = Serena/English), runs generation twice
with the same fixed seed and requires byte-identical raw output, then encodes
a loudness-normalized 48 kHz mono MP3 plus a per-locale metrics record.

Usage:
    ../.runtime/qwen3-tts/venv/bin/python \
        tools/animal-onboarding/audio/generate_narration.py \
        <profile.json...> [--locale zh-CN --locale en]

Exit codes (per docs/specification/animal-onboarding-standard.md §4):
    0  every requested locale passed
    1  an automated hard gate failed (voice mismatch, non-identical raw runs,
       oversized MP3, generation/encoding failure)
    2  invalid invocation or profile (missing script file, bad schema)
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import random
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

# Must be set before cuBLAS initializes; required by
# torch.use_deterministic_algorithms on CUDA.
os.environ.setdefault("CUBLAS_WORKSPACE_CONFIG", ":4096:8")

MODEL_REPO_ID = "Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice"
MODEL_REVISION = "85e237c12c027371202489a0ec509ded67b5e4b5"
MODEL_DIR = Path(
    "/home/idea/code/.runtime/qwen3-tts/models/Qwen3-TTS-12Hz-0.6B-CustomVoice"
)

# Approved voice matrix: locale -> (speaker, language). Anything else is a
# hard failure; never substitute one locale for another.
VOICE_MATRIX = {
    "zh-CN": ("Serena", "Chinese"),
    "en": ("Serena", "English"),
}

FIXED_SEED = 20260810

# Greedy decoding: the library exposes no seed parameter, so determinism is
# pinned by disabling sampling in the talker and sub-talker and reseeding
# torch/numpy/random before every run.
DECODING = {"doSample": False, "subtalkerDosample": False}

TARGET_SAMPLE_RATE = 48000
MP3_BITRATE = "64k"
MP3_TARGET_BYTES = 200 * 1024
MP3_CEILING_BYTES = 300 * 1024
LOUDNORM_FILTER = "loudnorm=I=-16:TP=-1.5:LRA=11"

EXIT_HARD_GATE = 1
EXIT_INVALID = 2


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def fail(message: str) -> None:
    raise RuntimeError(message)


def set_seeds(seed: int) -> None:
    import torch

    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True


def enable_deterministic_algorithms() -> bool:
    """Pin CUDA kernel selection so separate processes agree bit-for-bit.

    Greedy decoding makes the two runs inside one process identical, but
    default cuBLAS/cuDNN algorithm selection can still vary between
    processes (e.g. split-k under external GPU load), which made raw audio
    drift across invocations in testing. Requires CUBLAS_WORKSPACE_CONFIG
    to be set before cuBLAS initializes (done at module import below).
    """
    import torch

    try:
        torch.use_deterministic_algorithms(True)
        return True
    except Exception as exc:  # pragma: no cover - defensive
        print(f"WARNING: deterministic algorithms unavailable: {exc}", file=sys.stderr)
        return False


def probe_cudnn() -> bool:
    """True when cuDNN works; otherwise disable it (native CUDA kernels)."""
    import torch

    if not torch.cuda.is_available():
        return False
    try:
        x = torch.randn(1, 2, 8, 8, device="cuda")
        torch.nn.functional.conv2d(x, torch.randn(2, 2, 3, 3, device="cuda"))
        torch.cuda.synchronize()
        return True
    except RuntimeError:
        # e.g. CUDNN_STATUS_NOT_INITIALIZED under external VRAM pressure;
        # native CUDA fallback kernels are slower but numerically consistent.
        torch.backends.cudnn.enabled = False
        print(
            "WARNING: cuDNN init failed; using native CUDA fallback kernels "
            "(torch.backends.cudnn.enabled=False)",
            file=sys.stderr,
        )
        return False


def load_model():
    import torch
    from qwen_tts import Qwen3TTSModel

    if not MODEL_DIR.is_dir():
        fail(f"pinned model snapshot missing: {MODEL_DIR}")
    cudnn_ok = probe_cudnn()
    model = Qwen3TTSModel.from_pretrained(
        str(MODEL_DIR),
        device_map="cuda:0" if torch.cuda.is_available() else "cpu",
        dtype=torch.bfloat16,
    )
    model._cudnn_enabled = cudnn_ok
    model._device = "cuda" if torch.cuda.is_available() else "cpu"
    model._deterministic_algorithms = enable_deterministic_algorithms()
    speakers = model.get_supported_speakers() or []
    languages = model.get_supported_languages() or []
    if "serena" not in {s.lower() for s in speakers}:
        fail(f"approved speaker 'Serena' not in supported speakers: {speakers}")
    for lang in ("Chinese", "English"):
        if lang.lower() not in {l.lower() for l in languages}:
            fail(f"approved language '{lang}' not in supported languages: {languages}")
    return model


def generate_raw(model, text: str, speaker: str, language: str, seed: int):
    """One seeded generation pass; returns (float32 mono wav, sample rate)."""
    set_seeds(seed)
    wavs, fs = model.generate_custom_voice(
        text=text,
        speaker=speaker,
        language=language,
        do_sample=DECODING["doSample"],
        subtalker_dosample=DECODING["subtalkerDosample"],
    )
    wav = np.asarray(wavs[0], dtype=np.float32).reshape(-1)
    return wav, int(fs)


def encode_mp3(wav: np.ndarray, src_rate: int, out_path: Path) -> None:
    """Loudness-normalize and encode 48 kHz mono MP3 via imageio-ffmpeg."""
    import imageio_ffmpeg

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        ffmpeg, "-y", "-hide_banner", "-loglevel", "error",
        "-f", "f32le", "-ar", str(src_rate), "-ac", "1", "-i", "pipe:0",
        "-af", LOUDNORM_FILTER,
        "-ar", str(TARGET_SAMPLE_RATE), "-ac", "1",
        "-c:a", "libmp3lame", "-b:a", MP3_BITRATE,
        str(out_path),
    ]
    proc = subprocess.run(
        cmd, input=wav.astype(np.float32).tobytes(), capture_output=True
    )
    if proc.returncode != 0:
        fail(f"ffmpeg MP3 encode failed: {proc.stderr.decode(errors='replace')}")


def decode_mp3(path: Path) -> tuple[np.ndarray, int]:
    """Decode an MP3 back to float32 mono at 48 kHz for sanity checks."""
    import imageio_ffmpeg

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [
        ffmpeg, "-hide_banner", "-loglevel", "error",
        "-i", str(path), "-f", "f32le", "-acodec", "pcm_f32le",
        "-ar", str(TARGET_SAMPLE_RATE), "-ac", "1", "pipe:1",
    ]
    proc = subprocess.run(cmd, capture_output=True)
    if proc.returncode != 0:
        fail(f"ffmpeg MP3 decode failed: {proc.stderr.decode(errors='replace')}")
    return np.frombuffer(proc.stdout, dtype=np.float32), TARGET_SAMPLE_RATE


def write_float_wav(path: Path, wav: np.ndarray, sample_rate: int) -> None:
    """Write a canonical 32-bit float mono WAV.

    Deliberately not soundfile.write: libsndfile embeds a PEAK chunk with a
    wall-clock timestamp, so two byte-identical audio buffers produce
    different .wav files and the raw-run evidence cannot be hash-compared.
    """
    import struct

    data = np.asarray(wav, dtype="<f4").tobytes()
    fmt = struct.pack("<HHIIHH", 3, 1, sample_rate, sample_rate * 4, 4, 32)
    header = (
        b"RIFF"
        + struct.pack("<I", 4 + (8 + len(fmt)) + (8 + len(data)))
        + b"WAVE"
        + b"fmt "
        + struct.pack("<I", len(fmt))
        + fmt
        + b"data"
        + struct.pack("<I", len(data))
    )
    path.write_bytes(header + data)


def process_locale(model, profile_path: Path, profile: dict, locale: str) -> dict:
    """Generate one locale; returns the metrics record. Raises on violation."""
    base = profile_path.parent
    narration = profile.get("narration")
    if not isinstance(narration, dict) or locale not in narration:
        fail(f"profile {profile_path}: narration.{locale} missing")

    entry = narration[locale]
    expected_speaker, expected_language = VOICE_MATRIX[locale]
    speaker = entry.get("speaker")
    language = entry.get("language")
    if speaker != expected_speaker or language != expected_language:
        fail(
            f"profile {profile_path}: narration.{locale} voice matrix violation: "
            f"speaker={speaker!r} language={language!r}, "
            f"approved is speaker={expected_speaker!r} language={expected_language!r}"
        )

    for key in ("path", "scriptPath", "metricsPath"):
        if not entry.get(key):
            fail(f"profile {profile_path}: narration.{locale}.{key} missing")

    script_path = base / entry["scriptPath"]
    mp3_path = base / entry["path"]
    metrics_path = base / entry["metricsPath"]
    raw_dir = base / "output" / "audio" / "raw"

    if not script_path.is_file():
        raise FileNotFoundError(
            f"profile {profile_path}: script file missing: {script_path} "
            f"(locale content is authored before the narration stage runs)"
        )
    script_bytes = script_path.read_bytes()
    text = script_bytes.decode("utf-8").strip()
    if not text:
        fail(f"profile {profile_path}: script file is empty: {script_path}")

    # Two independent same-seed runs; raw outputs must be byte-identical.
    run1, fs1 = generate_raw(model, text, speaker, language, FIXED_SEED)
    run2, fs2 = generate_raw(model, text, speaker, language, FIXED_SEED)

    raw1_bytes = run1.tobytes()
    raw2_bytes = run2.tobytes()
    raw1_sha = sha256_bytes(raw1_bytes)
    raw2_sha = sha256_bytes(raw2_bytes)
    identical = fs1 == fs2 and raw1_bytes == raw2_bytes

    raw_dir.mkdir(parents=True, exist_ok=True)
    raw1_path = raw_dir / f"{locale}-run1.wav"
    raw2_path = raw_dir / f"{locale}-run2.wav"
    write_float_wav(raw1_path, run1, fs1)
    write_float_wav(raw2_path, run2, fs2)

    if not identical:
        fail(
            f"profile {profile_path} locale {locale}: same-seed raw runs differ "
            f"(run1 sha256={raw1_sha}, run2 sha256={raw2_sha}); "
            f"raw evidence kept under {raw_dir}"
        )

    duration = len(run1) / fs1
    peak = float(np.max(np.abs(run1))) if run1.size else 0.0
    rms = float(np.sqrt(np.mean(np.square(run1)))) if run1.size else 0.0

    encode_mp3(run1, fs1, mp3_path)
    mp3_bytes = mp3_path.read_bytes()
    if len(mp3_bytes) > MP3_CEILING_BYTES:
        fail(
            f"profile {profile_path} locale {locale}: MP3 {len(mp3_bytes)} bytes "
            f"exceeds the {MP3_CEILING_BYTES}-byte ceiling: {mp3_path}"
        )

    # Sanity check: the encoded MP3 decodes and is not silent.
    decoded, decoded_rate = decode_mp3(mp3_path)
    decoded_rms = (
        float(np.sqrt(np.mean(np.square(decoded)))) if decoded.size else 0.0
    )
    if decoded.size == 0 or decoded_rms < 1e-4:
        fail(
            f"profile {profile_path} locale {locale}: encoded MP3 decodes to "
            f"silence (rms={decoded_rms:.6f}): {mp3_path}"
        )

    metrics = {
        "model": {
            "repoId": MODEL_REPO_ID,
            "revision": MODEL_REVISION,
            "localPath": str(MODEL_DIR),
        },
        "locale": locale,
        "speaker": speaker,
        "language": language,
        "seed": FIXED_SEED,
        "decoding": {
            **DECODING,
            "device": getattr(model, "_device", "unknown"),
            "cudnnEnabled": bool(getattr(model, "_cudnn_enabled", False)),
            "deterministicAlgorithms": bool(
                getattr(model, "_deterministic_algorithms", False)
            ),
        },
        "script": {
            "path": entry["scriptPath"],
            "sha256": sha256_bytes(script_bytes),
            "bytes": len(script_bytes),
        },
        "rawRuns": {
            "identical": True,
            "sampleRate": fs1,
            "durationSeconds": round(duration, 6),
            "run1": {"path": str(raw1_path.relative_to(base)), "sha256": raw1_sha},
            "run2": {"path": str(raw2_path.relative_to(base)), "sha256": raw2_sha},
        },
        "durationSeconds": round(len(decoded) / decoded_rate, 6),
        "sampleRate": TARGET_SAMPLE_RATE,
        "channels": 1,
        "levels": {"peak": round(peak, 6), "rms": round(rms, 6)},
        "mp3": {
            "path": entry["path"],
            "bytes": len(mp3_bytes),
            "sha256": sha256_bytes(mp3_bytes),
        },
        "generatedAt": datetime.now(timezone.utc).isoformat(),
    }
    metrics_path.parent.mkdir(parents=True, exist_ok=True)
    metrics_path.write_text(json.dumps(metrics, indent=2, ensure_ascii=False) + "\n")

    size_note = ""
    if len(mp3_bytes) > MP3_TARGET_BYTES:
        size_note = f" (above {MP3_TARGET_BYTES}-byte target, within ceiling)"
    print(
        f"PASS {profile.get('id', profile_path.stem)} {locale}: "
        f"raw identical sha256={raw1_sha[:16]}…, {duration:.2f}s raw, "
        f"MP3 {len(mp3_bytes) / 1024:.1f} KiB{size_note} -> {entry['path']}"
    )
    return metrics


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate pinned-seed Qwen3-TTS narration for candidate profiles."
    )
    parser.add_argument("profiles", nargs="+", type=Path, help="profile.json paths")
    parser.add_argument(
        "--locale",
        action="append",
        choices=sorted(VOICE_MATRIX),
        dest="locales",
        help="locale to generate (repeatable; default: all approved locales)",
    )
    args = parser.parse_args()
    locales = args.locales or sorted(VOICE_MATRIX)

    profiles: list[tuple[Path, dict]] = []
    for p in args.profiles:
        if not p.is_file():
            print(f"ERROR invalid invocation: profile not found: {p}", file=sys.stderr)
            return EXIT_INVALID
        try:
            profiles.append((p, json.loads(p.read_text(encoding="utf-8"))))
        except (OSError, json.JSONDecodeError) as exc:
            print(f"ERROR invalid profile {p}: {exc}", file=sys.stderr)
            return EXIT_INVALID

    try:
        model = load_model()
    except Exception as exc:  # model load is a hard gate
        print(f"ERROR hard gate: {exc}", file=sys.stderr)
        return EXIT_HARD_GATE

    exit_code = 0
    for profile_path, profile in profiles:
        for locale in locales:
            try:
                process_locale(model, profile_path, profile, locale)
            except FileNotFoundError as exc:
                print(f"ERROR invalid profile: {exc}", file=sys.stderr)
                exit_code = EXIT_INVALID
            except Exception as exc:
                print(f"ERROR hard gate: {exc}", file=sys.stderr)
                if exit_code == 0:
                    exit_code = EXIT_HARD_GATE
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
