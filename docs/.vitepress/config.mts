import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Yoschey Dev Docs",
  description: "Just a Playground to test. But also nice. Its like HOME, my Garage. Smoke a Pipe and sip a Whiskey with me here ",
  base: '/Doc-Blog/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Allgemeines',
        items: [
          { text: 'Markdown Examplinos', link: '/markdown-examples' },
          { text: 'Runtime API Examplion', link: '/api-examples' },


        ]
      },
      {
        text: 'Shell',
        items: [
          { text: 'Vim Keybindings', link: '/vim_keybindings' },
          { text: 'Tmux Keybindings', link: '/tmux_keybindings' },
          { text: 'Vim Motion Test', link: '/vim-motion-test' },
        ]
      },
      {
        text: 'Konzepte',
        items: [
          { text: 'Singeltons', link: '/Singelton' },
          { text: 'Dependency Injection', link: '/Dependency-Injection' }
        ]
      },
      {
        text: 'C#',
        items: [
          { text: 'Item C', link: '/' },
          { text: 'Item D', link: '/' },
          { text: 'Item E', link: '/' }
        ]
      },
      {
        text: 'Sinnloser Kram',
        items: [
          { text: 'Ultra Violet', link: '/PokemonUltraViolet' },
          { text: 'Rugby Josh', link: '/rugby' },
          { text: 'Rugby Teams', link: '/rugby-teams' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Yoschey' },
      { icon: 'x', link: 'https://github.com/Yoschey/dotfiles' }
    ]
  }
})
