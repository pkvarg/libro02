import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar'
import Link from 'next/link'
import { AdminSearch, StatusToggle } from './AdminUi'
import axios from 'axios'
import { useRouter } from 'next/router'

const UsersPanel = () => {
  const router = useRouter()

  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [showAllUsers, setShowAllUsers] = useState(true)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const [query, setQuery] = useState('')

  const getUsers = async () => {
    const { data } = await axios.get('/api/users')
    setUsers(data)
  }

  const getBooks = async () => {
    const { data } = await axios.get('/api/books')
    setBooks(data)
  }

  const getConversations = async () => {
    const { data } = await axios.get('/api/conversations/actions')
    setConversations(data.conversations)
  }

  const getMessages = async () => {
    const { data } = await axios.get('/api/messages')
    setMessages(data)
  }

  useEffect(() => {
    getUsers()
    getBooks()
    getConversations()
    getMessages()
  }, [])

  const conv = conversations?.filter((conversation) =>
    conversation.userIds.map((id) => id === '64a3e98b5343db0e444ee0fa')
  )

  const msgs = messages.filter(
    (message) => message.senderId === '64a3e98b5343db0e444ee0fa'
  )

  const toggleUserPrivileges = async (
    userId: string,
    privilege: string,
    status: boolean
  ) => {
    const { data } = await axios.patch(`/api/users/${userId}`, {
      privilege,
      status: !status,
    })
    if (data === 'OK') {
      getUsers()
    }
  }

  // Members who used "Zrušiť konto" wait here; GDPR requires deletion within 30 days.
  const permanentlyDelete = async (user: Record<string, any>) => {
    const confirmed = window.confirm(
      `Natrvalo vymazať konto ${user.name} (@${user.username}) so všetkými príspevkami, knihami a konverzáciami? Táto akcia sa nedá vrátiť.`
    )
    if (!confirmed) return
    const { data } = await axios.delete(`/api/users/${user.id}`)
    if (data === 'OK') {
      getUsers()
    }
  }

  const deletionNotice = (user: Record<string, any>) => {
    if (!user.deletionRequestedAt) return null
    const requested = new Date(user.deletionRequestedAt)
    const deadline = new Date(requested.getTime() + 30 * 24 * 60 * 60 * 1000)
    return (
      <div className='mt-2 flex flex-col gap-1 rounded-lg bg-warning-soft p-2.5 text-sm'>
        <p className='font-semibold text-warning'>
          Žiadosť o zrušenie konta {requested.toLocaleDateString('sk-SK')} – vymazať do{' '}
          {deadline.toLocaleDateString('sk-SK')}
        </p>
        <button
          type='button'
          onClick={() => permanentlyDelete(user)}
          className='focus-ring self-start rounded font-semibold text-danger underline'
        >
          Natrvalo vymazať
        </button>
      </div>
    )
  }

  const handleSearch = async (query: string) => {
    setQuery(query)
    if (query === '') {
      setSearchResults([])
      setShowSearchResults(false)
      setShowAllUsers(true)
    } else {
      try {
        const response = await axios.get(`/api/search/users/${encodeURIComponent(query)}`)
        setSearchResults(response.data)
        setShowSearchResults(true)
        setShowAllUsers(false)
      } catch (error) {
        console.error('Error searching:', error)
      }
    }
  }

  const list = showAllUsers ? users : showSearchResults ? searchResults : []

  return (
    <section className='flex flex-col gap-4'>
      <AdminSearch value={query} onChange={handleSearch} />
      <div className='card divide-y divide-line'>
        {list.map((user: Record<string, any>) => (
          <div key={user.id} className='flex flex-col gap-3 p-4 lg:flex-row lg:items-start'>
            <div className='flex min-w-0 flex-1 gap-3'>
              <Avatar userId={user.id} src={user.profileImage ?? null} name={user.name} />
              <div className='min-w-0'>
                <Link
                  href={`/admin/${user.id}`}
                  className='focus-ring block truncate rounded font-semibold text-ink hover:underline'
                  title='Technické údaje užívateľa'
                >
                  {user.name}
                </Link>
                <Link href={`/users/${user.id}`} className='block truncate text-sm text-ink-muted hover:underline'>
                  @{user.username}
                </Link>
                <p className='truncate text-sm text-ink-muted'>{user.email}</p>
                <p className='mt-1 text-xs text-ink-soft'>
                  {books?.filter((book) => user.id === book.userId).length} kníh ·{' '}
                  {messages?.filter((message) => user.id === message.senderId).length} odoslaných správ
                </p>
                {deletionNotice(user)}
              </div>
            </div>
            <div className='flex shrink-0 flex-wrap gap-2'>
              <StatusToggle
                label='Admin'
                on={!!user.isAdmin}
                onClick={() => toggleUserPrivileges(user.id, 'isAdmin', user.isAdmin)}
              />
              <StatusToggle
                label='Aktívny'
                on={!!user.active}
                onClick={() => toggleUserPrivileges(user.id, 'active', user.active)}
              />
            </div>
          </div>
        ))}
        {list.length === 0 && <p className='p-6 text-center text-ink-muted'>Nič sa nenašlo.</p>}
      </div>
    </section>
  )
}

export default UsersPanel
