import { IReview } from "@/interfaces/Thread";
import React from "react";
import Moment from "react-moment";
import Linkify from "react-linkify";
import { Avatar, Divider, Typography } from "antd";
import { randomColorGeneratorFromString } from "@/utils/randomColorGeneratorFromString";
import { FFButton } from "@/theme/themeConfig";
import { useFeedbackContext } from "@/contexts/FeedbackContext";
interface Props {
  thread: IReview;
}

const FeedbackTile: React.FC<Props> = ({ thread }) => {
  const {
    setHighlightedComment,
    highlightedComment,
    setIsFocusedThread,
    version,
  } = useFeedbackContext();
  const componentDecorator = (href: string, text: string, key: any) => (
    <Typography.Link
      className="linkify__text"
      href={href}
      key={key}
      target="_blank"
    >
      {text}
    </Typography.Link>
  );  

  return (
    <>
      {version === thread.version && (
        <div
          onClick={() => {
            setHighlightedComment(thread);
          }}
          className={`cursor-pointer transition-all ${
            highlightedComment?.id === thread.id ? "bg-black" : ""
          }`}
        >
          <div className="py-2 pl-2.5">
            <div className=" flex items-center">
              <Avatar
                className="mr-2"
                style={{
                  backgroundColor: randomColorGeneratorFromString(thread.name)
                    .color,
                }}
              >
                {thread.name[0]}
              </Avatar>
              <Typography.Text strong>{thread.name}</Typography.Text>
              <Moment fromNow className=" ml-2 text-sm text-gray-400">
                {thread.timeStamp}
              </Moment>
            </div>
            <Typography.Paragraph className="font-sec mt-3 text-sm">
              {" "}
              <Linkify componentDecorator={componentDecorator}>
                {thread.initialComment}
              </Linkify>
            </Typography.Paragraph>
            <FFButton size="small">
              {" "}
              <Typography.Text
                className=" text-sm"
                onClick={() => {
                  setHighlightedComment(thread);
                  setIsFocusedThread(true);
                }}
              >
                Reply
              </Typography.Text>
            </FFButton>
          </div>
          <Divider className="my-0" />
        </div>
      )}
    </>
  );
};

export default FeedbackTile;
