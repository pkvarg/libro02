import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { signOut } from 'next-auth/react'

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

  // Deletion request (GDPR art. 17): blocks the account now; the admin deletes it within 30 days.
  const deleteAccount = useCallback(async () => {
    const confirmed = window.confirm(
      'Naozaj chcete zrušiť svoje konto? Konto sa hneď zablokuje a skryje a do 30 dní ho natrvalo vymažeme spolu s príspevkami, komentármi, knihami aj konverzáciami.'
    )
    if (!confirmed) return
    try {
      setIsLoading(true)
      await axios.delete('/api/account')
      toast.success('Žiadosť o zrušenie konta sme prijali')
      editModal.onClose()
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      toast.error('Konto sa nepodarilo zrušiť, napíšte na info@librosophia.sk')
    } finally {
      setIsLoading(false)
    }
  }, [editModal])

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
    <div className='flex flex-col gap-2'>
      <div className='w-full p-4 text-white text-center border-2 border-dotted rounded-md border-neutral-700'>
        <h1>Nahjrate profilový obrázok</h1>
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onUpload={handleUploadProfileImage}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
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
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
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
      <button
        type='button'
        onClick={deleteAccount}
        disabled={isLoading}
        className='self-start text-sm text-red-400 underline hover:text-red-300 disabled:opacity-50'
      >
        Zrušiť konto
      </button>
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
