import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import React from "react";
import PreviewCanvas from "./PreviewCanvas";

interface Props {
  imageData: IReviewImageData;
  currentVersion: number;
}

const CompareView: React.FC<Props> = ({ imageData, currentVersion }) => {
  const [version1, setVersion1] = React.useState<number>(currentVersion);
  const [version2, setVersion2] = React.useState<number>(currentVersion - 1);

  console.log("version2", version2);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="">
        <div className=" flex justify-around gap-5 ">
          <div
            // style={{ width: imageDimension.width, height: imageDimension.height }}
            className="flex w-full flex-col items-center justify-center"
          >
            <p className=" mb-5 text-sm  font-semibold">
              {imageData.imageName}
            </p>
            <div className=" w-[45vw]">
              <PreviewCanvas imageSrc={imageData?.imageURL[(version1 as number) - 1]} />
            </div>
            <div className=" mt-5">
              <Menu>
                <MenuButton className="rounded bg-purple-500 px-4 py-2 text-xs font-semibold text-white focus:outline-none">
                  {`Version ${version1}`} <ChevronDownIcon />
                </MenuButton>
                <MenuList bgColor={"#475569"} border={0}>
                  {imageData?.imageURL.map((_, index) => {
                    return (
                      <MenuItem
                        className="font-sec flex justify-center p-2 py-1 text-sm text-white hover:bg-purple-500"
                        bgColor={"#475569"}
                        key={index}
                        onClick={() => {
                          setVersion1(imageData.imageURL.length - index);
                        }}
                      >
                        {`Version ${imageData.imageURL.length - index}`}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
              {version1 === currentVersion && (
                <p className="absolute mt-2 text-xs text-gray-400">
                  Latest Version
                </p>
              )}
            </div>
          </div>
          <div className=" h-[calc(100vh-4rem)] w-0.5 bg-gray-400"></div>
          <div
            // style={{ width: imageDimension.width, height: imageDimension.height }}
            className="flex w-full flex-col items-center justify-center   "
          > 
            <p className=" mb-5 text-sm  font-semibold">
              {imageData.imageName}
            </p>
            <div className="w-[45vw]">
               <PreviewCanvas imageSrc={imageData?.imageURL[(version2 as number) - 1]} />
            </div>
            <div className=" mt-5">
              <Menu>
                <MenuButton className="rounded bg-purple-500 px-4 py-2 text-xs font-semibold text-white focus:outline-none">
                  {`Version ${version2}`} <ChevronDownIcon />
                </MenuButton>
                <MenuList bgColor={"#475569"} border={0}>
                  {imageData?.imageURL.map((_, index) => {
                    return (
                      <MenuItem
                        className="font-sec flex justify-center p-2 py-1 text-sm text-white hover:bg-purple-500"
                        bgColor={"#475569"}
                        key={index}
                        onClick={() => {
                          setVersion2(imageData.imageURL.length - index);
                        }}
                      >
                        {`Version ${imageData.imageURL.length - index}`}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
              {version2 === currentVersion && (
                <p className=" absolute mt-2 text-xs text-gray-400">
                  Latest Version
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareView;
