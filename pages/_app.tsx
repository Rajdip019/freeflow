import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import '@/styles/globals.css'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
  )
}

export default MyApp