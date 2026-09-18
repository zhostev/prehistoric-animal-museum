import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AnimalCollectionSheet } from '../../src/components/AnimalCollectionSheet'
import { I18nProvider } from '../../src/i18n/I18nProvider'

const mockAnimals = [
  {
    id: 'smilodon',
    name: '剑齿虎',
    classification: '剑齿猫亚科猫科动物',
    thumbnail: '/images/smilodon.webp',
    chronologyBadge: '更新世 · 约180万年前',
    mya: 1.8,
  },
  {
    id: 'anomalocaris',
    name: '奇虾',
    classification: '放射齿目奇虾科',
    thumbnail: '/images/anomalocaris.webp',
    chronologyBadge: '寒武纪 · 约5.08亿年前',
    mya: 508,
  },
  {
    id: 'tyrannosaurus-rex',
    name: '霸王龙',
    classification: '暴龙科',
    thumbnail: '/images/tyrannosaurus.webp',
    chronologyBadge: '晚白垩世 · 约6650万年前',
    mya: 66.5,
  },
]

describe('AnimalCollectionSheet sorting and badges', () => {
  it('renders sort toggle and switches to timeline order', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onClose = vi.fn()
    const returnFocusTo = { current: null }

    render(
      <I18nProvider initialState={{ locale: 'zh-CN', preference: 'zh-CN' }}>
        <AnimalCollectionSheet
          animals={mockAnimals}
          currentAnimalId="smilodon"
          loadingAnimalId={null}
          loadingPhase={null}
          loadingPercent={null}
          onClose={onClose}
          onSelect={onSelect}
          open={true}
          returnFocusTo={returnFocusTo}
        />
      </I18nProvider>,
    )

    // Verify sort buttons exist
    const featuredBtn = screen.getByRole('radio', { name: '精选推荐' })
    const timelineBtn = screen.getByRole('radio', { name: '生命时间轴' })
    expect(featuredBtn).toBeVisible()
    expect(timelineBtn).toBeVisible()
    expect(featuredBtn).toHaveAttribute('aria-checked', 'true')

    // In featured mode, first animal is smilodon
    const cards = screen.getAllByRole('button', { name: /前往/ })
    expect(cards[0]).toHaveAttribute('data-collection-animal-id', 'smilodon')

    // Verify chronology badge is rendered
    expect(screen.getByText('更新世 · 约180万年前')).toBeVisible()
    expect(screen.getByText('寒武纪 · 约5.08亿年前')).toBeVisible()

    // Switch to timeline mode (oldest-first)
    await user.click(timelineBtn)
    expect(timelineBtn).toHaveAttribute('aria-checked', 'true')

    // In timeline mode, first animal should be oldest (anomalocaris)
    const sortedCards = screen.getAllByRole('button', { name: /前往/ })
    expect(sortedCards[0]).toHaveAttribute('data-collection-animal-id', 'anomalocaris')
    expect(sortedCards[1]).toHaveAttribute('data-collection-animal-id', 'tyrannosaurus-rex')
    expect(sortedCards[2]).toHaveAttribute('data-collection-animal-id', 'smilodon')
  })
})
