<template>
   <div class="bg-emerald-400 text-5xl text-red-400 p-4">
      <form @submit.prevent="handleForm" class="grid grid-cols-2 gap-5 justify-items-center items-center">
         <input disabled class="rounded-3xl px-4 py-2 outline-none focus:ring-4 ring-offset-2 ring-yellow-700 w-full"
            type="text" name="id" v-model="id" placeholder="ID" />
         <input class="rounded-3xl px-4 py-2 outline-none focus:ring-4 ring-offset-2 ring-yellow-700 w-full" type="text"
            name="name" v-model="name" placeholder="Name" />
         <div>
            <button type="button" @click="removeUser"
               class="text-black rounded-3xl px-12 py-3 bg-red-600 text-2xl uppercase hover:bg-white transition-colors disabled:bg-slate-300 disabled:text-slate-500 disabled:grayscale filter">Remove
               User</button>
            <transition name="error">
               <div class="text-center overflow-hidden max-h-12" v-if="removeError">
                  <p class="text-red-600 text-xl mt-4">{{ removeError }}</p>
               </div>
            </transition>
         </div>
         <button :disabled="isOldName ? true : false"
            class="rounded-3xl px-12 py-3 bg-white text-2xl uppercase hover:bg-black transition-colors disabled:bg-slate-300 disabled:text-slate-500 disabled:grayscale filter"
            type="submit">{{ isOldName ? 'Change name' : 'Update User' }}</button>
      </form>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: ['auth-require']
})

const route = useRoute()
const router = useRouter()
const paramID = parseInt(route.params.id as string)

const { data: user, error } = await useFetch<User>(`/api/user/${paramID}`)
if (!user.value || error.value) {
   router.back()
   throw createError({
      statusCode: error.value?.statusCode || 404,
      statusMessage: error.value?.statusMessage || `User ${paramID} not found`
   })
}

const id = ref(`ID: ${user.value?.id}`)
const name = ref(user.value?.name)
const oldName = ref(user.value?.name)
const isOldName = computed(() => {
   return name.value === oldName.value
})

const { user: authUser, logout } = useAuth()


const handleForm = async (e: Event) => {
   if (isOldName.value) return

   try {
      await $fetch(`/api/user/${paramID}`, {
         method: 'PATCH',
         body: {
            name: name.value
         }
      })

      oldName.value = name.value
      if (authUser.value?.id !== paramID) return
      authUser.value = {
         id: authUser.value?.id || 0,
         name: name.value,
         password: '',
         role: authUser.value?.role || 'user'
      }
   } catch (error: any) {
      console.warn(error)
   }
}


const removeError = ref<string>()
const removeUser = async ({ target }: Event) => {
   try {
      await $fetch(`/api/user/${paramID}`, {
         method: 'DELETE'
      })

      await logout()
      router.push('/')
   } catch (error: any) {
      let element = target as Element

      if (element)
         element.setAttribute('disabled', 'true')

      if (error.statusCode === 403)
         return removeError.value = 'Cannot remove other users'

      console.warn(error.value)
      return
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