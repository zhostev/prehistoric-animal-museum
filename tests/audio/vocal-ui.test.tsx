import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/App'
import type { InitialAppState } from '../../src/app-bootstrap'

const zhState: InitialAppState = {
  animalId: 'stegosaurus',
  locale: 'zh-CN',
  pageKind: 'museum',
  preference: 'zh-CN',
}

const enState: InitialAppState = {
  animalId: 'stegosaurus',
  locale: 'en',
  pageKind: 'museum',
  preference: 'en',
}

describe('Vocal UI interactions', () => {
  it('renders roar button and toggles vocal playback state in zh-CN', async () => {
    render(<App initialState={zhState} />)

    const roarButton = await screen.findByRole('button', { name: /听.*的叫声/ })
    expect(roarButton).toBeInTheDocument()
    expect(roarButton).toHaveTextContent('听叫声')
    expect(roarButton).not.toHaveClass('is-roaring')

    // Click to start roaring
    fireEvent.click(roarButton)
    expect(roarButton).toHaveTextContent('吼叫中…')
    expect(roarButton).toHaveClass('is-roaring')

    // Click again to stop
    fireEvent.click(roarButton)
    expect(roarButton).toHaveTextContent('听叫声')
    expect(roarButton).not.toHaveClass('is-roaring')
  })

  it('renders roar button in English when locale is en', async () => {
    render(<App initialState={enState} />)

    const roarButton = await screen.findByRole('button', { name: /Hear .* call/ })
    expect(roarButton).toBeInTheDocument()
    expect(roarButton).toHaveTextContent('Hear call')
    expect(roarButton).not.toHaveClass('is-roaring')

    fireEvent.click(roarButton)
    expect(roarButton).toHaveTextContent('Calling…')
    expect(roarButton).toHaveClass('is-roaring')

    fireEvent.click(roarButton)
    expect(roarButton).toHaveTextContent('Hear call')
    expect(roarButton).not.toHaveClass('is-roaring')
  })
})
