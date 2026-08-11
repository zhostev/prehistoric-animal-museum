import { defineConfig, devices } from '@playwright/test'

const nestedBase = '/prehistoric-animal-museum/'
const port = 4187

// Opt-in real-GPU rendering for machines with a usable GPU (e.g. /dev/dri +
// NVIDIA). CI and default local runs stay on the bundled software renderer.
// Requires the full Chromium build: npx playwright install chromium
const useGpu = Boolean(process.env.MUSEUM_E2E_GPU)
const gpuLaunch = {
  channel: 'chromium' as const,
  launchOptions: {
    args: [
      '--use-gl=angle',
      '--use-angle=vulkan',
      '--enable-features=Vulkan',
      '--enable-gpu',
      '--ignore-gpu-blocklist',
    ],
  },
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 3,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:${port}${nestedBase}`,
    locale: 'zh-CN',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...(useGpu ? gpuLaunch : {}),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run build:e2e && node server.mjs dist --port ${port} --base ${nestedBase} --fixture-model-delay 1800`,
    url: `http://127.0.0.1:${port}${nestedBase}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
