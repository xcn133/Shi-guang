<template>
  <div class="fixed bottom-6 left-4 z-40">
    <div class="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-white/20">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="text-white text-xs font-medium">爱意碎片</span>
      </div>
      
      <div class="flex items-center gap-1.5">
        <div
          v-for="i in 5"
          :key="i"
          class="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 transition-all duration-500 flex items-center justify-center"
          :class="isCollected(i) ? 'bg-pink-500 border-pink-400' : 'bg-white/5 border-white/30'"
        >
          <svg
            v-if="isCollected(i)"
            class="w-3 h-3 md:w-4 md:h-4 text-white animate-bounce"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span
            v-else
            class="text-white/40 text-xs"
          >
            {{ i }}
          </span>
        </div>
      </div>
      
      <div class="mt-2 text-center">
        <span class="text-white/60 text-xs">{{ collectedCount }} / 5</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMemoryStore } from '@/stores/memory'

const store = useMemoryStore()

const collectedCount = computed(() => store.collectedFragments.length)

function isCollected(index: number) {
  return store.collectedFragments.includes(index)
}
</script>
