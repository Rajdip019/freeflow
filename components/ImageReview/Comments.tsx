import { db } from '@/lib/firebaseConfig';
import { Input, Spinner, useToast } from '@chakra-ui/react';
import { getDocs, collection, query, orderBy, addDoc } from 'firebase/firestore';
import error from 'next/error';
import React, { useState } from 'react'
import Moment from 'react-moment';

interface Props {
    top: number,
    left: number,
    id: string,
    imageId :  string,
    uname : string,
}

const Comments: React.FC<Props> = ({ top, left, id, imageId, uname }) => {
    const [isShowComments, setIsShowComments] = useState<boolean>(false);
    const [ comments, setComments] = useState<{ name: string; comment: string, timeStamp: number }[]>([]);
    const [newComment, setNewComment] = useState<string>();
    const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(false)

    const toast = useToast();

    const getComments = async () => {
        setIsCommentsLoading(true)
        const _comments: unknown[] = [];
        const querySnapshot = await getDocs(query(
          collection(db, `reviewImages/${imageId}/threads/${id}/comments`), orderBy('timeStamp', 'asc')
        ));
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          _comments.push(doc.data());
        });
        setComments(_comments as { name: string; comment: string ,timeStamp: number }[]);
        setIsCommentsLoading(false)
      };

      const addNewComment = async () => {
        try{
          await addDoc(
            collection(
              db,
              `reviewImages/${imageId}/threads/${id as string}/comments`
            ),
            {
              name: uname,
              comment: newComment,
              timeStamp: Date.now(),
            }
          );
          toast({
            title: "Comment added successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });
          setNewComment("");
          getComments();
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
    }

      
    return (
        <div
            style={{ top: top, left: left }}
            className={`absolute flex ${top > 450 ? 'items-end' : 'items-start'} ${left > 500 ? 'flex-row-reverse' : ' flex-row'}`}
        >
            <button className="" onClick={() => { getComments(); setIsShowComments(true)}}>
                <svg
                    fill="currentColor"
                    className="w-8 mb-1 text-gray-800"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z"
                    />
                </svg>
            </button>
            {isShowComments ? (
                <div className={`bg-gray-800 w-64 p-2 rounded absolute ${left > 500 ? 'right-10' : 'left-10'}  z-50`} >
                    <div className=' flex items-center justify-between mb-1'>
                    <p className=" text-sm font-semibold">Comments</p>
                    <button onClick={() => {
                            setIsShowComments(false)}}>
                            <svg
                              fill="currentColor"
                              className=" w-5"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                clipRule="evenodd"
                                fillRule="evenodd"
                                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                              />
                            </svg>
                          </button>
                    </div>
                    {isCommentsLoading ? (<div className='mt-1 p-2 rounded bg-gray-500 h-10 animate-pulse'></div>) : (
                    <div className=' max-h-52 overflow-y-scroll'>
                    {comments.map((comment, index) => {
                        return(
                            <div key={index} className='mt-1 p-2 rounded bg-gray-900'>
                                <div className=' text-sm font-semibold flex items-center gap-1'>
                                    <p>{comment.name}</p>
                                    <p className=' text-xs'><Moment fromNow>{comment.timeStamp}</Moment></p>
                                </div>
                                <p className=' text-sm'>{comment.comment}</p>
                            </div>
                        )
                    })}
                    </div>
                    )}
                    <div className=" flex mt-2">
                          <Input
                            className="h-5"
                            size="sm"
                            placeholder="Write your message..."
                            focusBorderColor="purple.500"
                            value={newComment}
                            onChange={(e) => {
                                setNewComment(e.target.value)
                            }}
                          />
                          <button
                            disabled={!!!newComment}
                            className="bg-purple-500 hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-gray-400  ml-2 p-1 rounded px-2 transition-all"
                            onClick={addNewComment}
                          >
                            <svg
                              className="w-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                          </button>
                        </div>
                </div>
            ) : null}
        </div>
    )
}

export default Comments