import React, { useState, useRef } from 'react'
import { useImagePaste } from '../hooks/useImagePaste'
import ImageEditor from './ImageEditor'
import { Slide } from '../types'
import { Image } from 'lucide-react'

interface SlideViewProps {
  slide: Slide
  onImageInsert?: (imageHtml: string) => void
}

/**
 * SlideView - 幻灯片预览组件
 * 参考 Magicrew 的 PPTSlide 设计
 * 
 * 功能：
 * - 渲染 HTML 内容
 * - 保持 16:9 宽高比
 * - 支持加载状态
 * - 支持粘贴/拖拽图片
 */
const SlideView: React.FC<SlideViewProps> = ({ slide, onImageInsert }) => {
  const previewRef = useRef<HTMLDivElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // 使用图片粘贴 Hook
  const { containerRef, isDragging, isProcessing, registerEventListeners } =
    useImagePaste({
      onImagePasted: (dataUrl) => {
        setSelectedImage(dataUrl)
      },
    })

  // 注册事件监听
  React.useEffect(() => {
    const unregister = registerEventListeners()
    return unregister
  }, [registerEventListeners])

  const handleImageInsert = (imageHtml: string) => {
    onImageInsert?.(imageHtml)
    setSelectedImage(null)
  }

  return (
    <div className="w-full space-y-4">
      {/* 标题 */}
      <h2 className="text-2xl font-bold text-gray-900">{slide.title}</h2>

      {/* 提示信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2 text-sm">
        <Image size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-blue-800">
          <strong>💡 Tip:</strong> You can paste images (Ctrl+V) or drag & drop images
          here
        </p>
      </div>

      {/* 幻灯片预览容器 - 16:9 比例 */}
      <div
        ref={containerRef}
        className={`w-full bg-white rounded-lg shadow-lg overflow-hidden relative transition-all ${
          isDragging
            ? 'ring-4 ring-blue-400 bg-blue-50'
            : 'border border-gray-200'
        }`}
        style={{
          aspectRatio: '16 / 9',
        }}
        tabIndex={0}
      >
        {/* 拖拽覆盖层 */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center z-10 pointer-events-none">
            <div className="text-center">
              <Image size={48} className="text-blue-500 mx-auto mb-2" />
              <p className="text-blue-600 font-semibold">Drop image here</p>
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {slide.loadingState === 'loading' && (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {/* 错误状态 */}
        {slide.loadingState === 'error' && (
          <div className="w-full h-full flex items-center justify-center bg-red-50">
            <p className="text-red-500">Error loading slide</p>
          </div>
        )}

        {/* 内容渲染 */}
        {(slide.loadingState === 'loaded' || slide.loadingState === 'idle') && (
          <div
            className="w-full h-full"
            ref={previewRef}
            dangerouslySetInnerHTML={{ __html: slide.content }}
          />
        )}

        {/* 处理中提示 */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-20">
            <div className="bg-white px-4 py-2 rounded-lg">
              <p className="text-gray-900 font-medium">Processing...</p>
            </div>
          </div>
        )}
      </div>

      {/* 元数据 */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>Created: {new Date(slide.created_at).toLocaleString()}</p>
        <p>Updated: {new Date(slide.updated_at).toLocaleString()}</p>
        <p>Content length: {slide.content.length} characters</p>
      </div>

      {/* 图片编辑器模态框 */}
      {selectedImage && (
        <ImageEditor
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
          onInsert={handleImageInsert}
        />
      )}
    </div>
  )
}

export default SlideView
