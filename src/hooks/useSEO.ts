import { useEffect } from 'react'

export interface UseSEOProps {
  title: string
  description: string
  canonicalPath?: string
  ogType?: string
  ogImage?: string
  jsonLd?: Record<string, any>
}

const BASE_URL = 'https://indiatools-rho.vercel.app'

export function useSEO({
  title,
  description,
  canonicalPath = '',
  ogType = 'website',
  ogImage = `${BASE_URL}/og-image.png`,
  jsonLd,
}: UseSEOProps) {
  useEffect(() => {
    // 1. Document title
    document.title = title

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // 3. Canonical URL
    const canonicalUrl = `${BASE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`.replace(/\/+$/, '') || `${BASE_URL}/`
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl === BASE_URL ? `${BASE_URL}/` : canonicalUrl)

    // 4. Open Graph meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonicalUrl === BASE_URL ? `${BASE_URL}/` : canonicalUrl)
    setMeta('property', 'og:type', ogType)
    setMeta('property', 'og:site_name', 'IndiaTools')
    setMeta('property', 'og:image', ogImage)

    // 5. Twitter Card meta tags
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', ogImage)

    // 6. JSON-LD Structured Data
    let scriptEl = document.getElementById('page-jsonld') as HTMLScriptElement | null
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script')
        scriptEl.id = 'page-jsonld'
        scriptEl.type = 'application/ld+json'
        document.head.appendChild(scriptEl)
      }
      scriptEl.textContent = JSON.stringify(jsonLd)
    } else if (scriptEl) {
      scriptEl.remove()
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [title, description, canonicalPath, ogType, ogImage, jsonLd])
}
