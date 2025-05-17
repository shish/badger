/// <reference types="@rsbuild/core/types" />
/// <reference types="pocketbase" />

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
    created: string
    updated: string
    owner: string
    title: string
    public: boolean
    tags: string
    files: Array<string | File>
    layers: LayerData[]
}
