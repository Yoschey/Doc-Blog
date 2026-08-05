<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

type LearningData = {
  level?: string
  duration?: string
  goals?: string[]
  terms?: string[]
}

const { frontmatter, page } = useData()

const sectionDefaults: Record<string, { level: string; terms: string[] }> = {
  books: { level: 'Vertiefung', terms: ['Einordnung', 'Transfer', 'Weiterlesen'] },
  concepts: { level: 'Aufbau', terms: ['Entwurf', 'Wartbarkeit', 'Trade-off'] },
  devops: { level: 'Grundlagen · Praxis', terms: ['Automatisierung', 'Feedback', 'Betrieb'] },
  examples: { level: 'Praxis', terms: ['Vorlage', 'Anpassung', 'Review'] },
  grundlagen: { level: 'Einstieg', terms: ['Grundverständnis', 'Praxis', 'Fehlersuche'] },
  lernwerkstatt: { level: 'Übung', terms: ['Lab', 'Dokumentation', 'Reflexion'] },
  linux: { level: 'Grundlagen · Praxis', terms: ['Linux', 'CLI', 'Diagnose'] },
  security: { level: 'Aufbau', terms: ['Risiko', 'Schutzmaßnahme', 'Nachweis'] },
  windows: { level: 'Grundlagen · Praxis', terms: ['PowerShell', 'Windows', 'Automatisierung'] }
}

const pathSection = computed(() => page.value.relativePath.split('/')[0])
const defaults = computed(() => sectionDefaults[pathSection.value] ?? {
  level: 'Grundlagen',
  terms: ['Verstehen', 'Anwenden', 'Überprüfen']
})
const learning = computed<LearningData>(() => frontmatter.value.learning ?? {})
const isLearningArticle = computed(() =>
  frontmatter.value.layout !== 'home' &&
  frontmatter.value.aside !== false &&
  !pathSection.value.startsWith('hobbies')
)
const title = computed(() => page.value.title || 'dieses Thema')
const goals = computed(() => learning.value.goals ?? [
  `${title.value} in eigenen Worten erklären.`,
  'das gezeigte Vorgehen in einer Testumgebung nachvollziehen.',
  'typische Fehler erkennen und eine passende Prüfung auswählen.'
])
const terms = computed(() => learning.value.terms ?? defaults.value.terms)
</script>

<template>
  <section v-if="isLearningArticle" class="learning-intro" aria-label="Lernübersicht">
    <div class="learning-intro__eyebrow">DevOps-Lexikon</div>
    <div class="learning-meta">
      <span class="learning-badge learning-badge--level">{{ learning.level ?? defaults.level }}</span>
      <span class="learning-badge">⏱ {{ learning.duration ?? '20–35 Minuten' }}</span>
    </div>
    <div class="learning-intro__grid">
      <div>
        <strong>Danach kannst du …</strong>
        <ul>
          <li v-for="goal in goals" :key="goal">{{ goal }}</li>
        </ul>
      </div>
      <div>
        <strong>Schlüsselbegriffe</strong>
        <div class="learning-terms">
          <span v-for="term in terms" :key="term">{{ term }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
