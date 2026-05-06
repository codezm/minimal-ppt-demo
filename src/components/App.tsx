import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Plus, Download, RotateCcw, Save } from 'lucide-react'
import { pptStore } from '../store/PPTStore'
import { exportSlidesToPPTX, exportAsJSON, importFromJSON } from '../services/PPTXExporter'
import SlideView from './SlideView'
import Sidebar from './Sidebar'

const App = observer(() => {
  const [editMode, setEditMode] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 添加新幻灯片
  const handleAddSlide = () => {
    pptStore.addSlide(`Slide ${pptStore.totalSlides + 1}`)
  }

  // 删除当前幻灯片
  const handleDeleteSlide = () => {
    pptStore.deleteSlide(pptStore.activeIndex)
  }

  // 导出 PPTX
  const handleExportPPTX = async () => {
    setIsExporting(true)
    try {
      await exportSlidesToPPTX(pptStore.slides, {
        fileName: 'presentation',
      })
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // 导出 JSON
  const handleExportJSON = () => {
    exportAsJSON(pptStore.slides, 'slides-backup')
  }

  // 导入 JSON
  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const slides = await importFromJSON(file)
        pptStore.importConfig({ slides, activeIndex: 0 })
      } catch (error) {
        console.error('Import failed:', error)
      }
    }
  }

  // 重置
  const handleReset = () => {
    if (confirm('Reset to default slides?')) {
      pptStore.reset()
    }
  }

  const currentSlide = pptStore.currentSlide

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <Sidebar
        slides={pptStore.slides}
        activeIndex={pptStore.activeIndex}
        onSlideClick={(index) => pptStore.setActiveIndex(index)}
        onAddSlide={handleAddSlide}
        onDeleteSlide={handleDeleteSlide}
      />

      {/* 主要内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 工具栏 */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Minimal PPT Demo</h1>
              <span className="text-gray-500 text-sm">
                ({pptStore.activeIndex + 1}/{pptStore.totalSlides})
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* 编辑切换 */}
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  editMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {editMode ? '✓ Editing' : 'Edit HTML'}
              </button>

              {/* 导出按钮 */}
              <button
                onClick={handleExportPPTX}
                disabled={isExporting}
                className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Download size={16} />
                {isExporting ? 'Exporting...' : 'Export PPTX'}
              </button>

              {/* 导出 JSON */}
              <button
                onClick={handleExportJSON}
                className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} />
                Save JSON
              </button>

              {/* 导入 JSON */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700"
              >
                Load JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />

              {/* 重置按钮 */}
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-md text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 flex items-center gap-2"
              >
                <RotateCcw size={16} />
              </button>

              {/* 添加幻灯片 */}
              <button
                onClick={handleAddSlide}
                className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Add Slide
              </button>
            </div>
          </div>
        </div>

        {/* 幻灯片内容区 */}
        {currentSlide ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {editMode ? (
                // 编辑模式
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={currentSlide.title}
                      onChange={(e) =>
                        pptStore.updateSlideTitle(pptStore.activeIndex, e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      HTML Content (Tailwind CSS supported)
                    </label>
                    <textarea
                      value={currentSlide.content}
                      onChange={(e) =>
                        pptStore.updateSlideContent(pptStore.activeIndex, e.target.value)
                      }
                      className="w-full h-96 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <p className="text-sm text-gray-500 italic">
                    💡 Tip: Use Tailwind CSS classes like bg-blue-500, text-white, p-8, etc.
                  </p>
                </div>
              ) : (
                // 预览模式
                <SlideView slide={currentSlide} />
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>No slides found</p>
          </div>
        )}

        {/* 底部状态栏 */}
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center text-sm text-gray-600">
          <div>
            Mode: <span className="font-semibold">{editMode ? 'Edit' : 'Preview'}</span>
          </div>
          <div>
            Last updated: <span className="font-semibold">{new Date(currentSlide?.updated_at || Date.now()).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default App
