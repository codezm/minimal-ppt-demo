import { useRef, useCallback, useState } from 'react'
import { saveImage, isImageFile } from '../utils/imageStorage'

interface UseImagePasteOptions {
  onImagePasted?: (dataUrl: string) => void
  maxSize?: number // 字节
}

export function useImagePaste({
  onImagePasted,
  maxSize = 10 * 1024 * 1024, // 默认 10MB
}: UseImagePasteOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  /**
   * 处理图片
   */
  const handleImage = useCallback(
    async (file: File) => {
      if (!isImageFile(file)) {
        alert('Please paste or drop an image file')
        return
      }

      if (file.size > maxSize) {
        alert(`Image size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
        return
      }

      setIsProcessing(true)
      try {
        const imageData = await saveImage(file)
        onImagePasted?.(imageData.dataUrl)
      } catch (error) {
        console.error('Failed to save image:', error)
        alert('Failed to save image')
      } finally {
        setIsProcessing(false)
      }
    },
    [onImagePasted, maxSize]
  )

  /**
   * 处理粘贴事件
   */
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            handleImage(file)
          }
          break
        }
      }
    },
    [handleImage]
  )

  /**
   * 处理拖拽进入
   */
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  /**
   * 处理拖拽离开
   */
  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.target === containerRef.current) {
      setIsDragging(false)
    }
  }, [])

  /**
   * 处理拖拽经过
   */
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  /**
   * 处理放下
   */
  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer?.files
      if (!files) return

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type.startsWith('image/')) {
          handleImage(file)
          break
        }
      }
    },
    [handleImage]
  )

  /**
   * 注册事件监听
   */
  const registerEventListeners = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('paste', handlePaste as any)
    container.addEventListener('dragenter', handleDragEnter as any)
    container.addEventListener('dragleave', handleDragLeave as any)
    container.addEventListener('dragover', handleDragOver as any)
    container.addEventListener('drop', handleDrop as any)

    return () => {
      container.removeEventListener('paste', handlePaste as any)
      container.removeEventListener('dragenter', handleDragEnter as any)
      container.removeEventListener('dragleave', handleDragLeave as any)
      container.removeEventListener('dragover', handleDragOver as any)
      container.removeEventListener('drop', handleDrop as any)
    }
  }, [handlePaste, handleDragEnter, handleDragLeave, handleDragOver, handleDrop])

  return {
    containerRef,
    isDragging,
    isProcessing,
    registerEventListeners,
    handleImage,
  }
}
