<script setup lang="ts">
// Set de iconos del diseño. Trazo currentColor, outline 1.7.

interface Props {
  name:
    | 'home' | 'list' | 'chart' | 'clock' | 'settings' | 'plus'
    | 'edit' | 'trash' | 'check' | 'x'
    | 'chevronDown' | 'chevronRight' | 'chevronLeft' | 'arrowRight'
    | 'search' | 'eye' | 'eyeOff' | 'calendar' | 'card' | 'bell' | 'tag' | 'note'
    | 'repeat' | 'download' | 'upload' | 'filter' | 'sun' | 'moon' | 'user'
    | 'logout' | 'lock' | 'mail' | 'trend' | 'image' | 'grid' | 'sort'
  size?: number | string
  stroke?: number | string
}
withDefaults(defineProps<Props>(), { size: 20, stroke: 1.7 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke-width="stroke"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    style="display: block; flex-shrink: 0;"
  >
    <template v-if="name === 'home'">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9.5h12V10" />
    </template>
    <template v-else-if="name === 'list'">
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6"  r="1.3" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1.3" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'chart'">
      <path d="M4 20V4" /><path d="M4 20h16" />
      <path d="M8 16v-3M12 16V8M16 16v-5M20 16v-7" />
    </template>
    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.5V12l3 1.8" />
    </template>
    <template v-else-if="name === 'settings'">
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 3v2.2M12 18.8V21M4.4 7.5l1.9 1.1M17.7 15.4l1.9 1.1M19.6 7.5l-1.9 1.1M6.3 15.4l-1.9 1.1" />
    </template>
    <template v-else-if="name === 'plus'">
      <path d="M12 5v14M5 12h14" />
    </template>
    <template v-else-if="name === 'edit'">
      <path d="M4 20h4l10.5-10.5a2 2 0 0 0-2.8-2.8L5 17.2 4 20Z" />
      <path d="M14 6.5 17.5 10" />
    </template>
    <template v-else-if="name === 'trash'">
      <path d="M5 7h14M10 7V5h4v2M6.5 7l.8 12a1 1 0 0 0 1 .95h7.4a1 1 0 0 0 1-.95L17.5 7" />
      <path d="M10.5 11v5M13.5 11v5" />
    </template>
    <template v-else-if="name === 'check'">
      <path d="M5 12.5 10 17l9-10" />
    </template>
    <template v-else-if="name === 'x'">
      <path d="M6 6l12 12M18 6 6 18" />
    </template>
    <template v-else-if="name === 'chevronDown'">
      <path d="M5 9l7 7 7-7" />
    </template>
    <template v-else-if="name === 'chevronRight'">
      <path d="M9 5l7 7-7 7" />
    </template>
    <template v-else-if="name === 'chevronLeft'">
      <path d="M15 5l-7 7 7 7" />
    </template>
    <template v-else-if="name === 'arrowRight'">
      <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6.4" />
      <path d="M16 16l4 4" />
    </template>
    <template v-else-if="name === 'eye'">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </template>
    <template v-else-if="name === 'eyeOff'">
      <path d="M4 4l16 16" />
      <path d="M9.5 9.7a2.6 2.6 0 0 0 3.6 3.6" />
      <path d="M6.2 6.5C3.9 8 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.6 0 3-.45 4.2-1.1M9.7 5.8A9.6 9.6 0 0 1 12 5.5C18 5.5 21.5 12 21.5 12a16 16 0 0 1-2.3 3" />
    </template>
    <template v-else-if="name === 'calendar'">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    </template>
    <template v-else-if="name === 'card'">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
    </template>
    <template v-else-if="name === 'bell'">
      <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 5 1.8 6.2 1.8 6.2H4.7S6.5 15 6.5 10Z" />
      <path d="M10 19.2a2.1 2.1 0 0 0 4 0" />
    </template>
    <template v-else-if="name === 'tag'">
      <path d="M4 4h7.2L20 12.8a2 2 0 0 1 0 2.8l-4.4 4.4a2 2 0 0 1-2.8 0L4 11.2V4Z" />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'note'">
      <path d="M5 4h9l5 5v11H5Z" />
      <path d="M14 4v5h5M8.5 13h7M8.5 16.5h5" />
    </template>
    <template v-else-if="name === 'repeat'">
      <path d="M4 9a5 5 0 0 1 5-5h8l-2.2-2.2M20 15a5 5 0 0 1-5 5H7l2.2 2.2" />
    </template>
    <template v-else-if="name === 'download'">
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" /><path d="M5 19.5h14" />
    </template>
    <template v-else-if="name === 'upload'">
      <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" /><path d="M5 19.5h14" />
    </template>
    <template v-else-if="name === 'filter'">
      <path d="M4 6h16l-6 7v5l-4 2v-7Z" />
    </template>
    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2.2M12 18.8V21M4.4 4.4l1.6 1.6M18 18l1.6 1.6M3 12h2.2M18.8 12H21M4.4 19.6 6 18M18 6l1.6-1.6" />
    </template>
    <template v-else-if="name === 'moon'">
      <path d="M19 13.5A7.5 7.5 0 0 1 10.5 5 6.5 6.5 0 1 0 19 13.5Z" />
    </template>
    <template v-else-if="name === 'user'">
      <circle cx="12" cy="8.5" r="3.7" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </template>
    <template v-else-if="name === 'logout'">
      <path d="M14 6.5V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1.5" />
      <path d="M10 12h10M16.5 8.5 20 12l-3.5 3.5" />
    </template>
    <template v-else-if="name === 'lock'">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </template>
    <template v-else-if="name === 'mail'">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7 8 5.5L20 7" />
    </template>
    <template v-else-if="name === 'trend'">
      <path d="M4 15l5-5 4 4 7-7" />
      <path d="M15 7h5v5" />
    </template>
    <template v-else-if="name === 'image'">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="m4.5 17 4.5-4 3.5 3 3-2.5 4.5 4" />
    </template>
    <template v-else-if="name === 'grid'">
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </template>
    <template v-else-if="name === 'sort'">
      <path d="M7 4v16M7 20l-3-3M7 4l3 3" />
      <path d="M17 20V4M17 4l-3 3M17 4l3 3" />
    </template>
  </svg>
</template>
