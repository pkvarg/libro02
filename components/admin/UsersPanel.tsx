import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar'
import axios from 'axios'

const UsersPanel = () => {
  const [users, setUsers] = useState([])

  const getUsers = async () => {
    const { data } = await axios.get('/api/users')
    setUsers(data)
  }

  useEffect(() => {
    getUsers()
  }, [])

  const toggleUserPrivileges = async (
    userId: string,
    privilege: string,
    status: boolean
  ) => {
    console.log(userId, privilege, status)
    const { data } = await axios.patch(`/api/users/${userId}`, {
      privilege,
      status: !status,
    })
    console.log(data)
    if (data === 'OK') {
      getUsers()
    }
  }

  return (
    <>
      <h1 className='text-center text-[30px] my-8 '>Užívatelia</h1>
      <div className='flex flex-col gap-6 mt-4'>
        {users.map((user: Record<string, any>) => (
          <div key={user.id} className='flex flex-row gap-4'>
            <Avatar userId={user.id} />
            <div className='flex flex-col'>
              <p className='text-white font-semibold text-sm'>{user.name}</p>
              <p className='text-neutral-400 text-sm'>@{user.username}</p>
            </div>
            <div>
              <p
                className={
                  user.isAdmin
                    ? `text-[#00FF00] font-semibold text-sm cursor-pointer`
                    : `text-[#D2042D] font-semibold text-sm cursor-pointer `
                }
                onClick={() =>
                  toggleUserPrivileges(user.id, 'isAdmin', user.isAdmin)
                }
              >
                Admin
              </p>
              <p
                className={
                  user.active
                    ? `text-[#00FF00] font-semibold text-sm cursor-pointer`
                    : `text-[#D2042D] font-semibold text-sm cursor-pointer`
                }
                onClick={() =>
                  toggleUserPrivileges(user.id, 'active', user.active)
                }
              >
                Active
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default UsersPanel
