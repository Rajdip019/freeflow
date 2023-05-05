import { useImageContext } from "@/contexts/ImagesContext";
import { useUserContext } from "@/contexts/UserContext";
import { template } from "@/helpers/apiTemplateString";
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
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const _latestUpdatedImages = images.sort((a, b) => {
      return b.lastUpdated - a.lastUpdated;
    });
    const result = _latestUpdatedImages.map((image) => {
      if (image.newUpdate === "Uploaded") {
        return image
      } else {
        return null
      }
    })
    const finalArray: IReviewImageData[] = []
    result.forEach(elements => {
      if (elements != null && elements !== undefined) {
        finalArray.push(elements);
      }
    });
    setLastUpdatedImages(finalArray);
  }, [images]);

  return (
    <div className="bg-[#881337] w-full p-4 rounded">
      <h3 className=" font-sec text-lg text-white flex items-center">Images with NO Feedback <p className=" ml-2 text-xs bg-red-700 p-1 rounded-full w-6 flex justify-center items-center">{latestUpdatedImages.length}</p></h3>
      <Collapse startingHeight={220} in={isExpanded}>
        {latestUpdatedImages.map((image, index) => {
          return (
            <div
              key={index}
              className=" flex items-center rounded mt-2 bg-[#BE123C] p-2 justify-between gap-2"
            >
              <p className=" text-white text-sm w-8/12 ml-1">{image.imageName}</p>
              <div className=" w-4/8 flex items-center gap-3">
                <Link
                  href={`${template}/review-image/${image.id}?uname=${user?.name}`}
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
          <div className=" flex justify-center items-center text-white font-semibold mt-24" >All Images got feedback...✨</div>
        )}
      </Collapse>
      {latestUpdatedImages.length > 5 && (
        <button onClick={() => setIsExpanded(!isExpanded)} className={` text-white p-2 flex items-center justify-between w-full border rounded mt-2 text-sm`}>
          {isExpanded ? 'Show Less' : 'View all Images'}
          <svg
            fill="none"
            className={`w-4 mr-1 ${isExpanded ? '' : 'rotate-90'} transition-all  text-white`}
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