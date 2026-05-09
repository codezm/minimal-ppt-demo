import React from 'react'
import { observer } from 'mobx-react-lite'
import { canvasStore } from '../store/CanvasStore'
import { ElementData, TextElementData, ImageElementData, ShapeElementData } from '../types/canvas'
import { Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react'

interface PropertyPanelProps {
  element: ElementData
}

/**
 * 属性面板
 * 编辑选中元素的属性
 */
const PropertyPanel = observer(({ element }: PropertyPanelProps) => {
  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4 overflow-y-auto max-h-full">
      {/* 元素信息 */}
      <div className="border-b pb-4">
        <h2 className="font-bold text-lg mb-2 capitalize">{element.type} Properties</h2>
        <p className="text-sm text-gray-500">ID: {element.id}</p>
      </div>

      {/* 位置和大小 */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                value={element.position.x}
                onChange={(e) =>
                  canvasStore.updateElementPosition(
                    element.id,
                    Number(e.target.value),
                    element.position.y
                  )
                }
                placeholder="X"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={element.position.y}
                onChange={(e) =>
                  canvasStore.updateElementPosition(
                    element.id,
                    element.position.x,
                    Number(e.target.value)
                  )
                }
                placeholder="Y"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                value={element.size.width}
                onChange={(e) =>
                  canvasStore.updateElementSize(
                    element.id,
                    Number(e.target.value),
                    element.size.height
                  )
                }
                placeholder="Width"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={element.size.height}
                onChange={(e) =>
                  canvasStore.updateElementSize(
                    element.id,
                    element.size.width,
                    Number(e.target.value)
                  )
                }
                placeholder="Height"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 文本属性 */}
      {element.type === 'text' && (
        <div className="space-y-3 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={(element as TextElementData).content}
              onChange={(e) => canvasStore.updateTextContent(element.id, e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none h-20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <input
              type="number"
              value={(element as TextElementData).fontSize}
              onChange={(e) =>
                canvasStore.updateTextStyle(element.id, { fontSize: Number(e.target.value) })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              value={(element as TextElementData).color}
              onChange={(e) =>
                canvasStore.updateTextStyle(element.id, { color: e.target.value })
              }
              className="w-full h-10 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Weight
            </label>
            <select
              value={(element as TextElementData).fontWeight}
              onChange={(e) =>
                canvasStore.updateTextStyle(element.id, { fontWeight: e.target.value })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Align
            </label>
            <select
              value={(element as TextElementData).textAlign}
              onChange={(e) =>
                canvasStore.updateTextStyle(element.id, { textAlign: e.target.value })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      )}

      {/* 图片属性 */}
      {element.type === 'image' && (
        <div className="space-y-3 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius
            </label>
            <input
              type="number"
              value={(element as ImageElementData).borderRadius}
              onChange={(e) =>
                canvasStore.updateImageProperties(element.id, {
                  borderRadius: Number(e.target.value),
                })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opacity
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={(element as ImageElementData).opacity}
              onChange={(e) =>
                canvasStore.updateImageProperties(element.id, {
                  opacity: Number(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* 形状属性 */}
      {(element.type === 'rectangle' || element.type === 'circle') && (
        <div className="space-y-3 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={(element as ShapeElementData).backgroundColor}
              onChange={(e) =>
                canvasStore.updateShapeProperties(element.id, {
                  backgroundColor: e.target.value,
                })
              }
              className="w-full h-10 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Color
            </label>
            <input
              type="color"
              value={(element as ShapeElementData).borderColor}
              onChange={(e) =>
                canvasStore.updateShapeProperties(element.id, {
                  borderColor: e.target.value,
                })
              }
              className="w-full h-10 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Width
            </label>
            <input
              type="number"
              value={(element as ShapeElementData).borderWidth}
              onChange={(e) =>
                canvasStore.updateShapeProperties(element.id, {
                  borderWidth: Number(e.target.value),
                })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      )}

      {/* 照纸顺序操作 */}
      <div className="border-t pt-4 flex gap-2">
        <button
          onClick={() => canvasStore.moveElementToFront(element.id)}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
        >
          <ArrowUp size={14} /> Front
        </button>
        <button
          onClick={() => canvasStore.moveElementToBack(element.id)}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
        >
          <ArrowDown size={14} /> Back
        </button>
      </div>

      {/* 删除按钮 */}
      <button
        onClick={() => canvasStore.deleteElement(element.id)}
        className="w-full px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center justify-center gap-2"
      >
        <Trash2 size={14} /> Delete Element
      </button>
    </div>
  )
})

export default PropertyPanel
