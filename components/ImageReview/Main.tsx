import CompareView from "@/components/ImageReview/CompareView";
import FeedbackNavbar from "@/components/ImageReview/FeedbackNavbar.tsx/FeedbackNavbar";
import PreviewCanvas from "@/components/ImageReview/PreviewCanvas";
import ReviewCanvas from "@/components/ImageReview/ReviewCanvas";
import LinkPreview from "@/components/LinkPreview";
import ReviewImageMobile from "@/components/MobileView/ReviewImageMobile";
import { useFeedbackContext } from "@/contexts/FeedbackContext";
import { useUserContext } from "@/contexts/UserContext";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import FeedbackDrawer from "./FeedbackDrawer";
import { CloseCircleOutlined } from "@ant-design/icons";
import { FFButton } from "@/theme/themeConfig";
import { defaultHighlightedThread } from "@/utils/constants";

const ReviewImage = () => {
  const router = useRouter();
  const { imageId } = router.query;
  const { user } = useUserContext();
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const {
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
        <title>
          {imageData?.imageName ? imageData.imageName : "Loading..."}
        </title>
      </Head>
      <LinkPreview
        title={imageData?.imageName as string}
        name={user?.name as string}
        imageUrl={imageData?.imageURL[imageData.currentVersion] as string}
        url={router.pathname}
      />
      <div className=" md:hidden">
        <ReviewImageMobile imageData={imageData as IReviewImageData} />
      </div>
      <div className="hidden h-screen overflow-hidden bg-black text-white md:block">
        <FeedbackNavbar />
        <div className=" flex h-[calc(100vh-4rem)]">
          {isCompareView ? (
            <CompareView
              imageData={imageData as IReviewImageData}
              currentVersion={imageData?.currentVersion as number}
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
                          imageData?.currentVersion
                            ? imageData?.imageURL[(version as number) - 1]
                            : (imageData?.imageURL as any)
                        }
                        imageId={imageId as string}
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
                imageId={imageId as string}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewImage;
