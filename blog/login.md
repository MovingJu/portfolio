---
title: Login
layout: auth
permalink: /login/
auth_text: "Let me know<br>who you are."
---

<form id="login-form" class="auth-form" novalidate>
  <div class="auth-field">
    <input type="text"     id="login-username" name="username" placeholder="username" autocomplete="username"          required />
  </div>
  <div class="auth-field">
    <input type="password" id="login-password" name="password" placeholder="password" autocomplete="current-password" required />
  </div>
  <button type="submit" class="auth-submit">Login →</button>
  <a href="{{ '/signup/' | relative_url }}" class="auth-secondary">Sign up</a>
</form>

<script src="{{ '/assets/js/auth.js' | relative_url }}" defer></script>
