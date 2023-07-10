import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const page = () => {
  const router = useRouter()
  const token = router.query
  const [tokenFromLocalStorage, setTokenFromLocalStorage] = useState<
    string | null
  >()
  const [showModal, setShowModal] = useState<boolean>(false)
  const tokenValue = token[':token']

  useEffect(() => {
    setTokenFromLocalStorage(localStorage.getItem('token'))
  }, [tokenFromLocalStorage])

  let parsed: String

  useEffect(() => {
    if (tokenFromLocalStorage) {
      parsed = JSON.parse(tokenFromLocalStorage)
    }
    if (tokenValue === parsed) {
      setShowModal(true)
    }
  }, [tokenFromLocalStorage, showModal])

  return (
    <div className='m-2 text-[#9ca3af]'>
      <h1 className='text-[35px] text-center'>Obnova hesla</h1>
      {showModal && <h1>Ideme na to</h1>}
    </div>
  )
}

export default page
