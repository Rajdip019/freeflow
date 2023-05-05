import { useImageContext } from '@/contexts/ImagesContext'
import { IReviewImageData } from '@/interfaces/ReviewImageData'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useDisclosure, useImage } from '@chakra-ui/react'
import React from 'react'

interface Props{
    image : IReviewImageData
}

const ImageDeleteModalConfirmation: React.FC<Props> = ({image}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { deleteImage } = useImageContext();

    return (
        <div>
            <button onClick={onOpen}>
                <svg
                    fill="currentColor"
                    className=" w-5 hover:text-white text-gray-400 cursor-pointer"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                    />
                </svg>
            </button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bgColor={'gray.800'} color={'white'}>
                    <ModalHeader>Delete Design</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    </ModalBody>
                    <div className='flex justify-center flex-col items-center pb-8'>
                        <h4 className=' text-white text-xl mb-10 text-center'>Are you sure tou want to delete <br /> <span className=' font-semibold'>{image.imageName}{' '}</span>?</h4>
                        <div className=' flex gap-3'>
                            <button onClick={async () => { await deleteImage(image); onClose()}} className=' px-8 rounded-full bg-red-500 text-white py-2 hover:bg-red-600 transition-all'>
                                Delete
                            </button>
                            <button className=' btn-p py-2' onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ImageDeleteModalConfirmation