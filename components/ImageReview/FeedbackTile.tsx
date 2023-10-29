import { IReview } from "@/interfaces/Thread";
import React from "react";
import Moment from "react-moment";
import Linkify from "react-linkify";
import { Divider, Typography } from "antd";
import { FFButton } from "@/theme/themeConfig";
import { useFeedbackContext } from "@/contexts/FeedbackContext";
import Avatar from "react-avatar";
interface Props {
  thread: IReview;
  onClose?: () => void;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const FeedbackTile: React.FC<Props> = ({ thread, onClose, setOpen }) => {
  const {
    setHighlightedComment,
    highlightedComment,
    setIsFocusedThread,
    version,
    isFocusedThread,
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
          onClickCapture={() => {
            setHighlightedComment(thread);
            onClose && !isFocusedThread && onClose();
          }}
          className={`cursor-pointer transition-all ${highlightedComment?.id === thread.id ? "bg-black" : ""
            }`}
        >
          <div className="py-2 pl-2.5">
            <div className=" flex items-center">
              <Avatar
                name={thread.name[0]}
                alt={thread.name[0]}
                size="30"
                round={true}
                className="mr-2"
              >
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
                  setOpen && setOpen(true);
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
