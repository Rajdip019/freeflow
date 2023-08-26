import { Head } from 'next/document';
import { useRouter } from 'next/router';
import React from 'react'
import Navbar from '../LandingPage/Navbar';
import { useUserContext } from '@/contexts/UserContext';

const ErrorFeedback = () => {
    const router = useRouter();
    const { user } = useUserContext();

    return (
        <>
            <Head>
                <title>FreeFlow | Invalid Link</title>
            </Head>
            <div className="flex h-screen flex-col bg-gray-900 ">
                <Navbar />
                <div className="flex flex-col items-center justify-center">
                    <p className=" mt-40 text-4xl text-white">Invalid URL</p>
                    <button
                        onClick={() => {
                            if (user) {
                                router.push("/dashboard");
                            } else {
                                router.push("/");
                            }
                        }}
                        className=" btn-p mt-5 w-fit py-2 text-xl"
                    >
                        Go back
                    </button>
                </div>
            </div>
        </>
    )
}

export default ErrorFeedback