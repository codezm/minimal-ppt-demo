import { makeAutoObservable } from 'mobx'
import { Slide } from '../types'

/**
 * PPTStore - 核心状态管理
 * 参考 Magicrew 的 PPTStore 架构
 * 
 * 功能：
 * - 幻灯片数据管理
 * - 导航和选择
 * - CRUD 操作
 */
export class PPTStore {
  slides: Slide[] = []
  activeIndex = 0
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
    this.initializeDefaultSlides()
  }

  // ==================== 初始化 ====================
  private initializeDefaultSlides() {
    const defaultSlides: Slide[] = [
      {
        id: 'slide-0',
        title: 'Welcome to PPT Demo',
        content: `<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 p-8">
          <div class="text-center">
            <h1 class="text-6xl font-bold text-white mb-4">Welcome</h1>
            <p class="text-2xl text-blue-100">Minimal PPT System Demo</p>
            <p class="text-lg text-blue-100 mt-8">Based on Magicrew Architecture</p>
          </div>
        </div>`,
        loadingState: 'loaded',
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      {
        id: 'slide-1',
        title: 'Features',
        content: `<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 p-8">
          <div>
            <h1 class="text-5xl font-bold text-white mb-8">Features</h1>
            <ul class="text-2xl text-white space-y-4">
              <li>✓ MobX State Management</li>
              <li>✓ Real-time Preview</li>
              <li>✓ HTML Content Editing</li>
              <li>✓ PPTX Export</li>
            </ul>
          </div>
        </div>`,
        loadingState: 'loaded',
        created_at: Date.now(),
        updated_at: Date.now(),
      },
    ]
    this.slides = defaultSlides
  }

  // ==================== 计算属性 ====================
  get currentSlide(): Slide | undefined {
    return this.slides[this.activeIndex]
  }

  get totalSlides(): number {
    return this.slides.length
  }

  get canGoPrev(): boolean {
    return this.activeIndex > 0
  }

  get canGoNext(): boolean {
    return this.activeIndex < this.slides.length - 1
  }

  // ==================== 导航操作 ====================
  setActiveIndex(index: number) {
    if (index >= 0 && index < this.slides.length) {
      this.activeIndex = index
    }
  }

  nextSlide() {
    if (this.canGoNext) {
      this.activeIndex++
    }
  }

  prevSlide() {
    if (this.canGoPrev) {
      this.activeIndex--
    }
  }

  goToFirstSlide() {
    this.activeIndex = 0
  }

  goToLastSlide() {
    this.activeIndex = this.slides.length - 1
  }

  // ==================== CRUD 操作 ====================
  /**
   * 添加新幻灯片
   * 新幻灯片会插入到当前幻灯片之后
   */
  addSlide(title = 'New Slide') {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title,
      content: `<div class="flex items-center justify-center w-full h-full bg-white p-8">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-900">${title}</h1>
          <p class="text-xl text-gray-600 mt-4">Edit this slide</p>
        </div>
      </div>`,
      loadingState: 'loaded',
      created_at: Date.now(),
      updated_at: Date.now(),
    }
    this.slides.splice(this.activeIndex + 1, 0, newSlide)
    this.activeIndex++
  }

  /**
   * 删除指定幻灯片
   */
  deleteSlide(index: number) {
    if (this.slides.length <= 1) {
      this.error = 'Cannot delete the last slide'
      return
    }
    this.slides.splice(index, 1)
    if (this.activeIndex >= this.slides.length) {
      this.activeIndex = this.slides.length - 1
    }
  }

  /**
   * 更新幻灯片标题
   */
  updateSlideTitle(index: number, title: string) {
    if (index >= 0 && index < this.slides.length) {
      this.slides[index].title = title
      this.slides[index].updated_at = Date.now()
    }
  }

  /**
   * 更新幻灯片内容
   */
  updateSlideContent(index: number, content: string) {
    if (index >= 0 && index < this.slides.length) {
      this.slides[index].content = content
      this.slides[index].loadingState = 'loaded'
      this.slides[index].updated_at = Date.now()
    }
  }

  /**
   * 重新排序幻灯片
   */
  moveSlide(fromIndex: number, toIndex: number) {
    if (
      fromIndex >= 0 &&
      fromIndex < this.slides.length &&
      toIndex >= 0 &&
      toIndex < this.slides.length
    ) {
      const [slide] = this.slides.splice(fromIndex, 1)
      this.slides.splice(toIndex, 0, slide)
      this.activeIndex = toIndex
    }
  }

  // ==================== 导出 ====================
  /**
   * 导出为 JSON 配置（可用于保存/分享）
   */
  exportConfig() {
    return {
      slides: this.slides,
      activeIndex: this.activeIndex,
      exportedAt: new Date().toISOString(),
    }
  }

  /**
   * 从 JSON 配置导入
   */
  importConfig(config: any) {
    this.slides = config.slides
    this.activeIndex = Math.min(config.activeIndex || 0, this.slides.length - 1)
  }

  // ==================== 状态重置 ====================
  reset() {
    this.slides = []
    this.activeIndex = 0
    this.isLoading = false
    this.error = null
    this.initializeDefaultSlides()
  }
}

// 创建全局 store 实例
export const pptStore = new PPTStore()
