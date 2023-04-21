import { template } from '@/helpers/apiTemplateString';
import { useRouter } from 'next/router'
import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useToast } from '@chakra-ui/react';

const Success = () => {
    const router = useRouter();

    const { query } = router;
    const { ref } = query;
    const toast = useToast();

    return (
        <div className=" flex justify-center items-center h-screen text-black bg-gray-900">
            <div className="w-96 bg-white rounded-2xl p-10 ">
                <div className=" flex items-center text-center justify-center gap-3 mb-6">
                    <p className=" font-semibold text-2xl">Done! Ready to get feedback?</p>
                </div>
                <div className=' border rounded p-2'>
                    {template}/review-image/{ref}/name
                </div>
                <div className=' flex flex-col gap-2 items-center mt-5'>
                    <CopyToClipboard text={`${template}/review-image/${ref}/name`}>
                        <button onClick={() => toast({
                            title: 'Link copied to Clipboard!',
                            status: 'success',
                            duration: 3000,
                            isClosable: false,
                            position: "bottom-right",
                        })} className='btn-p py-2 w-fit'>Copy</button>
                    </CopyToClipboard>
                    <button onClick={() =>  router.push('/upload-image')} className='btn-p py-2'>Upload another Image</button>
                </div>
            </div>
        </div>
    )
}

export default Success