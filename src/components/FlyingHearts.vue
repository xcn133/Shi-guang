<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-40">
    <transition-group
      name="heart-fly"
      tag="div"
      class="relative w-full h-full"
    >
      <div
        v-for="heart in flyingHearts"
        :key="heart.id"
        class="absolute"
        :style="getHeartStyle(heart)"
      >
        <svg 
          class="w-full h-full"
          :style="{ color: heart.color }"
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface FlyingHeart {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  color: string
  progress: number
  opacity: number
}

const flyingHearts = ref<FlyingHeart[]>([])
let heartId = 0
let animationFrame: number | null = null

const colors = [
  '#FF69B4',
  '#FF1493',
  '#DC143C',
  '#FF6B6B',
  '#F38181',
  '#FFB6C1',
  '#FFC0CB'
]

function createFlyingHearts(count: number, startX: number, startY: number) {
  const targetX = window.innerWidth * 0.5
  const targetY = window.innerHeight * 0.3
  
  for (let i = 0; i < count; i++) {
    const heart: FlyingHeart = {
      id: heartId++,
      x: startX + (Math.random() - 0.5) * 100,
      y: startY + (Math.random() - 0.5) * 50,
      targetX: targetX + (Math.random() - 0.5) * 60,
      targetY: targetY + (Math.random() - 0.5) * 40,
      size: Math.random() * 20 + 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      progress: 0,
      opacity: 1
    }
    
    flyingHearts.value.push(heart)
    
    animateHeart(heart, i * 50)
  }
}

function animateHeart(heart: FlyingHeart, delay: number) {
  setTimeout(() => {
    let progress = 0
    const duration = 2000
    const startTime = Date.now()
    
    function animate() {
      const elapsed = Date.now() - startTime
      progress = Math.min(1, elapsed / duration)
      
      const easeProgress = easeInOutCubic(progress)
      
      flyingHearts.value = flyingHearts.value.map(h => {
        if (h.id === heart.id) {
          const currentX = h.x + (h.targetX - h.x) * easeProgress
          const currentY = h.y + (h.targetY - h.y) * easeProgress - Math.sin(progress * Math.PI) * 100
          
          return {
            ...h,
            progress: easeProgress,
            opacity: 1 - progress * 0.3,
            x: currentX,
            y: currentY
          }
        }
        return h
      })
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          flyingHearts.value = flyingHearts.value.filter(h => h.id !== heart.id)
        }, 500)
      }
    }
    
    requestAnimationFrame(animate)
  }, delay)
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function getHeartStyle(heart: FlyingHeart) {
  return {
    left: `${heart.x}px`,
    top: `${heart.y}px`,
    width: `${heart.size}px`,
    height: `${heart.size}px`,
    opacity: heart.opacity,
    transform: `scale(${1 + heart.progress * 0.3}) rotate(${heart.progress * 360}deg)`,
    filter: `drop-shadow(0 0 ${10 * heart.opacity}px ${heart.color})`
  }
}

function trigger(count: number) {
  const canvas = document.querySelector('.fixed.bottom-6.left-1\\/2')
  if (canvas) {
    const rect = canvas.getBoundingClientRect()
    createFlyingHearts(count, rect.left + rect.width / 2, rect.top)
  } else {
    createFlyingHearts(count, window.innerWidth / 2, window.innerHeight - 100)
  }
}

defineExpose({ trigger })

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.heart-fly-enter-active {
  animation: heart-appear 0.3s ease-out;
}

.heart-fly-leave-active {
  animation: heart-disappear 0.5s ease-in;
}

@keyframes heart-appear {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes heart-disappear {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale(1.5);
  }
}
</style>
