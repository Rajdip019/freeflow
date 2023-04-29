import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { UserContextProvider } from "@/contexts/UserContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <UserContextProvider>
          <Component {...pageProps} />
          <Analytics />
        </UserContextProvider>
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
