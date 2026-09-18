import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/App'
import { initialAppState } from '../../src/app-bootstrap'

describe('Vocal UI interactions', () => {
  it('renders roar button and toggles vocal playback state in zh-CN', async () => {
    render(<App initialState={{ ...initialAppState, locale: 'zh-CN' }} />)

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
    render(<App initialState={{ ...initialAppState, locale: 'en' }} />)

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
