<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

type Check = { question: string; answer?: string }
type LearningData = { practice?: string; check?: Check[]; next?: string }

const { frontmatter, page } = useData()
const learning = computed<LearningData>(() => frontmatter.value.learning ?? {})
const section = computed(() => page.value.relativePath.split('/')[0])
const isLearningArticle = computed(() =>
  frontmatter.value.layout !== 'home' &&
  frontmatter.value.aside !== false &&
  !section.value.startsWith('hobbies')
)
const checks = computed<Check[]>(() => learning.value.check ?? [
  { question: 'Welches Problem löst das beschriebene Vorgehen?' },
  { question: 'Woran erkennst du, dass die Änderung erfolgreich war?' },
  { question: 'Welches Risiko und welchen Rückweg musst du vor der Ausführung kennen?' }
])
const nextLink = computed(() => learning.value.next ?? '/start')
</script>

<template>
  <section v-if="isLearningArticle" class="practice-box" aria-label="Praxis und Wissenscheck">
    <div class="practice-box__label">Jetzt anwenden</div>
    <h2>Praxisauftrag & Wissenscheck</h2>
    <p>
      {{ learning.practice ?? 'Erkläre einer anderen Person den Kern dieses Artikels, führe ein Beispiel in einer sicheren Testumgebung aus und notiere Ergebnis, Prüfung und Rückweg in drei kurzen Sätzen.' }}
    </p>
    <details>
      <summary>Fragen zur Selbstkontrolle</summary>
      <ol>
        <li v-for="item in checks" :key="item.question">
          {{ item.question }}
          <p v-if="item.answer" class="practice-box__answer"><strong>Musterantwort:</strong> {{ item.answer }}</p>
        </li>
      </ol>
    </details>
    <a class="practice-box__next" :href="withBase(nextLink)">Im Lernpfad weitergehen →</a>
  </section>
</template>
