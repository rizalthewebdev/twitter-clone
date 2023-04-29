import React from "react";
import { BsThreeDots, BsChat } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { FiShare, FiBarChart2 } from "react-icons/fi";
import Image from "next/image";
import moment from "moment";

const Comment = ({ comment }) => {
   return (
      <div className="p-3 flex cursor-pointer border-b border-gray-700 hover:bg-zinc-900/40 transition duration-200 ease-out">
         <Image
            src={comment.userImg}
            width={44}
            height={44}
            alt="userImg"
            className="rounded-full mr-4 self-start"
         />
         <div className="flex flex-col w-full">
            <div className="flex justify-between">
               <div className="text-gray-400">
                  <div className="inline-block group">
                     <h4 className="font-bold inline-block text-[15px] sm:text-base text-gray-300 hover:underline">
                        {comment?.username}
                     </h4>
                     <span className="mx-1.5 text-sm sm:text-[15px]">
                        @{comment?.tag}
                     </span>
                     ·
                     <span className="hover:underline text-gray-500 text-sm sm:text-[15px] ml-1.5">
                        {moment(comment?.timestamp?.toDate()).fromNow()}
                     </span>
                  </div>
               </div>
               <div className="icon group text-gray-500 hover:text-[#1d9bf0] flex flex-shrink-0 ml-auto">
                  <BsThreeDots />
               </div>
            </div>
            <p className="text-gray-300 max-w-lg overflow-scroll scrollbar-hide text-sm -mt-2">
               {comment?.comment}
            </p>
            <div className="text-gray-500 flex justify-between items-center w-10/12 mt-3">
               <BsChat className="text-zinc-700 h-5 group-hover:text-blue-500 group-hover:bg-blue-500/10" />
               <div className="flex items-center space-x-1 group">
                  <div className="icon group-hover:bg-pink-600/10">
                     <AiOutlineHeart className="h-5 text-zinc-700 group-hover:text-pink-600" />
                  </div>
                  <span className="group-hover:text-pink-600 text-sm"></span>
               </div>
               <div className="icon group">
                  <FiShare className="h-5 text-zinc-700 group-hover:text-[#1d9bf0]" />
               </div>
               <div className="icon group">
                  <FiBarChart2 className="h-5 text-zinc-700 group-hover:text-[#1d9bf0]" />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Comment;
