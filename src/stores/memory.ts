import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Photo, LoveMessage, GalleryMode } from '@/types'

export const useMemoryStore = defineStore('memory', () => {
  const isUnlocked = ref(false)
  const specialDate = ref({ month: 2, day: 24 })
  const currentMode = ref<GalleryMode>('polaroid')
  const currentIndex = ref(0)
  const isPlaying = ref(false)
  const showPetals = ref(false)
  const musicEnabled = ref(true)
  const soundEnabled = ref(true)
  const inputAttempts = ref(0)
  const showSecretMessage = ref(false)
  const collectedFragments = ref<number[]>([])
  const showFinalReveal = ref(false)
  
  const photos = ref<Photo[]>([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1522673607200-6b6f5f0f6a0a?w=800',
      caption: '第一次相遇，阳光正好，微风不燥',
      date: '2023-03-15',
      location: '校园图书馆'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1516589101900-5b9a0a6b7c6d?w=800',
      caption: '第一次牵手，心跳加速的感觉',
      date: '2023-04-20',
      location: '电影院门口'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1529674802298-0a26a3b4b0d5?w=800',
      caption: '一起旅行，看遍世间美景',
      date: '2023-07-10',
      location: '丽江古城'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1524503154123-4b7e3b7b5c0a?w=800',
      caption: '你的生日，为你点亮蜡烛',
      date: '2023-09-18',
      location: '温馨小屋'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1536648301602-169fb019277e?w=800',
      caption: '最美的你，永远在我心中',
      date: '2024-02-14',
      location: '情人节',
      isLastPhoto: true
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1522673607200-6b6f5f0f6a0a?w=800',
      caption: '我们的故事，未完待续...',
      date: '2024-06-10',
      location: '未来',
      isGroupPhoto: true
    }
  ])
  
  const loveMessages = ref<LoveMessage[]>([
    { id: 1, text: '遇见你，是我最大的幸运', unlocked: false },
    { id: 2, text: '你的笑容，是我每天的期待', unlocked: false },
    { id: 3, text: '有你的日子，每一刻都闪闪发光', unlocked: false },
    { id: 4, text: '我想牵着你的手，走到时光的尽头', unlocked: false },
    { id: 5, text: '你是我心中最美的风景', unlocked: false },
    { id: 6, text: '我爱你，胜过一切言语', unlocked: false }
  ])
  
  const currentPhoto = computed(() => photos.value[currentIndex.value])
  
  const currentLoveMessage = computed(() => {
    const unlocked = loveMessages.value.filter(m => m.unlocked)
    return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null
  })
  
  const progress = computed(() => {
    return ((currentIndex.value + 1) / photos.value.length) * 100
  })
  
  function setMode(mode: GalleryMode) {
    currentMode.value = mode
  }
  
  function nextPhoto() {
    if (currentIndex.value < photos.value.length - 1) {
      currentIndex.value++
      unlockLoveMessage(currentIndex.value)
    }
  }
  
  function prevPhoto() {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }
  
  function goToPhoto(index: number) {
    currentIndex.value = index
    unlockLoveMessage(index)
  }
  
  function unlockLoveMessage(photoIndex: number) {
    if (photoIndex < loveMessages.value.length && !loveMessages.value[photoIndex].unlocked) {
      loveMessages.value[photoIndex].unlocked = true
    }
  }
  
  function triggerPetals() {
    showPetals.value = true
    setTimeout(() => {
      showPetals.value = false
    }, 8000)
  }
  
  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }
  
  function toggleMusic() {
    musicEnabled.value = !musicEnabled.value
  }
  
  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }
  
  function checkDate(month: number, day: number): boolean {
    inputAttempts.value++
    const isCorrect = month === specialDate.value.month && day === specialDate.value.day
    if (isCorrect) {
      isUnlocked.value = true
      triggerPetals()
    }
    return isCorrect
  }
  
  function unlock() {
    isUnlocked.value = true
  }
  
  function triggerSecretMessage() {
    showSecretMessage.value = true
    setTimeout(() => {
      showSecretMessage.value = false
    }, 5000)
  }
  
  function collectFragment(fragmentId: number) {
    if (!collectedFragments.value.includes(fragmentId)) {
      collectedFragments.value.push(fragmentId)
      
      if (collectedFragments.value.length >= 5) {
        setTimeout(() => {
          showFinalReveal.value = true
          triggerPetals()
        }, 500)
      }
      
      return true
    }
    return false
  }
  
  function closeFinalReveal() {
    showFinalReveal.value = false
  }
  
  return {
    isUnlocked,
    specialDate,
    currentMode,
    currentIndex,
    currentPhoto,
    photos,
    loveMessages,
    currentLoveMessage,
    progress,
    isPlaying,
    showPetals,
    musicEnabled,
    soundEnabled,
    inputAttempts,
    showSecretMessage,
    collectedFragments,
    showFinalReveal,
    setMode,
    nextPhoto,
    prevPhoto,
    goToPhoto,
    unlockLoveMessage,
    triggerPetals,
    togglePlay,
    toggleMusic,
    toggleSound,
    checkDate,
    unlock,
    triggerSecretMessage,
    collectFragment,
    closeFinalReveal
  }
})
