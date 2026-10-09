import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

import BookCover from '@/components/books/BookCover'
import { AdminSearch, StatusToggle } from './AdminUi'

const BooksPanel = () => {
  const [books, setBooks] = useState([])
  const [showAllBooks, setShowAllBooks] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [query, setQuery] = useState('')

  const getBooks = async () => {
    const { data } = await axios.get('/api/books')
    setBooks(data)
  }

  useEffect(() => {
    getBooks()
  }, [])

  const toggleBookStatus = async (bookId: string, status: boolean) => {
    const { data } = await axios.patch(`/api/books/${bookId}`, {
      status: !status,
    })
    if (data === 'OK') {
      getBooks()
      if (!showAllBooks) handleSearch(query)
    }
  }

  const handleSearch = async (query: string) => {
    setQuery(query)
    if (query === '') {
      setSearchResults([])
      setShowAllBooks(true)
    } else {
      try {
        const response = await axios.get(`/api/search/books/${encodeURIComponent(query)}`)
        setSearchResults(response.data)
        setShowAllBooks(false)
      } catch (error) {
        console.error('Error searching:', error)
      }
    }
  }

  const list = showAllBooks ? books : searchResults

  return (
    <section className="flex flex-col gap-4">
      <AdminSearch value={query} onChange={handleSearch} />
      <div className="card divide-y divide-line">
        {list?.map((book) => (
          <div key={book.id} className="flex gap-4 p-4">
            <BookCover src={book.bookImage} title={book.bookTitle} className="w-14" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Link href={`/books/${book.id}`} className="focus-ring rounded font-display font-semibold text-ink hover:underline">
                {book.bookTitle}
              </Link>
              <p className="text-sm text-ink-muted">{book.bookAuthor}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <StatusToggle label="Aktívny" on={!!book.active} onClick={() => toggleBookStatus(book.id, book.active)} />
                <Link href={`/users/${book.userId}`} className="link text-sm">
                  Na profil majiteľa
                </Link>
              </div>
            </div>
          </div>
        ))}
        {list?.length === 0 && <p className="p-6 text-center text-ink-muted">Nič sa nenašlo.</p>}
      </div>
    </section>
  )
}

export default BooksPanel
