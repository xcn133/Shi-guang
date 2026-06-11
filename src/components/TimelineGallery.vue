<template>
  <div class="relative overflow-y-auto h-[calc(100vh-7rem)] pb-20" ref="timelineRef">
    <div class="max-w-4xl mx-auto py-8 md:py-16 px-4 md:px-6">
      <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-400 via-purple-500 to-blue-400 md:transform md:-translate-x-1/2" />
      
      <div
        v-for="(photo, index) in store.photos"
        :key="photo.id"
        class="relative mb-16 md:mb-24 pl-12 md:pl-0"
        :class="index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2'"
      >
        <div
          class="timeline-item absolute left-4 md:left-1/2 transform -translate-x-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-xl flex items-center justify-center z-10"
          :class="{ 'scale-125': store.currentIndex === index }"
        >
          <span class="text-purple-600 font-bold text-base md:text-lg">{{ index + 1 }}</span>
        </div>
        
        <div
          class="photo-card relative bg-white rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl overflow-hidden transition-all duration-700"
          :class="[
            index % 2 === 0 ? 'md:mr-auto md:ml-8' : 'md:ml-auto md:mr-8',
            { 'opacity-100 translate-y-0': visibleItems.includes(index), 'opacity-0 translate-y-20': !visibleItems.includes(index) }
          ]"
          :style="{ width: isMobile ? 'calc(100% - 3rem)' : 'calc(50% - 4rem)' }"
        >
          <div class="relative h-48 md:h-64 overflow-hidden">
            <img
              :src="photo.url"
              :alt="photo.caption"
              class="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
          
          <div class="p-4 md:p-6">
            <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ photo.date }}</span>
              <svg v-if="photo.location" class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span v-if="photo.location">{{ photo.location }}</span>
            </div>
            
            <p class="text-gray-800 text-sm md:text-base leading-relaxed">{{ photo.caption }}</p>
            
            <button
              v-if="photo.isLastPhoto"
              @click="handleSpecialPhoto(photo)"
              class="mt-3 md:mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg transition-all active:scale-95"
            >
              点击解锁惊喜 ✨
            </button>
          </div>
        </div>
      </div>
      
      <div class="text-center pt-8 md:pt-16 pl-12 md:pl-0">
        <div class="inline-block px-6 md:px-8 py-3 md:py-4 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl">
          <p class="text-white text-base md:text-lg font-medium">我们的故事，未完待续...</p>
          <p class="text-white/70 text-xs md:text-sm mt-1">每一个明天，都是新的开始</p>
        </div>
        
        <div class="mt-8 md:mt-12 flex flex-col items-center gap-3">
          <button
            @click="handleHighFive"
            @touchstart.prevent="handleHighFive"
            class="relative group"
          >
            <div 
              class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
              :class="{ 'animate-shake': isShaking }"
            >
              <svg class="w-10 h-10 md:w-12 md:h-12 text-white transform rotate-12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 6.5c-.5-.5-1.5-.5-2 0l-2 2c-.3.3-.5.6-.5 1v3.5c0 .3.1.5.3.7l2.7 2.7c.4.4.6.9.6 1.4v.7c0 1.1-.9 2-2 2h-9c-.6 0-1-.4-1-1s.4-1 1-1h6c.3 0 .5-.2.5-.5s-.2-.5-.5-.5h-8c-.6 0-1-.4-1-1s.4-1 1-1h8c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H6c-.6 0-1-.4-1-1s.4-1 1-1h7.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H8c-.6 0-1-.4-1-1s.4-1 1-1h6.5l2-2c.5-.5 1.5-.5 2 0l2 2z"/>
              </svg>
            </div>
            
            <div class="absolute inset-0 rounded-full bg-yellow-300 opacity-0 group-hover:opacity-30 transition-opacity animate-ping" />
          </button>
          
          <div class="text-center">
            <p class="text-white text-sm font-medium">Give me five</p>
            <p class="text-white/80 text-xs">碰个拳 👊</p>
          </div>
        </div>
        
        <transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 scale-0 translate-y-10"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-500 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-0 translate-y-10"
        >
          <div
            v-if="showHighFiveMessage"
            class="mt-6 inline-block bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div class="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4">
              <div class="flex items-center gap-3 mb-2">
                <div class="text-3xl">✋</div>
                <div class="text-left">
                  <p class="text-white font-bold text-lg">击掌成功！</p>
                  <p class="text-white/90 text-sm">能量 +100</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-white rounded-full transition-all duration-1000"
                    :style="{ width: energyProgress + '%' }"
                  />
                </div>
                <span class="text-white text-xs font-bold">{{ energyProgress }}%</span>
              </div>
            </div>
            
            <div class="px-6 py-4">
              <p class="text-gray-800 text-sm font-medium text-center leading-relaxed">
                未来继续一起冲！💪
              </p>
              <div class="flex justify-center gap-2 mt-3">
                <span class="text-lg animate-bounce">🎉</span>
                <span class="text-lg animate-bounce" style="animation-delay: 0.1s">✨</span>
                <span class="text-lg animate-bounce" style="animation-delay: 0.2s">💫</span>
                <span class="text-lg animate-bounce" style="animation-delay: 0.3s">🌟</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMemoryStore } from '@/stores/memory'
import type { Photo } from '@/types'

const store = useMemoryStore()
const timelineRef = ref<HTMLElement | null>(null)
const visibleItems = ref<number[]>([])
const isMobile = ref(false)
const isShaking = ref(false)
const showHighFiveMessage = ref(false)
const energyProgress = ref(0)

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

function handleScroll() {
  if (!timelineRef.value) return
  
  const items = timelineRef.value.querySelectorAll('.timeline-item')
  const viewportHeight = window.innerHeight
  
  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect()
    if (rect.top < viewportHeight * 0.8 && rect.bottom > 0) {
      if (!visibleItems.value.includes(index)) {
        visibleItems.value.push(index)
        store.goToPhoto(index)
      }
    }
  })
}

function handleSpecialPhoto(photo: Photo) {
  if (photo.isLastPhoto) {
    store.triggerPetals()
    if (photo.isGroupPhoto) {
      store.nextPhoto()
    }
  }
}

function handleHighFive() {
  if (showHighFiveMessage.value) return
  
  isShaking.value = true
  store.triggerPetals()
  
  setTimeout(() => {
    isShaking.value = false
  }, 500)
  
  showHighFiveMessage.value = true
  energyProgress.value = 0
  
  const interval = setInterval(() => {
    energyProgress.value += 5
    if (energyProgress.value >= 100) {
      clearInterval(interval)
    }
  }, 50)
  
  setTimeout(() => {
    showHighFiveMessage.value = false
  }, 5000)
}

onMounted(() => {
  checkMobile()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', checkMobile)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(-15deg); }
  20% { transform: rotate(15deg); }
  30% { transform: rotate(-15deg); }
  40% { transform: rotate(15deg); }
  50% { transform: rotate(-10deg); }
  60% { transform: rotate(10deg); }
  70% { transform: rotate(-5deg); }
  80% { transform: rotate(5deg); }
  90% { transform: rotate(-2deg); }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
