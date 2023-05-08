import { useImageContext } from "@/contexts/ImagesContext";
import { useUserContext } from "@/contexts/UserContext";
import { appUrl } from "@/helpers/app-url";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { Collapse } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const RecentUploads = () => {
  const { images } = useImageContext();
  const [latestUpdatedImages, setLastUpdatedImages] = useState<
    IReviewImageData[]
  >([]);
  const { user } = useUserContext();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const _latestUpdatedImages = images.sort((a, b) => {
      return b.lastUpdated - a.lastUpdated;
    });
    const result = _latestUpdatedImages.map((image) => {
      if (image.newUpdate === "Uploaded") {
        return image;
      } else {
        return null;
      }
    });
    const finalArray: IReviewImageData[] = [];
    result.forEach((elements) => {
      if (elements != null && elements !== undefined) {
        finalArray.push(elements);
      }
    });
    setLastUpdatedImages(finalArray);
  }, [images]);

  return (
    <div className="w-full rounded bg-[#334155] p-4">
      <h3 className=" font-sec flex items-center text-lg text-white">
        Images with NO Feedback{" "}
        <p className=" ml-2 flex w-6 items-center justify-center rounded-full bg-red-700 p-1 text-xs">
          {latestUpdatedImages.length}
        </p>
      </h3>
      <Collapse startingHeight={220} in={isExpanded}>
        {latestUpdatedImages.map((image, index) => {
          return (
            <div
              key={index}
              className=" mt-2 flex items-center justify-between gap-2 rounded bg-gray-900 p-2"
            >
              <p className=" ml-1 w-8/12 text-sm text-white">
                {image.imageName}
              </p>
              <div className=" w-4/8 flex items-center gap-3">
                <Link
                  href={`${appUrl}/review-image/${image.id}?uname=${user?.name}`}
                  className=" mr-1"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    fill="none"
                    className=" w-4 text-white"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
        {latestUpdatedImages.length === 0 && (
          <div className=" mt-24 flex items-center justify-center font-semibold text-white">
            All Images got feedback...✨
          </div>
        )}
      </Collapse>
      {latestUpdatedImages.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={` mt-2 flex w-full items-center justify-between rounded border p-2 text-sm text-white`}
        >
          {isExpanded ? "Show Less" : "View all Images"}
          <svg
            fill="none"
            className={`mr-1 w-4 ${
              isExpanded ? "" : "rotate-90"
            } text-white  transition-all`}
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default RecentUploads;
