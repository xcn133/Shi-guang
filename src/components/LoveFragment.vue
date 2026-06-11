<template>
  <button
    @click="handleCollect"
    class="love-fragment absolute w-8 h-8 md:w-10 md:h-10 transition-all duration-500 cursor-pointer hover:scale-150 active:scale-125"
    :style="fragmentStyle"
    :class="{ 'opacity-0 scale-0 pointer-events-none': isCollected }"
  >
    <svg 
      class="w-full h-full text-pink-400 drop-shadow-lg" 
      :class="{ 'animate-pulse': !isCollected }"
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
    
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
  opacity: isCollected.value ? 0 : 0.6,
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
  filter: drop-shadow(0 0 8px rgba(244, 114, 182, 0.5));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}
</style>
