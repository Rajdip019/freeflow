import { defaultHighlightedThread } from "@/utils/constants";
import { db } from "@/lib/firebaseConfig";
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
import { FFButton } from "@/theme/themeConfig";
import { ArrowRightOutlined, LeftOutlined } from "@ant-design/icons";
import { Divider, Typography, Input, Image } from "antd";
import { useFeedbackContext } from "@/contexts/FeedbackContext";
import { useNotification } from "../shared/Notification";
import Avatar from "react-avatar";

interface Props {
  designId: string;
  workspaceId: string;
}

const FeedbackExpanded: React.FC<Props> = ({ designId, workspaceId }) => {
  const [comments, setComments] = useState<
    { name: string; comment: string; timeStamp: number }[]
  >([]);
  const [newComment, setNewComment] = useState<string>();
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { TextArea } = Input;
  const {
    uname,
    highlightedComment,
    setHighlightedComment,
    setIsFocusedThread,
  } = useFeedbackContext();

  const { notify, contextHolder } = useNotification();
  const { authUser } = useAuth();
  const getReplies = async () => {
    if (highlightedComment !== defaultHighlightedThread) {
      const q = query(
        collection(
          db,
          `workspaces/${workspaceId}/designs/${designId}/comments/${highlightedComment?.id}/replies`
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
    getReplies();
    setIsCommentsLoading(false);
  }, [highlightedComment]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef, highlightedComment]);

  const addNewReply = async () => {
    try {
      const name = uname
        ? uname.slice(0, uname.indexOf("@"))
        : authUser?.email?.slice(0, authUser?.email?.indexOf("@"));
      await addDoc(
        collection(
          db,
          `workspaces/${workspaceId}/designs/${designId}/comments/${
            highlightedComment?.id as string
          }/replies`
        ),
        {
          name: name,
          comment: newComment,
          timeStamp: Date.now(),
        }
      );
      setNewComment("");
    } catch (e) {
      console.error("Error", error);
      notify({
        type: "error",
        message: "Something went wring please try again.",
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
      {contextHolder}
      <div className="pl-1.5">
        <div className=" bg-sec sticky -top-[0.3rem] flex w-full items-center py-2 text-lg font-semibold md:pl-4">
          <FFButton
            size="small"
            onClick={() => {
              setIsFocusedThread(false);
              setHighlightedComment(defaultHighlightedThread);
            }}
            className=" mr-3"
          >
            <LeftOutlined />
          </FFButton>
          <Typography.Text style={{ fontSize: 18 }} className=" font-sec">
            Feedbacks
          </Typography.Text>
          <Typography.Text className=" bg-p ml-2 flex h-6 w-6 items-center justify-center rounded-full">
            {comments.length}
          </Typography.Text>
        </div>
        <Divider className="my-2" />
        <div className="flex md:pl-4">
          <div className="py-2">
            <div className=" flex items-center">
              <Avatar
                name={highlightedComment?.name[0]}
                alt={highlightedComment?.name[0]}
                size="30"
                round={true}
                className="relative mr-2"
              />
              <span className=" font-sec ">{highlightedComment?.name}</span>
              <Moment
                fromNow
                className="font-sec ml-2 text-sm font-semibold text-gray-400"
              >
                {highlightedComment?.timeStamp}
              </Moment>
            </div>
            <Typography.Paragraph className=" font-sec mt-2 text-sm">
              {highlightedComment?.initialComment}
            </Typography.Paragraph>
          </div>
        </div>
        <Divider className="mb-1 mt-1" />
        <Divider className="mb-2 mt-1" />
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
                    <>
                      <div
                        className=" flex flex-col pl-4"
                        key={comment.timeStamp}
                      >
                        <div className="p-2">
                          <div className=" mb-1 flex items-center">
                            <Avatar
                              name={comment.name[0]}
                              alt={comment.name[0]}
                              size="30"
                              round={true}
                              className="relative mr-2"
                            />
                            <Typography.Text strong className=" font-sec">
                              {comment.name}
                            </Typography.Text>
                            <Moment
                              fromNow
                              className="font-sec ml-2 text-sm text-gray-400"
                            >
                              {comment.timeStamp}
                            </Moment>
                          </div>
                          <Typography.Text className=" font-sec wrap text-sm">
                            <Linkify componentDecorator={componentDecorator}>
                              {comment.comment}
                            </Linkify>
                          </Typography.Text>
                        </div>
                      </div>
                      <Divider className="my-1" />
                    </>
                  );
                })}
              </>
            ) : (
              <div className="mt-20 flex flex-col justify-center">
                <div className="p-4 text-center">
                  <Image
                    src="/feedbackDrawer/empty-state-replies.png"
                    alt=""
                    preview={false}
                  />
                  <Typography.Text className=" font-sec text-gray-400">
                    No Comments yet
                  </Typography.Text>
                  <br />
                  <Typography.Text className=" font-sec text-gray-400">
                    Click anywhere on the visual to add a comment
                  </Typography.Text>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className=" sticky bottom-0 flex items-end gap-1 pl-4 pr-2 pt-3">
        <TextArea
          className="h-5"
          size="small"
          rows={3}
          ref={textareaRef}
          placeholder="Write your message..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <FFButton
          disabled={!!!newComment}
          type="primary"
          className="px-2"
          onClick={addNewReply}
        >
          <ArrowRightOutlined />
        </FFButton>
      </div>
    </div>
  );
};

export default FeedbackExpanded;
