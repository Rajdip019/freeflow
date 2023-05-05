import { defaultHighlightedThread } from "@/helpers/constants";
import { IThread } from "@/interfaces/Thread";
import { db } from "@/lib/firebaseConfig";
import { Spinner, Textarea, useToast } from "@chakra-ui/react";
import {
    getDocs,
    query,
    collection,
    orderBy,
    addDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import error from "next/error";
import React, { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import Linkify from 'react-linkify';
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
    const [isNewCommentLoading, setIsNewCommentLoading] = useState<boolean>(false)

    const toast = useToast();
    const { authUser } = useAuth()

    const getComments = async () => {
        setIsCommentsLoading(true);
        const _comments: unknown[] = [];
        const querySnapshot = await getDocs(
            query(
                collection(
                    db,
                    `reviewImages/${imageId}/threads/${highlightedComment.id}/comments`
                ),
                orderBy("timeStamp", "asc")
            )
        );
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            _comments.push(doc.data());
        });
        setComments(
            _comments as { name: string; comment: string; timeStamp: number }[]
        );
        setIsCommentsLoading(false);
    };

    useEffect(() => {
        getComments();
    }, [highlightedComment]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [textareaRef, highlightedComment]);

    const addNewComment = async () => {
        setIsNewCommentLoading(true)
        try {
            const name = uname ? uname : authUser?.displayName
            await addDoc(
                collection(
                    db,
                    `reviewImages/${imageId}/threads/${highlightedComment.id as string
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
                newUpdate: "New Comment"
            });
            toast({
                title: "Comment added successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setNewComment("");
            getComments();
            setIsNewCommentLoading(false)
        } catch (e) {
            console.error("Error", error);
            toast({
                title: "Something went wring please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setIsCommentsLoading(false)
        }
    };

    const componentDecorator = (href: string, text: string, key: any) => (
        <a className="linkify__text" href={href} key={key} target="_blank">
            {text}
        </a>
    );

    return (
        <div className=" flex flex-col justify-between h-[91vh]">
            <div>
                <div
                    className=" sticky top-0 justify-between border-b border-gray-600 bg-[#581C87] py-2 px-2 text-lg font-semibold flex items-center  w-full"
                >
                    <button onClick={() => {
                        setIsFocusedThread(false);
                        setHighlightedComment(defaultHighlightedThread);
                    }}>

                        <svg
                            fill="none"
                            className=" w-5 mr-3"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                            />
                        </svg>
                    </button>
                    <p> {comments.length} Comments</p>
                </div>
                <div className="mb-1.5 bg-gray-700 flex">
                    <div className={`w-1 bg-${highlightedComment.color}`}></div>
                    <div className="p-2">
                        <span className=" font-semibold">{highlightedComment.name}</span>
                        <Moment fromNow className="ml-2">
                            {highlightedComment.timeStamp}
                        </Moment>
                        <p>{highlightedComment.initialComment}</p>
                    </div>
                </div>
                {isCommentsLoading ? (
                    <div className=" flex flex-col gap-1.5">
                        <div className=" rounded h-14 mx-2 animate-pulse bg-gray-700"></div>
                        <div className=" rounded h-14 mx-2 animate-pulse bg-gray-700"></div>
                        <div className=" rounded h-14 mx-2 animate-pulse bg-gray-700"></div>
                        <div className=" rounded h-14 mx-2 animate-pulse bg-gray-700"></div>
                    </div>
                ) : (
                    <>
                        {comments.length > 0 ? (
                            <>
                                {comments.map((comment, index: number) => {
                                    return (
                                        <div
                                            className=" border-b border-gray-600 bg-gray-700 flex"
                                            key={comment.timeStamp}
                                        >
                                            <div className="p-2 pl-5">
                                                <span className=" font-semibold">{comment.name}</span>
                                                <Moment fromNow className="ml-2">
                                                    {comment.timeStamp}
                                                </Moment>
                                                <p>
                                                    <Linkify componentDecorator={componentDecorator}>{comment.comment}</Linkify>
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <div className="text-center">
                                <p className=" font-semibold mt-4">
                                    No comments in this thread !
                                </p>
                                <p className=" mt-1">Add first comment to this thread.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className=" flex gap-1 items-end px-2 sticky bottom-0 bg-gray-800 py-3">
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
                    className="bg-purple-500 hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-gray-400  ml-2 p-1 rounded px-2 transition-all"
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
