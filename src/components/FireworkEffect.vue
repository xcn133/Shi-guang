<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-30">
    <div
      v-for="firework in fireworks"
      :key="firework.id"
      class="absolute"
      :style="{ left: firework.x + '%', top: firework.y + '%' }"
    >
      <div
        v-for="(particle, index) in firework.particles"
        :key="index"
        class="absolute rounded-full"
        :style="getParticleStyle(particle)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface Particle {
  x: number
  y: number
  size: number
  color: string
  speed: number
  angle: number
  opacity: number
}

interface Firework {
  id: number
  x: number
  y: number
  particles: Particle[]
}

const fireworks = ref<Firework[]>([])
let fireworkId = 0

const colors = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#95E1D3',
  '#F38181',
  '#AA96DA',
  '#FCBAD3',
  '#A8D8EA'
]

function createFirework(x: number, y: number) {
  const particles: Particle[] = []
  const particleCount = 20
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: 0,
      y: 0,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 80 + 40,
      angle: (i / particleCount) * Math.PI * 2,
      opacity: 1
    })
  }
  
  const firework: Firework = {
    id: fireworkId++,
    x,
    y,
    particles
  }
  
  fireworks.value.push(firework)
  
  animateFirework(firework)
  
  setTimeout(() => {
    fireworks.value = fireworks.value.filter(f => f.id !== firework.id)
  }, 2000)
}

function animateFirework(firework: Firework) {
  let frame = 0
  const maxFrames = 60
  
  function animate() {
    frame++
    const progress = frame / maxFrames
    
    fireworks.value = fireworks.value.map(f => {
      if (f.id === firework.id) {
        return {
          ...f,
          particles: f.particles.map(p => ({
            ...p,
            x: Math.cos(p.angle) * p.speed * progress,
            y: Math.sin(p.angle) * p.speed * progress + (progress * progress * 50),
            opacity: 1 - progress,
            size: p.size * (1 - progress * 0.5)
          }))
        }
      }
      return f
    })
    
    if (frame < maxFrames) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

function getParticleStyle(particle: Particle) {
  return {
    transform: `translate(${particle.x}px, ${particle.y}px)`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    backgroundColor: particle.color,
    opacity: particle.opacity,
    boxShadow: `0 0 ${particle.size}px ${particle.color}`
  }
}

function trigger() {
  const positions = [
    { x: 20, y: 30 },
    { x: 50, y: 20 },
    { x: 80, y: 30 },
    { x: 30, y: 60 },
    { x: 70, y: 60 },
    { x: 50, y: 50 }
  ]
  
  positions.forEach((pos, index) => {
    setTimeout(() => {
      createFirework(pos.x, pos.y)
    }, index * 150)
  })
}

defineExpose({ trigger })

onUnmounted(() => {
  fireworks.value = []
})
</script>
