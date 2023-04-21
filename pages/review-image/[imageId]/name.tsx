import { IReviewImageData } from '@/interfaces/ReviewImageData';
import { db } from '@/lib/firebaseConfig';
import { Input } from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const Name = () => {
    const router = useRouter();
    const { imageId } = router.query;
    const [imageData, setImageData] = useState<IReviewImageData>();
    const [uname, setUname] = useState<string>();
    const [error, setError] = useState<boolean>(false);

    const getImageDetails = async () => {
        const docRef = doc(db, "reviewImages", imageId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setImageData(docSnap.data() as IReviewImageData)
        } else {
            setError(true)
            console.log("No such document!");
        }
    }

    useEffect(() => {
        if (router.isReady) {
            getImageDetails();
        }
    }, [])

    return (
        <>
            {error ? (
                <div className=' flex justify-center flex-col items-center h-screen w-screen text-4xl bg-gray-900" '>
                    <p>Invalid URL</p>
                    <button onClick={() => router.push('/')} className=' btn-p py-2 mt-5'>Go back</button>
                </div>
            ) : (
                <div className=" flex justify-center items-center h-screen text-black bg-gray-900">
                    <div className="w-96 bg-white rounded-2xl p-10 ">
                        <div className=" text-center mb-6">
                            <p className=" font-semibold text-xl">You are invited to review</p>
                            <p className=" font-semibold text-2xl">{imageData?.imageName}</p>
                        </div>
                        <p className=' text-sm text-gray-700 mb-2'>What should we call you?</p>
                        <Input value={uname} onChange={(e) => setUname(e.target.value)} type='text' placeholder='Enter a name' />
                        <div className=' flex flex-col gap-2 items-center mt-5'>
                            <button disabled={!!!uname} onClick={() => router.push(`/review-image/${imageId}?uname=${uname}`)} className='btn-p py-2'>Review Image</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Name