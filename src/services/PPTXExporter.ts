import PptxGenJS from 'pptxgenjs'
import { Slide } from '../types'

/**
 * PPTXExporter - PPTX 文件导出
 * 参考 Magicrew 的 html2pptx 包
 * 
 * 功能：
 * - 将幻灯片内容转换为 PPTX
 * - 提取 HTML 中的文本和样式
 * - 生成标准 PowerPoint 文件
 */

interface ExportOptions {
  fileName?: string
  slideWidth?: number
  slideHeight?: number
}

/**
 * 将 HTML 内容简化提取为文本（基础版本）
 * 完整版本应该使用 DOM 解析器（如 jsdom 或 @zumer/snapdom）
 */
function extractTextFromHTML(html: string): string {
  // 创建临时容器解析 HTML
  const div = document.createElement('div')
  div.innerHTML = html
  return div.innerText || div.textContent || ''
}

/**
 * 提取 HTML 中的背景色
 */
function extractBackgroundColor(html: string): string {
  // 尝试从 style 属性或 class 中提取背景色
  const bgColorMatch = html.match(/bg-\w+-\d+/)
  const tailwindColorMap: Record<string, string> = {
    'bg-blue-500': '3B82F6',
    'bg-blue-600': '2563EB',
    'bg-purple-500': 'A855F7',
    'bg-purple-600': '9333EA',
    'bg-white': 'FFFFFF',
  }
  return tailwindColorMap[bgColorMatch?.[0] || ''] || 'FFFFFF'
}

/**
 * 主导出函数
 */
export async function exportSlidesToPPTX(
  slides: Slide[],
  options: ExportOptions = {}
): Promise<void> {
  const {
    fileName = 'presentation',
    slideWidth = 10,
    slideHeight = 5.625,
  } = options

  // 1. 创建 PptxGenJS 实例
  const pres = new PptxGenJS()

  // 2. 定义自定义布局
  pres.defineLayout({
    name: 'CUSTOM',
    width: slideWidth,
    height: slideHeight,
  })
  pres.layout = 'CUSTOM'

  // 3. 逐页转换
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]
    const slideObj = pres.addSlide()

    // 提取内容
    const text = extractTextFromHTML(slide.content)
    const bgColor = extractBackgroundColor(slide.content)

    // 3.1 添加背景
    slideObj.background = { color: bgColor }

    // 3.2 添加标题
    slideObj.addText(slide.title, {
      x: 0.5,
      y: 0.5,
      w: slideWidth - 1,
      h: 1,
      fontSize: 44,
      bold: true,
      color: '000000',
    })

    // 3.3 添加内容文本
    const contentText = text.substring(0, 200) // 限制文本长度
    if (contentText) {
      slideObj.addText(contentText, {
        x: 0.5,
        y: 1.8,
        w: slideWidth - 1,
        h: slideHeight - 2.3,
        fontSize: 18,
        color: '333333',
        wrap: true,
      })
    }

    // 3.4 添加页码
    slideObj.addText(`Slide ${i + 1}/${slides.length}`, {
      x: slideWidth - 2,
      y: slideHeight - 0.4,
      w: 1.5,
      h: 0.3,
      fontSize: 10,
      color: '999999',
      align: 'right',
    })
  }

  // 4. 生成并下载文件
  await pres.writeFile({ fileName: `${fileName}.pptx` })
}

/**
 * 导出为 JSON（用于本地保存）
 */
export function exportAsJSON(slides: Slide[], fileName: string): void {
  const dataStr = JSON.stringify(slides, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * 从 JSON 导入幻灯片
 */
export async function importFromJSON(file: File): Promise<Slide[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const slides = JSON.parse(e.target?.result as string)
        resolve(slides)
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
