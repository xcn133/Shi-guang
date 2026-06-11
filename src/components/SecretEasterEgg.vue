<template>
  <div class="fixed bottom-24 md:bottom-20 right-4 z-40">
    <button
      @dblclick="handleDoubleTap"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      class="secret-heart relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95"
      title="双击发现惊喜"
    >
      <svg class="w-6 h-6 md:w-7 md:h-7 text-white/60 hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      
      <div 
        v-if="showTapHint" 
        class="absolute -top-8 right-0 px-2 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white/80 text-xs whitespace-nowrap animate-pulse"
      >
        双击试试 💕
      </div>
    </button>
    
    <transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-0"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-500 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-0"
    >
      <div
        v-if="store.showSecretMessage"
        class="absolute bottom-16 right-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div class="px-6 py-4 text-center">
          <div class="text-2xl mb-1">🐷</div>
          <p class="text-white font-bold text-lg tracking-wide">
            猪妞
          </p>
          <p class="text-white/80 text-xs mt-1">
            这是只属于你的称呼 ✨
          </p>
        </div>
        
        <div class="absolute -bottom-2 right-4 w-4 h-4 bg-pink-500 transform rotate-45"></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMemoryStore } from '@/stores/memory'

const store = useMemoryStore()

const showTapHint = ref(false)
const lastTap = ref(0)
const touchStartTime = ref(0)

function handleDoubleTap() {
  store.triggerSecretMessage()
  showTapHint.value = false
}

function handleTouchStart() {
  touchStartTime.value = Date.now()
}

function handleTouchEnd() {
  const now = Date.now()
  const touchDuration = now - touchStartTime.value
  
  if (touchDuration > 500) {
    store.triggerSecretMessage()
    showTapHint.value = false
    return
  }
  
  const DOUBLE_TAP_DELAY = 300
  if (now - lastTap.value < DOUBLE_TAP_DELAY) {
    store.triggerSecretMessage()
    showTapHint.value = false
  }
  lastTap.value = now
}

onMounted(() => {
  setTimeout(() => {
    showTapHint.value = true
  }, 5000)
  
  setTimeout(() => {
    showTapHint.value = false
  }, 15000)
})
</script>

<style scoped>
.secret-heart {
  animation: heartbeat 3s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.secret-heart:hover {
  animation: none;
}
</style>
