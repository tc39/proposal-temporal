<script setup>
import DefaultTheme from 'vitepress/theme'
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <div class="banner">
        This Stage 3 proposal is <strong><a href="https://blogs.igalia.com/compilers/2020/06/23/dates-and-times-in-javascript/">experimental.</a></strong>
        <strong>Do</strong> try it and <a href="https://github.com/tc39/proposal-temporal/issues">report bugs</a>; <strong>don't</strong> use it in production!
      </div>
    </template>
    <template #doc-after>
      <footer>
        <p>
          This page includes a script which loads an implementation of Temporal in your browser.
          You can open a console in your browser's developer tools and try it out directly!
        </p>
        <p>View this or help contribute on <a href="https://github.com/tc39/proposal-temporal">GitHub</a>.</p>
      </footer>
    </template>
  </DefaultTheme.Layout>
</template>

<style>
:root {
  --vp-layout-top-height: 38px;
}
.banner {
  /* Gradient from https://joshnh.com/weblog/how-to-make-an-alert-bar/ */
  background-color: #fce94f;
  background-image: linear-gradient(135deg,
    transparent,
    transparent 25%,
    rgba(0, 0, 0, .05) 25%,
    rgba(0, 0, 0, .05) 50%,
    transparent 50%,
    transparent 75%,
    rgba(0, 0, 0, .05) 75%,
    rgba(0, 0, 0, .05));
  background-size: 20px 20px;
  box-shadow: 0 5px 0 rgba(0, 0, 0, .1);
  color: #363636;
  left: 0;
  padding: 0.4em 0;
  position: fixed;
  text-align: center;
  top: 0;
  width: 100%;
  height: 38px;
  z-index: 40;
}
footer {
  border-top: 1px solid var(--vp-c-default-1);
  color: var(--vp-c-text-1);
  font-size: 0.8em;
  padding: 10px;
}
footer a {
  text-decoration: revert;
}
</style>
