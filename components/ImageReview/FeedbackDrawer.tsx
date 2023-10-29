import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Divider, Drawer, Image, Typography } from "antd";
import React from "react";
import FeedbackTile from "./FeedbackTile";
import FeedbackExpanded from "./FeedbackExpanded";
import { useFeedbackContext } from "@/contexts/FeedbackContext";
import Moment from "react-moment";

interface Props {
  showDrawer: () => void;
  onClose: () => void;
  open: boolean;
  imageId: string;
}

const FeedbackDrawer: React.FC<Props> = ({
  showDrawer,
  onClose,
  open,
  imageId,
}) => {
  const { threads, version, isFocusedThread, imageData } = useFeedbackContext();

  return (
    <>
      <div className="relative">
        {!open && (
          <button
            className=" absolute right-0 h-[calc(100vh-4rem)] rounded-none bg-[#642AB5] p-0.5"
            onClick={showDrawer}
          >
            {" "}
            <LeftOutlined />
          </button>
        )}
        <div className="fixed right-0 h-[calc(100vh-4rem)]">
          <Drawer
            placement="right"
            onClose={onClose}
            open={open}
            maskClosable={false}
            mask={false}
            closeIcon={null}
            getContainer={false}
            bodyStyle={{
              backgroundColor: "#141414",
              padding: "5px 0  5px 12px ",
              borderTop: "1.5px solid #2D2D2D",
            }}
          >
            <button
              className=" bg-p absolute left-0 top-0 h-[calc(100vh-4rem)] rounded-none p-0.5"
              onClick={onClose}
            >
              {" "}
              <RightOutlined />
            </button>
            <div>
              {isFocusedThread ? (
                <FeedbackExpanded imageId={imageId as string} />
              ) : (
                <>
                  <div className=" bg-sec sticky -top-[0.3rem] z-50 ml-4 flex flex-col py-2">
                    <div className="flex flex-col gap-2">
                      <Typography.Text className="text-base">
                        {imageData?.uploadedBy}{" "}
                        <span className="text-sm text-gray-400">
                          uploaded{" "}
                          <Moment fromNow>{imageData?.timeStamp}</Moment>
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
                      <Divider className="my-0 -ml-1.5" />
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
                  {threads.filter(
                    ({ version: versionDB }) => versionDB === version
                  ).length > 0 ? (
                    <div>
                      {threads.map((thread, index) => {
                        return (
                          <div className=" ml-2">
                            {thread.imageURL ? (
                              <FeedbackTile key={index} thread={thread} />
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
                        <Image
                          src="/empty-state-replies.png"
                          alt=""
                          preview={false}
                        />
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
      </div>
    </>
  );
};

export default FeedbackDrawer;
