import { useImageContext } from "@/contexts/ImagesContext";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";

const TotalViews = () => {
  const { images } = useImageContext();
  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    if (images.length !== 0) {
      const sum = images.reduce((accumulator, object: any) => {
        return accumulator + object.views;
      }, 0);
      setViews(sum);
    }
  }, [images]);

  return (
    <div className=" font-sec min-w-max rounded bg-[#047857]  p-4 text-white md:w-full">
      <div className=" mb-3 flex items-center justify-between">
        <p>Total Views</p>
        <Tooltip title="Total unique views on all your designs.">
          <img src="/stats/eye.png" className=" w-7" alt="" />
        </Tooltip>
      </div>
      <div className=" flex items-baseline">
        <h3 className=" text-5xl">{views}</h3>
        {/* <p className=' text-sm text-gray-300 ml-1'>+100 this week</p> */}
      </div>
    </div>
  );
};

export default TotalViews;
