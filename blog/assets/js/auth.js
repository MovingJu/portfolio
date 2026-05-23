const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8080"
  : "https://api.movingju.com";

function showMessage(text, type) {
  const el = document.getElementById("auth-message");
  if (!el) return;
  el.textContent = text;
  el.className = "auth-message " + type;
  el.style.visibility = "visible";
}

function hideMessage() {
  const el = document.getElementById("auth-message");
  if (!el) return;
  el.style.visibility = "hidden";
}

document.addEventListener("DOMContentLoaded", () => {

  // --- 로그인 폼 ---
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector(".auth-submit");

      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value;

      hideMessage();
      btn.disabled = true;

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          showMessage(data.message || "Server Error", "error");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);
        window.location.href = "/";
      } catch {
        showMessage("Server Error", "error");
      } finally {
        btn.disabled = false;
      }
    });
  }

  // --- 회원가입 폼 ---
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = signupForm.querySelector(".auth-submit");

      const username = document.getElementById("signup-username").value.trim();
      const email    = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value;

      hideMessage();
      btn.disabled = true;

      try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          showMessage(data.message || "Server Error", "error");
          return;
        }

        showMessage("완료되었습니다.", "success");
        signupForm.reset();
      } catch {
        showMessage("Server Error", "error");
      } finally {
        btn.disabled = false;
      }
    });
  }

});
