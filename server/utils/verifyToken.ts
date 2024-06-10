import type { H3Event, EventHandlerRequest } from 'h3'
import jwt from "jsonwebtoken"

export default async (event: H3Event<EventHandlerRequest>, token: string, refresh: boolean = false) => {
   try {
      if (refresh) {
         const { id: jwtID } = jwt.verify(token, event.context.secret) as User
         const { id, name, role } = await userModel().getUser(jwtID);
         event.context.user = { id, name, role }
      } else {
         const { id, name, role } = jwt.verify(token, event.context.secret) as User
         event.context.user = { id, name, role }
      }
      event.context.loggedIn = true
      return true
   } catch (error: any) {
      console.warn(`JWT error: `, error.message)
      event.context.user = null
      event.context.loggedIn = false
      deleteCookie(event, 'auth');
      deleteCookie(event, 'refresh');
   }

   return false
}