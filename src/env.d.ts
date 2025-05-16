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
    id: string
    collectionId: string
    title: string
    tags: string
    files: string[]
    layers: LayerData[]
}
