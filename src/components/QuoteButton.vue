<template>
  <div class="fixed bottom-40 md:bottom-44 left-4 z-40">
    <button
      @click="handleClick"
      class="group relative px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
        <span class="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
          戳我一下
        </span>
      </div>
      
      <div 
        v-if="showClickEffect"
        class="absolute inset-0 rounded-xl bg-pink-400 animate-ping opacity-30"
      />
    </button>
    
    <div v-if="clickCount > 0" class="mt-2 text-center">
      <p class="text-white/60 text-xs">
        已收集 {{ clickCount }} 句情话 💝
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { loveQuotes } from '@/data/loveQuotes'

const emit = defineEmits<{
  showQuote: [text: string]
}>()

const clickCount = ref(0)
const showClickEffect = ref(false)
const usedIndices = ref<Set<number>>(new Set())

function getRandomQuote(): string {
  const availableIndices = loveQuotes
    .map((_, index) => index)
    .filter(index => !usedIndices.value.has(index))
  
  if (availableIndices.length === 0) {
    usedIndices.value.clear()
    return getRandomQuote()
  }
  
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
  usedIndices.value.add(randomIndex)
  
  return loveQuotes[randomIndex]
}

function handleClick() {
  showClickEffect.value = true
  setTimeout(() => {
    showClickEffect.value = false
  }, 300)
  
  const quote = getRandomQuote()
  clickCount.value++
  
  emit('showQuote', quote)
}
</script>
