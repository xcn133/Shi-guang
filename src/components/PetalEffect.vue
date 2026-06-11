<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-40">
    <div
      v-for="petal in petals"
      :key="petal.id"
      class="absolute"
      :style="getPetalStyle(petal)"
    >
      <svg
        :width="petal.size"
        :height="petal.size"
        viewBox="0 0 20 20"
        class="petal-svg"
      >
        <path
          d="M10 0C10 0 15 5 15 10C15 15 10 20 10 20C10 20 5 15 5 10C5 5 10 0 10 0Z"
          :fill="getPetalColor(petal.id)"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Petal } from '@/types'

const petals = ref<Petal[]>([])
let animationFrame: number | null = null
let lastTime = 0

const colors = [
  '#FFB6C1',
  '#FFC0CB',
  '#FF69B4',
  '#FFDAB9',
  '#FFF0F5',
  '#FFE4E1'
]

function getPetalColor(id: number): string {
  return colors[id % colors.length]
}

function getPetalStyle(petal: Petal) {
  return {
    left: `${petal.x}%`,
    top: `${petal.y}%`,
    transform: `rotate(${petal.rotation}deg)`,
    opacity: petal.opacity
  }
}

function createPetal(): Petal {
  return {
    id: Math.random(),
    x: Math.random() * 100,
    y: -10,
    size: Math.random() * 20 + 15,
    speed: Math.random() * 1 + 0.5,
    rotation: Math.random() * 360,
    opacity: Math.random() * 0.6 + 0.4
  }
}

function updatePetals(timestamp: number) {
  if (!lastTime) lastTime = timestamp
  const deltaTime = (timestamp - lastTime) / 16
  lastTime = timestamp
  
  petals.value = petals.value.map(petal => ({
    ...petal,
    y: petal.y + petal.speed * deltaTime,
    rotation: petal.rotation + (petal.speed * deltaTime * 2),
    x: petal.x + Math.sin(petal.y / 50) * 0.3
  }))
  
  petals.value = petals.value.filter(petal => petal.y < 110)
  
  if (Math.random() < 0.3) {
    petals.value.push(createPetal())
  }
  
  animationFrame = requestAnimationFrame(updatePetals)
}

onMounted(() => {
  for (let i = 0; i < 30; i++) {
    const petal = createPetal()
    petal.y = Math.random() * 100
    petals.value.push(petal)
  }
  
  animationFrame = requestAnimationFrame(updatePetals)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.petal-svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  animation: flutter 3s ease-in-out infinite;
}

@keyframes flutter {
  0%, 100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(0.9);
  }
}
</style>
