import type { H3Event, EventHandlerRequest } from 'h3'
import jwt from "jsonwebtoken"

export default (event: H3Event<EventHandlerRequest>, payload: string | object, expiresIn: number, cookieName: string) => {
   const token = jwt.sign(payload, event.context.secret, { expiresIn })
   setCookie(event, cookieName, token, { maxAge: expiresIn })

   return token
}