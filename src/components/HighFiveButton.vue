<template>
  <div class="fixed bottom-24 md:bottom-28 right-4 z-40">
    <button
      @click="handleHighFive"
      @touchstart.prevent="handleHighFive"
      class="relative group flex flex-col items-center gap-2"
    >
      <div 
        class="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        :class="{ 'animate-shake': isShaking }"
      >
        <svg class="w-8 h-8 md:w-9 md:h-9 text-white transform rotate-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 6.5c-.5-.5-1.5-.5-2 0l-2 2c-.3.3-.5.6-.5 1v3.5c0 .3.1.5.3.7l2.7 2.7c.4.4.6.9.6 1.4v.7c0 1.1-.9 2-2 2h-9c-.6 0-1-.4-1-1s.4-1 1-1h6c.3 0 .5-.2.5-.5s-.2-.5-.5-.5h-8c-.6 0-1-.4-1-1s.4-1 1-1h8c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H6c-.6 0-1-.4-1-1s.4-1 1-1h7.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H8c-.6 0-1-.4-1-1s.4-1 1-1h6.5l2-2c.5-.5 1.5-.5 2 0l2 2z"/>
        </svg>
        
        <div class="absolute inset-0 rounded-full bg-yellow-300 opacity-0 group-hover:opacity-30 transition-opacity animate-ping" />
      </div>
      
      <div class="text-center">
        <p class="text-white text-xs font-medium whitespace-nowrap">
          Give me five
        </p>
        <p class="text-white/80 text-xs whitespace-nowrap">
          碰个拳 👊
        </p>
      </div>
    </button>
    
    <transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-0 translate-y-10"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-500 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-0 translate-y-10"
    >
      <div
        v-if="showMessage"
        class="absolute bottom-32 right-0 bg-white rounded-2xl shadow-2xl overflow-hidden min-w-64"
      >
        <div class="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="text-3xl">✋</div>
            <div>
              <p class="text-white font-bold text-lg">
                击掌成功！
              </p>
              <p class="text-white/90 text-sm">
                能量 +100
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                class="h-full bg-white rounded-full transition-all duration-1000"
                :style="{ width: energyProgress + '%' }"
              />
            </div>
            <span class="text-white text-xs font-bold">{{ energyProgress }}%</span>
          </div>
        </div>
        
        <div class="px-6 py-4">
          <p class="text-gray-800 text-sm font-medium text-center leading-relaxed">
            未来继续一起冲！💪
          </p>
          <div class="flex justify-center gap-2 mt-3">
            <span class="text-lg animate-bounce">🎉</span>
            <span class="text-lg animate-bounce" style="animation-delay: 0.1s">✨</span>
            <span class="text-lg animate-bounce" style="animation-delay: 0.2s">💫</span>
            <span class="text-lg animate-bounce" style="animation-delay: 0.3s">🌟</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  trigger: []
}>()

const isShaking = ref(false)
const showMessage = ref(false)
const energyProgress = ref(0)

function handleHighFive() {
  if (showMessage.value) return
  
  isShaking.value = true
  
  emit('trigger')
  
  setTimeout(() => {
    isShaking.value = false
  }, 500)
  
  showMessage.value = true
  energyProgress.value = 0
  
  const interval = setInterval(() => {
    energyProgress.value += 5
    if (energyProgress.value >= 100) {
      clearInterval(interval)
    }
  }, 50)
  
  setTimeout(() => {
    showMessage.value = false
  }, 5000)
}
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(-15deg); }
  20% { transform: rotate(15deg); }
  30% { transform: rotate(-15deg); }
  40% { transform: rotate(15deg); }
  50% { transform: rotate(-10deg); }
  60% { transform: rotate(10deg); }
  70% { transform: rotate(-5deg); }
  80% { transform: rotate(5deg); }
  90% { transform: rotate(-2deg); }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
