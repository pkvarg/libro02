'use client'

import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { IoClose } from 'react-icons/io5'

interface ModalProps {
  isOpen?: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Transition.Root show={isOpen ? true : false} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div
            className='
              fixed
              inset-0
              bg-ink/40
              transition-opacity
            '
          />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div
            className='
              flex
              min-h-full
              items-center
              justify-center
              p-4
              text-center
              sm:p-0
            '
          >
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel
                className='
                  relative
                  transform
                  overflow-hidden
                  rounded-2xl
                  bg-surface
                  px-5
                  pb-5
                  pt-6
                  text-left
                  shadow-pop
                  transition-all
                  w-full
                  sm:my-8
                  sm:w-full
                  sm:max-w-lg
                  sm:p-6
                '
              >
                <div
                  className='
                    absolute
                    right-0
                    top-0
                    hidden
                    pr-4
                    pt-4
                    sm:block
                    z-10
                  '
                >
                  <button type='button' className='icon-btn' onClick={onClose}>
                    <span className='sr-only'>Zavrieť</span>
                    <IoClose className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
