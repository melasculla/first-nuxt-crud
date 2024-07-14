<template>
   <div class="bg-emerald-400 text-2xl text-red-400 p-4">
      <form @submit.prevent="handleForm"
         class="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-items-center items-center">
         <input disabled class="rounded-3xl px-4 py-2 outline-none focus:ring-4 ring-offset-2 ring-yellow-700 w-full"
            type="text" name="id" v-model="user.id" :placeholder="pending ? `Loading..` : `ID`" />
         <input class="rounded-3xl px-4 py-2 outline-none focus:ring-4 ring-offset-2 ring-yellow-700 w-full" type="text"
            name="name" v-model="user.name" :placeholder="pending ? `Loading..` : `Name`" />
         <div>
            <button type="button" @click="removeUser"
               class="text-black rounded-3xl px-12 py-3 bg-red-600 text-base uppercase hover:bg-white transition-colors disabled:bg-slate-300 disabled:text-slate-500 disabled:grayscale filter">Remove
               User</button>
            <transition name="error">
               <div class="text-center overflow-hidden max-h-12" v-if="removeError">
                  <p class="text-red-600 text-xl mt-4">{{ removeError }}</p>
               </div>
            </transition>
         </div>
         <button :disabled="isOldName ? true : false"
            class="rounded-3xl px-12 py-3 bg-white text-base uppercase hover:bg-black transition-colors disabled:bg-slate-300 disabled:text-slate-500 disabled:grayscale filter"
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

const { data, pending, error } = await useLazyFetch<UserWithoutPassword>(`/api/user/${paramID}`)

const user = ref<UserWithoutPassword>(data.value || {
   id: 0,
   name: '',
   role: 'user'
})

watch(data, (newData: UserWithoutPassword | null) => {
   console.log(newData)
   if (!newData) return
   user.value = newData
})

if (error.value) {
   router.back()
   throw createError({
      statusCode: error.value?.statusCode || 404,
      statusMessage: error.value?.statusMessage || `User ${paramID} not found`
   })
}


const oldName = ref(user.value?.name)
const isOldName = computed(() => {
   return user.value?.name === oldName.value
})

const { user: authUser, logout } = useAuth()


const handleForm = async (e: Event) => {
   if (isOldName.value) return

   try {
      await $fetch(`/api/user/${paramID}`, {
         method: 'PATCH',
         body: {
            name: user.value?.name
         }
      })

      oldName.value = user.value?.name
      if (authUser.value?.id !== paramID) return
      authUser.value = {
         id: authUser.value?.id || 0,
         name: user.value?.name!,
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