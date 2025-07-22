# RSS 阅读器

一个基于 React + TypeScript 构建的现代化 RSS 阅读器，支持添加、管理和阅读 RSS 订阅源。

## 功能特性

- 📰 **RSS 源管理**: 添加、编辑、删除 RSS 订阅源
- 📱 **三栏布局**: 左侧源列表、中间文章列表、右侧文章内容
- 💾 **本地存储**: 自动保存 RSS 源到本地存储
- 🎨 **现代化 UI**: 美观的界面设计和响应式布局
- 🔄 **实时更新**: 点击源即可获取最新文章
- 📱 **响应式设计**: 支持桌面和移动设备

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **RSS 解析**: 浏览器原生 XML 解析
- **图标库**: Lucide React
- **样式**: CSS3 + 响应式设计

## 安装和运行

### 环境要求

- Node.js 18+ 
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
pnpm build
```

## 使用说明

### 添加 RSS 源

1. 点击右上角的 "+" 按钮
2. 在弹出的对话框中输入：
   - **名称**: RSS 源的显示名称
   - **URL**: RSS 源的地址 (如: `https://example.com/feed.xml`)
3. 点击"添加"按钮

### 阅读文章

1. 在左侧选择要阅读的 RSS 源
2. 中间面板会显示该源的文章列表
3. 点击文章标题在右侧查看详细内容
4. 点击"查看原文"链接跳转到原始网站

### 管理 RSS 源

- **删除源**: 右键点击源名称，选择"删除源"
- **编辑源**: 目前支持删除功能，编辑功能可后续扩展

## 项目结构

```
src/
├── App.tsx          # 主应用组件
├── App.css          # 应用样式
├── main.tsx         # 应用入口
├── index.css        # 全局样式
└── vite-env.d.ts    # Vite 类型声明
```

## 常见 RSS 源示例

以下是一些常用的 RSS 源地址：

- **科技新闻**: `https://rss.cnn.com/rss/edition_technology.rss`
- **开发者资讯**: `https://feeds.feedburner.com/TechCrunch/`
- **博客**: `https://blog.example.com/feed.xml`

## 注意事项

- 由于浏览器 CORS 限制，RSS 源需要通过代理服务获取
- 确保 RSS 源地址格式正确且可访问
- 某些 RSS 源可能包含图片或其他媒体内容

## 开发计划

- [ ] 添加 RSS 源编辑功能
- [ ] 支持文章收藏功能
- [ ] 添加阅读历史记录
- [ ] 支持 RSS 源分类管理
- [ ] 添加文章搜索功能
- [ ] 支持离线阅读

## 许可证

MIT License
