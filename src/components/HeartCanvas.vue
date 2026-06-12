<template>
  <div class="fixed z-40">
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-full"
    >
      <div v-if="isExpanded" class="fixed inset-0 z-50 flex items-end justify-center">
        <div class="absolute inset-0 bg-black/40" @click="toggleExpand" />
        <div class="relative w-full max-w-md mx-4 mb-4 bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div class="flex items-center justify-between p-4 pb-2">
            <div>
              <p class="text-white text-sm font-medium">画颗爱心 💕</p>
              <p class="text-white/50 text-xs">画得越认真，飞出的心越多</p>
            </div>
            <button
              @click="toggleExpand"
              class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-90"
            >
              <svg class="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="relative mx-4 mb-3">
            <canvas
              ref="canvasRef"
              :width="canvasWidth"
              :height="canvasHeight"
              class="w-full rounded-xl bg-white/10 border border-dashed border-white/30 cursor-crosshair touch-none"
              style="aspect-ratio: 4/3"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="endDrawing"
              @mouseleave="endDrawing"
              @touchstart.prevent="startDrawingTouch"
              @touchmove.prevent="drawTouch"
              @touchend.prevent="endDrawing"
            />
          </div>
          
          <div class="flex items-center justify-between px-4 pb-4 gap-3">
            <button
              @click="clearCanvas"
              class="flex-1 py-2.5 rounded-xl bg-white/10 text-white/70 text-sm font-medium hover:bg-white/20 active:scale-95 transition-all"
            >
              清空
            </button>
            <button
              @click="submitHeart"
              :disabled="!hasDrawing"
              class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-medium shadow-lg disabled:opacity-40 disabled:shadow-none active:scale-95 transition-all"
            >
              发送 ❤️
            </button>
          </div>
          
          <div v-if="heartsSent > 0" class="text-center pb-3">
            <p class="text-pink-300 text-xs">已发送 {{ heartsSent }} 颗爱心 💖</p>
          </div>
        </div>
      </div>
    </transition>
    
    <button
      v-if="!isExpanded"
      @click="toggleExpand"
      class="fixed left-4 bottom-20 w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-lg shadow-pink-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-90 heart-pulse"
      title="画爱心"
    >
      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const emit = defineEmits<{
  heartsReady: [count: number]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWidth = 320
const canvasHeight = 240

const isExpanded = ref(false)
const isDrawing = ref(false)
const hasDrawing = ref(false)
const heartsSent = ref(0)
const paths = ref<{x: number, y: number}[]>([])

let ctx: CanvasRenderingContext2D | null = null

function toggleExpand() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    nextTick(() => {
      if (canvasRef.value) {
        ctx = canvasRef.value.getContext('2d')
        if (ctx) {
          ctx.strokeStyle = '#FF69B4'
          ctx.lineWidth = 3
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
        }
      }
    })
  }
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = '#FF69B4'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }
})

function getPos(e: MouseEvent) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }
  const scaleX = canvasWidth / rect.width
  const scaleY = canvasHeight / rect.height
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }
}

function getTouchPos(e: TouchEvent) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }
  const touch = e.touches[0]
  const scaleX = canvasWidth / rect.width
  const scaleY = canvasHeight / rect.height
  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY
  }
}

function startDrawing(e: MouseEvent) {
  isDrawing.value = true
  hasDrawing.value = true
  const pos = getPos(e)
  paths.value = [pos]
  if (ctx) {
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }
}

function startDrawingTouch(e: TouchEvent) {
  isDrawing.value = true
  hasDrawing.value = true
  const pos = getTouchPos(e)
  paths.value = [pos]
  if (ctx) {
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }
}

function draw(e: MouseEvent) {
  if (!isDrawing.value || !ctx) return
  const pos = getPos(e)
  paths.value.push(pos)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

function drawTouch(e: TouchEvent) {
  if (!isDrawing.value || !ctx) return
  const pos = getTouchPos(e)
  paths.value.push(pos)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

function endDrawing() {
  isDrawing.value = false
}

function clearCanvas() {
  if (ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    hasDrawing.value = false
    paths.value = []
  }
}

function calculateHeartQuality(): number {
  if (paths.value.length < 10) return 1
  
  const totalPoints = paths.value.length
  const coverage = totalPoints / (canvasWidth * canvasHeight) * 1000
  
  let closed = false
  if (paths.value.length > 20) {
    const start = paths.value[0]
    const end = paths.value[paths.value.length - 1]
    const distance = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2)
    closed = distance < 30
  }
  
  let baseHearts = 3
  if (coverage > 0.5) baseHearts = 5
  if (coverage > 1) baseHearts = 7
  if (closed) baseHearts += 3
  if (totalPoints > 100) baseHearts += 2
  
  return Math.min(15, baseHearts)
}

function submitHeart() {
  const heartCount = calculateHeartQuality()
  heartsSent.value += heartCount
  emit('heartsReady', heartCount)
  clearCanvas()
}
</script>

<style scoped>
.heart-pulse {
  animation: heart-pulse 2s ease-in-out infinite;
}

@keyframes heart-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}
</style>
