export const currentLikes = async (userID: number, postID?: number): Promise<User['likedPosts'] | boolean> => {
   if (postID) {
      const isLiked = await userModel().getUserLike(userID, postID)
      return isLiked ? true : false
   }

   return await userModel().getUserLikes(userID)
}