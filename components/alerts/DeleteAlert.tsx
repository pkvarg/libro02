import React from 'react'

interface DeleteAlertProps {
  onDelete: () => void
  onCancel: () => void
}

const DeleteAlert: React.FC<DeleteAlertProps> = ({ onDelete, onCancel }) => {
  const handleDelete = () => {
    onDelete()
  }

  const handleCancel = () => {
    onCancel()
  }
  return (
    <>
      <div
        className='
          justify-center 
          items-center 
          flex 
          overflow-x-hidden 
          overflow-y-auto 
          fixed 
          inset-0 
          z-50 
          outline-none 
          focus:outline-none
          bg-neutral-800
          bg-opacity-70
        '
      >
        <div className='relative w-full lg:w-3/6 my-6 mx-auto lg:max-w-3xl h-full lg:h-auto'>
          {/*content*/}
          <div
            className='
            h-full
            lg:h-auto
            border-0 
            rounded-lg 
            shadow-lg 
            relative 
            flex 
            flex-col 
            w-full 
            bg-black 
            outline-none 
            focus:outline-none
            '
          >
            <div
              className='
              flex 
              
              justify-center
              p-10 
              rounded
              '
            >
              <h3 className='text-3xl font-semibold text-white'>
                Naozaj chcete vymazať príspevok?
              </h3>
            </div>
            <div className='relative px-10 pt-10 py-10 flex flex-row justify-center items-center gap-16'>
              <button
                onClick={handleDelete}
                className='
                  py-4 
                  px-12
                  border-0 
                  text-white 
                  hover:opacity-70
                  transition
                  bg-[#4bb543]
                  rounded-xl
                '
              >
                Áno
              </button>
              <button
                onClick={handleCancel}
                className='
                  py-4 
                  px-12
                  border-0 
                  text-white 
                  hover:opacity-70
                  transition
                  bg-[#ff781f]
                  rounded-xl
                '
              >
                Nie
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteAlert
