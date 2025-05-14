/// <reference types="@rsbuild/core/types" />

type LayerData =
    | {
          type: 'image'
          image: string
          scale?: number
          offset?: [number, number]
      }
    | {
          type: 'hflag'
          stripes: Array<{ color: string; size: number }>
          scale?: number
          offset?: [number, number]
      }
    | {
          type: 'edge-text'
          text: string
          startOffset?: number
      }

interface BadgeData {
    title: string
    layers: LayerData[]
}

interface PageData {
    scale: number
    badges: Record<string, number>
}
