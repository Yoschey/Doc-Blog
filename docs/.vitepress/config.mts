import { defineConfig } from 'vitepress'
import { nav, sidebar } from './navigation'

export default defineConfig({
  lang: 'de-DE',
  title: 'Yoschey Dev Garage',
  titleTemplate: ':title | Yoschey Dev Garage',
  description: 'Das deutschsprachige DevOps-Lexikon für Ausbildung und Praxis: Grundlagen, Labs, Runbooks und Wissen zu CI/CD, PowerShell, Linux, Cloud und Security.',
  base: '/Doc-Blog/',
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/Doc-Blog/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Yoschey Dev Garage' }]
  ],
  sitemap: {
    hostname: 'https://yoschey.github.io/Doc-Blog/'
  },
  // Existing bookmarks stay valid although the source files are grouped by topic.
  rewrites: {
    'concepts/Dependency-Injection.md': 'Dependency-Injection.md',
    'concepts/Singelton.md': 'Singelton.md',
    'devops/Daily-DevOps.md': 'Daily-DevOps.md',
    'devops/PBvSQLite.md': 'PBvSQLite.md',
    'devops/azuredevops-kurs.md': 'azuredevops-kurs.md',
    'devops/checksum.md': 'checksum.md',
    'devops/proxy.md': 'proxy.md',
    'devops/smoketest.md': 'smoketest.md',
    'devops/yaml.md': 'yaml.md',
    'examples/api-examples.md': 'api-examples.md',
    'examples/markdown-examples.md': 'markdown-examples.md',
    'hobbies/PokemonUltraViolet.md': 'PokemonUltraViolet.md',
    'hobbies/rugby-teams.md': 'rugby-teams.md',
    'hobbies/rugby.md': 'rugby.md',
    'linux/Unix-Tools.md': 'Unix-Tools.md',
    'linux/tmux_keybindings.md': 'tmux_keybindings.md',
    'linux/vim-motion-test.md': 'vim-motion-test.md',
    'linux/vim_keybindings.md': 'vim_keybindings.md',
    'windows/Basis-Powershell.md': 'Basis-Powershell.md',
    'windows/Powershell-Fortgeschrittene.md': 'Powershell-Fortgeschrittene.md',
    'windows/gpo.md': 'gpo.md',
    'windows/powershell-kurs.md': 'powershell-kurs.md',
    'windows/win-proxy.md': 'win-proxy.md'
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Dev Garage',
    nav,
    sidebar,
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: 'Auf dieser Seite'
    },
    editLink: {
      pattern: 'https://github.com/Yoschey/Doc-Blog/edit/main/docs/:path',
      text: 'Diese Seite auf GitHub bearbeiten'
    },
    lastUpdated: {
      text: 'Zuletzt aktualisiert',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },
    docFooter: {
      prev: 'Vorherige Seite',
      next: 'Nächste Seite'
    },
    footer: {
      message: 'DevOps verständlich lernen, sicher ausprobieren und im Team weitergeben.',
      copyright: 'Beispiele zuerst im Lab testen. Stand: fortlaufend gepflegt.'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Yoschey/Doc-Blog' },
      { icon: 'github', link: 'https://github.com/Yoschey' }
    ]
  }
})
