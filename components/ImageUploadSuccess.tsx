import { template } from '@/helpers/apiTemplateString';
import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useToast } from '@chakra-ui/react';

interface Props {
    imageId: string,
    setUploadingState: React.Dispatch<React.SetStateAction<"error" | "success" | "not-started" | "uploading">>,
    clearFile: () => any,
    mode: 'dark' | 'light'
}

const ImageUploadSuccess: React.FC<Props> = ({ imageId, setUploadingState, clearFile, mode }) => {
    const toast = useToast();

    return (
        <div className=' space-y-6'>
            <div className={`flex items-center text-center justify-center gap-3 mb-6 ${mode === 'dark' ? 'text-white' : 'text-black'} `}>
                <p className=" font-semibold text-2xl">Done! Ready to get feedback?</p>
            </div>
            <div className={`border ${mode === 'dark' ? 'border-white text-white' : 'border-black text-gray-800'} b rounded p-2 clear-left `}>
                {template}/review-image/{imageId}/name
            </div>
            <div className=' flex flex-col items-center mt-5'>
                <CopyToClipboard text={`${template}/review-image/${imageId}/name`}>
                    <button onClick={() => toast({
                        title: 'Link copied to Clipboard!',
                        status: 'success',
                        duration: 3000,
                        isClosable: false,
                        position: "bottom-right",
                    })} className='btn-p py-2 w-fit'>Copy</button>
                </CopyToClipboard>
                <button className=' btn-p mt-5 py-2' onClick={() => { setUploadingState("not-started"), clearFile() }}>Upload Another Design</button>
            </div>
        </div>
    )
}

export default ImageUploadSuccess