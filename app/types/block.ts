export type BlockSupportsData = {
  anchor?: boolean
  align?: boolean | ('left' | 'center' | 'right' | 'wide' | 'full')[]
  alignWide?: boolean
  className?: boolean
  customClassName?: boolean
  html?: boolean
  inserter?: boolean
  multiple?: boolean
  reusable?: boolean
  lock?: boolean
  renaming?: boolean
  splitting?: boolean
  color?: {
    text?: boolean
    background?: boolean
    link?: boolean
    gradients?: boolean
    heading?: boolean
    button?: boolean
  }
  typography?: {
    fontSize?: boolean
    lineHeight?: boolean
    textAlign?: boolean
  }
  spacing?: {
    margin?: boolean | ('top' | 'right' | 'bottom' | 'left' | 'vertical' | 'horizontal')[]
    padding?: boolean | ('top' | 'right' | 'bottom' | 'left' | 'vertical' | 'horizontal')[]
  }
  dimensions?: {
    minHeight?: boolean
    aspectRatio?: boolean
  }
  border?: {
    radius?: boolean
    color?: boolean
    width?: boolean
    style?: boolean
  }
  layout?: boolean | {
    allowSwitching?: boolean
    allowInheriting?: boolean
    allowVerticalAlignment?: boolean
    allowJustification?: boolean
    allowOrientation?: boolean
    default?: {
      type?: 'constrained' | 'flex' | 'grid'
    }
  }
  position?: {
    sticky?: boolean
  }
}

export type BlockOptionsData = {
  name: string
  title: string
  description: string
  category: 'text' | 'media' | 'design' | 'widgets' | 'theme' | 'embed'
  icon: string
  keywords: string[]
  textdomain: string
  apiVersion: number
  version: string
  render?: string | null
  parent?: string[]
  ancestor?: string[]
  allowedBlocks?: string[]
  supports?: BlockSupportsData
}
