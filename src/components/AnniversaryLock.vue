<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="mb-6">
          <div class="inline-block p-4 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
        
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
          时光胶片
        </h1>
        <p class="text-white/80 text-sm md:text-base mb-6">
          每一张照片，都是我们爱情的见证
        </p>
        
        <div 
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border mb-6"
          :style="counterStyle"
        >
          <svg 
            class="w-4 h-4 transition-all"
            :style="{ color: currentColor }"
            :class="heartBeatClass"
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          
          <div class="flex items-center gap-1 text-xs font-medium" :style="{ color: currentColor }">
            <span class="opacity-80">在一起</span>
            <span class="font-bold">{{ timeData.days }}天</span>
            <span class="font-bold">{{ String(timeData.hours).padStart(2, '0') }}时</span>
            <span class="font-bold">{{ String(timeData.minutes).padStart(2, '0') }}分</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
        <div class="text-center mb-6">
          <div class="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium mb-4">
            解锁回忆
          </div>
          <h2 class="text-xl md:text-2xl font-semibold text-white mb-2">
            输入我们的纪念日
          </h2>
          <p class="text-white/70 text-sm">
            那是我们第一次牵手的日子
          </p>
        </div>
        
        <div class="space-y-4">
          <div class="flex gap-3 items-center justify-center">
            <div class="flex-1 max-w-32">
              <label class="block text-white/80 text-xs mb-1.5 text-center">月份</label>
              <input
                v-model="monthInput"
                type="number"
                min="1"
                max="12"
                placeholder="2"
                class="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white text-center text-lg font-medium placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/30 transition-all"
                @keyup.enter="handleSubmit"
              />
            </div>
            
            <span class="text-white text-2xl font-bold pt-5">/</span>
            
            <div class="flex-1 max-w-32">
              <label class="block text-white/80 text-xs mb-1.5 text-center">日期</label>
              <input
                v-model="dayInput"
                type="number"
                min="1"
                max="31"
                placeholder="24"
                class="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white text-center text-lg font-medium placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/30 transition-all"
                @keyup.enter="handleSubmit"
              />
            </div>
          </div>
          
          <button
            @click="handleSubmit"
            class="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-base hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            开启时光之旅 ✨
          </button>
          
          <div v-if="errorMessage" class="text-center">
            <p class="text-pink-200 text-sm animate-pulse">
              {{ errorMessage }}
            </p>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-white/20">
          <p class="text-white/60 text-xs text-center mb-2">
            提示：那天是个浪漫的日子 🌹
          </p>
          <button
            v-if="store.inputAttempts >= 3"
            @click="handleHint"
            class="w-full py-2 rounded-lg bg-white/10 text-white/80 text-sm hover:bg-white/20 transition-all"
          >
            偷看答案 🔑
          </button>
        </div>
      </div>
      
      <div class="text-center mt-8">
        <p class="text-white/50 text-xs">
          Made with 💕 for you
        </p>
      </div>
    </div>
    
    <button
      @dblclick="handleDoubleTap"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      class="fixed bottom-6 right-4 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 secret-heart"
      title="双击发现惊喜"
    >
      <svg class="w-5 h-5 md:w-6 md:h-6 text-white/60 hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
    
    <transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-500 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-10"
    >
      <div
        v-if="showSecret"
        class="fixed bottom-20 right-4 z-50 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl shadow-2xl overflow-hidden"
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
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMemoryStore } from '@/stores/memory'

const store = useMemoryStore()

const monthInput = ref('')
const dayInput = ref('')
const errorMessage = ref('')
const showSecret = ref(false)
const lastTap = ref(0)
const touchStartTime = ref(0)

const errorMessages = [
  '这个日子不对哦，再想想~',
  '不是这一天呢，回忆一下当时的场景',
  '差一点点就对了，加油！',
  '嗯...让我给你一点提示吧'
]

const startDate = new Date(2026, 1, 24, 0, 0, 0)

const timeData = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

const heartBeatClass = ref('heart-normal')

const currentColor = computed(() => {
  const totalDays = timeData.value.days + timeData.value.hours / 24
  const maxDays = 365
  const progress = Math.min(1, totalDays / maxDays)
  
  const startR = 255, startG = 165, startB = 0
  const endR = 220, endG = 20, endB = 60
  
  const r = Math.round(startR + (endR - startR) * progress)
  const g = Math.round(startG + (endG - startG) * progress)
  const b = Math.round(startB + (endB - startB) * progress)
  
  return `rgb(${r}, ${g}, ${b})`
})

const counterStyle = computed(() => {
  const totalDays = timeData.value.days
  const opacity = 0.15 + (Math.min(totalDays / 365, 1) * 0.15)
  
  return {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    borderColor: currentColor.value + '40'
  }
})

function updateTime() {
  const now = new Date()
  const diff = now.getTime() - startDate.getTime()
  
  if (diff < 0) {
    const absDiff = Math.abs(diff)
    timeData.value = {
      days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((absDiff % (1000 * 60)) / 1000)
    }
  } else {
    timeData.value = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    }
  }
}

function updateHeartBeat() {
  heartBeatClass.value = 'heart-beat'
  setTimeout(() => {
    heartBeatClass.value = 'heart-normal'
  }, 100)
}

let timer: number | null = null
let heartTimer: number | null = null

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
  heartTimer = window.setInterval(updateHeartBeat, 2000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (heartTimer) clearInterval(heartTimer)
})

function handleSubmit() {
  const month = parseInt(monthInput.value)
  const day = parseInt(dayInput.value)
  
  if (!month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
    errorMessage.value = '请输入有效的日期'
    return
  }
  
  const isCorrect = store.checkDate(month, day)
  
  if (!isCorrect) {
    const index = Math.min(store.inputAttempts - 1, errorMessages.length - 1)
    errorMessage.value = errorMessages[index]
    
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

function handleHint() {
  monthInput.value = store.specialDate.month.toString()
  dayInput.value = store.specialDate.day.toString()
  errorMessage.value = '现在点击按钮开启吧！'
}

function handleDoubleTap() {
  showSecret.value = true
  setTimeout(() => {
    showSecret.value = false
  }, 5000)
}

function handleTouchStart() {
  touchStartTime.value = Date.now()
}

function handleTouchEnd() {
  const now = Date.now()
  const touchDuration = now - touchStartTime.value
  
  if (touchDuration > 500) {
    showSecret.value = true
    setTimeout(() => {
      showSecret.value = false
    }, 5000)
    return
  }
  
  const DOUBLE_TAP_DELAY = 300
  if (now - lastTap.value < DOUBLE_TAP_DELAY) {
    showSecret.value = true
    setTimeout(() => {
      showSecret.value = false
    }, 5000)
  }
  lastTap.value = now
}
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

.heart-normal {
  animation: heart-normal-beat 2s ease-in-out infinite;
}

.heart-beat {
  animation: heart-fast-beat 0.5s ease-in-out infinite;
}

@keyframes heart-normal-beat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes heart-fast-beat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}
</style>
