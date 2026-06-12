<template>
  <button
    @click="handleCollect"
    class="love-fragment absolute w-10 h-10 md:w-12 md:h-12 transition-all duration-500 cursor-pointer hover:scale-150 active:scale-125"
    :style="fragmentStyle"
    :class="{ 'opacity-0 scale-0 pointer-events-none': isCollected }"
  >
    <div class="relative w-full h-full">
      <div class="absolute inset-0 rounded-full bg-pink-500/30 backdrop-blur-sm border-2 border-pink-400/60 shadow-lg shadow-pink-500/40" />
      <svg 
        class="absolute inset-0 w-full h-full text-pink-400 p-1.5" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>
    
    <div 
      v-if="showCollectEffect"
      class="absolute inset-0 flex items-center justify-center"
    >
      <div class="w-16 h-16 rounded-full bg-pink-400 animate-ping opacity-60" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMemoryStore } from '@/stores/memory'

const props = defineProps<{
  id: number
  x: number
  y: number
}>()

const store = useMemoryStore()
const showCollectEffect = ref(false)

const isCollected = computed(() => store.collectedFragments.includes(props.id))

const fragmentStyle = computed(() => ({
  left: `${props.x}%`,
  top: `${props.y}%`,
  transform: `rotate(${Math.random() * 20 - 10}deg)`
}))

function handleCollect() {
  if (isCollected.value) return
  
  showCollectEffect.value = true
  
  const collected = store.collectFragment(props.id)
  
  if (collected) {
    setTimeout(() => {
      showCollectEffect.value = false
    }, 500)
  }
}
</script>

<style scoped>
.love-fragment {
  animation: float 3s ease-in-out infinite, glow 2s ease-in-out infinite alternate;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

@keyframes glow {
  0% {
    filter: drop-shadow(0 0 6px rgba(244, 114, 182, 0.4));
  }
  100% {
    filter: drop-shadow(0 0 16px rgba(244, 114, 182, 0.8));
  }
}
</style>
