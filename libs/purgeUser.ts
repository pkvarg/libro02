import prisma from '@/libs/prismadb'

/**
 * Permanently deletes a member and their data (GDPR art. 17). Posts, comments, books,
 * own messages and own notifications go with the user record (onDelete: Cascade);
 * this also removes the traces kept in other members' records. Admin-only, see
 * /api/users/[userId] DELETE.
 */
export default async function purgeUser(userId: string) {
  // One-to-one conversations are deleted with their messages; in group chats
  // the member is only removed.
  const conversations = await prisma.conversation.findMany({ where: { userIds: { has: userId } } })
  for (const conversation of conversations) {
    const others = conversation.userIds.filter((id) => id !== userId)
    if (conversation.isGroup && others.length > 1) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { userIds: others },
      })
    } else {
      await prisma.message.deleteMany({ where: { conversationId: conversation.id } })
      await prisma.conversation.delete({ where: { id: conversation.id } })
      for (const otherId of others) {
        const other = await prisma.user.findUnique({ where: { id: otherId } })
        if (other) {
          await prisma.user.update({
            where: { id: otherId },
            data: { conversationIds: other.conversationIds.filter((id) => id !== conversation.id) },
          })
        }
      }
    }
  }

  // Follows, likes and notifications that other members hold about this user.
  const followers = await prisma.user.findMany({ where: { followingIds: { has: userId } } })
  for (const follower of followers) {
    await prisma.user.update({
      where: { id: follower.id },
      data: { followingIds: follower.followingIds.filter((id) => id !== userId) },
    })
  }
  const likedPosts = await prisma.post.findMany({ where: { likedIds: { has: userId } } })
  for (const post of likedPosts) {
    await prisma.post.update({
      where: { id: post.id },
      data: { likedIds: post.likedIds.filter((id) => id !== userId) },
    })
  }
  await prisma.notification.deleteMany({ where: { liker: userId } })
  await prisma.followingNotification.deleteMany({ where: { follower: userId } })

  await prisma.user.delete({ where: { id: userId } })
}
