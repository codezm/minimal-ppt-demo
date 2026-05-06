import React from 'react'
import { Slide } from '../types'

interface SlideViewProps {
  slide: Slide
}

/**
 * SlideView - 幻灯片预览组件
 * 参考 Magicrew 的 PPTSlide 设计
 * 
 * 功能：
 * - 渲染 HTML 内容
 * - 保持 16:9 宽高比
 * - 支持加载状态
 */
const SlideView: React.FC<SlideViewProps> = ({ slide }) => {
  return (
    <div className="w-full">
      {/* 标题 */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{slide.title}</h2>

      {/* 幻灯片预览容器 - 16:9 比例 */}
      <div
        className="w-full bg-white rounded-lg shadow-lg overflow-hidden"
        style={{
          aspectRatio: '16 / 9',
          border: '1px solid #e5e7eb',
        }}
      >
        {slide.loadingState === 'loading' && (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {slide.loadingState === 'error' && (
          <div className="w-full h-full flex items-center justify-center bg-red-50">
            <p className="text-red-500">Error loading slide</p>
          </div>
        )}

        {(slide.loadingState === 'loaded' || slide.loadingState === 'idle') && (
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: slide.content }}
          />
        )}
      </div>

      {/* 元数据 */}
      <div className="mt-4 text-sm text-gray-500 space-y-1">
        <p>Created: {new Date(slide.created_at).toLocaleString()}</p>
        <p>Updated: {new Date(slide.updated_at).toLocaleString()}</p>
        <p>Content length: {slide.content.length} characters</p>
      </div>
    </div>
  )
}

export default SlideView
