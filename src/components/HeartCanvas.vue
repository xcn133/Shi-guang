<template>
  <div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20">
      <div class="text-center mb-3">
        <p class="text-white text-sm font-medium mb-1">用鼠标画颗爱心送给我吧 💕</p>
        <p class="text-white/60 text-xs">画得越认真，飞出的心越多</p>
      </div>
      
      <div class="relative">
        <canvas
          ref="canvasRef"
          :width="canvasWidth"
          :height="canvasHeight"
          class="rounded-xl bg-white/20 border-2 border-dashed border-white/40 cursor-crosshair touch-none"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="endDrawing"
          @mouseleave="endDrawing"
          @touchstart.prevent="startDrawingTouch"
          @touchmove.prevent="drawTouch"
          @touchend.prevent="endDrawing"
        />
        
        <button
          @click="clearCanvas"
          class="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          title="清空画布"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        
        <button
          v-if="hasDrawing"
          @click="submitHeart"
          class="absolute bottom-2 right-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-medium hover:shadow-lg transition-all"
        >
          发送爱心 ❤️
        </button>
      </div>
      
      <div v-if="heartsSent > 0" class="text-center mt-2">
        <p class="text-pink-300 text-xs">
          已发送 {{ heartsSent }} 颗爱心 💖
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  heartsReady: [count: number]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWidth = 200
const canvasHeight = 150

const isDrawing = ref(false)
const hasDrawing = ref(false)
const heartsSent = ref(0)
const paths = ref<{x: number, y: number}[]>([])

let ctx: CanvasRenderingContext2D | null = null

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
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

function getTouchPos(e: TouchEvent) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }
  const touch = e.touches[0]
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
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
