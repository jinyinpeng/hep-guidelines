import { useEffect, useState } from 'react'
import PullToRefresh from './components/PullToRefresh'
import TabBar from './components/TabBar'
import TopBar from './components/TopBar'
import { DEPT_GROUPS, DEPT_MAP } from './data'
import { goBack, useRoute } from './lib/router'
import { StoreProvider } from './lib/store'
import { restoreAfterUpdate, useAutoUpdate } from './lib/update'
import AboutPage from './pages/AboutPage'
import DeptPage from './pages/DeptPage'
import DetailPage from './pages/DetailPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'

function Shell() {
  const route = useRoute()
  const [query, setQuery] = useState('')

  // 打开应用、切回前台、恢复联网时都自动检查一次是否有新版本
  useAutoUpdate()

  // 因自动更新而重载时，把滚动位置还原回来（须在上面的回顶逻辑之后执行）
  useEffect(() => {
    restoreAfterUpdate()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route.name, route.id, route.deptId, route.topic])

  const dept = route.deptId ? DEPT_MAP[route.deptId as keyof typeof DEPT_MAP] : undefined

  let title = '临床指南要点库'
  let subtitle = '国内外指南共识 · 要点速查'

  if (route.name === 'dept') {
    title = dept?.name ?? '科室'
    const groupName = DEPT_GROUPS.find((x) => x.id === dept?.group)?.name
    subtitle = groupName ? `${groupName} · 指南共识要点` : '指南共识要点'
  } else if (route.name === 'library') {
    title = '全部指南'
    subtitle = '按科室 · 地区筛选'
  } else if (route.name === 'detail') {
    title = '指南详情'
    subtitle = '要点摘编 · 请以原文为准'
  } else if (route.name === 'favorites') {
    title = '我的收藏'
    subtitle = '收藏的指南与标记的要点'
  } else if (route.name === 'about') {
    title = '使用说明'
    subtitle = '离线能力、收录范围与免责声明'
  }

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <TopBar
        title={title}
        subtitle={subtitle}
        onBack={route.name === 'detail' || route.name === 'dept' ? goBack : undefined}
      />

      <main className="mx-auto w-full max-w-[760px] flex-1 px-4 pb-32 pt-4">
        {route.name === 'home' && <HomePage query={query} onQueryChange={setQuery} />}
        {route.name === 'dept' && route.deptId && (
          <DeptPage
            key={`${route.deptId}:${route.topic ?? ''}`}
            deptId={route.deptId}
            initialTopic={route.topic}
          />
        )}
        {route.name === 'library' && <LibraryPage />}
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
      <PullToRefresh>
        <Shell />
      </PullToRefresh>
    </StoreProvider>
  )
}
