import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/common/Toast'
import { TricolorCursor } from './components/common/TricolorCursor'
import { Navbar } from './components/common/Navbar'
import { Footer } from './components/common/Footer'

// Pages
import { HomePage } from './pages/HomePage'
import { ToolsCatalogPage } from './pages/ToolsCatalogPage'
import { CategoryPage } from './pages/CategoryPage'
import { ToolDetailPage } from './pages/ToolDetailPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="relative min-h-screen flex flex-col bg-[#080A10] light:bg-[#F8FAFC] text-slate-100 light:text-slate-900 transition-colors duration-300 selection:bg-amber-500 selection:text-white">
            {/* Animated Indian Tricolor Floating Cursor Follower */}
            <TricolorCursor />

            {/* Header Navigation */}
            <Navbar />

            {/* Main Page Routes */}
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tools" element={<ToolsCatalogPage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/calculators/:slug" element={<ToolDetailPage />} />
                <Route path="/tools/:slug" element={<ToolDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Premium Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
