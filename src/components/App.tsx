import React from 'react'
import { observer } from 'mobx-react-lite'
import VisualEditor from './VisualEditor'
import { canvasStore } from '../store/CanvasStore'

/**
 * 主应用程序
 * 集成可视化编辑器
 */
const App = observer(() => {
  React.useEffect(() => {
    // 初始化画布
    if (!canvasStore.page) {
      canvasStore.createPage('My Presentation')
    }
  }, [])

  return <VisualEditor />
})

export default App
