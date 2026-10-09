// Which user fields each kind of response may contain. Other members never get
// e-mails, follow/conversation lists of others or account flags; admins get full records.

export const publicUserSelect = {
  id: true,
  name: true,
  username: true,
  bio: true,
  profileImage: true,
  coverImage: true,
  createdAt: true,
} as const

// A profile page also shows the following count.
export const profileUserSelect = {
  ...publicUserSelect,
  followingIds: true,
} as const

// Chat participants: identity by id, never by e-mail.
export const chatUserSelect = {
  id: true,
  name: true,
  username: true,
  profileImage: true,
  createdAt: true,
} as const

// Hidden (moderated) posts and books are visible only to admins.
export const visibleContent = (isAdmin?: boolean | null) => (isAdmin ? {} : { active: { not: false } })

// What logged-out visitors may see of a book: the book itself, never who lends it or their review.
export const publicBookSelect = {
  id: true,
  bookTitle: true,
  bookAuthor: true,
  bookImage: true,
  bookAvailable: true,
  bookLendingDuration: true,
  active: true,
  createdAt: true,
} as const
