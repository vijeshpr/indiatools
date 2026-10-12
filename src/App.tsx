import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/common/Toast'
import { I18nProvider } from './i18n/I18nContext'
import { Navbar } from './components/common/Navbar'
import { Footer } from './components/common/Footer'

// Pages
import { HomePage } from './pages/HomePage'
import { ToolsCatalogPage } from './pages/ToolsCatalogPage'
import { CategoryPage } from './pages/CategoryPage'
import { CategoriesOverviewPage } from './pages/CategoriesOverviewPage'
import { ToolDetailPage } from './pages/ToolDetailPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { IndianChequeStudioTool } from './calculators/IndianChequeStudioTool'
import { GoldExchangeCalculatorTool } from './calculators/GoldExchangeCalculatorTool'

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
        <BrowserRouter>
          <div className="relative min-h-screen flex flex-col bg-[#F7F8FC] dark:bg-[#080D1A] text-[#111827] dark:text-slate-100 transition-colors duration-200 selection:bg-indigo-600 selection:text-white overflow-x-hidden w-full max-w-full">
            {/* Ambient Radial Gradient Mesh Lighting & Tech Grid */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none no-print" aria-hidden="true">
              <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[140px]" />
              <div className="absolute top-20 -right-32 w-[600px] h-[600px] bg-teal-500/8 dark:bg-cyan-500/15 rounded-full blur-[140px]" />
              <div className="absolute top-[45%] -left-32 w-[550px] h-[550px] bg-indigo-500/6 dark:bg-indigo-500/15 rounded-full blur-[150px]" />
              <div className="absolute bottom-20 right-10 w-[650px] h-[650px] bg-amber-500/6 dark:bg-amber-500/12 rounded-full blur-[160px]" />
              <div className="absolute inset-0 bg-[radial-gradient(#4f46e50f_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            {/* Header Navigation */}
            <div className="relative z-40">
              <Navbar />
            </div>

            {/* Main Page Routes */}
            <div className="flex-1 relative z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tools" element={<ToolsCatalogPage />} />
                <Route path="/popular" element={<ToolsCatalogPage popularOnly={true} />} />
                <Route path="/categories" element={<CategoriesOverviewPage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/calculators/indian-cheque-studio" element={<IndianChequeStudioTool />} />
                <Route path="/calculators/indian-cheque-studio/:langCode" element={<IndianChequeStudioTool />} />
                <Route path="/tools/indian-cheque-studio" element={<IndianChequeStudioTool />} />
                <Route path="/tools/indian-cheque-studio/:langCode" element={<IndianChequeStudioTool />} />
                <Route path="/tools/gold-exchange-calculator" element={<GoldExchangeCalculatorTool />} />
                <Route path="/calculators/gold-exchange-calculator" element={<GoldExchangeCalculatorTool />} />
                <Route path="/:langCode/tools/gold-exchange-calculator" element={<GoldExchangeCalculatorTool />} />
                <Route path="/:langCode/calculators/gold-exchange-calculator" element={<GoldExchangeCalculatorTool />} />
                <Route path="/:langCode/tools/:slug" element={<ToolDetailPage />} />
                <Route path="/:langCode/calculators/:slug" element={<ToolDetailPage />} />
                <Route path="/qr-code-generator" element={<Navigate to="/calculators/qr-code-generator" replace />} />
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
            <div className="relative z-10">
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
