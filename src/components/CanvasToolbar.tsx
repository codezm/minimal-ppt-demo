import React from 'react'
import { Plus, Type, Image, Square, Circle, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'
import { canvasStore } from '../store/CanvasStore'

interface CanvasToolbarProps {
  onZoomChange: (zoom: number) => void
  zoomLevel: number
}

/**
 * 画布工具栏
 */
const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ onZoomChange, zoomLevel }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3 flex-wrap mb-4">
      {/* 添加元素按钮 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => canvasStore.addTextElement('New Text')}
          className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-2"
        >
          <Type size={16} /> Text
        </button>
        <button
          onClick={() => canvasStore.addImageElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')}
          className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-2"
        >
          <Image size={16} /> Image
        </button>
        <button
          onClick={() => canvasStore.addShapeElement('rectangle')}
          className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center gap-2"
        >
          <Square size={16} /> Rectangle
        </button>
        <button
          onClick={() => canvasStore.addShapeElement('circle')}
          className="px-3 py-2 bg-pink-600 text-white rounded text-sm hover:bg-pink-700 flex items-center gap-2"
        >
          <Circle size={16} /> Circle
        </button>
      </div>

      {/* 分隔符 */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* 缩放按钮 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onZoomChange(Math.min(zoomLevel + 10, 200))}
          className="px-2 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
        >
          <ZoomIn size={16} />
        </button>
        <span className="w-12 text-center text-sm font-medium">{zoomLevel}%</span>
        <button
          onClick={() => onZoomChange(Math.max(zoomLevel - 10, 50))}
          className="px-2 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
        >
          <ZoomOut size={16} />
        </button>
      </div>

      {/* 分隔符 */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* 背景色 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Background:</label>
        <input
          type="color"
          value={canvasStore.page?.backgroundColor || '#ffffff'}
          onChange={(e) => canvasStore.setCanvasBackgroundColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
        />
      </div>
    </div>
  )
}

export default CanvasToolbar
