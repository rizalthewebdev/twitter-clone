import React, { useState, useRef } from "react";
import { RiSearchLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import Trending from "./Trending";

const Widgets = ({ trendingResults, followResults }) => {
   const searchRef = useRef();
   const [searchFocus, setSearchFocus] = useState(false);

   console.log({ trendingResults, followResults });

   return (
      <div className="sticky top-0 hidden lg:inline max-w-[425px] min-w-[350px] py-1 space-y-2.5 pl-8 h-max mb-[100px]">
         <div
            className={`sticky top-0 py-1.5 bg-black z-50 w-11/12 xl:w-10/12`}
         >
            <div
               className={`flex items-center ${
                  searchFocus
                     ? "bg-transparent border border-blue-600"
                     : "bg-zinc-800/80"
               } py-3 px-5 rounded-full relative`}
               onClick={() => searchRef.current.focus()}
            >
               <RiSearchLine
                  className={`text-xl ${
                     searchFocus ? "text-blue-600" : "text-gray-500"
                  }`}
               />
               <input
                  type="text"
                  ref={searchRef}
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                  className="outline-none w-full pl-5 bg-transparent placeholder:text-gray-500 placeholder:text-[15px] text-gray-300"
                  placeholder="Search Twitter"
               />
            </div>
         </div>
         <div className=" flex flex-col pt-2 w-11/12 xl:w-10/12 bg-zinc-800/60 rounded-2xl text-gray-500">
            <div className="flex justify-between items-center px-4 pb-2 text-gray-200 text-lg">
               <h4 className="font-bold">Trends for you</h4>
               <div className="hoverAnimation p-2 rounded-full ">
                  <FiSettings className="font-xl" />
               </div>
            </div>
            {trendingResults?.map((result, index) => (
               <Trending key={index} result={result} />
            ))}
            <p className="px-4 py-3 cursor-pointer text-blue-500 hover:bg-zinc-800 text-[15px] rounded-b-2xl">
               Show more
            </p>
         </div>
         <div className="flex flex-col pt-2 w-11/12 xl:w-10/12 bg-zinc-800/60 rounded-2xl text-gray-500">
            <div className="flex justify-start items-center px-4 pb-2 text-gray-200 text-lg">
               <h4 className="font-bold">Who to follow</h4>
            </div>
            {followResults?.map((follow, index) => (
               <div
                  key={index}
                  className="flex  justify-between p-3 items-center hover:bg-zinc-800 cursor-pointer"
               >
                  <div className="flex space-x-3">
                     <img
                        src={follow.userImg}
                        alt=""
                        className="w-12 h-12 rounded-full"
                     />
                     <div className="flex flex-col items-start">
                        <h5 className="text-gray-200 font-bold hover:underline">
                           {follow.username}
                        </h5>
                        <p className="text-sm">{follow.tag}</p>
                     </div>
                  </div>
                  <button className="px-5 py-2 rounded-full bg-gray-100 text-black font-semibold text-sm">
                     Follow
                  </button>
               </div>
            ))}
            <p className="px-4 py-3 cursor-pointer text-blue-500 hover:bg-zinc-800 text-[15px] rounded-b-2xl">
               Show more
            </p>
         </div>
         <div className="flex flex-wrap gap-x-5 pl-3 text-[12.5px] font-[500] text-gray-500 pt-2 w-11/12 xl:w-10/12">
            <p className="footer">Terms of Service</p>
            <p className="footer">Privacy Policy</p>
            <p className="footer">Cookie Policy</p>
            <p className="footer">Accessibility</p>
            <p className="footer">Ads info</p>
            <p className="footer">More ...</p>
         </div>
         <p className="pl-3 text-[12.5px] font-[500] text-gray-500">
            &copy; 2022 Twitter, Inc.
         </p>
      </div>
   );
};

export default Widgets;
