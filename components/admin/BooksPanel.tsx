import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

const BooksPanel = ({ showBooks }) => {
  const [books, setBooks] = useState([])
  const router = useRouter()

  const getBooks = async () => {
    const { data } = await axios.get('/api/books')
    setBooks(data)
  }

  useEffect(() => {
    getBooks()
  }, [])

  return (
    showBooks && (
      <>
        <h1 className='text-center text-[30px] my-8 '>Knihy</h1>
        <div className='mx-4'>
          {books?.map((book) => (
            <div key={book.id} className='flex flex-row gap-2'>
              <img
                className='w-[15%]'
                src={book.bookImage}
                alt={book.bookTitle}
              />
              <div className='flex flex-col text-[25px]'>
                <p>{book.bookTitle}</p>
                <p
                  onClick={() => router.push(`/users/${book.userId}`)}
                  className='cursor-pointer text-[#FFAC1C]'
                >
                  Na profil majiteľa
                </p>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  )
}

export default BooksPanel
