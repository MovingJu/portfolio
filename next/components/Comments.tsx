'use client';

import { useEffect, useRef, useState } from 'react';

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : 'https://api.movingju.com';

const REACTION_KEYS = ['like', 'heart', 'tada', 'thinking', 'sad'] as const;
const REACTION_LABELS: Record<string, string> = {
  like: '👍', heart: '❤️', tada: '🎉', thinking: '🤔', sad: '😢',
};

interface Comment {
  username: string;
  content: string;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr.replace(' ', 'T').replace('+00', 'Z'));
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 86400 * 30) return Math.floor(diff / 86400) + 'd ago';
  return date.toLocaleDateString();
}

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    loadComments();
    loadReactions();
  }, [postId]);

  async function loadComments() {
    try {
      const res = await fetch(`${API_BASE}/comments?post_id=${encodeURIComponent(postId)}`);
      if (res.ok) setComments(await res.json());
    } catch { /* silent */ }
  }

  async function loadReactions() {
    try {
      const tk = localStorage.getItem('token');
      const headers: Record<string, string> = tk ? { Authorization: 'Bearer ' + tk } : {};
      const res = await fetch(`${API_BASE}/reactions?post_id=${encodeURIComponent(postId)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setReactions(data.counts || {});
        setMine(data.mine || []);
      }
    } catch { /* silent */ }
  }

  async function handleReaction(key: string) {
    const tk = localStorage.getItem('token');
    if (!tk) { window.location.href = '/login'; return; }
    try {
      const res = await fetch(`${API_BASE}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tk },
        body: JSON.stringify({ post_id: postId, reaction: key }),
      });
      if (res.ok) loadReactions();
    } catch { /* silent */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = textareaRef.current?.value.trim();
    if (!content || !token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ post_id: postId, content }),
      });
      if (res.ok) {
        if (textareaRef.current) textareaRef.current.value = '';
        loadComments();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="comments-section">
      <div className="reactions-bar">
        {REACTION_KEYS.map(key => (
          <button
            key={key}
            className={`reaction-btn${mine.includes(key) ? ' reacted' : ''}`}
            onClick={() => handleReaction(key)}
          >
            {REACTION_LABELS[key]} <span className="reaction-count">{reactions[key] || 0}</span>
          </button>
        ))}
      </div>

      <div className="comments-divider" />
      <p className="comments-header">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </p>

      <div>
        {comments.length === 0
          ? <p className="comment-empty">No comments yet.</p>
          : comments.map((c, i) => (
              <div key={i} className="comment-item">
                <div className="comment-meta">
                  <span className="comment-author">{c.username}</span>
                  <span className="comment-time">{timeAgo(c.created_at)}</span>
                </div>
                <div className="comment-body">{c.content}</div>
              </div>
            ))
        }
      </div>

      {token && username ? (
        <form className="comment-form" onSubmit={handleSubmit} noValidate>
          <textarea ref={textareaRef} placeholder="Leave a comment..." rows={4} />
          <div className="comment-form-footer">
            <span className="comment-author-label">{username}</span>
            <button type="submit" className="comment-submit" disabled={submitting}>Post →</button>
          </div>
        </form>
      ) : (
        <div className="comment-login-prompt">
          <a href="/login">Login</a> to leave a comment.
        </div>
      )}
    </div>
  );
}
