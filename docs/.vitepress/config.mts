import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Yoschey Dev Docs",
  description: "Just a Playground to test. But also nice. Its like HOME, my Garage. Smoke a Pipe and sip a Whisky with me here ",
  base: '/Doc-Blog/',
  // Keep existing public URLs stable while organizing source files by topic.
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
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
    search: {
      provider: 'local'
    },

    sidebar: [
      {
        text: 'DevOps',
        items: [
          { text: 'Daily DevOps', link: '/Daily-DevOps' },
          { text: 'Azure DevOps Kurs', link: '/azuredevops-kurs' },
          { text: 'YAML Guide', link: '/yaml' },
          { text: 'Checksummen', link: '/checksum' },
          { text: 'Proxy', link: '/proxy' },
          { text: 'Smoke Tests', link: '/smoketest' },
          { text: 'PocketBase vs. SQLite', link: '/PBvSQLite' }
        ]
      },
      {
        text: 'Windows & PowerShell',
        items: [
          { text: 'PowerShell für DevOps', link: '/powershell-kurs' },
          { text: 'PowerShell Grundlagen', link: '/Basis-Powershell' },
          { text: 'PowerShell Fortgeschritten', link: '/Powershell-Fortgeschrittene' },
          { text: 'Windows Proxy', link: '/win-proxy' },
          { text: 'Gruppenrichtlinien', link: '/gpo' }
        ]
      },
      {
        text: 'Linux & CLI',
        items: [
          { text: 'Unix Tools', link: '/Unix-Tools' },
          { text: 'Vim Keybindings', link: '/vim_keybindings' },
          { text: 'Tmux Keybindings', link: '/tmux_keybindings' },
          { text: 'Vim Motion Test', link: '/vim-motion-test' }
        ]
      },
      {
        text: 'Entwicklungskonzepte',
        items: [
          { text: 'Dependency Injection', link: '/Dependency-Injection' },
          { text: 'Singleton Pattern', link: '/Singelton' }
        ]
      },
      {
        text: 'Beispiele',
        items: [
          { text: 'Markdown', link: '/markdown-examples' },
          { text: 'Runtime API', link: '/api-examples' }
        ]
      },
      {
        text: 'Bücher',
        items: [
          { text: 'Übersicht', link: '/books/overview' },
          { text: 'Ansible', link: '/books/Ansible_Up_and_Running_Summary' },
          { text: 'DevObs for Dummies', link: '/books/DevOps_for_Dummies_Summary' },
          { text: 'Effective DevOps', link: '/books/Effective_DevOps_Summary' },
          { text: 'GitOps Cookbook', link: '/books/GitOps_Cookbook_Summary' },
          { text: 'DevSecOps', link: '/books/Learning_DevSecOps_Summary' },
          { text: 'PowerShell for Sysadmins', link: '/books/PowerShell_for_Sysadmins_Summary' },
          { text: 'PowerShell Pocketreference', link: '/books/PowerShell_Pocket_Reference_Summary' },
          { text: 'Python for DevOps', link: '/books/Python_for_DevOps_Summary' }
        ]
      },
      {
        text: 'Freizeit',
        items: [
          { text: 'Rugby Wettbewerbe', link: '/rugby' },
          { text: 'Rugby Teams', link: '/rugby-teams' },
          { text: 'Pokémon Ultra Violet', link: '/PokemonUltraViolet' }
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Yoschey' },
      { icon: 'x', link: 'https://github.com/Yoschey/dotfiles' }
    ]
  }
})
