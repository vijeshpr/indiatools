import React, { useState } from 'react'
import { Send, CheckCircle2, MessageSquare, Mail } from 'lucide-react'
import { useToast } from '../components/common/Toast'

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('tool-suggestion')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    showToast('Feedback submitted! Thank you for supporting India Practical Tools.')
  }

  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <h1 className="text-3xl sm:text-5xl font-black text-white light:text-slate-900 tracking-tight">
          Feedback & Tool Requests
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 light:text-slate-600 max-w-lg mx-auto">
          Have an idea for a new Indian practical calculator or want to suggest regional tariff data? Let us know.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-2xl">
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white light:text-slate-900">
              Message Received
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Thank you for contributing to India Practical Tools. We review every suggestion to add new calculators.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setMessage('')
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-neutral-800 text-xs text-white hover:bg-neutral-700"
            >
              Send Another Suggestion
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5 font-semibold">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-2.5 text-sm text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@email.com"
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-2.5 text-sm text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5 font-semibold">
                Suggestion Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-2.5 text-sm text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              >
                <option value="tool-suggestion">Suggest a New Calculator / Tool</option>
                <option value="formula-refinement">Formula or Tariff Benchmark Refinement</option>
                <option value="bug-report">Bug or Layout Issue</option>
                <option value="general">General Partnership / Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5 font-semibold">
                Message / Details
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the tool or calculation you'd like to see added..."
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl p-4 text-sm text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
