import { defaultHighlightedThread } from "@/helpers/constants";
import { IThread } from "@/interfaces/Thread";
import { db } from "@/lib/firebaseConfig";
import { Avatar, Spinner, Textarea, useToast } from "@chakra-ui/react";
import {
  query,
  collection,
  orderBy,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import error from "next/error";
import React, { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import Linkify from "react-linkify";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  uname: string;
  imageId: string;
  highlightedComment: IThread;
  setHighlightedComment: React.Dispatch<React.SetStateAction<IThread>>;
  setIsFocusedThread: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThreadsExpanded: React.FC<Props> = ({
  uname,
  imageId,
  highlightedComment,
  setIsFocusedThread,
  setHighlightedComment,
}) => {
  const [comments, setComments] = useState<
    { name: string; comment: string; timeStamp: number }[]
  >([]);
  const [newComment, setNewComment] = useState<string>();
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isNewCommentLoading, setIsNewCommentLoading] =
    useState<boolean>(false);

  const toast = useToast();
  const { authUser } = useAuth();
  const getComments = async () => {
    if (highlightedComment !== defaultHighlightedThread) {
      const q = query(
        collection(
          db,
          `reviewImages/${imageId}/threads/${highlightedComment.id}/comments`
        ),
        orderBy("timeStamp", "asc")
      );
      onSnapshot(q, async (querySnapshot) => {
        const _comments: unknown[] = [];
        querySnapshot.forEach(async (docSnap) => {
          const data = docSnap.data();
          const finalData = {
            ...data,
          };
          _comments.push(finalData);
        });
        setComments(
          _comments as { name: string; comment: string; timeStamp: number }[]
        );
      });
    }
  };

  useEffect(() => {
    setIsCommentsLoading(true);
    getComments();
    setIsCommentsLoading(false);
  }, [highlightedComment]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef, highlightedComment]);

  const addNewComment = async () => {
    try {
      const name = uname
        ? uname.slice(0, uname.indexOf("@"))
        : authUser?.email?.slice(0, authUser?.email?.indexOf("@"));
      await addDoc(
        collection(
          db,
          `reviewImages/${imageId}/threads/${
            highlightedComment.id as string
          }/comments`
        ),
        {
          name: name,
          comment: newComment,
          timeStamp: Date.now(),
        }
      );
      await updateDoc(doc(db, `reviewImages`, imageId as string), {
        lastUpdated: Date.now(),
        newUpdate: "New Comment",
      });
      setNewComment("");
    } catch (e) {
      console.error("Error", error);
      toast({
        title: "Something went wring please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const componentDecorator = (href: string, text: string, key: any) => (
    <a className="linkify__text" href={href} key={key} target="_blank">
      {text}
    </a>
  );

  return (
    <div className=" flex h-[91vh] flex-col justify-between">
      <div>
        <div className=" sticky top-0 flex w-full items-center border-y border-black px-2 py-2 text-lg  font-semibold">
          <button
            onClick={() => {
              setIsFocusedThread(false);
              setHighlightedComment(defaultHighlightedThread);
            }}
          >
            <svg
              className=" mr-3 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              />
            </svg>
          </button>
          <p className=" font-sec">Comments</p>
          <p className=" ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600">
            {comments.length}
          </p>
        </div>
        <div className="flex border-b border-black">
          <div className={`w-1 bg-${highlightedComment.color}`}></div>
          <div className="p-2">
            <div className={`w-1 bg-${highlightedComment.color}`}></div>
            <div className=" flex items-center">
              <Avatar
                size="sm"
                name={highlightedComment.name}
                className="mr-2"
              />
              <span className=" font-sec font-semibold">
                {highlightedComment.name}
              </span>
              <Moment
                fromNow
                className="font-sec ml-2 text-sm font-semibold text-gray-400"
              >
                {highlightedComment.timeStamp}
              </Moment>
            </div>
            <p className=" font-sec mt-2 text-sm">
              {highlightedComment.initialComment}
            </p>
          </div>
        </div>
        {isCommentsLoading ? (
          <div className=" flex flex-col gap-1.5">
            <div className=" mx-2 h-14 animate-pulse rounded bg-gray-700"></div>
            <div className=" mx-2 h-14 animate-pulse rounded bg-gray-700"></div>
            <div className=" mx-2 h-14 animate-pulse rounded bg-gray-700"></div>
            <div className=" mx-2 h-14 animate-pulse rounded bg-gray-700"></div>
          </div>
        ) : (
          <>
            {comments.length > 0 ? (
              <>
                {comments.map((comment) => {
                  return (
                    <div
                      className=" flex flex-col border-b border-black pl-2"
                      key={comment.timeStamp}
                    >
                      <div className="p-2">
                        <div className=" flex items-center">
                          <Avatar
                            size="sm"
                            name={comment.name}
                            className="mr-2"
                          />
                          <span className=" font-sec font-semibold">
                            {comment.name}
                          </span>
                          <Moment
                            fromNow
                            className="font-sec ml-2 text-sm font-semibold text-gray-400"
                          >
                            {comment.timeStamp}
                          </Moment>
                        </div>
                        <p className=" font-sec wrap mt-2 text-sm">
                          <Linkify componentDecorator={componentDecorator}>
                            {comment.comment}
                          </Linkify>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="mt-20 flex flex-col justify-center">
                <div className="p-4 text-center">
                  <img src="/no-comments.png" alt="" />
                  <p className=" font-sec">No Comments yet</p>
                  <div className="my-10 h-0.5 w-full bg-gray-700"></div>
                  <img
                    src="/no-comments-left-arrow.png"
                    alt=""
                    className="p-10"
                  />
                  <p className=" font-sec text-gray-500">
                    Type anything on the box below to add a comment.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className=" sticky bottom-0 flex items-end gap-1 bg-gray-800 px-2 pt-3">
        <Textarea
          className="h-5"
          size="sm"
          ref={textareaRef}
          placeholder="Write your message..."
          focusBorderColor="purple.500"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          disabled={!!!newComment || isNewCommentLoading}
          className="ml-2 rounded bg-purple-500 p-1  px-2 transition-all hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          onClick={addNewComment}
        >
          {isNewCommentLoading ? (
            <Spinner size="sm" />
          ) : (
            <svg
              className="w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ThreadsExpanded;
