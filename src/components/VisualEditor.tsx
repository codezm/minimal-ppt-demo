import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { canvasStore } from '../store/CanvasStore'
import { ElementData, TextElementData, ImageElementData, ShapeElementData } from '../types/canvas'
import CanvasElement from './CanvasElement'
import PropertyPanel from './PropertyPanel'
import CanvasToolbar from './CanvasToolbar'
import { Download, Save, Upload, Plus } from 'lucide-react'

/**
 * 可视化编辑器
 * 所见即所得的画布编辑器
 */
const VisualEditor = observer(() => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isExporting, setIsExporting] = useState(false)

  if (!canvasStore.page) return null

  const handleCanvasClick = (e: React.MouseEvent) => {
    // 点击空白区域取消选择
    if (e.target === canvasRef.current) {
      canvasStore.selectElement(null)
    }
  }

  // 导出为 HTML
  const handleExportHTML = () => {
    if (!canvasStore.page) return
    const page = canvasStore.page
    const elementsHTML = page.elements
      .map((el) => {
        if (el.type === 'text') {
          const text = el as TextElementData
          return `<div style="position: absolute; left: ${text.position.x}px; top: ${text.position.y}px; width: ${text.size.width}px; height: ${text.size.height}px; font-size: ${text.fontSize}px; color: ${text.color}; font-weight: ${text.fontWeight}; text-align: ${text.textAlign};">${text.content}</div>`
        } else if (el.type === 'image') {
          const img = el as ImageElementData
          return `<img src="${img.dataUrl}" style="position: absolute; left: ${img.position.x}px; top: ${img.position.y}px; width: ${img.size.width}px; height: ${img.size.height}px; border-radius: ${img.borderRadius}px; opacity: ${img.opacity};" />`
        } else {
          const shape = el as ShapeElementData
          const borderRadius = shape.type === 'circle' ? '50%' : '0'
          return `<div style="position: absolute; left: ${shape.position.x}px; top: ${shape.position.y}px; width: ${shape.size.width}px; height: ${shape.size.height}px; background-color: ${shape.backgroundColor}; border: ${shape.borderWidth}px solid ${shape.borderColor}; border-radius: ${borderRadius}; opacity: ${shape.opacity};"></div>`
        }
      })
      .join('\n')

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <style>
    body { margin: 0; padding: 0; }
    .canvas { position: relative; width: ${page.width}px; height: ${page.height}px; background-color: ${page.backgroundColor}; }
  </style>
</head>
<body>
  <div class="canvas">
    ${elementsHTML}
  </div>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${page.title}.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 保存画布为 JSON
  const handleSave = () => {
    const json = canvasStore.serializePageData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'canvas.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  // 从 JSON 加载
  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const json = event.target?.result as string
        canvasStore.deserializePageData(json)
      }
      reader.readAsText(file)
    }
  }

  const page = canvasStore.page
  const scale = zoomLevel / 100

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 左侧：画布区域 */}
      <div className="flex-1 flex flex-col">
        {/* 工具栏 */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <CanvasToolbar onZoomChange={setZoomLevel} zoomLevel={zoomLevel} />
          {/* 导出按钮 */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleExportHTML}
              className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-2"
            >
              <Download size={16} /> Export HTML
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-2"
            >
              <Save size={16} /> Save JSON
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center gap-2"
            >
              <Upload size={16} /> Load JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleLoad}
              className="hidden"
            />
            <button
              onClick={() => {
                if (confirm('Create new blank canvas?')) {
                  canvasStore.createPage('New Slide')
                }
              }}
              className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center gap-2 ml-auto"
            >
              <Plus size={16} /> New
            </button>
          </div>
        </div>

        {/* 画布区域 */}
        <div
          className="flex-1 overflow-auto bg-gray-300 flex items-center justify-center p-4"
          style={{ perspective: '1000px' }}
        >
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="bg-white shadow-2xl relative cursor-default flex-shrink-0"
            style={{
              width: `${page.width * scale}px`,
              height: `${page.height * scale}px`,
              backgroundColor: page.backgroundColor,
              transformOrigin: 'center',
              transform: `scale(${scale})`,
            }}
          >
            {/* 画布元素 */}
            {page.elements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={canvasStore.selectedElementId === element.id}
                onSelect={() => canvasStore.selectElement(element.id)}
                onPositionChange={(x, y) => canvasStore.updateElementPosition(element.id, x, y)}
                onSizeChange={(width, height) => canvasStore.updateElementSize(element.id, width, height)}
              />
            ))}
          </div>
        </div>

        {/* 底部信息 */}
        <div className="bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-600">
          <p>
            Canvas: {page.width}x{page.height}px | Zoom: {zoomLevel}% | Elements: {page.elements.length}
            {canvasStore.selectedElement && ` | Selected: ${canvasStore.selectedElement.type}`}
          </p>
        </div>
      </div>

      {/* 右侧：属性面板 */}
      {canvasStore.selectedElement && (
        <PropertyPanel element={canvasStore.selectedElement} />
      )}
    </div>
  )
})

export default VisualEditor
