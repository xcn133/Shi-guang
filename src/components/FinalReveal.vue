<template>
  <transition
    enter-active-class="transition-all duration-1000 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-500 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="store.showFinalReveal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="close"
    >
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div 
        class="relative max-w-4xl w-full animate-fade-in"
        @click.stop
      >
        <button
          @click="close"
          class="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all z-10"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div class="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 px-8 py-10 text-center">
            <div class="text-6xl mb-4">💕</div>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-3">
              爱意拼图完成
            </h2>
            <p class="text-white/90 text-lg">
              你找到了所有的爱意碎片
            </p>
          </div>
          
          <div class="p-8 md:p-12">
            <div class="text-center mb-8">
              <div class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink-100 mb-6">
                <span class="text-2xl">❤️</span>
                <span class="text-pink-600 font-bold text-lg">真情告白</span>
                <span class="text-2xl">❤️</span>
              </div>
              
              <div class="space-y-6 text-left max-w-2xl mx-auto">
                <p class="text-gray-800 text-lg md:text-xl leading-relaxed">
                  亲爱的，
                </p>
                <p class="text-gray-700 text-base md:text-lg leading-relaxed">
                  从第一次相遇的那一刻起，我就知道你是我一直在寻找的那个人。
                </p>
                <p class="text-gray-700 text-base md:text-lg leading-relaxed">
                  你的笑容像阳光一样温暖，你的温柔像春风一样轻柔。每一天有你在身边，都是我生命中最美好的礼物。
                </p>
                <p class="text-gray-700 text-base md:text-lg leading-relaxed">
                  我们一起走过的路，看过的风景，经历的故事，都成为了最珍贵的回忆。
                </p>
                <p class="text-gray-800 text-lg md:text-xl leading-relaxed font-medium">
                  我想对你说：<br/>
                  <span class="text-pink-600">"谢谢你出现在我的生命里，<br/>未来，我想继续牵着你的手，<br/>一起看遍世间所有的美好。"</span>
                </p>
              </div>
            </div>
            
            <div class="border-t pt-8 mt-8">
              <p class="text-center text-gray-500 text-sm mb-4">我们的合影合集</p>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="photo in store.photos.slice(0, 3)"
                  :key="photo.id"
                  class="relative aspect-square rounded-xl overflow-hidden shadow-lg"
                >
                  <img
                    :src="photo.url"
                    :alt="photo.caption"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div class="absolute bottom-2 left-2 right-2">
                    <p class="text-white text-xs">{{ photo.date }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-center mt-8">
              <div class="flex justify-center gap-3 mb-4">
                <span class="text-3xl animate-bounce">💖</span>
                <span class="text-3xl animate-bounce" style="animation-delay: 0.1s">💝</span>
                <span class="text-3xl animate-bounce" style="animation-delay: 0.2s">💕</span>
                <span class="text-3xl animate-bounce" style="animation-delay: 0.3s">💗</span>
                <span class="text-3xl animate-bounce" style="animation-delay: 0.4s">💘</span>
              </div>
              
              <p class="text-gray-400 text-xs">
                永远爱你的那个人 💑
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useMemoryStore } from '@/stores/memory'

const store = useMemoryStore()

function close() {
  store.closeFinalReveal()
}
</script>
