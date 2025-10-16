import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Yoschey Dev Docs",
  description: "Just a Playground to test. But also nice. Its like HOME, my Garage. Smoke a Pipe and sip a Whisky with me here ",
  base: '/Doc-Blog/',
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
        text: 'Allgemeines',
        items: [
          { text: 'Markdown Examplinos', link: '/markdown-examples' },
          { text: 'Runtime API Examplion', link: '/api-examples' },
          { text: 'Pocketbase vs. SQLite', link: '/PBvSQLite' },
          { text: 'YAML Guide', link: '/yaml' },
          { text: 'Smoke Test', link: '/smoketest' },
          { text: 'PowerShell Kurs', link: '/powershell-kurs' },
          { text: 'Azure DevOps Kurs', link: '/azuredevops-kurs' },
          { text: 'Was ist eine Checksumme', link: '/checksum' },
          { text: 'Proxy', link: '/proxy' },
          { text: 'Windows Proxy', link: '/win-proxy' },
          { text: 'Gruppenrichtlinien', link: '/gpo' },

        ]
      },
      {
        text: 'Linux',
        items: [
          { text: 'Vim Keybindings', link: '/vim_keybindings' },
          { text: 'Tmux Keybindings', link: '/tmux_keybindings' },
          { text: 'Vim Motion Test', link: '/vim-motion-test' },
          { text: 'Unix Tools', link: '/Unix-Tools' },
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
        text: 'Powershell',
        items: [
          { text: 'DevOps Kram', link: '/Daily-DevOps' },
          { text: 'Powershell Basic', link: '/Basis-Powershell' },
          { text: 'Powershell Advanced', link: '/Powershell-Fortgeschrittene' }
        ]
      },{
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
          { text: 'Python for DevOps', link: '/books/Python_for_DevOps_Summary' },


        ]
      },
      {
        text: 'Sinnloser Kram',
        items: [
          { text: 'Rugby Josh', link: '/rugby' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Yoschey' },
      { icon: 'x', link: 'https://github.com/Yoschey/dotfiles' }
    ]
  }
})
