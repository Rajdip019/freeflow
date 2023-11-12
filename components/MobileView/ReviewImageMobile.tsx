import {
  IReviewImage,
  IReviewImageVersion,
} from "@/interfaces/ReviewImageData";
import React from "react";
import ReviewCanvas from "../ImageReview/ReviewCanvas";
import { useFeedbackContext } from "@/contexts/FeedbackContext";
import { useRouter } from "next/router";
import FeedbackNavbar from "../ImageReview/FeedbackNavbar.tsx/FeedbackNavbar";
import FeedbackDrawerMobile from "./FeedbackDrawerMobile";
import CompareView from "../ImageReview/CompareView";
import { FFButton } from "@/theme/themeConfig";
import { defaultHighlightedThread } from "@/utils/constants";
import { CloseCircleOutlined } from "@ant-design/icons";
import PreviewCanvas from "../ImageReview/PreviewCanvas";

interface Props {
  image: IReviewImage;
  imageData: IReviewImageVersion[];
}

const ReviewImageMobile: React.FC<Props> = ({ image, imageData }) => {
  const router = useRouter();
  const { imageId, workspaceId } = router.query;
  const {
    version,
    isCompareView,
    highlightedComment,
    setIsFocusedThread,
    setHighlightedComment,
  } = useFeedbackContext();

  return (
    <div className=" h-screen bg-black">
      <FeedbackNavbar />
      <div className=" md:flex md:h-[calc(100vh-4rem)]">
        {isCompareView ? (
          <CompareView
            imageData={imageData}
            image={image as IReviewImage}
            currentVersion={image?.latestVersion as number}
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
                        imageData &&
                        (imageData[version - 1]?.imageURL as string)
                      }
                      imageId={imageId as string}
                      workspaceId={workspaceId as string}
                    />
                  </div>
                )}
              </>
            </div>
          </div>
        )}
      </div>
      {isCompareView ? null : (
        <FeedbackDrawerMobile
          designId={imageId as string}
          workspaceId={workspaceId as string}
        />
      )}
    </div>
  );
};

export default ReviewImageMobile;
