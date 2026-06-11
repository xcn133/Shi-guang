<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-30">
    <transition-group
      name="quote-float"
      tag="div"
      class="relative w-full h-full"
    >
      <div
        v-for="quote in floatingQuotes"
        :key="quote.id"
        class="absolute px-6 py-3 rounded-2xl backdrop-blur-md shadow-lg border max-w-xs"
        :style="getQuoteStyle(quote)"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">💕</span>
          <p class="text-white text-sm font-medium leading-relaxed">
            {{ quote.text }}
          </p>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface FloatingQuote {
  id: number
  text: string
  x: number
  y: number
  opacity: number
  scale: number
  color: string
}

const floatingQuotes = ref<FloatingQuote[]>([])
let quoteId = 0

const colors = [
  'rgba(236, 72, 153, 0.6)',
  'rgba(244, 114, 182, 0.6)',
  'rgba(251, 146, 60, 0.6)',
  'rgba(167, 139, 250, 0.6)',
  'rgba(99, 102, 241, 0.6)'
]

function showQuote(text: string) {
  const quote: FloatingQuote = {
    id: quoteId++,
    text,
    x: Math.random() * 60 + 20,
    y: 100,
    opacity: 1,
    scale: 1,
    color: colors[Math.floor(Math.random() * colors.length)]
  }
  
  floatingQuotes.value.push(quote)
  
  animateQuote(quote)
  
  setTimeout(() => {
    floatingQuotes.value = floatingQuotes.value.filter(q => q.id !== quote.id)
  }, 6000)
}

function animateQuote(quote: FloatingQuote) {
  let startTime = Date.now()
  const duration = 6000
  
  function animate() {
    const elapsed = Date.now() - startTime
    const progress = elapsed / duration
    
    if (progress < 1) {
      floatingQuotes.value = floatingQuotes.value.map(q => {
        if (q.id === quote.id) {
          const y = 100 - progress * 120
          const opacity = progress < 0.8 ? 1 : 1 - (progress - 0.8) / 0.2
          const scale = 1 + Math.sin(progress * Math.PI) * 0.1
          
          return {
            ...q,
            y,
            opacity,
            scale
          }
        }
        return q
      })
      
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

function getQuoteStyle(quote: FloatingQuote) {
  return {
    left: `${quote.x}%`,
    top: `${quote.y}%`,
    opacity: quote.opacity,
    transform: `translateX(-50%) scale(${quote.scale})`,
    backgroundColor: quote.color,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  }
}

defineExpose({ showQuote })

onUnmounted(() => {
  floatingQuotes.value = []
})
</script>

<style scoped>
.quote-float-enter-active {
  animation: quote-appear 0.5s ease-out;
}

.quote-float-leave-active {
  animation: quote-disappear 0.5s ease-in;
}

@keyframes quote-appear {
  from {
    transform: translateX(-50%) scale(0) translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes quote-disappear {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateX(-50%) scale(0.8) translateY(-20px);
  }
}
</style>
