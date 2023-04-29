import { useAuth } from '@/contexts/AuthContext'
import { Tooltip } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const SignUp = () => {

    const { signUpWithGoogle } = useAuth();

    const router = useRouter();

    const handleSignupWithGoogle = async () => {
      try {
        await signUpWithGoogle();
        router.push('/');
      } catch (err: any) {
        console.log(err);
      }
    };

    return (
        <div className=' flex h-screen text-white bg-gradient-to-t from-[#7834bb] to-black items-center '>
            <div className=' absolute left-5 top-5'>
                <Link href={"/"}>
                <img src="/freeflow.png" alt="" className=' w-32' />
                </Link>
            </div>
            <div className=' flex flex-col justify-center items-center md:w-6/12 w-full gap-5'>
                <h2 className=' font-sec text-4xl font-bold mb-5'>Login /Sign Up</h2>
                <div className=' md:w-6/12 flex flex-col gap-4'>
                    <button onClick={handleSignupWithGoogle} className=' flex justify-center gap-3 items-center btn-sec'><img src="/icons/Google.png" alt="" className=' w-5' /> Login with Google</button>
                    <Tooltip label="Coming soon...">
                        <button className=' cursor-not-allowed flex justify-center gap-3  items-center btn-sec'><img src="/icons/FaceBook.png" alt="" className=' w-6' />Login with Facebook</button>
                    </Tooltip>
                    <Tooltip label="Coming soon...">
                        <button className=' cursor-not-allowed flex justify-center gap-3 items-center btn-sec'><img src="/icons/Apple.png" alt="" className=' w-6' />Login with Apple</button>
                    </Tooltip>
                </div>
            </div>
            <div className=' w-6/12 bg-black h-screen items-center hidden md:flex'>
                <img src="/login.png" alt="" />
            </div>
            <div className=' absolute bottom-5 left-10'>
                <p className=' text-xs opacity-70'> © 2023 Freeflow. All rights reserved.</p>
            </div>
        </div>
    )
}

export default SignUp