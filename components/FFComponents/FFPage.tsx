import { useAuth } from '@/contexts/AuthContext';
import { useUserContext } from '@/contexts/UserContext'
import { Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react'

interface Props {
    isAuthRequired: boolean,
    children: ReactElement
}

const FFPage: React.FC<Props> = ({ children, isAuthRequired }) => {
    const { user } = useUserContext();
    const { authUser } = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter()

    useEffect(() => {
        if (authUser) {
            if (user) {
                setIsLoading(false)
            }
        } else {
            if (isAuthRequired) {
                router.push('/auth/signup');
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        }
    }, [user])

    return (
        <div>
            {isLoading ? (
                <div className=' flex justify-center items-center h-screen bg-black'>
                    <Spinner color='purple' size="lg" />
                </div>
            ) : (
                <>
                    {children}
                </>
            )}
        </div>
    )
}

export default FFPage