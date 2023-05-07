import { IThread } from "@/interfaces/Thread";
import React from "react";
import Moment from "react-moment";
interface Props {
  thread: IThread;
  setHighlightedComment: React.Dispatch<React.SetStateAction<IThread>>;
  setIsFocusedThread: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarComments: React.FC<Props> = ({
  thread,
  setHighlightedComment,
  setIsFocusedThread,
}) => {
  return (
    <div className="my-1.5 flex bg-gray-700 transition-all hover:bg-gray-600">
      <div className={`w-1 bg-${thread.color}`}></div>
      <div className="p-2">
        <span className=" font-semibold">{thread.name}</span>
        <Moment fromNow className="ml-2">
          {thread.timeStamp}
        </Moment>
        <p>{thread.initialComment}</p>
        <button
          onClick={() => {
            setHighlightedComment(thread);
            setIsFocusedThread(true);
          }}
          className=" mt-1 font-semibold"
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default SidebarComments;
