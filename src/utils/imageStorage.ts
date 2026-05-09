/**
 * 图片存储工具
 * 将粘贴/拖拽的图片转换为 Base64 数据 URL
 * 存储在 IndexedDB 中以支持项目持久化
 */

const DB_NAME = 'PPTImageStore'
const STORE_NAME = 'images'
const DB_VERSION = 1

interface ImageData {
  id: string
  dataUrl: string
  name: string
  size: number
  createdAt: number
}

/**
 * 初始化 IndexedDB
 */
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

/**
 * 将 File 转换为 Base64 Data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * 生成图片 ID
 */
function generateImageId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 保存图片到 IndexedDB
 */
export async function saveImage(file: File): Promise<ImageData> {
  const dataUrl = await fileToDataUrl(file)
  const imageData: ImageData = {
    id: generateImageId(),
    dataUrl,
    name: file.name,
    size: file.size,
    createdAt: Date.now(),
  }

  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.add(imageData)

      request.onsuccess = () => resolve(imageData)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    // 如果 IndexedDB 不可用，直接返回数据
    console.warn('IndexedDB not available, using memory storage', error)
    return imageData
  }
}

/**
 * 从 IndexedDB 获取图片
 */
export async function getImage(id: string): Promise<ImageData | null> {
  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.warn('Failed to get image from IndexedDB', error)
    return null
  }
}

/**
 * 删除 IndexedDB 中的图片
 */
export async function deleteImage(id: string): Promise<void> {
  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.warn('Failed to delete image from IndexedDB', error)
  }
}

/**
 * 获取所有图片
 */
export async function getAllImages(): Promise<ImageData[]> {
  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.warn('Failed to get all images from IndexedDB', error)
    return []
  }
}

/**
 * 验证文件是否为图片
 */
export function isImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  return validTypes.includes(file.type)
}

/**
 * 获取文件尺寸的可读字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
