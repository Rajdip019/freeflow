import { IThread } from "@/interfaces/Thread";
import React from "react";
import Moment from "react-moment";

interface Props {
  thread: IThread;
  setHighlightedComment: React.Dispatch<React.SetStateAction<IThread>>;
  setIsFocusedThread :React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarComments: React.FC<Props> = ({
  thread,
  setHighlightedComment,
  setIsFocusedThread
}) => {

  return (
    <div
      className="my-1.5 bg-gray-700 flex hover:bg-gray-600 transition-all"
    >
      <div className={`w-1 bg-${thread.color}`}></div>
      <div className="p-2">
        <span className=" font-semibold">{thread.name}</span>
        <Moment fromNow className="ml-2">
          {thread.timeStamp}
        </Moment>
        <p>{thread.initialComment}</p>
        <button onClick={() => {setHighlightedComment(thread); setIsFocusedThread(true)}} className=" font-semibold mt-1">Reply</button>
      </div>
    </div>
  );
};

export default SidebarComments;
