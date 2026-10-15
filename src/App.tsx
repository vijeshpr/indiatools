import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
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
import { NotFoundPage } from './pages/NotFoundPage'
import { IndianChequeStudioTool } from './calculators/IndianChequeStudioTool'
import { GoldExchangeCalculatorTool } from './calculators/GoldExchangeCalculatorTool'

const LocalizedGoldRedirect: React.FC = () => {
  const { langCode } = useParams<{ langCode?: string }>()
  return <Navigate to={langCode ? `/${langCode}/tools/gold-exchange-calculator` : '/calculators/gold-exchange-calculator'} replace />
}

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
        <BrowserRouter>
          <div className="relative min-h-screen flex flex-col bg-[#F7F8FC] dark:bg-[#07130E] text-[#111827] dark:text-[#F3F0E5] transition-colors duration-300 selection:bg-[#16865D] selection:text-white overflow-x-hidden w-full max-w-full font-sans">
            {/* Ambient Radial Gradient Botanical Mesh Lighting */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none no-print" aria-hidden="true">
              <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-emerald-600/15 dark:bg-emerald-600/18 rounded-full blur-[140px]" />
              <div className="absolute top-20 -right-32 w-[600px] h-[600px] bg-[#617A43]/15 dark:bg-[#617A43]/15 rounded-full blur-[140px]" />
              <div className="absolute top-[45%] -left-32 w-[550px] h-[550px] bg-[#D8B879]/8 dark:bg-[#D8B879]/10 rounded-full blur-[150px]" />
              <div className="absolute bottom-20 right-10 w-[650px] h-[650px] bg-emerald-700/10 dark:bg-emerald-700/12 rounded-full blur-[160px]" />
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
                <Route path="/tools/indian-cheque-studio" element={<Navigate to="/calculators/indian-cheque-studio" replace />} />
                <Route path="/tools/indian-cheque-studio/:langCode" element={<Navigate to="/calculators/indian-cheque-studio" replace />} />
                <Route path="/tools/gold-exchange-calculator" element={<Navigate to="/calculators/gold-exchange-calculator" replace />} />
                <Route path="/calculators/gold-exchange-calculator" element={<GoldExchangeCalculatorTool />} />
                <Route path="/:langCode/tools/gold-exchange-calculator" element={<GoldExchangeCalculatorTool />} />
                <Route path="/:langCode/calculators/gold-exchange-calculator" element={<LocalizedGoldRedirect />} />
                <Route path="/tools/friendship-relationship-cost" element={<Navigate to="/calculators/friendship-relationship-cost" replace />} />
                <Route path="/tools/repair-vs-replace" element={<Navigate to="/calculators/repair-vs-replace" replace />} />
                <Route path="/calculators/lucky-draw-team-splitter" element={<Navigate to="/tools/lucky-draw-team-splitter" replace />} />
                <Route path="/:langCode/tools/:slug" element={<ToolDetailPage />} />
                <Route path="/:langCode/calculators/:slug" element={<ToolDetailPage />} />
                <Route path="/qr-code-generator" element={<Navigate to="/calculators/qr-code-generator" replace />} />
                <Route path="/orbit-audio-studio" element={<Navigate to="/tools/orbit-audio-studio" replace />} />
                <Route path="/calculators/orbit-audio-studio" element={<Navigate to="/tools/orbit-audio-studio" replace />} />
                <Route path="/audio-spectrum-waveform-video-generator" element={<Navigate to="/tools/audio-spectrum-waveform-video-generator" replace />} />
                <Route path="/calculators/audio-spectrum-waveform-video-generator" element={<Navigate to="/tools/audio-spectrum-waveform-video-generator" replace />} />
                <Route path="/dts-cinema-theater-reverb" element={<Navigate to="/tools/dts-cinema-theater-reverb" replace />} />
                <Route path="/calculators/dts-cinema-theater-reverb" element={<Navigate to="/tools/dts-cinema-theater-reverb" replace />} />
                <Route path="/virtual-surround-upmixer" element={<Navigate to="/tools/virtual-surround-upmixer" replace />} />
                <Route path="/calculators/virtual-surround-upmixer" element={<Navigate to="/tools/virtual-surround-upmixer" replace />} />
                <Route path="/studio-master-spatial-suite" element={<Navigate to="/tools/studio-master-spatial-suite" replace />} />
                <Route path="/calculators/studio-master-spatial-suite" element={<Navigate to="/tools/studio-master-spatial-suite" replace />} />
                <Route path="/studio-bass-enhancer" element={<Navigate to="/tools/studio-bass-enhancer" replace />} />
                <Route path="/calculators/studio-bass-enhancer" element={<Navigate to="/tools/studio-bass-enhancer" replace />} />
                <Route path="/batch-pdf-password-vault" element={<Navigate to="/tools/batch-pdf-password-vault" replace />} />
                <Route path="/calculators/batch-pdf-password-vault" element={<Navigate to="/tools/batch-pdf-password-vault" replace />} />
                <Route path="/zero-knowledge-file-vault" element={<Navigate to="/tools/zero-knowledge-file-vault" replace />} />
                <Route path="/calculators/zero-knowledge-file-vault" element={<Navigate to="/tools/zero-knowledge-file-vault" replace />} />
                <Route path="/invisible-document-watermarker" element={<Navigate to="/tools/invisible-document-watermarker" replace />} />
                <Route path="/calculators/invisible-document-watermarker" element={<Navigate to="/tools/invisible-document-watermarker" replace />} />
                <Route path="/smart-document-scanner" element={<Navigate to="/tools/smart-document-scanner" replace />} />
                <Route path="/calculators/smart-document-scanner" element={<Navigate to="/tools/smart-document-scanner" replace />} />
                <Route path="/batch-image-watermarker" element={<Navigate to="/tools/batch-image-watermarker" replace />} />
                <Route path="/calculators/batch-image-watermarker" element={<Navigate to="/tools/batch-image-watermarker" replace />} />
                <Route path="/fast-inpainting-watermark-remover" element={<Navigate to="/tools/fast-inpainting-watermark-remover" replace />} />
                <Route path="/calculators/fast-inpainting-watermark-remover" element={<Navigate to="/tools/fast-inpainting-watermark-remover" replace />} />
                <Route path="/scan-to-print" element={<Navigate to="/tools/scan-to-print" replace />} />
                <Route path="/calculators/scan-to-print" element={<Navigate to="/tools/scan-to-print" replace />} />
                <Route path="/calculators/:slug" element={<ToolDetailPage />} />
                <Route path="/tools/:slug" element={<ToolDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
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
