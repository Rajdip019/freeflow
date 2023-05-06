import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { UserContextProvider } from "@/contexts/UserContext";
import { ImageContextProvider } from "@/contexts/ImagesContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <UserContextProvider>
          <ImageContextProvider>
            <Component {...pageProps} />
            <Analytics />
          </ImageContextProvider>
        </UserContextProvider>
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
