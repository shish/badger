/// <reference types="@rsbuild/core/types" />

type LayerType = 'image' | 'hflag' | 'edge-text'

type LayerData =
    | {
          type: 'image'
          image: string
          scale: number
          offset: [number, number]
      }
    | {
          type: 'hflag'
          stripes: Array<{ color: string; size: number }>
      }
    | {
          type: 'edge-text'
          text: string
          startOffset?: number
      }

interface BadgeData {
    title: string
    tags: string[]
    layers: LayerData[]
}

interface PageData {
    scale: number
    badges: Record<string, number>
}
