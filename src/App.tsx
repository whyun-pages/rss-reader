import { useState, useEffect } from 'react'
import './App.css'
import { Plus, Trash2 } from 'lucide-react'

interface RSSSource {
  id: string
  name: string
  url: string
  logo?: string
}

interface Article {
  title: string
  link: string
  content: string
  pubDate: string
  author?: string
}

function App() {
  const [sources, setSources] = useState<RSSSource[]>([])
  const [selectedSource, setSelectedSource] = useState<RSSSource | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [contextMenuSource, setContextMenuSource] = useState<RSSSource | null>(null)
  const [newSource, setNewSource] = useState({ name: '', url: '' })

  // 加载保存的源
  useEffect(() => {
    const savedSources = localStorage.getItem('rss-sources')
    if (savedSources) {
      setSources(JSON.parse(savedSources))
    }
  }, [])

  // 保存源到本地存储
  useEffect(() => {
    localStorage.setItem('rss-sources', JSON.stringify(sources))
  }, [sources])

  // 解析 RSS XML
  const parseRSS = (xmlText: string): Article[] => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    
    // 检查是否有解析错误
    const parseError = xmlDoc.getElementsByTagName('parsererror')
    if (parseError.length > 0) {
      throw new Error('XML 解析失败')
    }
    
    // 获取所有 item 元素
    const items = xmlDoc.getElementsByTagName('item')
    const articles: Article[] = []
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const title = item.getElementsByTagName('title')[0]?.textContent || ''
      const link = item.getElementsByTagName('link')[0]?.textContent || ''
      const description = item.getElementsByTagName('description')[0]?.textContent || ''
      const content = item.getElementsByTagName('content:encoded')[0]?.textContent || description
      const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || ''
      const author = item.getElementsByTagName('author')[0]?.textContent || 
                   item.getElementsByTagName('dc:creator')[0]?.textContent || ''
      
      articles.push({
        title,
        link,
        content,
        pubDate,
        author
      })
    }
    
    return articles
  }

  // 获取文章
  const fetchArticles = async (source: RSSSource) => {
    try {
      // 使用代理服务来避免 CORS 问题
      const proxyUrl = `/api/rss/${encodeURIComponent(source.url)}`
      const response = await fetch(proxyUrl)
      const data = await response.text()
      
      if (data) {
        const articles = parseRSS(data)
        setArticles(articles)
      } else {
        throw new Error('无法获取 RSS 内容')
      }
    } catch (error) {
      console.error('获取文章失败:', error)
      alert('获取文章失败，请检查 RSS 源地址是否正确')
    }
  }

  // 选择源
  const handleSourceSelect = (source: RSSSource) => {
    setSelectedSource(source)
    setSelectedArticle(null)
    fetchArticles(source)
  }

  // 添加源
  const handleAddSource = () => {
    if (newSource.name && newSource.url) {
      const source: RSSSource = {
        id: Date.now().toString(),
        name: newSource.name,
        url: newSource.url
      }
      setSources([...sources, source])
      setNewSource({ name: '', url: '' })
      setShowAddDialog(false)
    }
  }

  // 删除源
  const handleDeleteSource = (source: RSSSource) => {
    setSources(sources.filter(s => s.id !== source.id))
    if (selectedSource?.id === source.id) {
      setSelectedSource(null)
      setArticles([])
      setSelectedArticle(null)
    }
    setShowContextMenu(false)
  }

  // 右键菜单
  const handleContextMenu = (e: React.MouseEvent, source: RSSSource) => {
    e.preventDefault()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setContextMenuSource(source)
    setShowContextMenu(true)
  }

  // 关闭右键菜单
  useEffect(() => {
    const handleClick = () => setShowContextMenu(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="app">
      {/* 左侧源列表 */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>RSS 源</h2>
          <button 
            className="add-button"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="sources-list">
          {sources.map(source => (
            <div
              key={source.id}
              className={`source-item ${selectedSource?.id === source.id ? 'selected' : ''}`}
              onClick={() => handleSourceSelect(source)}
              onContextMenu={(e) => handleContextMenu(e, source)}
            >
              <div className="source-logo">
                {source.logo ? (
                  <img src={source.logo} alt={source.name} />
                ) : (
                  <div className="default-logo">{source.name[0]}</div>
                )}
              </div>
              <span className="source-name">{source.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 中间文章列表 */}
      <div className="articles-panel">
        <div className="articles-header">
          <h3>{selectedSource ? selectedSource.name : '选择 RSS 源'}</h3>
        </div>
        <div className="articles-list">
          {articles.map((article, index) => (
            <div
              key={index}
              className={`article-item ${selectedArticle === article ? 'selected' : ''}`}
              onClick={() => setSelectedArticle(article)}
            >
              <h4 className="article-title">{article.title}</h4>
              <p className="article-meta">
                {article.author && <span className="author">{article.author}</span>}
                {article.pubDate && (
                  <span className="date">
                    {new Date(article.pubDate).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧文章内容 */}
      <div className="content-panel">
        {selectedArticle ? (
          <div className="article-content">
            <h1>{selectedArticle.title}</h1>
            <div className="article-meta">
              {selectedArticle.author && <span>作者: {selectedArticle.author}</span>}
              {selectedArticle.pubDate && (
                <span>发布时间: {new Date(selectedArticle.pubDate).toLocaleString()}</span>
              )}
            </div>
            <div 
              className="content"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
            <a href={selectedArticle.link} target="_blank" rel="noopener noreferrer" className="original-link">
              查看原文
            </a>
          </div>
        ) : (
          <div className="no-article">
            <p>选择一篇文章查看内容</p>
          </div>
        )}
      </div>

      {/* 添加源对话框 */}
      {showAddDialog && (
        <div className="dialog-overlay" onClick={() => setShowAddDialog(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h3>添加 RSS 源</h3>
            <div className="form-group">
              <label>名称:</label>
              <input
                type="text"
                value={newSource.name}
                onChange={e => setNewSource({ ...newSource, name: e.target.value })}
                placeholder="输入源名称"
              />
            </div>
            <div className="form-group">
              <label>URL:</label>
              <input
                type="url"
                value={newSource.url}
                onChange={e => setNewSource({ ...newSource, url: e.target.value })}
                placeholder="输入 RSS 源地址"
              />
            </div>
            <div className="dialog-buttons">
              <button onClick={() => setShowAddDialog(false)}>取消</button>
              <button onClick={handleAddSource}>添加</button>
            </div>
          </div>
        </div>
      )}

      {/* 右键菜单 */}
      {showContextMenu && contextMenuSource && (
        <div 
          className="context-menu"
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
        >
          <div className="context-menu-item" onClick={() => handleDeleteSource(contextMenuSource)}>
            <Trash2 size={16} />
            删除源
          </div>
        </div>
      )}
    </div>
  )
}

export default App
