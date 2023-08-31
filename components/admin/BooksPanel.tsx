import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { BsSearch } from 'react-icons/bs'
import axios from 'axios'

const BooksPanel = () => {
  const [books, setBooks] = useState([])
  const router = useRouter()
  const [showAllBooks, setShowAllBooks] = useState(true)
  const [showSearchResults, setShowSearchResults] = useState(false)
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
    }
  }

  const handleSearch = async (query) => {
    if (query === '') {
      setSearchResults([])
      setShowAllBooks(true)
      setShowSearchResults(false)
    } else {
      try {
        const response = await axios.get(`/api/search/books/${query}`)
        setSearchResults(response.data)
        setShowSearchResults(true)
        setShowAllBooks(false)
      } catch (error) {
        console.error('Error searching:', error)
      }
    }
  }

  return (
    <>
      <h1 className='text-center text-[30px] my-8 '>Knihy</h1>
      <div className='flex flex-row gap-2 justify-center items-center '>
        <input
          type='text'
          placeholder='Hľadať...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={() => handleSearch(query)}
          className='rounded-xl text-[#000000] pl-2'
        />
        <BsSearch
          className='cursor-pointer'
          onClick={() => handleSearch(query)}
        />
      </div>

      {showAllBooks && (
        <div className='mx-4 mt-8'>
          {books?.map((book) => (
            <div key={book.id} className='flex flex-row gap-2'>
              <img
                className='w-[30%] lg:w-[15%]'
                src={book.bookImage}
                alt={book.bookTitle}
              />
              <div className='flex flex-col text-[18.5px]'>
                <p>{book.bookTitle}</p>
                <p>{book.bookAuthor}</p>
                <p
                  onClick={() => router.push(`/users/${book.userId}`)}
                  className='cursor-pointer text-[#FFAC1C]'
                >
                  Na profil majiteľa
                </p>
                <p
                  className={
                    book.active
                      ? `text-[#00FF00] cursor-pointer`
                      : `text-[#D2042D] cursor-pointer `
                  }
                  onClick={() => toggleBookStatus(book.id, book.active)}
                >
                  Aktívny
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {showSearchResults && (
        <div className='mx-4 mt-8'>
          {searchResults?.map((book) => (
            <div key={book.id} className='flex flex-row gap-2'>
              <img
                className='w-[15%]'
                src={book.bookImage}
                alt={book.bookTitle}
              />
              <div className='flex flex-col text-[18.5px]'>
                <p>{book.bookTitle}</p>
                <p>{book.bookAuthor}</p>
                <p
                  onClick={() => router.push(`/users/${book.userId}`)}
                  className='cursor-pointer text-[#FFAC1C]'
                >
                  Na profil majiteľa
                </p>
                <p
                  className={
                    book.active
                      ? `text-[#00FF00] cursor-pointer`
                      : `text-[#D2042D] cursor-pointer `
                  }
                  onClick={() => toggleBookStatus(book.id, book.active)}
                >
                  Aktívny
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default BooksPanel
