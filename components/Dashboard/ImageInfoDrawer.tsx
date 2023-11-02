import React from "react";
import { Image } from "antd";
import { IReviewImageData } from "@/interfaces/ReviewImageData";

type Props = {
  image: IReviewImageData;
};

const ImageInfoDrawer = ({ image }: Props) => {
  return (
    <div className="bg-sec sticky top-0 hidden h-screen w-[260px] border-r border-r-[#ffffff1e] md:flex">
      <Image src={image.imageURL[0]} />
    </div>
  );
};

export default ImageInfoDrawer;
