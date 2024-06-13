<template>
   <div class="bg-emerald-400 p-5 h-5/6 flex items-center justify-center">
      <form method="post" @submit.prevent="handleForm" class="grid justify-center justify-items-center gap-5">
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
         <div>
            <textarea
               class="block w-full max-w-[800px] rounded px-3 py-2 text-xl placeholder:text-orange-600 outline-none ring-offset-black focus:ring-4 ring-offset-4 ring-purple-400 transition-shadow duration-500"
               type="password" placeholder="Post Content" v-model="post.content" @input="validateContent" />
            <transition name="error">
               <div class="text-center overflow-hidden max-h-12" v-if="errors.content">
                  <p class="text-red-600 text-sm mt-4">{{
                     errors.content }}</p>
               </div>
            </transition>
         </div>
         <UploadFiles :multiple="false" title="Add thumbnail" @imagesAdded="handleImage" />
         <button
            class="rounded-md bg-black text-white text-base px-4 py-1 hover:bg-white hover:text-blue-800 font-bold transition-all disabled:grayscale-100 disabled:bg-slate-400 disabled:hover:text-black"
            type="submit" :disabled="creating ? true : false">{{ creating ? 'Loading..' : 'Create Post' }}</button>
      </form>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: ['auth-require']
})

const post = ref<NewPost>({
   title: '',
   content: '',
   thumbnail: ''
})
const errors = ref({
   title: '',
   content: ''
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

const validateContent = () => {
   const maxContentLength = 500
   const isContentEmpty = !post.value.content?.length
   const isContentSoLong = post.value.content?.length! >= maxContentLength

   if (isContentSoLong) {
      errors.value.content = `Content cannot be greater than ${maxContentLength} characters long`
      return
   }
   if (isContentEmpty) {
      errors.value.content = `Content cannot be empty`
      return
   }

   errors.value.content = ''
   return true
}

const thumbnail = ref<FileList>()
const handleImage = (files: FileList) => { thumbnail.value = files }

const router = useRouter()
const creating = ref<boolean>(false)
const handleForm = async (e: Event) => {
   const isTitleValid = validateTitle()
   const isContentVaild = validateContent()
   const isVaildForm = isTitleValid && isContentVaild
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
         post.value.thumbnail = data[0]
      } catch (error: any) {
         console.warn(error)
      }
   }

   try {
      const data = await $fetch('/api/posts/create', {
         method: 'POST',
         body: post.value
      })

      router.push('/posts')
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