import React, { useRef, useState, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { canvasStore } from '../store/CanvasStore'
import { ElementData } from '../types/canvas'
import CanvasElement from './CanvasElement'
import PropertyPanel from './PropertyPanel'
import CanvasToolbar from './CanvasToolbar'
import html2canvas from 'html2canvas'

interface VisualEditorProps {
  onRender?: (element: HTMLElement) => void
}

/**
 * 可视化编辑器
 * 所见即所得的畫布编辑器
 */
const VisualEditor = observer(({ onRender }: VisualEditorProps) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoomLevel, setZoomLevel] = useState(100)

  useEffect(() => {
    if (!canvasStore.page) {
      canvasStore.createPage('New Slide')
    }
  }, [])

  if (!canvasStore.page) return null

  const handleCanvasClick = (e: React.MouseEvent) => {
    // 点击空白区域取消选择
    if (e.target === canvasRef.current) {
      canvasStore.selectElement(null)
    }
  }

  const page = canvasStore.page
  const scale = zoomLevel / 100

  return (
    <div className="flex h-full gap-4 p-4 bg-gray-100">
      {/* 中心画布 */}
      <div className="flex-1 flex flex-col">
        {/* 工具栏 */}
        <CanvasToolbar onZoomChange={setZoomLevel} zoomLevel={zoomLevel} />

        {/* 画布区域 */}
        <div
          className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="bg-white shadow-lg relative cursor-default"
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
        <div className="mt-4 text-sm text-gray-600">
          <p>
            Canvas: {page.width}x{page.height}px | Zoom: {zoomLevel}% | Elements:
            {page.elements.length}
          </p>
        </div>
      </div>

      {/* 右侧属性面板 */}
      {canvasStore.selectedElement && (
        <PropertyPanel element={canvasStore.selectedElement} />
      )}
    </div>
  )
})

export default VisualEditor
