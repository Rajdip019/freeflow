import {
  IReviewImage,
  IReviewImageVersion,
} from "@/interfaces/ReviewImageData";
import React from "react";
import PreviewCanvas from "./PreviewCanvas";
import { Button, Dropdown, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";

interface Props {
  image: IReviewImage;
  imageData: IReviewImageVersion[];
  currentVersion: number;
}

const CompareView: React.FC<Props> = ({ image, imageData, currentVersion }) => {
  const [version1, setVersion1] = React.useState<number>(currentVersion);
  const [version2, setVersion2] = React.useState<number>(currentVersion - 1);

  return (
    <div className="flex h-full w-full items-center justify-center bg-black md:h-auto">
      <div className="">
        <div className=" flex flex-col justify-around gap-5 md:flex-row ">
          <div className="flex w-full flex-col items-center justify-center">
            <Typography.Text className=" mb-5 text-sm  font-semibold">
              {image.imageName}
            </Typography.Text>
            <div className="w-[90vw] md:w-[45vw]">
              <PreviewCanvas imageSrc={imageData[0].imageURL} />
            </div>
            <div className=" mt-5">
              <Dropdown
                overlay={
                  <div className="rounded bg-gray-800 p-2">
                    {imageData?.map((_, index) => {
                      return (
                        <div
                          className="font-sec flex justify-center p-2 py-1 text-sm text-white hover:bg-purple-500"
                          key={index}
                          onClick={() => {
                            setVersion1(imageData.length - index);
                          }}
                        >
                          {`Version ${imageData.length - index}`}
                        </div>
                      );
                    })}
                  </div>
                }
                placement="bottomCenter"
                trigger={["click"]}
              >
                <Button type="primary">
                  {`Version ${version1}`} <DownOutlined />
                </Button>
              </Dropdown>
              <br />
              {version1 === currentVersion && (
                <Typography.Text className="absolute mt-2 text-xs text-gray-400">
                  Latest Version
                </Typography.Text>
              )}
            </div>
          </div>
          <div className=" my-5 h-0.5 w-screen bg-gray-400 md:my-0 md:h-[calc(100vh-4rem)] md:w-0.5"></div>
          <div
            // style={{ width: imageDimension.width, height: imageDimension.height }}
            className="flex w-full flex-col items-center justify-center   "
          >
            <Typography.Text className=" mb-5 text-sm  font-semibold">
              {image.imageName}
            </Typography.Text>
            <div className="w-[90vw] md:w-[45vw]">
              <PreviewCanvas imageSrc={imageData[1].imageURL} />
            </div>
            <div className=" mb-10 mt-5 md:mb-0">
              <Dropdown
                overlay={
                  <div className="rounded bg-gray-800 p-2">
                    {imageData?.map((_, index) => {
                      return (
                        <div
                          className="font-sec flex justify-center p-2 py-1 text-sm text-white hover:bg-purple-500"
                          key={index}
                          onClick={() => {
                            setVersion2(imageData.length - index);
                          }}
                        >
                          {`Version ${imageData.length - index}`}
                        </div>
                      );
                    })}
                  </div>
                }
                placement="bottomCenter"
                trigger={["click"]}
              >
                <Button type="primary">
                  {`Version ${version2}`} <DownOutlined />
                </Button>
              </Dropdown>
              <br />
              {version2 === currentVersion && (
                <Typography.Text className=" absolute mt-2 text-xs text-gray-400">
                  Latest Version
                </Typography.Text>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareView;
