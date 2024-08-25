import { defineConfig } from 'vitepress'
import { htmlEscape } from '@mdit-vue/shared'

let tocMap = new Map<string, string>()

// https://vitepress.dev/reference/site-config
export default defineConfig({
  outDir: '../out/docs',
  base: '/proposal-temporal/docs/',

  title: "Temporal Documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    search: {
      provider: 'local',
    },

    sidebar: [
      { text: 'Ambiguity', link: '/ambiguity' },
      { text: 'Balancing', link: '/balancing' },
      { text: 'Calendar Systems', link: '/calendar-review' },
      { text: 'Cookbook', link: '/cookbook' },
      {
        text: 'API',
        items: [
          'Temporal.Now',
          'Temporal.Instant',
          'Temporal.ZonedDateTime',
          'Temporal.PlainDate',
          'Temporal.PlainTime',
          'Temporal.PlainDateTime',
          'Temporal.PlainYearMonth',
          'Temporal.PlainMonthDay',
          'Temporal.Duration',
          'Temporal.TimeZone',
          'Temporal.Calendar'
        ].map(text => ({
          text,
          link: '/' + text.split('.').at(-1).toLowerCase()
        })),
      },
      {
        text: 'Drafts',
        items: [
          { text: 'Calendar', link: '/calendar-draft' },
          { text: 'Parse', link: '/parse-draft' },
          { text: 'Timezone', link: '/timezone-draft' },
        ],
      },
    ],

    outline: false,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tc39/proposal-temporal/issues' },
    ],

    docFooter: {
      prev: false,
      next: false,
    },
  },

  markdown: {
    anchor: {
      getTokensText (tokens) {
        const base = tokens
          .filter(t => ['text', 'code_inline'].includes(t.type))
          .map(t => t.content)
          .join('')

        let inStrong = false;
        for (const token of tokens) {
          if (token.type === 'strong_open') {
            inStrong = true;
          } else if (inStrong && token.type === 'text') {
            // Method headers should only show the method name in the TOC
            tocMap.set(htmlEscape(base), token.content)
            return token.content.replace(/[^a-zA-Z]/g, '-');
          }
        }

        // https://github.com/valeriangalliat/markdown-it-anchor/blob/master/index.js
        return encodeURIComponent(String(base).trim().toLowerCase().replace(/\s+/g, '-'));
      },
      slugify (s) {
        return s;
      },
    },
    toc: {
      format (s) {
        return tocMap.get(s) || s;
      },
    },
  },
})
