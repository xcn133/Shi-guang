<template>
  <div class="fixed top-16 md:top-20 left-0 right-0 z-40 pointer-events-none">
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-3">
      <div 
        class="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-md border transition-all duration-300"
        :style="containerStyle"
      >
        <div class="flex items-center gap-1">
          <svg 
            class="w-4 h-4 md:w-5 md:h-5 transition-all"
            :style="{ color: currentColor }"
            :class="heartBeatClass"
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        
        <div class="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium" :style="{ color: currentColor }">
          <span class="opacity-80">在一起</span>
          
          <div class="flex items-center gap-1">
            <span 
              v-if="timeData.days > 0" 
              class="number-bounce inline-block min-w-6 md:min-w-8 text-center font-bold"
              :class="{ 'scale-125': bouncingDays }"
            >
              {{ timeData.days }}
            </span>
            <span v-if="timeData.days > 0" class="opacity-70">天</span>
          </div>
          
          <div class="flex items-center gap-1">
            <span 
              class="number-bounce inline-block min-w-5 md:min-w-6 text-center font-bold"
              :class="{ 'scale-125': bouncingHours }"
            >
              {{ String(timeData.hours).padStart(2, '0') }}
            </span>
            <span class="opacity-70 hidden sm:inline">小时</span>
            <span class="opacity-70 sm:hidden">时</span>
          </div>
          
          <div class="flex items-center gap-1">
            <span 
              class="number-bounce inline-block min-w-5 md:min-w-6 text-center font-bold"
              :class="{ 'scale-125': bouncingMinutes }"
            >
              {{ String(timeData.minutes).padStart(2, '0') }}
            </span>
            <span class="opacity-70 hidden sm:inline">分钟</span>
            <span class="opacity-70 sm:hidden">分</span>
          </div>
          
          <div class="flex items-center gap-1 hidden md:flex">
            <span 
              class="number-bounce inline-block min-w-5 text-center font-bold"
              :class="{ 'scale-125': bouncingSeconds }"
            >
              {{ String(timeData.seconds).padStart(2, '0') }}
            </span>
            <span class="opacity-70">秒</span>
          </div>
        </div>
        
        <div class="hidden lg:flex items-center gap-1 ml-1">
          <div 
            v-for="i in 5" 
            :key="i"
            class="w-1.5 h-1.5 rounded-full transition-all duration-300"
            :style="{ 
              backgroundColor: i <= loveLevel ? currentColor : 'rgba(255,255,255,0.3)',
              opacity: i <= loveLevel ? 1 : 0.3
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMemoryStore } from '@/stores/memory'

const store = useMemoryStore()

const startDate = new Date(2026, 1, 24, 0, 0, 0)

const timeData = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

const bouncingDays = ref(false)
const bouncingHours = ref(false)
const bouncingMinutes = ref(false)
const bouncingSeconds = ref(false)

const prevTimeData = ref({ ...timeData.value })

const heartBeatClass = ref('heart-normal')

const loveLevel = computed(() => {
  const totalHours = timeData.value.days * 24 + timeData.value.hours
  const maxHours = 365 * 24
  return Math.min(5, Math.ceil((totalHours / maxHours) * 5))
})

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

const containerStyle = computed(() => {
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
  
  if (prevTimeData.value.seconds !== timeData.value.seconds) {
    bouncingSeconds.value = true
    setTimeout(() => bouncingSeconds.value = false, 200)
  }
  
  if (prevTimeData.value.minutes !== timeData.value.minutes) {
    bouncingMinutes.value = true
    setTimeout(() => bouncingMinutes.value = false, 300)
  }
  
  if (prevTimeData.value.hours !== timeData.value.hours) {
    bouncingHours.value = true
    setTimeout(() => bouncingHours.value = false, 400)
  }
  
  if (prevTimeData.value.days !== timeData.value.days) {
    bouncingDays.value = true
    setTimeout(() => bouncingDays.value = false, 500)
  }
  
  prevTimeData.value = { ...timeData.value }
}

function updateHeartBeat() {
  const seconds = timeData.value.seconds
  const heartRate = 60 + (seconds % 10) * 2
  
  heartBeatClass.value = 'heart-beat'
  setTimeout(() => {
    heartBeatClass.value = 'heart-normal'
  }, 1000 / heartRate)
}

let timer: number | null = null
let heartTimer: number | null = null

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
  heartTimer = window.setInterval(updateHeartBeat, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (heartTimer) clearInterval(heartTimer)
})
</script>

<style scoped>
.number-bounce {
  transition: transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
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
