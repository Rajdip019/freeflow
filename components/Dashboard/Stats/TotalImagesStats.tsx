import { useImageContext } from "@/contexts/ImagesContext";
import React, { useEffect, useState } from "react";

const TotalImagesStats = () => {
  const { images } = useImageContext();
  const [prevWeek, setPrevWeek] = useState<number>(0);

  useEffect(() => {
    const result = images.map((image) => {
      const currentTime = Date.now();
      const imageUploadTime = image.timeStamp;
      if (currentTime - 604800000 < imageUploadTime) {
        return image;
      } else {
        return null;
      }
    });
    const finalArray = [];
    result.forEach((elements) => {
      if (elements != null && elements !== undefined) {
        finalArray.push(elements);
      }
    });
    setPrevWeek(finalArray.length);
  }, [images]);

  return (
    <div className=" font-sec min-w-max rounded bg-[#7E22CE] p-4 text-white md:w-full">
      <div className=" mb-3 flex items-center justify-between">
        <p>Total Images</p>
        <img src="/stats/image.png" className=" w-7" alt="" />
      </div>
      <div className=" flex items-baseline">
        <h3 className=" text-5xl">{images.length}</h3>
        <p className=" ml-1 text-sm text-gray-300">+{prevWeek} this week</p>
      </div>
    </div>
  );
};

export default TotalImagesStats;
