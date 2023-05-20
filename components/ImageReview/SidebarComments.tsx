import { IThread } from "@/interfaces/Thread";
import { Avatar } from "@chakra-ui/react";
import React from "react";
import Moment from "react-moment";
import Linkify from "react-linkify";
interface Props {
  thread: IThread;
  setHighlightedComment: React.Dispatch<React.SetStateAction<IThread>>;
  setIsFocusedThread: React.Dispatch<React.SetStateAction<boolean>>;
  version: number;
}

const componentDecorator = (href: string, text: string, key: any) => (
  <a className="linkify__text" href={href} key={key} target="_blank">
    {text}
  </a>
);

const SidebarComments: React.FC<Props> = ({
  thread,
  setHighlightedComment,
  setIsFocusedThread,
  version,
}) => {
  const componentDecorator = (href: string, text: string, key: any) => (
    <a className="linkify__text" href={href} key={key} target="_blank">
      {text}
    </a>
  );

  return (
    <>
      {version === thread.version && (
        <div
          className="flex cursor-pointer border-b border-black transition-all hover:bg-gray-900"
          onClick={() => {
            setHighlightedComment(thread);
            setIsFocusedThread(true);
          }}
        >
          <div className={`w-1 bg-${thread.color}`}></div>
          <div className="p-2">
            <div className=" flex items-center">
              <Avatar size="sm" name={thread.name} className="mr-2" />
              <span className=" font-sec font-semibold">{thread.name}</span>
              <Moment
                fromNow
                className="font-sec ml-2 text-sm font-semibold text-gray-400"
              >
                {thread.timeStamp}
              </Moment>
            </div>
            <p className=" font-sec mt-2 text-sm">
              {" "}
              <Linkify componentDecorator={componentDecorator}>
                {thread.initialComment}
              </Linkify>
            </p>
            {/* <button
              onClick={() => {
                setHighlightedComment(thread);
                setIsFocusedThread(true);
              }}
              className=" font-sec mt-1 text-sm text-gray-400 hover:text-gray-200"
            >
              Reply
            </button> */}
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarComments;
