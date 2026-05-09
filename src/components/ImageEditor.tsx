import React, { useState } from 'react'
import { X, Copy } from 'lucide-react'

interface ImageEditorProps {
  imageUrl: string
  onClose: () => void
  onInsert: (imageUrl: string, caption?: string) => void
}

/**
 * 图片编辑器
 * 用于预览和配置要插入的图片
 */
const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onClose, onInsert }) => {
  const [caption, setCaption] = useState('')
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(300)
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center')

  const handleInsert = () => {
    // 生成 HTML
    const html = `
<div class="flex justify-${align} mb-4">
  <div>
    <img src="${imageUrl}" alt="${caption}" style="width: ${width}px; height: ${height}px; object-fit: cover; border-radius: 8px;" />
    ${caption ? `<p class="text-center text-sm text-gray-600 mt-2">${caption}</p>` : ''}
  </div>
</div>
    `.trim()

    onInsert(html, caption)
  }

  const alignOptions = [
    { value: 'left', label: '左对齐' },
    { value: 'center', label: '居中' },
    { value: 'right', label: '右对齐' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Image Editor</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 预览 */}
          <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
            <img
              src={imageUrl}
              alt="Preview"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </div>

          {/* 图片 URL */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(imageUrl)
                  alert('Copied!')
                }}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Copy size={16} />
                Copy
              </button>
            </div>
          </div>

          {/* 说明文字 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Caption (Optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter image caption"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 尺寸 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Width (px)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                min="100"
                max="800"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Height (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min="100"
                max="600"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 对齐 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Alignment
            </label>
            <div className="flex gap-3">
              {alignOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAlign(option.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    align === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageEditor
