import { makeAutoObservable } from 'mobx'
import { CanvasPageData, ElementData } from '../types/canvas'

/**
 * Canvas Store - 可视化编辑器的核心状态
 * 管理画布上的所有元素
 */
export class CanvasStore {
  // 画布数据
  page: CanvasPageData | null = null

  // 选择的元素 ID
  selectedElementId: string | null = null

  // 编辑模式
  isEditingText: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  /**
   * 创建新画布页面
   */
  createPage(title: string) {
    this.page = {
      id: `page-${Date.now()}`,
      title,
      width: 1920,  // 16:9 比例
      height: 1080,
      backgroundColor: '#ffffff',
      elements: [],
    }
  }

  /**
   * 添加文本元素
   */
  addTextElement(text: string = 'New Text') {
    if (!this.page) return
    const newElement: ElementData = {
      type: 'text',
      id: `text-${Date.now()}`,
      content: text,
      fontSize: 32,
      fontFamily: 'Arial',
      color: '#000000',
      fontWeight: 'normal',
      textAlign: 'left',
      position: { x: 100, y: 100 },
      size: { width: 300, height: 60 },
      zIndex: this.page.elements.length,
      rotation: 0,
    }
    this.page.elements.push(newElement)
    this.selectedElementId = newElement.id
  }

  /**
   * 添加图片元素
   */
  addImageElement(dataUrl: string) {
    if (!this.page) return
    const newElement: ElementData = {
      type: 'image',
      id: `image-${Date.now()}`,
      dataUrl,
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      zIndex: this.page.elements.length,
      rotation: 0,
      borderRadius: 0,
      opacity: 1,
    }
    this.page.elements.push(newElement)
    this.selectedElementId = newElement.id
  }

  /**
   * 添加形状元素
   */
  addShapeElement(type: 'rectangle' | 'circle' = 'rectangle') {
    if (!this.page) return
    const newElement: ElementData = {
      type,
      id: `shape-${Date.now()}`,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
      zIndex: this.page.elements.length,
      backgroundColor: '#3b82f6',
      borderColor: '#000000',
      borderWidth: 1,
      opacity: 1,
      rotation: 0,
    }
    this.page.elements.push(newElement)
    this.selectedElementId = newElement.id
  }

  /**
   * 选择元素
   */
  selectElement(elementId: string | null) {
    this.selectedElementId = elementId
    this.isEditingText = false
  }

  /**
   * 删除元素
   */
  deleteElement(elementId: string) {
    if (!this.page) return
    this.page.elements = this.page.elements.filter((el) => el.id !== elementId)
    if (this.selectedElementId === elementId) {
      this.selectedElementId = null
    }
  }

  /**
   * 更新元素位置
   */
  updateElementPosition(elementId: string, x: number, y: number) {
    if (!this.page) return
    const element = this.page.elements.find((el) => el.id === elementId)
    if (element) {
      element.position = { x, y }
    }
  }

  /**
   * 更新元素尺寸
   */
  updateElementSize(elementId: string, width: number, height: number) {
    if (!this.page) return
    const element = this.page.elements.find((el) => el.id === elementId)
    if (element) {
      element.size = { width, height }
    }
  }

  /**
   * 更新文本内容
   */
  updateTextContent(elementId: string, content: string) {
    if (!this.page) return
    const element = this.page.elements.find((el) => el.id === elementId)
    if (element && element.type === 'text') {
      (element as any).content = content
    }
  }

  /**
   * 更新文本样式
   */
  updateTextStyle(elementId: string, style: Partial<any>) {
    if (!this.page) return
    const element = this.page.elements.find((el) => el.id === elementId)
    if (element && element.type === 'text') {
      Object.assign(element, style)
    }
  }

  /**
   * 更新图片属性
   */
  updateImageProperties(elementId: string, props: Partial<any>) {
    if (!this.page) return
    const element = this.page.elements.find((el) => el.id === elementId)
    if (element && element.type === 'image') {
      Object.assign(element, props)
    }
  }

  /**
   * 更新形状属性
   */
  updateShapeProperties(elementId: string, props: Partial<any>) {
    if (!this.page) return
    const element = this.page.elements.find((el) => el.id === elementId)
    if (element && (element.type === 'rectangle' || element.type === 'circle')) {
      Object.assign(element, props)
    }
  }

  /**
   * 更新画布背景色
   */
  setCanvasBackgroundColor(color: string) {
    if (this.page) {
      this.page.backgroundColor = color
    }
  }

  /**
   * 获取选中元素
   */
  get selectedElement(): ElementData | undefined {
    if (!this.page || !this.selectedElementId) return undefined
    return this.page.elements.find((el) => el.id === this.selectedElementId)
  }

  /**
   * 将画布上移元素
   */
  moveElementToFront(elementId: string) {
    if (!this.page) return
    const maxZ = Math.max(...this.page.elements.map((el) => el.zIndex), 0)
    const element = this.page.elements.find((el) => el.id === elementId)
    if (element) {
      element.zIndex = maxZ + 1
    }
  }

  /**
   * 将画布下移元素
   */
  moveElementToBack(elementId: string) {
    if (!this.page) return
    const minZ = Math.min(...this.page.elements.map((el) => el.zIndex), 0)
    const element = this.page.elements.find((el) => el.id === elementId)
    if (element) {
      element.zIndex = minZ - 1
    }
  }

  /**
   * 将画布数据串行化
   */
  serializePageData(): string {
    return JSON.stringify(this.page, null, 2)
  }

  /**
   * 将画布数据执行反串行化
   */
  deserializePageData(json: string) {
    try {
      this.page = JSON.parse(json)
    } catch (error) {
      console.error('Failed to deserialize page data:', error)
    }
  }
}

export const canvasStore = new CanvasStore()
