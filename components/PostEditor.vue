<template>
   <div class="w-full overflow-hidden">
      <form method="post" @submit.prevent="handleForm" class="grid justify-items-stretch gap-5 w-[86%] mx-auto py-2">
         <div v-show="!creating" class="grid justify-items-center gap-5">
            <div>
               <input
                  class="block w-full max-w-[800px] rounded px-3 py-2 text-xl placeholder:text-orange-600 outline-none ring-offset-black focus:ring-4 ring-offset-4 ring-purple-400 transition-shadow duration-500"
                  type="text" placeholder="Post Title" v-model="post.title" @input="validateTitle" />
               <transition name="error">
                  <div class="text-center overflow-hidden max-h-12" v-if="errors.title">
                     <p class="text-red-600 text-sm mt-4">{{ errors.title }}</p>
                  </div>
               </transition>
            </div>
            <Editor ref="editor" :data="postData?.content" />
            <p class="text-base">Gallery</p>
            <UploadFiles :multiple="true" title="Add Photo" :data="post.gallery" v-model="gallery" ref="_gallery" />
            <div class="w-full border border-black"></div>
            <UploadFiles :multiple="false" title="Add thumbnail" :thumbnail="post.thumbnail" v-model="thumbnail"
               ref="_thumbnail" />
         </div>
         <button
            class="rounded-md bg-black text-white text-base px-4 py-1 hover:bg-white hover:text-blue-800 font-bold transition-all disabled:grayscale-100 disabled:bg-slate-400 disabled:hover:text-black justify-self-center"
            type="submit" :disabled="creating ? true : false">{{ creating ? 'Loading..' : edit ? 'Update Post' :
               'Create Post' }}</button>
      </form>
   </div>
</template>

<script setup lang="ts">
import type { Editor, UploadFiles } from '#components'

const { postData, edit } = defineProps<{
   postData?: Omit<Post, ('isLiked' | 'likes' | 'createdAt')> | null
   edit?: boolean
}>()

const editor = ref<InstanceType<typeof Editor>>()
const post = ref<NewPost>({
   title: '',
   thumbnail: null,
   content: null,
   gallery: []
})

if (postData) {
   post.value = postData
}

const errors = ref({
   title: ''
})

const validateTitle = () => {
   const minTitleLength = 5
   const isTitleLongEnough = post.value.title.length >= minTitleLength

   if (!isTitleLongEnough) {
      errors.value.title = `Title must be at least ${minTitleLength} characters long`
      return
   }

   errors.value.title = ''
   return true
}


const gallery = ref<(Gallery[0] & { file?: File })[]>([])
const uploadGallery = async () => {
   const body = new FormData()
   for (const { file } of gallery.value) {
      if (!file) continue

      body.append('images', file)
   }

   const isRequireUpload = Array.from(body.keys()).length
   if (!isRequireUpload) return

   try {
      const urls = await $fetch('/api/images/upload', {
         method: 'POST',
         body
      })
      replaceBlobUrls(urls)
   } catch (err: any) {
      console.error(err)
   }
}
const replaceBlobUrls = (urls: string[]) => {
   let index = 0
   for (const item of gallery.value) {
      if (!item.file) continue

      item.path = urls[index]
      delete item.file
      index++
   }
}

const thumbnail = ref<(Gallery[0] & { file?: File })[]>([])

const _gallery = ref<InstanceType<typeof UploadFiles> | null>(null)
const _thumbnail = ref<InstanceType<typeof UploadFiles> | null>(null)
const filesToRemove = computed((): string[] => {
   if (!(_gallery.value && _thumbnail.value)) return []

   const galleryRemove = _gallery.value.filesToRemove ?? []
   const thumbnailRemove = _thumbnail.value.filesToRemove ?? []

   return galleryRemove.concat(thumbnailRemove)
})


const router = useRouter()
const creating = ref<boolean>(false)
const handleForm = async (e: Event) => {
   const isTitleValid = validateTitle()
   const isVaildForm = isTitleValid
   if (!isVaildForm) return

   creating.value = true

   if (thumbnail.value.length && thumbnail.value[0].file) {
      const files = new FormData()
      files.append('files', thumbnail.value[0].file)

      try {
         const urls = await $fetch('/api/images/upload', {
            method: 'POST',
            body: files
         })
         post.value.thumbnail = urls[0]
      } catch (error: any) {
         console.warn(error)
      }
   } else {
      post.value.thumbnail = null
   }

   if (filesToRemove.value.length) {
      try {
         await $fetch('/api/images/remove', {
            method: 'DELETE',
            body: filesToRemove.value
         })
      } catch (error: any) {
         console.error(error)
      }
   }

   post.value.content = await editor.value!.save()

   await uploadGallery()
   post.value.gallery = gallery.value

   try {
      if (postData && edit) {
         const id = await $fetch(`/api/posts/${postData.id}`, {
            method: 'PATCH',
            body: post.value
         })
         router.push(`/posts/${id}`)
      } else {
         const { id: postID } = await $fetch('/api/posts/create', {
            method: 'POST',
            body: post.value
         })
         router.push(`/posts/${postID}`)
      }
   } catch (err: any) {
      creating.value = false
      console.warn(err)
   }
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