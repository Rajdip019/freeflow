import { IThread } from "@/interfaces/Thread";
import React from "react";

interface Props {
  thread: IThread;
  imageDimension: {
    height: number;
    width: number;
  };
  highlightedComment: IThread;
  setHighlightedComment: React.Dispatch<React.SetStateAction<IThread>>;
  setIsFocusedThread: React.Dispatch<React.SetStateAction<boolean>>;
}

const Markings: React.FC<Props> = ({
  thread,
  imageDimension,
  highlightedComment,
  setHighlightedComment,
  setIsFocusedThread,
}) => {
  return (
    <div
      style={{
        top:
          thread.top * (imageDimension?.height / thread.imageDimension?.height),
        left:
          thread.left * (imageDimension.width / thread.imageDimension?.width),
      }}
      className={`absolute flex ${
        thread.top > 450 ? "items-end" : "items-start"
      } ${thread.left > 500 ? "flex-row-reverse" : " flex-row"}`}
    >
      <div className=" hidden border-red-500"></div>
      <div className=" hidden border-green-500"></div>
      <div className=" hidden border-blue-500"></div>
      <div className=" hidden border-white"></div>
      <div className=" hidden border-gray-900"></div>
      <button
        className=""
        onClick={() => {
          setHighlightedComment(thread);
          setIsFocusedThread(true);
        }}
      >
        <div
          className={`h-7 w-7 rounded-r-full rounded-t-full bg-${
            thread.color
          } ${
            highlightedComment.id === thread.id
              ? "scale-125 ring-4 ring-white transition-all"
              : ""
          } `}
        ></div>
      </button>
    </div>
  );
};

export default Markings;
