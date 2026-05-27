'use client'

import { useState } from 'react'

interface EmailCaptureProps {
  /** Visual style — 'inline' for a compact single-row strip, 'card' for a centered block */
  variant?: 'inline' | 'card'
}

export function EmailCapture({ variant = 'inline' }: EmailCaptureProps) {
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrMsg(data.error ?? 'Something went wrong.')
        setStatus('error')
      } else {
        setStatus('success')
        setEmail('')
      }
    } catch {
      setErrMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={variant === 'card'
        ? 'flex flex-col items-center gap-2 py-4 text-center'
        : 'flex items-center justify-center gap-2 py-2'
      }>
        <span className="text-lg">🎉</span>
        <p className="text-sm font-semibold text-emerald-400">You&apos;re on the list!</p>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 text-center">
        <p className="mb-1 text-base font-bold text-white">Stay in the loop</p>
        <p className="mb-4 text-xs text-slate-400">Get updates when new features drop.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl bg-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Submitting…' : 'Notify Me'}
          </button>
          {status === 'error' && (
            <p className="text-xs text-red-400">{errMsg}</p>
          )}
        </form>
      </div>
    )
  }

  // inline variant — single row
  return (
    <div className="flex flex-col items-center gap-1">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          placeholder="Get updates — enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-52 rounded-full bg-slate-800 px-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '…' : 'Notify me'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-400">{errMsg}</p>
      )}
    </div>
  )
}
