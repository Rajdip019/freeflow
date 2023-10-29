import { useImageContext } from "@/contexts/ImagesContext";
import { useUserContext } from "@/contexts/UserContext";
import React from "react";

const StorageStats = () => {
  const { user } = useUserContext();
  const { storage } = useImageContext();

  console.log(user?.storage);

  return (
    <div className=" font-sec min-w-max rounded bg-[#1E40AF] p-4 text-white md:w-full ">
      <div className=" mb-3 flex items-center justify-between">
        <p>Storage</p>
        <img src="/stats/storage.png" className=" w-7" alt="" />
      </div>
      <div className=" flex items-baseline">
        <h3 className=" text-5xl">{storage}</h3>
        <p className=" ml-1 text-sm text-gray-300">
          / {(user?.storage as number) / 1024} GB
        </p>
      </div>
    </div>
  );
};

export default StorageStats;
