'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : 'https://api.movingju.com';

interface Props {
  type: 'login' | 'signup';
}

export default function AuthForm({ type }: Props) {
  const isLogin = type === 'login';
  const [msg, setMsg] = useState<{ text: string; kind: 'error' | 'success' } | null>(null);
  const [disabled, setDisabled] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setDisabled(true);

    const username = usernameRef.current?.value.trim() || '';
    const password = passwordRef.current?.value || '';

    try {
      if (isLogin) {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) { setMsg({ text: data.message || 'Server Error', kind: 'error' }); return; }
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        window.location.href = '/';
      } else {
        const email = emailRef.current?.value.trim() || '';
        const res = await fetch(`${API_BASE}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        if (!res.ok) { setMsg({ text: data.message || 'Server Error', kind: 'error' }); return; }
        setMsg({ text: '완료되었습니다.', kind: 'success' });
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      setMsg({ text: 'Server Error', kind: 'error' });
    } finally {
      setDisabled(false);
    }
  }

  return (
    <div className="mid-section-home">
      <h1>{isLogin ? 'Login' : 'Sign up'}</h1>
      <div className="auth-layout">
        <p
          className="auth-left"
          dangerouslySetInnerHTML={{
            __html: isLogin ? 'Let me know<br>who you are.' : 'Nice to<br>meet you.',
          }}
        />
        <div className="auth-right">
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <input
                ref={usernameRef}
                type="text"
                placeholder="username"
                autoComplete="username"
                required
              />
            </div>
            {!isLogin && (
              <div className="auth-field">
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="email"
                  autoComplete="email"
                  required
                />
              </div>
            )}
            <div className="auth-field">
              <input
                ref={passwordRef}
                type="password"
                placeholder="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
              />
            </div>
            <button type="submit" className="auth-submit" disabled={disabled}>
              {isLogin ? 'Login →' : 'Sign up →'}
            </button>
            <Link href={isLogin ? '/signup' : '/login'} className="auth-secondary">
              {isLogin ? 'Sign up' : 'Login'}
            </Link>
          </form>
        </div>
      </div>
      <Link href="/" className="auth-home">Home</Link>
      {msg && (
        <p
          className={`auth-message ${msg.kind}`}
          style={{ visibility: 'visible' }}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
