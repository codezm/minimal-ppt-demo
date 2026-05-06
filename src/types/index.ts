// 幻灯片数据模型
export interface Slide {
  id: string
  title: string
  content: string // HTML content
  loadingState: 'idle' | 'loading' | 'loaded' | 'error'
  created_at: number
  updated_at: number
}

// PPT 导出配置
export interface PPTExportConfig {
  fileName: string
  slideWidth: number // 英寸
  slideHeight: number // 英寸
}

// 幻灯片项目配置
export interface SlideProject {
  name: string
  slides: Slide[]
  created_at: number
  updated_at: number
}
