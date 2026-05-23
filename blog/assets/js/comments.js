const COMMENTS_API = window.location.hostname === "localhost"
  ? "http://localhost:8080"
  : "https://api.movingju.com";

const REACTION_LABELS = { like: "👍", heart: "❤️", tada: "🎉", thinking: "🤔", sad: "😢" };

function timeAgo(dateStr) {
  const date = new Date(dateStr.replace(" ", "T").replace("+00", "Z"));
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)         return "just now";
  if (diff < 3600)       return Math.floor(diff / 60) + "m ago";
  if (diff < 86400)      return Math.floor(diff / 3600) + "h ago";
  if (diff < 86400 * 30) return Math.floor(diff / 86400) + "d ago";
  return date.toLocaleDateString();
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderComments(comments) {
  const list = document.getElementById("comment-list");
  const count = document.getElementById("comment-count");
  if (!list) return;
  count.textContent = comments.length + " Comment" + (comments.length !== 1 ? "s" : "");
  if (comments.length === 0) {
    list.innerHTML = '<p class="comment-empty">No comments yet.</p>';
    return;
  }
  list.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-meta">
        <span class="comment-author">${escapeHtml(c.username)}</span>
        <span class="comment-time">${timeAgo(c.created_at)}</span>
      </div>
      <div class="comment-body">${escapeHtml(c.content)}</div>
    </div>
  `).join("");
}

function renderReactions(counts, mine) {
  Object.keys(REACTION_LABELS).forEach(key => {
    const countEl = document.getElementById("count-" + key);
    const btn = document.querySelector(`.reaction-btn[data-reaction="${key}"]`);
    if (countEl) countEl.textContent = counts[key] || 0;
    if (btn) {
      btn.classList.toggle("reacted", mine.includes(key));
    }
  });
}

async function loadComments(postId) {
  try {
    const res = await fetch(`${COMMENTS_API}/comments?post_id=${encodeURIComponent(postId)}`);
    if (!res.ok) return;
    renderComments(await res.json());
  } catch { /* silent */ }
}

async function loadReactions(postId, token) {
  try {
    const headers = token ? { "Authorization": "Bearer " + token } : {};
    const res = await fetch(`${COMMENTS_API}/reactions?post_id=${encodeURIComponent(postId)}`, { headers });
    if (!res.ok) return;
    const data = await res.json();
    renderReactions(data.counts || {}, data.mine || []);
  } catch { /* silent */ }
}

document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("comments-section");
  if (!section) return;

  const postId = section.dataset.postId;
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  loadComments(postId);
  loadReactions(postId, token);

  // show/hide form
  const form = document.getElementById("comment-form");
  const prompt = document.getElementById("comment-login-prompt");
  if (token && username) {
    if (form) form.style.display = "";
    if (prompt) prompt.style.display = "none";
  } else {
    if (form) form.style.display = "none";
    if (prompt) prompt.style.display = "";
  }

  // reaction buttons
  document.querySelectorAll(".reaction-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!token) {
        window.location.href = "/login/";
        return;
      }
      const reaction = btn.dataset.reaction;
      try {
        const res = await fetch(`${COMMENTS_API}/reactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify({ post_id: postId, reaction }),
        });
        if (res.ok) await loadReactions(postId, token);
      } catch { /* silent */ }
    });
  });

  // comment form
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const textarea = document.getElementById("comment-content");
      const btn = form.querySelector(".comment-submit");
      const content = textarea.value.trim();
      if (!content) return;
      btn.disabled = true;
      try {
        const res = await fetch(`${COMMENTS_API}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify({ post_id: postId, content }),
        });
        if (res.ok) {
          textarea.value = "";
          await loadComments(postId);
        }
      } finally {
        btn.disabled = false;
      }
    });
  }
});
