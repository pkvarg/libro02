import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const page = () => {
  const router = useRouter()
  const token = router.query
  const [tokenFromLocalStorage, setTokenFromLocalStorage] = useState<
    string | null
  >()
  let sentToken

  console.log(token)
  useEffect(() => {
    sentToken = localStorage.getItem('token')
    setTokenFromLocalStorage(sentToken)
    console.log(tokenFromLocalStorage)
  }, [tokenFromLocalStorage])

  // Access the URL parameters
  return (
    <div>
      <h1>Reset Password</h1>
    </div>
  )
}

export default page
