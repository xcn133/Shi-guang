<template>
  <div class="min-h-screen">
    <AnniversaryLock v-if="!store.isUnlocked" />
    <MemoryGallery v-else />
  </div>
</template>

<script setup lang="ts">
import { useMemoryStore } from './stores/memory'
import AnniversaryLock from './components/AnniversaryLock.vue'
import MemoryGallery from './components/MemoryGallery.vue'

const store = useMemoryStore()
</script>
