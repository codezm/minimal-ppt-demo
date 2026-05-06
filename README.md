# Minimal PPT System Demo

> 基于 Magicrew 架构的最小化 PPT 制作系统演示

## 📋 项目概述

这是一个**精简版本**的 PPT 制作系统，完全参考 Magicrew 的技术架构，包含核心功能的完整实现：

- ✅ **MobX 状态管理** - 反应式更新 UI
- ✅ **HTML 幻灯片编辑** - 支持 Tailwind CSS
- ✅ **实时预览** - 所见即所得
- ✅ **PPTX 导出** - 生成标准 PowerPoint 文件
- ✅ **JSON 保存/加载** - 项目持久化

## 🏗️ 架构设计

### 层级结构

```
UI Layer (React Components)
    ├── App.tsx                    # 主应用
    ├── SlideView.tsx             # 幻灯片渲染
    └── Sidebar.tsx               # 侧边栏导航
         ↓
State Layer (MobX Store)
    └── PPTStore.ts               # 中央状态管理
         ↓
Service Layer
    └── PPTXExporter.ts           # PPTX 生成
         ↓
External Libraries
    ├── react / react-dom
    ├── mobx / mobx-react-lite
    └── pptxgenjs
```

### 核心组件对应关系

| Magicrew | Demo | 功能 |
|---------|------|------|
| AgentMode.PPT | slider.agent | AI 触发入口 |
| PPTStore (MobX) | PPTStore.ts | 状态管理 |
| PPTSlide | SlideView.tsx | 单页渲染 |
| PPTSidebar | Sidebar.tsx | 导航侧栏 |
| html2pptx | PPTXExporter.ts | PPTX 转换 |
| pptxgenjs | pptxgenjs | Office XML 生成 |

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 http://localhost:3000

### 3. 构建生产版本

```bash
npm run build
npm run preview
```

## 🎮 功能演示

### 场景 1：编辑幻灯片

```
1. 左侧选择幻灯片
2. 点击工具栏 "Edit HTML"
3. 修改标题和 HTML 内容
4. 支持所有 Tailwind CSS 类名
5. 切换回 "Preview" 查看效果
```

### 场景 2：添加新幻灯片

```
1. 点击 "+ Add Slide" 按钮
2. 新幻灯片会插入到当前位置之后
3. 自动切换到新幻灯片
4. 在 Edit 模式下修改内容
```

### 场景 3：导出 PPTX

```
1. 完成所有编辑后
2. 点击 "📥 Export PPTX" 按钮
3. 浏览器下载 presentation.pptx
4. 用 PowerPoint/Google Slides 打开
5. 包含标题、内容、背景色、页码
```

### 场景 4：备份和恢复

```
# 保存
1. 点击 "Save JSON"
2. 下载 slides-backup.json

# 恢复
1. 修改幻灯片
2. 点击 "Load JSON"
3. 选择备份文件恢复
```

## 🎨 HTML 示例模板

编辑时直接使用这些模板：

### 蓝色渐变 + 居中文本

```html
<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 p-8">
  <div class="text-center">
    <h1 class="text-6xl font-bold text-white mb-4">标题</h1>
    <p class="text-2xl text-blue-100">副标题</p>
  </div>
</div>
```

### 左右分栏

```html
<div class="flex w-full h-full">
  <div class="w-1/2 bg-red-500 p-8 flex items-center justify-center">
    <div class="text-white text-4xl font-bold">Left</div>
  </div>
  <div class="w-1/2 bg-blue-500 p-8 flex items-center justify-center">
    <div class="text-white text-4xl font-bold">Right</div>
  </div>
</div>
```

### 四宫格布局

```html
<div class="grid grid-cols-2 gap-4 w-full h-full p-8 bg-gray-100">
  <div class="bg-red-500 rounded-lg flex items-center justify-center">
    <p class="text-white text-2xl font-bold">Item 1</p>
  </div>
  <div class="bg-blue-500 rounded-lg flex items-center justify-center">
    <p class="text-white text-2xl font-bold">Item 2</p>
  </div>
  <div class="bg-green-500 rounded-lg flex items-center justify-center">
    <p class="text-white text-2xl font-bold">Item 3</p>
  </div>
  <div class="bg-purple-500 rounded-lg flex items-center justify-center">
    <p class="text-white text-2xl font-bold">Item 4</p>
  </div>
</div>
```

