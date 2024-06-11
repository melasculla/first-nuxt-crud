import type { H3Event, EventHandlerRequest } from 'h3'
import jwt from "jsonwebtoken"

export default async (event: H3Event<EventHandlerRequest>, payload: string | object, expiresIn: number, cookieName: string) => {
   const token = jwt.sign(payload, event.context.secret, { expiresIn })
   setCookie(event, cookieName, token, { maxAge: expiresIn, sameSite: 'strict' })
   
   // const session = await useSession(event, { name: 'test', password: token, maxAge: expiresIn, cookie: { httpOnly: false, sameSite: 'strict' } })

   return token
}