import { useFeedbackContext } from "@/contexts/FeedbackContext";
import { Divider, Drawer, Typography } from "antd";
import React, { useState, version } from "react";
import FeedbackExpanded from "../ImageReview/FeedbackExpanded";
import FeedbackTile from "../ImageReview/FeedbackTile";
import Moment from "react-moment";
import { UpOutlined } from "@ant-design/icons";

interface Props {
  imageId: string;
}

const FeedbackDrawerMobile: React.FC<Props> = ({ imageId }) => {
  const [open, setOpen] = useState(false);
  const { isFocusedThread, imageData, threads, version } = useFeedbackContext();

  // const showDrawer = () => {
  //   setOpen(true);
  // };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button
        className="bg-p fixed bottom-0 w-screen text-white"
        onClick={() => setOpen(true)}
      >
        <UpOutlined />
      </button>
      <Drawer
        title={`${imageData?.imageName}'s Feedbacks`}
        placement="bottom"
        open={open}
        closable
        onClose={onClose}
        size="large"
        bodyStyle={{
          backgroundColor: "#141414",
          padding: "5px 0  5px 12px ",
          borderTop: "1.5px solid #2D2D2D",
        }}
      >
        <div>
          {isFocusedThread ? (
            <FeedbackExpanded imageId={imageId as string} />
          ) : (
            <>
              <div className=" bg-sec sticky -top-[0.35rem] z-50 flex flex-col py-2">
                <div className="flex flex-col gap-2">
                  <Typography.Text className="text-base">
                    {imageData?.uploadedBy}{" "}
                    <span className="text-sm text-gray-400">
                      uploaded <Moment fromNow>{imageData?.timeStamp}</Moment>
                    </span>
                    <br />
                  </Typography.Text>
                  {imageData?.imageDescription && (
                    <Typography.Text>
                      <span className="text-base">Description</span> <br />
                      <span className="text-sm text-gray-400">
                        {imageData?.imageDescription}
                      </span>
                    </Typography.Text>
                  )}
                  <Divider className="my-0" />
                </div>
                <div className=" flex gap-3">
                  <Typography.Title
                    level={5}
                    className="font-sec font-semibold"
                  >
                    Feedbacks
                  </Typography.Title>
                  <Typography.Text className=" bg-p flex h-6 w-6 justify-center rounded-full">
                    {
                      threads.filter(
                        ({ version: versionDB }) => versionDB === version
                      ).length
                    }
                  </Typography.Text>
                </div>
                <Divider className="my-0 -ml-1.5" />
              </div>
              {threads.filter(({ version: versionDB }) => versionDB === version)
                .length > 0 ? (
                <div>
                  {threads.map((thread, index) => {
                    return (
                      <div className=" ml-2">
                        {thread.imageURL ? (
                          <FeedbackTile
                            key={index}
                            thread={thread}
                            onClose={onClose}
                            setOpen={setOpen}
                          />
                        ) : (
                          <div className=" mt-5 px-2 text-center font-semibold">
                            <Typography.Paragraph>
                              This version is outdated. <br />
                              Please switch to new version by uploading the
                              image again.
                            </Typography.Paragraph>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
                  <div className="p-4 text-center">
                    {/* <Image
                          src="/feedbackDrawer/empty-state-replies.png"
                          alt=""
                          preview={false}
                        /> */}
                    <Typography.Text className=" font-sec">
                      No Feedback yet
                    </Typography.Text>{" "}
                    <br />
                    <Typography.Text className=" font-sec text-gray-500">
                      Add a feedback now
                    </Typography.Text>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default FeedbackDrawerMobile;
