<template>
  <div class="min-h-[calc(100vh-7rem)] p-3 md:p-8 pb-24">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
      <div
        v-for="(photo, index) in store.photos"
        :key="photo.id"
        class="polaroid relative bg-white p-3 md:p-4 rounded shadow-xl transition-all duration-500 cursor-pointer hover:shadow-2xl active:scale-105"
        :style="getPolaroidStyle(index)"
        @mouseenter="handleHover(index, true)"
        @mouseleave="handleHover(index, false)"
        @touchstart="handleTouchStart(index)"
        @touchend="handleTouchEnd(photo, index)"
        @click="handleClick(photo, index)"
      >
        <div class="relative overflow-hidden rounded-sm">
          <img
            :src="photo.url"
            :alt="photo.caption"
            class="w-full h-40 sm:h-48 object-cover transition-transform duration-500"
            :class="{ 'scale-110': hoveredIndex === index || touchIndex === index }"
          />
          
          <div
            v-if="hoveredIndex === index || touchIndex === index"
            class="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300"
          >
            <div class="text-white text-center px-4">
              <p class="text-xs md:text-sm font-medium">{{ photo.caption }}</p>
              <p class="text-xs mt-1 opacity-80">{{ photo.date }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-2 md:mt-3">
          <p class="text-gray-800 text-xs md:text-sm font-handwriting truncate">{{ photo.caption }}</p>
          <div class="flex items-center gap-1 md:gap-2 mt-1 text-xs text-gray-500">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-xs">{{ photo.date }}</span>
          </div>
        </div>
        
        <div
          v-if="photo.isLastPhoto"
          class="absolute top-2 right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center"
        >
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        
        <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div class="w-2 h-2 rounded-full shadow-sm"
            :class="store.currentIndex === index ? 'bg-purple-500' : 'bg-gray-300'"
          />
        </div>
      </div>
    </div>
    
    <div v-if="selectedPhoto" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" @click="closeModal">
      <div class="relative max-w-3xl w-full mx-3 md:mx-8 animate-fade-in" @click.stop>
        <button
          @click="closeModal"
          class="absolute top-2 right-2 md:-top-12 md:right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all z-10"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          <img
            :src="selectedPhoto.url"
            :alt="selectedPhoto.caption"
            class="w-full h-64 md:h-96 object-cover"
          />
          <div class="p-4 md:p-8 overflow-y-auto">
            <div class="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
              <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ selectedPhoto.date }}</span>
              <svg v-if="selectedPhoto.location" class="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span v-if="selectedPhoto.location">{{ selectedPhoto.location }}</span>
            </div>
            
            <p class="text-gray-800 text-base md:text-xl leading-relaxed mb-4 md:mb-6">{{ selectedPhoto.caption }}</p>
            
            <div v-if="selectedPhoto.isLastPhoto" class="text-center">
              <button
                @click="handleSpecialPhoto"
                class="px-6 md:px-8 py-2 md:py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm md:text-base font-medium hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                点击解锁惊喜 ✨
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMemoryStore } from '@/stores/memory'
import type { Photo } from '@/types'

const store = useMemoryStore()
const hoveredIndex = ref<number | null>(null)
const touchIndex = ref<number | null>(null)
const selectedPhoto = ref<Photo | null>(null)

function getPolaroidStyle(index: number) {
  const rotations = [-5, 3, -2, 4, -3, 2]
  const rotation = rotations[index % rotations.length]
  
  const isActive = hoveredIndex.value === index || touchIndex.value === index
  
  return {
    transform: isActive
      ? 'scale(1.05) rotate(0deg)'
      : `rotate(${rotation}deg)`,
    zIndex: isActive ? 10 : 1
  }
}

function handleHover(index: number, isHovered: boolean) {
  hoveredIndex.value = isHovered ? index : null
}

function handleTouchStart(index: number) {
  touchIndex.value = index
}

function handleTouchEnd(photo: Photo, index: number) {
  setTimeout(() => {
    touchIndex.value = null
  }, 300)
}

function handleClick(photo: Photo, index: number) {
  selectedPhoto.value = photo
  store.goToPhoto(index)
}

function closeModal() {
  selectedPhoto.value = null
}

function handleSpecialPhoto() {
  if (selectedPhoto.value?.isLastPhoto) {
    store.triggerPetals()
    if (selectedPhoto.value.isGroupPhoto) {
      const nextIndex = store.currentIndex + 1
      if (nextIndex < store.photos.length) {
        store.goToPhoto(nextIndex)
        selectedPhoto.value = store.photos[nextIndex]
      }
    }
  }
}
</script>

<style scoped>
.font-handwriting {
  font-family: 'Comic Sans MS', 'Bradley Hand', 'PingFang SC', cursive;
}
</style>
