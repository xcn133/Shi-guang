export interface Photo {
  id: number
  url: string
  caption: string
  date: string
  location?: string
  isLastPhoto?: boolean
  isGroupPhoto?: boolean
}

export interface LoveMessage {
  id: number
  text: string
  unlocked: boolean
}

export interface Petal {
  id: number
  x: number
  y: number
  size: number
  speed: number
  rotation: number
  opacity: number
}

export type GalleryMode = '3d-cube' | 'timeline' | 'polaroid'
