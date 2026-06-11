<template>
  <div class="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-7rem)] p-4 md:p-8">
    <div class="perspective-1000 mb-6 md:mb-0">
      <div
        ref="cubeRef"
        class="relative w-64 h-64 md:w-80 md:h-80 preserve-3d transition-transform duration-500 cursor-grab active:cursor-grabbing"
        :style="cubeStyle"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @touchstart="startTouchDrag"
        @touchmove="onTouchDrag"
        @touchend="endTouchDrag"
      >
        <div
          v-for="(face, index) in cubeFaces"
          :key="index"
          class="absolute w-64 h-64 md:w-80 md:h-80 backface-hidden rounded-lg overflow-hidden shadow-2xl"
          :style="face.style"
        >
          <img
            :src="face.photo.url"
            :alt="face.photo.caption"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
            <p class="text-xs md:text-sm font-medium">{{ face.photo.caption }}</p>
            <p class="text-xs opacity-80">{{ face.photo.date }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="md:ml-8 space-y-3 md:space-y-4 text-center md:text-left">
      <h2 class="text-xl md:text-2xl font-bold text-white">3D 立方体相册</h2>
      <p class="text-white/80 text-xs md:text-sm max-w-xs mx-auto md:mx-0">
        拖拽立方体旋转，查看不同面的照片
      </p>
      <div class="flex gap-2 justify-center md:justify-start">
        <button
          v-for="(photo, index) in store.photos.slice(0, 6)"
          :key="photo.id"
          @click="rotateToFace(index)"
          class="w-4 h-4 md:w-3 md:h-3 rounded-full transition-all active:scale-150"
          :class="currentFace === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMemoryStore } from '@/stores/memory'

const store = useMemoryStore()

const cubeRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const rotateX = ref(-30)
const rotateY = ref(45)
const currentFace = ref(0)

const cubeStyle = computed(() => ({
  transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`
}))

const cubeFaces = computed(() => {
  const photos = store.photos.slice(0, 6)
  const isMobile = window.innerWidth < 768
  const translateZ = isMobile ? '128px' : '160px'
  
  const transforms = [
    `translateZ(${translateZ})`,
    `rotateY(180deg) translateZ(${translateZ})`,
    `rotateY(-90deg) translateZ(${translateZ})`,
    `rotateY(90deg) translateZ(${translateZ})`,
    `rotateX(90deg) translateZ(${translateZ})`,
    `rotateX(-90deg) translateZ(${translateZ})`
  ]
  
  return photos.map((photo, index) => ({
    photo,
    style: { transform: transforms[index] }
  }))
})

function startDrag(e: MouseEvent) {
  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return
  
  const deltaX = e.clientX - startX.value
  const deltaY = e.clientY - startY.value
  
  rotateY.value += deltaX * 0.5
  rotateX.value -= deltaY * 0.5
  
  startX.value = e.clientX
  startY.value = e.clientY
}

function endDrag() {
  isDragging.value = false
}

function startTouchDrag(e: TouchEvent) {
  isDragging.value = true
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
}

function onTouchDrag(e: TouchEvent) {
  if (!isDragging.value) return
  e.preventDefault()
  
  const deltaX = e.touches[0].clientX - startX.value
  const deltaY = e.touches[0].clientY - startY.value
  
  rotateY.value += deltaX * 0.5
  rotateX.value -= deltaY * 0.5
  
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
}

function endTouchDrag() {
  isDragging.value = false
}

function rotateToFace(index: number) {
  currentFace.value = index
  const rotations = [
    { x: 0, y: 0 },
    { x: 0, y: 180 },
    { x: 0, y: 90 },
    { x: 0, y: -90 },
    { x: -90, y: 0 },
    { x: 90, y: 0 }
  ]
  
  rotateX.value = rotations[index].x
  rotateY.value = rotations[index].y
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()
  rotateY.value += e.deltaY * 0.1
}

onMounted(() => {
  if (cubeRef.value) {
    cubeRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

onUnmounted(() => {
  if (cubeRef.value) {
    cubeRef.value.removeEventListener('wheel', handleWheel)
  }
})
</script>
