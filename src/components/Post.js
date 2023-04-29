import React, { useState, useEffect } from "react";
import moment from "moment";
import {
   collection,
   doc,
   deleteDoc,
   onSnapshot,
   orderBy,
   query,
   setDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import { BsThreeDots, BsChat } from "react-icons/bs";
import { HiOutlineTrash } from "react-icons/hi";
import { AiOutlineRetweet, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiShare, FiBarChart2 } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAtom } from "jotai";
import { activePostIdAtom, isShowModalAtom } from "@/atoms/jotaiStore";

const Post = ({ id, post, postPage }) => {
   const { data: session } = useSession();
   const [, setIsOpen] = useAtom(isShowModalAtom);
   const [, setPostId] = useAtom(activePostIdAtom);
   const [likes, setLikes] = useState([]);
   const [liked, setLiked] = useState(false);
   const [comments, setComments] = useState([]);
   const router = useRouter();

   useEffect(
      () =>
         onSnapshot(
            query(
               collection(db, "posts", id, "comments"),
               orderBy("timestamp", "desc")
            ),
            (snapShot) => {
               setComments(snapShot.docs);
            }
         ),
      [db, id]
   );

   useEffect(
      () =>
         onSnapshot(collection(db, "posts", id, "likes"), (snapShot) => {
            setLikes(snapShot.docs);
         }),
      [db, id]
   );

   useEffect(
      () =>
         setLiked(
            likes.findIndex((like) => like.id === session.user.uid) !== -1
         ),
      [likes]
   );

   const likePost = async () => {
      if (liked) {
         await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
      } else {
         await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
            username: session?.user?.name,
         });
      }
   };
   return (
      <div
         className="p-3 flex cursor-pointer border-b border-gray-700 hover:bg-zinc-900/40 transition duration-200 ease-out"
         onClick={() => router.push(`/${id}`)}
      >
         {/* Image Profile */}
         {!postPage && (
            <Image
               src={post?.userImg}
               alt="profile"
               height={44}
               width={44}
               className="rounded-full mr-4 self-start"
            />
         )}
         <div className="flex flex-col space-y-2 w-full">
            <div className={`flex ${!postPage && "justify-between"}`}>
               {postPage && (
                  <Image
                     src={post?.userImg}
                     alt="profile"
                     height={44}
                     width={44}
                     className="rounded-full mr-4 self-start"
                  />
               )}

               {/* UserName */}
               <div className="text-gray-400">
                  <div className="inline-block group">
                     <h4
                        className={`${
                           !postPage && "inline-block"
                        } font-bold text-[15px] sm:text-base text-gray-300 hover:underline`}
                     >
                        {post?.username}
                     </h4>

                     {/* Tag Name */}
                     <span
                        className={`text-sm sm:text-[15px] text-gray-500 ${
                           !postPage && "mx-1.5"
                        }`}
                     >
                        @{post?.tag}
                     </span>
                  </div>
                  ·{/* Timestamp */}
                  <span className="hover:underline text-gray-500 text-sm sm:text-[15px] ml-1.5">
                     {moment(post?.timestamp?.toDate()).fromNow()}
                  </span>
                  {!postPage && (
                     <p className="text-gray-100 text-[15px] sm:text-base mt-0.5">
                        {post?.text}
                     </p>
                  )}
               </div>

               {/* Other */}
               <div className="icon text-gray-500 hover:text-[#1d9bf0] group flex flex-shrink-0 ml-auto">
                  <BsThreeDots />
               </div>
            </div>

            {/* Tweet Description */}
            {postPage && (
               <p className="text-gray-100 text-[15px] sm:text-base mt-0.5">
                  {post?.text}
               </p>
            )}
            {/* Tweet Image */}
            {post?.image && (
               <img
                  src={post?.image}
                  alt=""
                  className="rounded-2xl mr-2 max-h-[700px] object-cover"
               />
            )}
            <div
               className={`text-gray-500 flex justify-between w-10/12 ${
                  postPage && "mx-auto"
               }`}
            >
               {/* Comment Button */}
               <div
                  className="flex items-center space-x-1 group"
                  onClick={(e) => {
                     e.stopPropagation();
                     setPostId(id);
                     setIsOpen(true);
                  }}
               >
                  <div className="icon group-hover:bg-blue-500/10">
                     <BsChat className="text-zinc-700 h-5 group-hover:text-blue-500" />
                  </div>
                  {comments.length > 0 && (
                     <span className="text-sm group-hover:text-blue-500">
                        {comments.length}
                     </span>
                  )}
               </div>
               {/* Delete Button */}
               {session.user.uid === post?.id ? (
                  <div
                     className="flex items-center space-x-1 group"
                     onClick={(e) => {
                        e.stopPropagation();
                        deleteDoc(doc(db, "posts", id));
                        router.push("/");
                     }}
                  >
                     <div className="icon group-hover:bg-red-600/10">
                        <HiOutlineTrash className="text-zinc-700 group-hover:text-red-600" />
                     </div>
                  </div>
               ) : (
                  <div className="flex items-center space-x-1 group">
                     <div className="icon group-hover:bg-green-500/10">
                        <AiOutlineRetweet className=" h-5 text-zinc-600 group-hover:text-green-500" />
                     </div>
                  </div>
               )}
               <div
                  className="flex items-center space-x-1 group"
                  onClick={(e) => {
                     e.stopPropagation();
                     likePost();
                  }}
               >
                  <div className="icon group-hover:bg-pink-600/10">
                     {liked ? (
                        <AiFillHeart className="h-5 text-pink-600" />
                     ) : (
                        <AiOutlineHeart className="h-5 text-zinc-600 group-hover:text-pink-600" />
                     )}
                  </div>
                  {likes.length > 0 && (
                     <span
                        className={`text-sm group-hover:text-pink-600 ${
                           liked && "text-pink-600"
                        }`}
                     >
                        {likes.length}
                     </span>
                  )}
               </div>
               <div className="icon group group-hover:bg-blue-600/10">
                  <FiShare className="text-zinc-700 group-hover:text-blue-600" />
               </div>
               {session.user.uid === post?.id ? (
                  <div className="icon group group-hover:bg-blue-600/10">
                     <FiBarChart2 className="text-zinc-700 group-hover:text-blue-600" />
                  </div>
               ) : (
                  ""
               )}
            </div>
         </div>
      </div>
   );
};

export default Post;
