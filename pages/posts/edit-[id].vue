<template>
   <div class="bg-emerald-400 p-5 h-5/6 flex items-center justify-center">
      <form method="post" @submit.prevent="handleForm" class="w-11/12 grid justify-items-center gap-5" v-if="!pending">
         <div>
            <input
               class="block w-full max-w-[800px] rounded px-3 py-2 text-xl placeholder:text-orange-600 outline-none ring-offset-black focus:ring-4 ring-offset-4 ring-purple-400 transition-shadow duration-500"
               type="text" placeholder="Post Title" v-model="post!.title" @input="validateTitle" />
            <transition name="error">
               <div class="text-center overflow-hidden max-h-12" v-if="errors.title">
                  <p class="text-red-600 text-sm mt-4">{{ errors.title }}</p>
               </div>
            </transition>
         </div>
         <Editor ref="editor" :data="post!.content" />
         <UploadFiles v-if="!post?.thumbnail" :multiple="false" title="Add thumbnail" @imagesAdded="handleImage" />
         <div v-else class="grid justify-items-center items-end gap-2">
            <div class="w-full flex justify-between">
               {{ thumbnailName }}
               <button type="button" class="text-red-600 justify-self-end" @click="removeThumbnail">
                  <svg class="size-8" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="7 7 10 10">
                     <path fill="currentColor"
                        d="m8.054 16.673l-.727-.727L11.273 12L7.327 8.079l.727-.727L12 11.298l3.921-3.946l.727.727L12.702 12l3.946 3.946l-.727.727L12 12.727z" />
                  </svg>
               </button>
            </div>
            <img :src="post.thumbnail" />
         </div>
         <button
            class="rounded-md bg-black text-white text-base px-4 py-1 hover:bg-white hover:text-blue-800 font-bold transition-all disabled:grayscale-100 disabled:bg-slate-400 disabled:hover:text-black"
            type="submit" :disabled="creating ? true : false">{{ creating ? 'Loading..' : 'Update Post' }}</button>
      </form>
      <div v-else class="text-center font-bold text-3xl">
         <p>Loading...</p>
      </div>
   </div>
</template>

<script setup lang="ts">
import type { Editor } from '#components'

definePageMeta({
   middleware: ['auth-require']
})
const router = useRouter()
const { id } = useRoute().params
const { data: post, error, pending } = await useLazyFetch<Post>(`/api/posts/${id}`)

if (error.value)
   throw createError({ statusCode: error.value.statusCode, statusMessage: error.value.statusMessage })

const editor = ref<InstanceType<typeof Editor>>()
const errors = ref({
   title: ''
})

const validateTitle = () => {
   const minTitleLength = 5
   const isTitleLongEnough = post.value!.title.length >= minTitleLength

   if (!isTitleLongEnough) {
      errors.value.title = `Title must be at least ${minTitleLength} characters long`
      return
   }

   errors.value.title = ''
   return true
}

const thumbnailName = computed(() => {
   return new URL(post.value?.thumbnail!).pathname.replace('/images/', '')
})
const thumbnail = ref<FileList>()
const handleImage = (files: FileList) => { thumbnail.value = files }

const removeThumbnail = async () => {
   post.value!.thumbnail = ''
}

const creating = ref<boolean>(false)
const handleForm = async (e: Event) => {
   const isTitleValid = validateTitle()
   const isVaildForm = isTitleValid
   if (!isVaildForm) return

   creating.value = true

   if (thumbnail.value?.length) {
      const files = new FormData()
      files.append('files', thumbnail.value[0])

      try {
         const data = await $fetch('/api/images/upload', {
            method: 'POST',
            body: files
         })
         post.value!.thumbnail = data[0]
      } catch (error: any) {
         console.warn(error)
      }
   }

   post.value!.content = await editor.value!.save()

   try {
      console.log(post.value)
      // const data = await $fetch(`/api/posts/edit-${id}`, {
      //    method: 'PATCH',
      //    body: post.value
      // })

      // router.push('/posts')
   } catch (err: any) {
      console.warn(err)
   }

   creating.value = false
}
</script>

<style scoped>
.error-enter-active,
.error-leave-active {
   transition: all 0.4s;
}

.error-enter-from,
.error-leave-to {
   max-height: 0;
}
</style>