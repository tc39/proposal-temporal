// https://vitepress.dev/guide/custom-theme
import './setup.js'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp ({ app }) {
    app.config.errorHandler = err => {
      console.error(err);
    }
  }
} satisfies Theme
