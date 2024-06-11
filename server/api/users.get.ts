export default defineEventHandler(async (event) => {
  const cachedKeys = await useStorage('users').getKeys()
  let cachedUsers: Omit<User, 'password'>[] = []

  if (cachedKeys.length) {
    for (const user of cachedKeys) {
      const cachedUser = await useStorage('users').getItem(user) as Omit<User, 'password'>
      cachedUsers.push(cachedUser)
    }
    console.log('cached users')
    return cachedUsers
  }

  const users = await userModel().getUsers()
  for (const user of users) {
    useStorage('users').setItem(user.id.toString()+'.json', user)
  }
  return users;
});