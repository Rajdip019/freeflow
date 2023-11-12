import CompareView from "@/components/ImageReview/CompareView";
import FeedbackNavbar from "@/components/ImageReview/FeedbackNavbar.tsx/FeedbackNavbar";
import PreviewCanvas from "@/components/ImageReview/PreviewCanvas";
import ReviewCanvas from "@/components/ImageReview/ReviewCanvas";
import LinkPreview from "@/components/LinkPreview";
import ReviewImageMobile from "@/components/MobileView/ReviewImageMobile";
import { useFeedbackContext } from "@/contexts/FeedbackContext";
import { useUserContext } from "@/contexts/UserContext";

import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import FeedbackDrawer from "./FeedbackDrawer";
import { CloseCircleOutlined } from "@ant-design/icons";
import { FFButton } from "@/theme/themeConfig";
import { defaultHighlightedThread } from "@/utils/constants";
import { IReviewImage } from "@/interfaces/ReviewImageData";

const ReviewImage = () => {
  const router = useRouter();
  const { designId, workspaceId } = router.query;
  const { user } = useUserContext();
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const {
    image,
    imageData,
    highlightedComment,
    version,
    isCompareView,
    setIsFocusedThread,
    setHighlightedComment,
  } = useFeedbackContext();

  return (
    <>
      <Head>
        <title>{image?.imageName ? image.imageName : "Loading..."}</title>
      </Head>
      <LinkPreview
        title={image?.imageName as string}
        name={user?.name as string}
        imageUrl={image?.latestImageURL as string}
        url={router.pathname}
      />
      <div className=" md:hidden">
        <ReviewImageMobile
          image={image as IReviewImage}
          imageData={imageData}
        />
      </div>
      <div className="hidden h-screen overflow-hidden bg-black text-white md:block">
        <FeedbackNavbar />
        <div className=" flex h-[calc(100vh-4rem)]">
          {isCompareView ? (
            <CompareView
              imageData={imageData}
              image={image as IReviewImage}
              currentVersion={image?.latestVersion as number}
            />
          ) : (
            <div className={`${open ? " w-9/12" : "w-full"}`}>
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
                        imageId={designId as string}
                        workspaceId={workspaceId as string}
                        open={open}
                      />
                    </div>
                  )}
                </>
              </div>
            </div>
          )}
          {isCompareView ? null : (
            <div className=" h-[calc(100vh-4rem)]">
              <FeedbackDrawer
                showDrawer={showDrawer}
                onClose={onClose}
                open={open}
                imageId={designId as string}
                workspaceId={workspaceId as string}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewImage;
