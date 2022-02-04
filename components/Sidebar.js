import Image from "next/image";
import React from "react";
import SidebarLink from "./SidebarLink";
import { RiHomeSmileFill, RiHashtag, RiFileList2Line } from "react-icons/ri";
import { FiBell } from "react-icons/fi";
import { BiEnvelope } from "react-icons/bi";
import { MdOutlineLogout } from "react-icons/md";
import { HiOutlineBookmark } from "react-icons/hi";
import { CgMoreO } from "react-icons/cg";
import { IoPersonOutline } from "react-icons/io5";
import { GiFeather } from "react-icons/gi";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const Sidebar = () => {
   const { data: session } = useSession();
   return (
      <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[320px] sm:px-3 sm:py-1 fixed h-full">
         <div className="flex items-center justify-center w-12 h-12 hoverAnimation hover:bg-blue-900/20 p-0 xl:ml-12">
            <Image
               src="/twitter-white.png"
               alt="Twitter Logo"
               width={25}
               height={25}
            />
         </div>
         <div className="mb-2.5 xl:ml-10">
            <SidebarLink text="Home" Icon={RiHomeSmileFill} active />
            <SidebarLink text="Explore" Icon={RiHashtag} />
            <SidebarLink text="Notifications" Icon={FiBell} />
            <SidebarLink text="Messages" Icon={BiEnvelope} />
            <SidebarLink text="Bookmarks" Icon={HiOutlineBookmark} />
            <SidebarLink text="Lists" Icon={RiFileList2Line} />
            <SidebarLink text="Profile" Icon={IoPersonOutline} />
            <SidebarLink text="More" Icon={CgMoreO} />
         </div>
         <div>
            <div className="text-2xl xl:hidden text-gray-100 xl:ml-10 p-3 bg-[#1d9bf0] hover:bg-[#1a8cd8] rounded-full cursor-pointer">
               <GiFeather />
            </div>
            <div className="hidden xl:inline">
               <button className="text-gray-100 xl:ml-10 py-4 bg-[#1d9bf0] px-24 hover:bg-[#1a8cd8] rounded-full cursor-pointer font-bold shadow-md">
                  Tweet
               </button>
            </div>
         </div>
         <div className="flex text-gray-100 justify-center items-center gap-3 hoverAnimation p-2.5 xl:ml-auto xl:mr-1 mt-auto mb-3">
            <div>
               <img
                  src={session.user.image}
                  alt="profile"
                  className="rounded-full cursor-pointer"
                  width={40}
                  height={40}
               />
            </div>
            <div className="hidden xl:inline leading-5">
               <h4 className="font-bold text-[16px]">{session.user.name}</h4>
               <p className="text-[#6e767d] text-[14px]">@{session.user.tag}</p>
            </div>
            <MdOutlineLogout className="hidden xl:inline ml-10 mr-2 hover:text-red-500" onClick={() => signOut({ callbackUrl: '/' })} />
         </div>
      </div>
   );
};

export default Sidebar;
