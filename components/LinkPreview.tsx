import React from "react";
import { Helmet } from "react-helmet";

interface Props {
  title: string;
  name: string;
  imageUrl: string;
  url: string;
}
const LinkPreview = (props: Props) => {
  return (
    <Helmet>
      <meta property="og:title" content={`${props.title} | FreeFlow`} />
      <meta
        property="og:description"
        content={`🎨 ${props.name}, Shared You a Design for Feedback 🤔`}
      />
      <meta property="og:image" content={props.imageUrl} />
      <meta property="og:url" content={props.url} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default LinkPreview;
