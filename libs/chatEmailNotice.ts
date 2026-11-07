import prisma from '@/libs/prismadb'
import { callHono } from '@/libs/honoApi'
import siteUrl from '@/libs/siteUrl'

const INTERVAL_MS = 60 * 60 * 1000

/**
 * Tells the other participants by e-mail that they have a new chat message: at most one
 * e-mail per conversation and member per hour, never the message text, and only for
 * active members who did not turn it off (Upraviť profil).
 */
export default async function notifyChatRecipients(
  conversationId: string,
  sender: { id: string; name: string },
  requestOrigin?: string
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { userIds: true, emailNotifiedAt: true },
  })
  if (!conversation) return

  const notified = { ...((conversation.emailNotifiedAt as Record<string, string> | null) || {}) }
  const now = Date.now()

  const recipients = await prisma.user.findMany({
    where: { id: { in: conversation.userIds.filter((id) => id !== sender.id) } },
    select: {
      id: true,
      name: true,
      email: true,
      active: true,
      isRegistered: true,
      deletionRequestedAt: true,
      chatEmailNotifications: true,
    },
  })

  const due = recipients.filter(
    (user) =>
      user.chatEmailNotifications !== false &&
      user.isRegistered &&
      user.active !== false &&
      !user.deletionRequestedAt &&
      !(notified[user.id] && now - Date.parse(notified[user.id]) < INTERVAL_MS)
  )
  if (due.length === 0) return

  // Recorded before sending, so messages sent in quick succession do not each send an e-mail.
  for (const user of due) notified[user.id] = new Date(now).toISOString()
  await prisma.conversation.update({ where: { id: conversationId }, data: { emailNotifiedAt: notified } })

  const base = siteUrl(requestOrigin)
  const results = await Promise.allSettled(
    due.map((user) =>
      callHono('chat-message', {
        name: user.name,
        email: user.email,
        senderName: sender.name,
        chatUrl: `${base}/conversations/${conversationId}`,
        origin: 'LIBROSOPHIA',
      })
    )
  )
  results.forEach((result) => {
    if (result.status === 'rejected') console.log('chat e-mail failed', result.reason?.message)
  })
}
