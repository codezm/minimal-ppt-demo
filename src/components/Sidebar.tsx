import React from 'react'
import { Trash2, Plus } from 'lucide-react'
import { Slide } from '../types'

interface SidebarProps {
  slides: Slide[]
  activeIndex: number
  onSlideClick: (index: number) => void
  onAddSlide: () => void
  onDeleteSlide: () => void
}

/**
 * Sidebar - 幻灯片列表侧边栏
 * 参考 Magicrew 的 PPTSidebar 设计
 * 
 * 功能：
 * - 显示所有幻灯片缩略图
 * - 导航到不同幻灯片
 * - 添加/删除幻灯片
 */
const Sidebar: React.FC<SidebarProps> = ({
  slides,
  activeIndex,
  onSlideClick,
  onAddSlide,
  onDeleteSlide,
}) => {
  return (
    <div className="w-48 bg-white border-r border-gray-200 flex flex-col">
      {/* 侧边栏头部 */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Slides</h3>
        <p className="text-sm text-gray-500">({slides.length} slides)</p>
      </div>

      {/* 幻灯片列表 */}
      <div className="flex-1 overflow-y-auto">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
              index === activeIndex
                ? 'bg-blue-50 border-l-4 border-l-blue-500'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSlideClick(index)}
          >
            {/* 缩略图预览 */}
            <div className="slide-preview mb-2 bg-gray-100 text-gray-700 p-2 text-xs rounded">
              <div className="truncate font-semibold">{slide.title}</div>
            </div>

            {/* 元信息 */}
            <div className="text-xs text-gray-500 space-y-0.5">
              <p>Slide {index + 1}</p>
              <p>{slide.content.length} chars</p>
            </div>
          </div>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="border-t border-gray-200 p-3 space-y-2">
        <button
          onClick={onAddSlide}
          className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
        <button
          onClick={onDeleteSlide}
          disabled={slides.length <= 1}
          className="w-full px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  )
}

export default Sidebar
