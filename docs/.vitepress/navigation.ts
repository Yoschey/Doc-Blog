export const nav = [
  { text: 'Start', link: '/' },
  {
    text: 'Ausbildung',
    items: [
      { text: 'Azubi-Lernplan', link: '/lernwerkstatt/' },
      { text: 'IT- & DevOps-Grundlagen', link: '/grundlagen/' },
      { text: 'Lexikon A–Z', link: '/lexikon/' },
      { text: 'Praxis-Labs', link: '/lernwerkstatt/labs' }
    ]
  },
  {
    text: 'Themen',
    items: [
      { text: 'DevOps', link: '/devops/' },
      { text: 'Security', link: '/security/' },
      { text: 'Windows & PowerShell', link: '/windows/' },
      { text: 'Linux & CLI', link: '/linux/' },
      { text: 'Softwarekonzepte', link: '/concepts/' }
    ]
  },
  {
    text: 'Bibliothek',
    items: [
      { text: 'Praxisvorlagen', link: '/examples/' },
      { text: 'Bücher', link: '/books/overview' },
      { text: 'Freizeit', link: '/hobbies/' }
    ]
  },
  { text: 'Lernpfade', link: '/start' }
]

export const sidebar = [
  {
    text: 'Einstieg',
    items: [
      { text: 'Willkommen', link: '/' },
      { text: 'Azubi-Lernplan', link: '/lernwerkstatt/' },
      { text: 'Lernpfade', link: '/start' },
      { text: 'Lexikon A–Z', link: '/lexikon/' }
    ]
  },
  {
    text: 'IT- & DevOps-Grundlagen',
    collapsed: false,
    items: [
      { text: 'Übersicht', link: '/grundlagen/' },
      { text: 'Was ist DevOps?', link: '/grundlagen/was-ist-devops' },
      { text: 'Git-Grundlagen', link: '/grundlagen/git-grundlagen' },
      { text: 'Netzwerk-Grundlagen', link: '/grundlagen/netzwerk-grundlagen' },
      { text: 'HTTP, DNS & TLS', link: '/grundlagen/http-dns-tls' },
      { text: 'Dateisystem & Rechte', link: '/grundlagen/dateisystem-rechte' },
      { text: 'Prozesse, Dienste & Ports', link: '/grundlagen/prozesse-dienste-ports' },
      { text: 'CI/CD-Grundlagen', link: '/grundlagen/ci-cd-grundlagen' },
      { text: 'Cloud-Grundlagen', link: '/grundlagen/cloud-grundlagen' },
      { text: 'Troubleshooting-Methode', link: '/grundlagen/troubleshooting' }
    ]
  },
  {
    text: 'DevOps',
    collapsed: true,
    items: [
      { text: 'Übersicht', link: '/devops/' },
      { text: 'Daily DevOps', link: '/Daily-DevOps' },
      { text: 'GitHub Actions CI/CD', link: '/devops/github-actions-cicd' },
      { text: 'Container-Grundlagen', link: '/devops/container-grundlagen' },
      { text: 'GitOps in der Praxis', link: '/devops/gitops-praxis' },
      { text: 'Infrastructure as Code', link: '/devops/infrastructure-as-code' },
      { text: 'Observability', link: '/devops/observability' },
      { text: 'Azure DevOps Kurs', link: '/azuredevops-kurs' },
      { text: 'YAML Guide', link: '/yaml' },
      { text: 'Checksummen', link: '/checksum' },
      { text: 'Proxy', link: '/proxy' },
      { text: 'Smoke Tests', link: '/smoketest' },
      { text: 'PocketBase vs. SQLite', link: '/PBvSQLite' }
    ]
  },
  {
    text: 'Security',
    collapsed: true,
    items: [
      { text: 'Übersicht', link: '/security/' },
      { text: 'Secrets Management', link: '/security/secrets-management' },
      { text: 'Software Supply Chain', link: '/security/software-supply-chain' },
      { text: 'CI/CD absichern', link: '/security/cicd-security' }
    ]
  },
  {
    text: 'Windows & PowerShell',
    collapsed: true,
    items: [
      { text: 'Übersicht', link: '/windows/' },
      { text: 'PowerShell für DevOps', link: '/powershell-kurs' },
      { text: 'PowerShell Grundlagen', link: '/Basis-Powershell' },
      { text: 'PowerShell Fortgeschritten', link: '/Powershell-Fortgeschrittene' },
      { text: 'Fehlerbehandlung & Logging', link: '/windows/powershell-fehlerbehandlung' },
      { text: 'Remoting über SSH', link: '/windows/powershell-remoting' },
      { text: 'Tests mit Pester', link: '/windows/pester-testing' },
      { text: 'Windows Proxy', link: '/win-proxy' },
      { text: 'Gruppenrichtlinien', link: '/gpo' }
    ]
  },
  {
    text: 'Linux & CLI',
    collapsed: true,
    items: [
      { text: 'Übersicht', link: '/linux/' },
      { text: 'Unix Tools', link: '/Unix-Tools' },
      { text: 'Netzwerkdiagnose', link: '/linux/netzwerkdiagnose' },
      { text: 'systemd Troubleshooting', link: '/linux/systemd-troubleshooting' },
      { text: 'Robuste Bash-Skripte', link: '/linux/robuste-bash-skripte' },
      { text: 'Vim Keybindings', link: '/vim_keybindings' },
      { text: 'Tmux Keybindings', link: '/tmux_keybindings' },
      { text: 'Vim Motion Test', link: '/vim-motion-test' }
    ]
  },
  {
    text: 'Softwarekonzepte',
    collapsed: true,
    items: [
      { text: 'Übersicht', link: '/concepts/' },
      { text: 'Dependency Injection', link: '/Dependency-Injection' },
      { text: 'Singleton Pattern', link: '/Singelton' },
      { text: 'SOLID-Prinzipien', link: '/concepts/solid-prinzipien' },
      { text: 'Clean Architecture', link: '/concepts/clean-architecture' },
      { text: 'Idempotenz', link: '/concepts/idempotenz' }
    ]
  },
  {
    text: 'Lernwerkstatt',
    collapsed: true,
    items: [
      { text: 'Ablauf & Kompetenzplan', link: '/lernwerkstatt/' },
      { text: 'Alle Praxis-Labs', link: '/lernwerkstatt/labs' },
      { text: 'Lab 1: Git-Teamworkflow', link: '/lernwerkstatt/lab-git' },
      { text: 'Lab 2: Linux-Fehlersuche', link: '/lernwerkstatt/lab-linux' },
      { text: 'Lab 3: PowerShell', link: '/lernwerkstatt/lab-powershell' },
      { text: 'Lab 4: Container & CI', link: '/lernwerkstatt/lab-container-ci' },
      { text: 'Lab 5: Incident', link: '/lernwerkstatt/lab-incident' },
      { text: 'Ausbildungsnachweis', link: '/lernwerkstatt/ausbildungsnachweis' }
    ]
  },
  {
    text: 'Praxisvorlagen',
    collapsed: true,
    items: [
      { text: 'Übersicht', link: '/examples/' },
      { text: 'Runbook-Vorlage', link: '/examples/runbook-vorlage' },
      { text: 'Incident-Checkliste', link: '/examples/incident-checkliste' },
      { text: 'Markdown', link: '/markdown-examples' },
      { text: 'VitePress Runtime API', link: '/api-examples' }
    ]
  },
  {
    text: 'Bücher',
    collapsed: true,
    items: [
      { text: 'Übersicht', link: '/books/overview' },
      { text: 'Ansible', link: '/books/Ansible_Up_and_Running_Summary' },
      { text: 'DevOps for Dummies', link: '/books/DevOps_for_Dummies_Summary' },
      { text: 'Effective DevOps', link: '/books/Effective_DevOps_Summary' },
      { text: 'GitOps Cookbook', link: '/books/GitOps_Cookbook_Summary' },
      { text: 'Learning DevSecOps', link: '/books/Learning_DevSecOps_Summary' },
      { text: 'PowerShell for Sysadmins', link: '/books/PowerShell_for_Sysadmins_Summary' },
      { text: 'PowerShell Pocket Reference', link: '/books/PowerShell_Pocket_Reference_Summary' },
      { text: 'Python for DevOps', link: '/books/Python_for_DevOps_Summary' }
    ]
  },
  {
    text: 'Freizeit',
    collapsed: true,
    items: [
      { text: 'Übersicht', link: '/hobbies/' },
      { text: 'Rugby Wettbewerbe', link: '/rugby' },
      { text: 'Rugby Teams', link: '/rugby-teams' },
      { text: 'Pokémon Ultra Violet', link: '/PokemonUltraViolet' }
    ]
  }
]
