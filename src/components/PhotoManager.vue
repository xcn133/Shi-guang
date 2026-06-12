<template>
  <div>
    <button
      @click="showPanel = !showPanel"
      class="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all hover:bg-white/20 active:scale-90"
      title="管理照片"
    >
      <svg class="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>

    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div v-if="showPanel" class="fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-white/10 flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-white/10">
          <h3 class="text-white font-medium">照片管理</h3>
          <button @click="showPanel = false" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-4 border-b border-white/10">
          <label class="block w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium text-center cursor-pointer hover:shadow-lg active:scale-95 transition-all">
            + 添加照片
            <input type="file" accept="image/*" class="hidden" @change="handleUpload" :disabled="uploading" />
          </label>
          <div v-if="uploading" class="mt-2 text-center text-pink-300 text-xs">上传中...</div>
          <div v-if="error" class="mt-2 text-center text-red-400 text-xs">{{ error }}</div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-if="photos.length === 0" class="text-center text-white/40 text-sm py-8">
            还没有照片，点击上方添加
          </div>
          <div v-for="photo in photos" :key="photo.id" class="bg-white/5 rounded-xl overflow-hidden border border-white/10">
            <div class="relative">
              <img :src="photo.url" class="w-full h-32 object-cover" />
              <button
                @click="handleDelete(photo.id)"
                class="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-all"
              >
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div class="p-3">
              <input
                v-model="photo.caption"
                @blur="handleUpdate(photo)"
                placeholder="添加描述..."
                class="w-full bg-transparent text-white text-sm placeholder-white/30 focus:outline-none"
              />
              <div class="flex gap-2 mt-2">
                <input
                  v-model="photo.date"
                  @blur="handleUpdate(photo)"
                  placeholder="日期"
                  class="flex-1 bg-white/5 rounded px-2 py-1 text-white text-xs placeholder-white/30 focus:outline-none"
                />
                <input
                  v-model="photo.location"
                  @blur="handleUpdate(photo)"
                  placeholder="地点"
                  class="flex-1 bg-white/5 rounded px-2 py-1 text-white text-xs placeholder-white/30 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchPhotos, uploadPhoto, updatePhoto, deletePhoto } from '@/api/photos'

const showPanel = ref(false)
const photos = ref<any[]>([])
const uploading = ref(false)
const error = ref('')

async function loadPhotos() {
  try {
    photos.value = await fetchPhotos()
  } catch (e: any) {
    error.value = '加载失败'
  }
}

async function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  error.value = ''
  try {
    const formData = new FormData()
    formData.append('file', file)
    await uploadPhoto(formData)
    await loadPhotos()
  } catch (e: any) {
    error.value = '上传失败'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function handleUpdate(photo: any) {
  try {
    await updatePhoto(photo.id, {
      caption: photo.caption,
      date: photo.date,
      location: photo.location,
    })
  } catch (e: any) {}
}

async function handleDelete(id: number) {
  try {
    await deletePhoto(id)
    await loadPhotos()
  } catch (e: any) {
    error.value = '删除失败'
  }
}

onMounted(loadPhotos)
</script>
