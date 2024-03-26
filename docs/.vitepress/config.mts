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
        text: 'Examples',
        items: [
          { text: 'Markdown Examplinos', link: '/markdown-examples' },
          { text: 'Runtime API Examplion', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
