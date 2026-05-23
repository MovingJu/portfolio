---
title: Sign up
layout: auth
permalink: /signup/
auth_text: "Nice to<br>meet you."
---

<form id="signup-form" class="auth-form" novalidate>
  <div class="auth-field">
    <input type="text"     id="signup-username" name="username" placeholder="username" autocomplete="username"     required />
  </div>
  <div class="auth-field">
    <input type="email"    id="signup-email"    name="email"    placeholder="email"    autocomplete="email"        required />
  </div>
  <div class="auth-field">
    <input type="password" id="signup-password" name="password" placeholder="password" autocomplete="new-password" required />
  </div>
  <button type="submit" class="auth-submit">Sign up →</button>
  <a href="{{ '/login/' | relative_url }}" class="auth-secondary">Login</a>
</form>

<script src="{{ '/assets/js/auth.js' | relative_url }}" defer></script>
