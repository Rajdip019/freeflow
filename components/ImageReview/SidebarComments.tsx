import { IThread } from "@/interfaces/Thread";
import { db } from "@/lib/firebaseConfig";
import { useToast } from "@chakra-ui/react";
import {
  getDocs,
  query,
  collection,
  orderBy,
  addDoc,
} from "firebase/firestore";
import error from "next/error";
import React, { useState } from "react";
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
      className="my-1.5 bg-gray-700 flex cursor-pointer hover:bg-gray-600 transition-all"
      onClick={() => {setHighlightedComment(thread); setIsFocusedThread(true)}}
    >
      <div className={`w-1 bg-${thread.color}`}></div>
      <div className="p-2">
        <span className=" font-semibold">{thread.name}</span>
        <Moment fromNow className="ml-2">
          {thread.timeStamp}
        </Moment>
        <p>{thread.initialComment}</p>
      </div>
    </div>
  );
};

export default SidebarComments;
