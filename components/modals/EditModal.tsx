import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import useCurrentUser from '@/hooks/useCurrentUser'
import useEditModal from '@/hooks/useEditModal'
import useUser from '@/hooks/useUser'

import Input from '../Input'
import Modal from '../Modal'
import ImageUpload from '../ImageUpload'
import { HiPhoto } from 'react-icons/hi2'

import { CldUploadButton } from 'next-cloudinary'

const EditModal = () => {
  const { data: currentUser } = useCurrentUser()
  const { mutate: mutateFetchedUser } = useUser(currentUser?.id)
  const editModal = useEditModal()

  const [profileImage, setProfileImage] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    setProfileImage(currentUser?.profileImage)
    setCoverImage(currentUser?.coverImage)
    setName(currentUser?.name)
    setUsername(currentUser?.username)
    setBio(currentUser?.bio)
  }, [
    currentUser?.name,
    currentUser?.username,
    currentUser?.bio,
    currentUser?.profileImage,
    currentUser?.coverImage,
  ])

  const [isLoading, setIsLoading] = useState(false)

  const handleUploadProfileImage = (result: any) => {
    setProfileImage(result.info.secure_url)
  }
  const handleUploadCoverImage = (result: any) => {
    setCoverImage(result.info.secure_url)
  }

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true)

      await axios.patch('/api/edit', {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      })
      mutateFetchedUser()

      toast.success('Aktualizované')

      editModal.onClose()
    } catch (error) {
      toast.error('Nastala chyba')
    } finally {
      setIsLoading(false)
    }
  }, [
    editModal,
    name,
    username,
    bio,
    mutateFetchedUser,
    profileImage,
    coverImage,
  ])

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <div className='w-full p-4 text-white text-center border-2 border-dotted rounded-md border-neutral-700'>
        <h1>Nahjrate profilový obrázok</h1>
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onUpload={handleUploadProfileImage}
          uploadPreset='ug3mdafi'
        ></CldUploadButton>
        <img src={profileImage} height='100' width='100' alt='Uploaded image' />
      </div>
      {/* <ImageUpload
        value={profileImage}
        disabled={isLoading}
        onChange={(image) => setProfileImage(image)}
        label='Najhrajte profilový obrázok'
      /> */}

      <div className='w-full p-4 text-white text-center border-2 border-dotted rounded-md border-neutral-700'>
        <h1>Nahjrate pozadie</h1>
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onUpload={handleUploadCoverImage}
          uploadPreset='ug3mdafi'
        ></CldUploadButton>
        <img src={coverImage} height='100' width='100' alt='Uploaded image' />
      </div>
      {/* <ImageUpload
        value={coverImage}
        disabled={isLoading}
        onChange={(image) => setCoverImage(image)}
        label='Nahrajte pozadie'
      /> */}
      <Input
        placeholder='Meno'
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isLoading}
      />
      <Input
        placeholder='Užívateľské meno'
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={isLoading}
      />
      <Input
        placeholder='O Vás'
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        disabled={isLoading}
      />
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title='Upravte svoj profil'
      actionLabel='Uložiť'
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  )
}

export default EditModal
