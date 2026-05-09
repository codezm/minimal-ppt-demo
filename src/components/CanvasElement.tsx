import React, { useState, useRef } from 'react'
import { ElementData, TextElementData, ImageElementData, ShapeElementData } from '../types/canvas'
import { canvasStore } from '../store/CanvasStore'

interface CanvasElementProps {
  element: ElementData
  isSelected: boolean
  onSelect: () => void
  onPositionChange: (x: number, y: number) => void
  onSizeChange: (width: number, height: number) => void
}

/**
 * 画布元素组件
 * 代表画布上的一个元素（文本、图片、形状）
 */
const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onSelect,
  onPositionChange,
  onSizeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)

  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect()

    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      const handle = (e.target as HTMLElement).dataset.handle
      setResizeHandle(handle || null)
    } else {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - element.position.x,
        y: e.clientY - element.position.y,
      })
    }
  }

  // 处理拖拽中
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !resizeHandle) return

    const movementX = e.clientX - dragStart.x - element.position.x
    const movementY = e.clientY - dragStart.y - element.position.y

    if (isDragging && !resizeHandle) {
      onPositionChange(
        element.position.x + movementX,
        element.position.y + movementY
      )
    }
  }

  // 处理拖拽结束
  const handleMouseUp = () => {
    setIsDragging(false)
    setResizeHandle(null)
  }

  // 渲染文本元素
  const renderText = (el: TextElementData) => (
    <div
      className="w-full h-full flex items-center justify-center cursor-text"
      style={{
        fontSize: `${el.fontSize}px`,
        fontFamily: el.fontFamily,
        color: el.color,
        fontWeight: el.fontWeight === 'bold' ? 'bold' : 'normal',
        textAlign: el.textAlign as any,
        transform: `rotate(${el.rotation}deg)`,
        userSelect: 'none',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
    >
      {el.content}
    </div>
  )

  // 渲染图片元素
  const renderImage = (el: ImageElementData) => (
    <img
      src={el.dataUrl}
      alt=""
      className="w-full h-full object-cover"
      style={{
        borderRadius: `${el.borderRadius}px`,
        opacity: el.opacity,
        transform: `rotate(${el.rotation}deg)`,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  )

  // 渲染形状元素
  const renderShape = (el: ShapeElementData) => {
    if (el.type === 'circle') {
      return (
        <div
          className="w-full h-full"
          style={{
            backgroundColor: el.backgroundColor,
            borderColor: el.borderColor,
            borderWidth: `${el.borderWidth}px`,
            borderStyle: 'solid',
            borderRadius: '50%',
            opacity: el.opacity,
            transform: `rotate(${el.rotation}deg)`,
          }}
        />
      )
    }
    return (
      <div
        className="w-full h-full"
        style={{
          backgroundColor: el.backgroundColor,
          borderColor: el.borderColor,
          borderWidth: `${el.borderWidth}px`,
          borderStyle: 'solid',
          opacity: el.opacity,
          transform: `rotate(${el.rotation}deg)`,
        }}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className={`absolute cursor-move select-none ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        width: `${element.size.width}px`,
        height: `${element.size.height}px`,
        zIndex: element.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 内容 */}
      <div className="w-full h-full overflow-hidden">
        {element.type === 'text' && renderText(element as TextElementData)}
        {element.type === 'image' && renderImage(element as ImageElementData)}
        {(element.type === 'rectangle' || element.type === 'circle') &&
          renderShape(element as ShapeElementData)}
      </div>

      {/* 拖拽缩放句柄 */}
      {isSelected && (
        <>
          {/* 上 */}
          <div
            className="resize-handle absolute -top-1.5 left-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-n-resize -translate-x-1/2 transform hover:scale-125 transition-transform"
            data-handle="top"
          />
          {/* 下 */}
          <div
            className="resize-handle absolute -bottom-1.5 left-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-s-resize -translate-x-1/2 transform hover:scale-125 transition-transform"
            data-handle="bottom"
          />
          {/* 左 */}
          <div
            className="resize-handle absolute -left-1.5 top-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-w-resize -translate-y-1/2 transform hover:scale-125 transition-transform"
            data-handle="left"
          />
          {/* 右 */}
          <div
            className="resize-handle absolute -right-1.5 top-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-e-resize -translate-y-1/2 transform hover:scale-125 transition-transform"
            data-handle="right"
          />
          {/* 四个角 */}
          <div
            className="resize-handle absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize transform hover:scale-125 transition-transform"
            data-handle="top-left"
          />
          <div
            className="resize-handle absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize transform hover:scale-125 transition-transform"
            data-handle="top-right"
          />
          <div
            className="resize-handle absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize transform hover:scale-125 transition-transform"
            data-handle="bottom-left"
          />
          <div
            className="resize-handle absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize transform hover:scale-125 transition-transform"
            data-handle="bottom-right"
          />
        </>
      )}
    </div>
  )
}

export default CanvasElement
