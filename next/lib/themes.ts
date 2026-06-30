export const themeMap: Record<string, Record<string, string>> = {
  'default-dark': {
    'background-color': '#222',
    'text-color': 'white',
    'highlight-color': '#2e2e2e',
  },
  'default-light': {
    'background-color': 'white',
    'text-color': '#222',
    'highlight-color': '#eee',
  },
  'solarized-light': {
    'background-color': '#fdf6e3',
    'text-color': '#657b83',
    'highlight-color': '#eee8d5',
  },
  'solarized-dark': {
    'background-color': '#002b36',
    'text-color': '#839496',
    'highlight-color': '#073642',
  },
  'sepia-light': {
    'background-color': '#f4ecd8',
    'text-color': '#5b4636',
    'highlight-color': '#e4d5b7',
  },
  'sepia-dark': {
    'background-color': '#3e2c1c',
    'text-color': '#d8c3a5',
    'highlight-color': '#4b382a',
  },
};

export const defaultTheme = 'default-dark';

export const themeInitScript = `
(function(){
  var themeMap = ${JSON.stringify(themeMap)};
  var savedTheme = localStorage.getItem('theme') || '${defaultTheme}';
  var theme = themeMap[savedTheme] || themeMap['${defaultTheme}'];
  var html = document.documentElement;
  for (var key in theme) {
    html.style.setProperty('--primary-' + key, theme[key]);
  }
})();
`;
