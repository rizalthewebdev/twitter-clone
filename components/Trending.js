import React from "react";
import { BsThreeDots } from "react-icons/bs";

const Trending = ({ result }) => {
   return (
      <div className="flex flex-col items-start transition duration-200 ease-out hover:bg-zinc-800 px-4 py-1 w-full cursor-pointer">
         <div className="flex justify-between items-center w-full -mt-1.5 pt-1 text-xs text-zinc-300/60">
            <p>{result.category}</p>
            <div className="icon group text-zinc-300/60 hover:text-[#1d9bf0] flex flex-shrink-0 ml-auto">
               <BsThreeDots />
            </div>
         </div>
         <div className="-mt-2 pb-2">
            <h4 className="text-base text-gray-200 font-semibold">
               {result.title}
            </h4>
            <p className="text-xs">{result.tweet} Tweets</p>
         </div>
      </div>
   );
};

export default Trending;