## 📊 状态管理详解

### PPTStore 核心 API

```typescript
// 导航
pptStore.nextSlide()                         // 下一张
pptStore.prevSlide()                         // 上一张
pptStore.setActiveIndex(index)              // 跳转
pptStore.goToFirstSlide() / goToLastSlide() // 首/末

// CRUD
pptStore.addSlide(title)                    // 添加
pptStore.deleteSlide(index)                 // 删除
pptStore.updateSlideTitle(index, title)    // 更新标题
pptStore.updateSlideContent(index, html)   // 更新内容
pptStore.moveSlide(from, to)                // 重新排序

// 查询
pptStore.currentSlide                       // 当前幻灯片
pptStore.totalSlides                        // 总数量
pptStore.canGoNext / canGoPrev             // 导航检查

// 导出
pptStore.exportConfig()                     # 导出 JSON
pptStore.importConfig(config)               # 导入 JSON
pptStore.reset()                            # 重置
```

### 响应式更新示例

```typescript
import { observer } from 'mobx-react-lite'

const MyComponent = observer(() => {
  // 任何对 pptStore 的访问都会被追踪
  return <div>{pptStore.currentSlide?.title}</div>
  // 当 pptStore.currentSlide 改变时，组件自动重新渲染
})
```

## 💾 导出功能

### PPTX 导出过程

```typescript
// 1. 提取幻灯片数据
const slides = pptStore.slides

// 2. 创建 PptxGenJS 实例
const pres = new PptxGenJS()

// 3. 逐页转换
for (const slide of slides) {
  const slideObj = pres.addSlide()
  // 提取文本、背景色等
  // 添加到 PowerPoint 页面
}

// 4. 生成文件
await pres.writeFile({ fileName: 'presentation.pptx' })
```

### 导出选项

```typescript
exportSlidesToPPTX(slides, {
  fileName: 'my-presentation',  // 文件名
  slideWidth: 10,               // 宽度（英寸）
  slideHeight: 5.625,           // 高度（英寸）16:9 比例
})
```

## 🔧 扩展功能建议

### 1. 图片上传

```typescript
// 支持上传图片到幻灯片
const handleImageUpload = (file: File) => {
  // 保存图片到 IndexedDB 或 localStorage
  // 在 HTML 中通过 data URL 引用
}
```

### 2. ECharts 图表

```html
<!-- 在幻灯片 HTML 中嵌入图表 -->
<div id="chart" style="width: 100%; height: 100%;"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.6.0/echarts.min.js"></script>
<script>
  const chart = echarts.init(document.getElementById('chart'))
  chart.setOption({ ... })
</script>
```

### 3. 模板库

```typescript
const templates = {
  title: { ... },        // 标题页模板
  content: { ... },      // 内容页模板
  twoColumn: { ... },    // 两列模板
}

// 使用模板创建幻灯片
pptStore.addSlide('New Slide', templates.content)
```

### 4. PDF 导出

```typescript
// 使用 html2pdf.js
import html2pdf from 'html2pdf.js'

exportToPDF(slides)
```

### 5. 协作编辑

```typescript
// 使用 WebSocket 同步状态
import io from 'socket.io-client'

const socket = io('http://localhost:3001')
socket.on('slides:update', (slides) => {
  pptStore.importConfig({ slides, activeIndex: 0 })
})
```

## 🐛 常见问题

### Q: 如何使用自定义 CSS？

A: 在 HTML 中使用 Tailwind CSS 类名或 inline style：

```html
<div class="bg-gradient-to-r from-red-500 to-yellow-500 p-8">
  <h1 style="color: #fff; font-size: 48px;">Hello</h1>
</div>
```

### Q: 导出的 PPTX 中能否包含图片？

A: 可以。在 PPTXExporter.ts 中扩展 `convertHTMLToSlide()` 函数来处理图片元素。

### Q: 如何将幻灯片保存到服务器？

A: 使用 `exportAsJSON()` 获取 JSON，然后通过 API 发送到后端。

### Q: 支持多人协作吗？

A: 目前不支持。可以通过 WebSocket 和 Conflict-free Replicated Data Type (CRDT) 实现。

## 📚 参考资源

- [Magicrew GitHub](https://github.com/dtyq/magic)
- [MobX 文档](https://mobx.js.org/)
- [pptxgenjs 文档](https://gitbrent.github.io/PptxGenJS/)
- [React 文档](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
