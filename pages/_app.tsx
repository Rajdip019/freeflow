import { ChakraProvider } from "@chakra-ui/react";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { UserContextProvider } from "@/contexts/UserContext";
import { ImageContextProvider } from "@/contexts/ImagesContext";
import Script from "next/script";
import { IS_PRODUCTION } from "@/helpers/constants";
``;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_FIREBASE_MEASURMENT_ID}`}
      />
      <Script strategy="lazyOnload">
        {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      
      gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASURMENT_ID}');
      `}
      </Script>

      {IS_PRODUCTION && (
        <>
          <Script
            strategy="lazyOnload"
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_MEASURMENT_ID}`}
          />
          <Script strategy="lazyOnload">
            {`
      window.dataLayer = window.dataLayer || []; 
      function gtag(){dataLayer.push(arguments);} 
      gtag('js', new Date()); 
      
      gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_MEASURMENT_ID}');');
      `}
          </Script>
          <Script strategy="lazyOnload">
            {`
        gtag('event', 'conversion', {'send_to': '${process.env.NEXT_PUBLIC_GOOGLE_ADS_MEASURMENT_ID}/3LELCM2h3JwYEMTB65sD'});
      `}
          </Script>
        </>
      )}

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
    </>
  );
}

export default MyApp;
