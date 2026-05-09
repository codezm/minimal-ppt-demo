/**
 * 可视化编辑器数据模型
 */

export type ElementType = 'text' | 'image' | 'shape' | 'rectangle' | 'circle'

export interface Position {
  x: number // 水平位置 (px)
  y: number // 竖直位置 (px)
}

export interface Size {
  width: number  // 宽度 (px)
  height: number // 高度 (px)
}

export interface TextElementData {
  type: 'text'
  id: string
  content: string
  fontSize: number
  fontFamily: string
  color: string
  fontWeight: 'normal' | 'bold'
  textAlign: 'left' | 'center' | 'right'
  position: Position
  size: Size
  zIndex: number
  rotation: number
}

export interface ImageElementData {
  type: 'image'
  id: string
  dataUrl: string
  position: Position
  size: Size
  zIndex: number
  rotation: number
  borderRadius: number
  opacity: number
}

export interface ShapeElementData {
  type: 'rectangle' | 'circle'
  id: string
  position: Position
  size: Size
  zIndex: number
  backgroundColor: string
  borderColor: string
  borderWidth: number
  opacity: number
  rotation: number
}

export type ElementData = TextElementData | ImageElementData | ShapeElementData

export interface CanvasPageData {
  id: string
  title: string
  width: number    // 画布宽度 (px)
  height: number   // 画布高度 (px)
  backgroundColor: string
  elements: ElementData[]
}
