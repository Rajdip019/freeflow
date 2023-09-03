import { IReviewImageData } from "@/interfaces/ReviewImageData";
import Link from "next/link";
import React, { useState } from "react";
import Moment from "react-moment";
import ReviewCanvas from "../ImageReview/ReviewCanvas";
import { useFeedbackContext } from "@/contexts/FeedbackContext";
import { useRouter } from "next/router";
import FeedbackNavbar from "../ImageReview/FeedbackNavbar.tsx/FeedbackNavbar";
import FeedbackDrawerMobile from "./FeedbackDrawerMobile";
import CompareView from "../ImageReview/CompareView";
import { FFButton } from "@/theme/themeConfig";
import { defaultHighlightedThread } from "@/utils/constants";
import { CloseCircleOutlined } from "@ant-design/icons";
import FeedbackDrawer from "../ImageReview/FeedbackDrawer";
import PreviewCanvas from "../ImageReview/PreviewCanvas";

interface Props {
  imageData: IReviewImageData;
}

const ReviewImageMobile: React.FC<Props> = ({ imageData }) => {
  const router = useRouter();
  const { imageId } = router.query;
  const { version, isCompareView, highlightedComment, setIsFocusedThread, setHighlightedComment } = useFeedbackContext();



  return (
    <div className=" bg-black h-screen">
      <FeedbackNavbar />
      <div className=" md:flex md:h-[calc(100vh-4rem)]">
        {isCompareView ? (
          <CompareView
            imageData={imageData as IReviewImageData}
            currentVersion={imageData?.currentVersion as number}
          />
        ) : (
          <div className="w-full">
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-5 ">
              <>
                {highlightedComment?.imageURL ? (
                  <div className=" w-full">
                    <FFButton
                      onClick={() => {
                        setHighlightedComment(defaultHighlightedThread),
                          setIsFocusedThread(false);
                      }}
                      className=" mx-auto"
                      type="primary"
                      icon={<CloseCircleOutlined />}
                    >
                      Back to Feedback
                    </FFButton>
                    <PreviewCanvas
                      imageSrc={highlightedComment?.imageURL as string}
                      height="85vh"
                    />
                  </div>
                ) : (
                  <div className=" w-full">
                    <ReviewCanvas
                      imageSrc={
                        imageData?.currentVersion
                          ? imageData?.imageURL[(version as number) - 1]
                          : (imageData?.imageURL as any)
                      }
                      imageId={imageId as string}
                    />
                  </div>
                )}
              </>
            </div>
          </div>
        )}
      </div>
      {isCompareView ? null : (
      <FeedbackDrawerMobile imageId={imageId as string} />)}
    </div>
  );
};

export default ReviewImageMobile;
