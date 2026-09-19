import { useEffect, useState } from 'react'
import TabBar from './components/TabBar'
import TopBar from './components/TopBar'
import { goBack, useRoute } from './lib/router'
import { StoreProvider } from './lib/store'
import AboutPage from './pages/AboutPage'
import DetailPage from './pages/DetailPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'

const TITLES: Record<string, { title: string; subtitle: string }> = {
  home: { title: '肝病指南要点库', subtitle: '国内外指南共识 · 要点速查' },
  library: { title: '指南库', subtitle: '按地区与病种筛选' },
  favorites: { title: '我的收藏', subtitle: '收藏的指南与标记的要点' },
  about: { title: '使用说明', subtitle: '离线能力、收录范围与免责声明' },
}

function Shell() {
  const route = useRoute()
  const [query, setQuery] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route.name, route.id, route.disease])

  const meta = TITLES[route.name] ?? TITLES.home

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <TopBar
        title={route.name === 'detail' ? '指南详情' : meta.title}
        subtitle={route.name === 'detail' ? '要点摘编 · 请以原文为准' : meta.subtitle}
        onBack={route.name === 'detail' ? goBack : undefined}
      />

      <main className="mx-auto w-full max-w-[760px] flex-1 px-4 pb-32 pt-4">
        {route.name === 'home' && <HomePage query={query} onQueryChange={setQuery} />}
        {route.name === 'library' && (
          <LibraryPage key={route.disease ?? 'all'} initialDisease={route.disease} />
        )}
        {route.name === 'detail' && route.id && <DetailPage id={route.id} />}
        {route.name === 'favorites' && <FavoritesPage />}
        {route.name === 'about' && <AboutPage />}
      </main>

      <TabBar active={route.name} />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
