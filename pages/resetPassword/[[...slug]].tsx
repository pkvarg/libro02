import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

const page = () => {
  const router = useRouter()
  const slug = router.query.slug
  const [showModal, setShowModal] = useState<boolean>(false)

  const token = slug?.[0]
  const email = slug?.[1]

  const bearerToken = process.env.NEXT_PUBLIC_VERCEL_TOKEN

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }

  const checkToken = async () => {
    try {
      const data = await axios.post(
        '/api/passwordReset',
        {
          email,
          token,
        },
        config
      )
      console.log('dataCheckTok', data)
      if (data.data === true) {
        setShowModal(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='m-2 text-[#9ca3af]'>
      <h1 className='text-[35px] text-center'>Obnova hesla</h1>
      <button onClick={checkToken} className='cursor-pointer'>
        Klik
      </button>
      {showModal && <h1>Ideme na to!</h1>}
    </div>
  )
}

export default page
