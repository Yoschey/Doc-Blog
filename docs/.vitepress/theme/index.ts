import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ArticleIntro from './ArticleIntro.vue'
import ArticlePractice from './ArticlePractice.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'doc-before': () => h(ArticleIntro),
    'doc-after': () => h(ArticlePractice)
  })
}
