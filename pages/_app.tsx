import { ChakraProvider } from "@chakra-ui/react";
import "@pqina/pintura/pintura.css";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { UserContextProvider } from "@/contexts/UserContext";
import { ImageContextProvider } from "@/contexts/ImagesContext";
import Script from "next/script";
import { IS_PRODUCTION } from "@/utils/constants";
import { ConfigProvider } from "antd";
import customTheme from "@/theme/themeConfig";
import { TaskContextProvider } from "@/contexts/TaskContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { WorkspaceContextProvider } from "@/contexts/WorkspaceContext";

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
      <DndProvider backend={HTML5Backend}>
        <ChakraProvider>
          <ConfigProvider theme={customTheme}>
            <AuthContextProvider>
              <UserContextProvider>
                <WorkspaceContextProvider>
                  <ImageContextProvider>
                    <TaskContextProvider>
                      <Component {...pageProps} />
                      <Analytics />
                    </TaskContextProvider>
                  </ImageContextProvider>
                </WorkspaceContextProvider>
              </UserContextProvider>
            </AuthContextProvider>
          </ConfigProvider>
        </ChakraProvider>
      </DndProvider>
    </>
  );
}

export default MyApp;
