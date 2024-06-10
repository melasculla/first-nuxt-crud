<template>
   <div class="bg-emerald-400 p-5 h-5/6 flex items-center justify-center">
      <form method="post" @submit.prevent="handleForm" class="grid justify-center gap-5">
         <div>
            <input
               class="block w-full max-w-[800px] rounded px-3 py-2 text-xl placeholder:text-orange-600 outline-none ring-offset-black focus:ring-4 ring-offset-4 ring-purple-400 transition-shadow duration-500"
               type="text" placeholder="Enter your name" @input="validateName" v-model="name" />
            <transition name="error">
               <div class="text-center overflow-hidden max-h-12" v-if="errors.name">
                  <p class="text-red-600 text-sm mt-4">{{ errors.name }}</p>
               </div>
            </transition>
         </div>
         <div>
            <input
               class="block w-full max-w-[800px] rounded px-3 py-2 text-xl placeholder:text-orange-600 outline-none ring-offset-black focus:ring-4 ring-offset-4 ring-purple-400 transition-shadow duration-500"
               type="password" placeholder="Enter your password" v-model="password" @input="validatePassword" />
            <transition name="error">
               <div class="text-center overflow-hidden max-h-12" v-if="errors.password">
                  <p class="text-red-600 text-sm mt-4">{{
                     errors.password }}</p>
               </div>
            </transition>
         </div>
         <small class="text-center text-white font-bold text-sm tracking-wider px-2">
            Dont have account?
            <NuxtLink class="underline transition-colors duration-600 hover:text-black" to="/signup">Sign Up</NuxtLink>
         </small>
         <button
            class="rounded-md bg-black text-white text-base px-4 py-1 hover:bg-white hover:text-blue-800 font-bold transition-all disabled:grayscale-100 disabled:bg-slate-400 disabled:hover:text-black"
            type="submit" :disabled="(errors.name || errors.password) ? true : false">Log In</button>
      </form>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: [
      async (to, from) => {
         if (useAuth().loggedIn.value) return navigateTo('/')
      }
   ]
})

const { login } = useAuth()
const router = useRouter()
const name = ref<string>('')
const password = ref<string>('')
const errors = ref({
   name: '',
   password: '',
})

const validateName = () => {
   const minNameLength = 2
   const isNameLengthEnough = name.value.length >= minNameLength
   if (!isNameLengthEnough) {
      errors.value.name = `Name must be at least ${minNameLength} characters long`
      return
   }
   errors.value.name = ''
   return true
}

const validatePassword = () => {
   const minPasswordLength = 6
   const isPasswordLengthEnough = password.value.length >= minPasswordLength
   if (!isPasswordLengthEnough) {
      errors.value.password = `Password must be at least ${minPasswordLength} characters long`
      return
   }
   errors.value.password = ''
   return true
}

const handleForm = async (e: Event) => {
   const isFieldsEmpty = validateName() || validatePassword()
   if (e.type !== 'submit' || !isFieldsEmpty) return

   try {
      await login(name.value, password.value)
      router.push('/')
   } catch (error: any) {
      switch (error.statusCode) {
         case 404: errors.value.name = 'User not Found'
            break;
         case 403: errors.value.password = 'Wrong password'
            break;
         default: errors.value.password = 'Something went wrong'
      }
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