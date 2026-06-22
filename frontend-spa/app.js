const { createApp } = Vue;

function applyThemeFromStorage() {
  const stored = window.localStorage.getItem('theme');
  const isDark = stored === 'dark';

  const root = document.documentElement;
  if (isDark) root.classList.add('dark');
  else root.classList.remove('dark');

  // expose for components that keep local state
  window.__isDark = isDark;
}

// initialize theme BEFORE mount so first render already correct
applyThemeFromStorage();

// also expose toggle helper (optional for pages)
window.toggleTheme = function toggleTheme() {
  const root = document.documentElement;

  // single source of truth: class on <html>
  root.classList.toggle('dark');

  const isDarkNow = root.classList.contains('dark');
  window.localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
  window.__isDark = isDarkNow;

  // let Vue components re-sync if they listen
  window.dispatchEvent(new Event('theme:changed'));
};


// index.html loads app-root.js, router/index.js, services/api.js in global scope
createApp(window.AppRoot).use(window.router).mount('#app');




