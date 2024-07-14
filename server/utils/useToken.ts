import type { H3Event, EventHandlerRequest } from 'h3'
import type { SignOptions } from "jsonwebtoken"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

type UserSession = UserWithoutPassword & {
   salt?: string,
   iat?: string,
   exp?: string
}

const config = useRuntimeConfig()
const accessExpires = 60 * 10        // 10 mins
const refreshExpires = 60 * 60 * 3   // 3 hour

export const createAccessToken = async (event: H3Event<EventHandlerRequest>, payload: UserSession) => {
   const token = jwt.sign(payload, config.accessJwtSecret, { expiresIn: accessExpires })
   setCookie(event, 'auth', token, { maxAge: accessExpires, sameSite: 'strict' })

   return true
}

export const verifyAccessToken = async (event: H3Event<EventHandlerRequest>, token: string) => {
   try {
      const { salt, ...user } = jwt.verify(token, config.accessJwtSecret) as UserSession
      setUser(event, user)
      return true
   } catch (err: any) {
      await removeUser(event, err)
   }

   return false
}

export const createRefreshToken = async (event: H3Event<EventHandlerRequest>, payload: UserSession) => {
   payload.salt = await bcrypt.genSalt(20);

   const options = payload.exp ? undefined : { expiresIn: refreshExpires } as SignOptions
   const token = jwt.sign(payload, config.refreshJwtSecret, options)

   const now = Math.ceil(new Date().getTime() / 1000) // in seconds
   const remainExparationTime = payload.exp ?
      parseInt(payload.exp!) - now :
      refreshExpires

   try {
      await useStorage('redis:tokens').setItem(payload.id.toString(), token, { ttl: remainExparationTime })
      setCookie(event, 'refresh', token, { maxAge: remainExparationTime, sameSite: 'strict' }) // httpOnly: true

      return true
   } catch (err: any) {
      console.warn('Redis Storage Refresh: ' + err)
   }

   return false
}

export const verifyRefreshToken = async (event: H3Event<EventHandlerRequest>, cookieToken: string | undefined) => {
   if (!cookieToken) return false

   let userID: number | undefined = undefined
   try {
      const { salt, id, ...user } = jwt.decode(cookieToken) as UserSession
      userID = id
   } catch (err: any) {
      await removeUser(event, err)
      return false
   }

   const isStoredTokenExists = await useStorage('redis:tokens').hasItem(userID.toString())
   if (!isStoredTokenExists) {
      await removeUser(event, undefined, `Token Not Found on Server (UserID: ${userID})`)
      return false
   }

   const storedToken = await useStorage('redis:tokens').getItem(userID.toString()) as string
   const isTokenVaild = storedToken === cookieToken
   if (!isTokenVaild) {
      await removeUser(event, undefined, `Token Not Vaild (UserID: ${userID})`)
      return false
   }

   try {
      const { salt, ...user } = jwt.verify(cookieToken, config.refreshJwtSecret) as UserSession
      const { iat, exp, ...accessUser } = user
      setUser(event, accessUser)
      await createAccessToken(event, accessUser)
      await createRefreshToken(event, user)
      return true
   } catch (err: any) {
      await removeUser(event, err)
   }

   return false
}

/**
 * Setting up User in context
*/
const setUser = (event: H3Event<EventHandlerRequest>, user: UserSession) => {
   const { iat, exp, salt, ...contextUser } = user
   event.context.user = contextUser
   event.context.loggedIn = true
}

/**
 * Removing User from context
*/
const removeUser = async (event: H3Event<EventHandlerRequest>, error?: any, message?: string) => {
   if (!event.path.includes('api')) console.warn(`JWT error: `, message || error.message)
   event.context.user = null
   event.context.loggedIn = false
   deleteCookie(event, 'auth')
   deleteCookie(event, 'refresh')
}