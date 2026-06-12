<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-pink-200/30 via-purple-300/30 to-blue-200/30" />
    
    <PetalEffect v-if="store.showPetals" />
    <FireworkEffect ref="fireworkRef" />
    <FlyingHearts ref="flyingHeartsRef" />
    <FloatingQuotes ref="floatingQuotesRef" />
    <SecretEasterEgg />
    <LoveCounter />
    <HighFiveButton @trigger="handleFirework" />
    <FragmentCollector />
    <FinalReveal />
    <HeartCanvas @hearts-ready="handleHeartsReady" />
    <QuoteButton @show-quote="handleShowQuote" />
    <PhotoManager />
    
    <LoveFragment v-for="fragment in fragments" :key="fragment.id" :id="fragment.id" :x="fragment.x" :y="fragment.y" />
    
    <div class="relative z-10">
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div class="px-4 py-3 md:px-6 md:py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-wide">时光胶片</h1>
            
            <div class="hidden md:flex items-center gap-3">
              <button
                v-for="mode in modes"
                :key="mode.value"
                @click="store.setMode(mode.value)"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  store.currentMode === mode.value
                    ? 'bg-white text-purple-700 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]"
              >
                {{ mode.label }}
              </button>
            </div>
            
            <div class="flex items-center gap-2 md:gap-3">
              <button
                @click="showModeMenu = !showModeMenu"
                class="md:hidden p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <button
                @click="store.toggleMusic"
                class="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all hidden md:block"
                :title="store.musicEnabled ? '关闭音乐' : '开启音乐'"
              >
                <svg v-if="store.musicEnabled" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </button>
              
              <button
                @click="store.toggleSound"
                class="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all hidden md:block"
                :title="store.soundEnabled ? '关闭音效' : '开启音效'"
              >
                <svg v-if="store.soundEnabled" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div
        v-if="showModeMenu"
        class="fixed top-16 right-4 z-50 bg-white/95 backdrop-blur-md rounded-lg shadow-xl p-2 md:hidden"
      >
        <button
          v-for="mode in modes"
          :key="mode.value"
          @click="store.setMode(mode.value); showModeMenu = false"
          :class="[
            'w-full px-4 py-3 rounded-lg text-sm font-medium transition-all text-left',
            store.currentMode === mode.value
              ? 'bg-purple-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ mode.label }}
        </button>
      </div>
      
      <main class="pt-32 md:pt-28 min-h-screen">
        <CubeGallery v-if="store.currentMode === '3d-cube'" />
        <TimelineGallery v-else-if="store.currentMode === 'timeline'" />
        <PolaroidGallery v-else />
      </main>
      
      <footer class="fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-t border-white/20 safe-area-bottom">
        <div class="px-4 py-2 md:px-6 md:py-3">
          <div v-if="store.currentLoveMessage" class="text-center mb-2">
            <p class="text-white text-xs md:text-sm font-medium animate-fade-in">
              "{{ store.currentLoveMessage.text }}"
            </p>
          </div>
          
          <div class="flex items-center justify-between">
            <button
              @click="store.prevPhoto"
              :disabled="store.currentIndex === 0"
              class="p-2 md:p-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <svg class="w-5 h-5 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span class="text-white/80 text-sm">
              {{ store.currentIndex + 1 }} / {{ store.photos.length }}
            </span>
            
            <button
              @click="store.nextPhoto"
              :disabled="store.currentIndex === store.photos.length - 1"
              class="p-2 md:p-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <svg class="w-5 h-5 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div class="w-full h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden mt-2">
            <div
              class="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500"
              :style="{ width: `${store.progress}%` }"
            />
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMemoryStore } from '@/stores/memory'
import CubeGallery from './CubeGallery.vue'
import TimelineGallery from './TimelineGallery.vue'
import PolaroidGallery from './PolaroidGallery.vue'
import PetalEffect from './PetalEffect.vue'
import SecretEasterEgg from './SecretEasterEgg.vue'
import LoveCounter from './LoveCounter.vue'
import HighFiveButton from './HighFiveButton.vue'
import FireworkEffect from './FireworkEffect.vue'
import FragmentCollector from './FragmentCollector.vue'
import LoveFragment from './LoveFragment.vue'
import FinalReveal from './FinalReveal.vue'
import HeartCanvas from './HeartCanvas.vue'
import FlyingHearts from './FlyingHearts.vue'
import FloatingQuotes from './FloatingQuotes.vue'
import QuoteButton from './QuoteButton.vue'
import PhotoManager from './PhotoManager.vue'

const store = useMemoryStore()

const fireworkRef = ref<InstanceType<typeof FireworkEffect> | null>(null)
const flyingHeartsRef = ref<InstanceType<typeof FlyingHearts> | null>(null)
const floatingQuotesRef = ref<InstanceType<typeof FloatingQuotes> | null>(null)

const modes = ref([
  { label: '拍立得', value: 'polaroid' as const },
  { label: '时光轴', value: 'timeline' as const },
  { label: '3D立方体', value: '3d-cube' as const }
])

const fragments = ref([
  { id: 1, x: 10, y: 25 },
  { id: 2, x: 85, y: 35 },
  { id: 3, x: 15, y: 55 },
  { id: 4, x: 75, y: 65 },
  { id: 5, x: 50, y: 80 }
])

const showModeMenu = ref(false)

function handleFirework() {
  if (fireworkRef.value) {
    fireworkRef.value.trigger()
  }
}

function handleHeartsReady(count: number) {
  if (flyingHeartsRef.value) {
    flyingHeartsRef.value.trigger(count)
  }
}

function handleShowQuote(text: string) {
  if (floatingQuotesRef.value) {
    floatingQuotesRef.value.showQuote(text)
  }
}
</script>
