import { useEffect, useState } from 'react'

export type RouteName =
  | 'home'
  | 'dept'
  | 'library'
  | 'detail'
  | 'finding'
  | 'methods'
  | 'favorites'
  | 'about'

export interface Route {
  name: RouteName
  /** 科室 id */
  deptId?: string
  /** 科室下的亚病种 / 亚专业 */
  topic?: string
  /** 指南 id 或研究发现 id */
  id?: string
  query: URLSearchParams
  raw: string
}

/** 极简 hash 路由：无需第三方依赖，离线环境下也绝不失效 */
export function parseRoute(raw: string): Route {
  const [path, search] = raw.split('?')
  const query = new URLSearchParams(search ?? '')
  const segs = path.split('/').filter(Boolean)

  if (segs[0] === 'dept' && segs[1]) {
    return { name: 'dept', deptId: segs[1], topic: query.get('d') ?? undefined, query, raw }
  }
  if (segs[0] === 'library') return { name: 'library', query, raw }
  if (segs[0] === 'detail' && segs[1]) return { name: 'detail', id: segs[1], query, raw }
  if (segs[0] === 'finding' && segs[1]) return { name: 'finding', id: segs[1], query, raw }
  if (segs[0] === 'methods') return { name: 'methods', query, raw }
  if (segs[0] === 'favorites') return { name: 'favorites', query, raw }
  if (segs[0] === 'about') return { name: 'about', query, raw }
  return { name: 'home', query, raw }
}

export function useRoute(): Route {
  const [raw, setRaw] = useState(() => {
    const h = window.location.hash.replace(/^#/, '')
    return h || '/'
  })

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#/, '')
      setRaw(h || '/')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return parseRoute(raw)
}

export function navigate(to: string) {
  const target = to.startsWith('/') ? to : `/${to}`
  if (window.location.hash.replace(/^#/, '') === target) return
  window.location.hash = target
}

export function href(to: string) {
  return `#${to.startsWith('/') ? to : `/${to}`}`
}

/** 详情页返回：有历史则后退，否则回指南库 */
export function goBack() {
  if (window.history.length > 1) window.history.back()
  else navigate('/library')
}
