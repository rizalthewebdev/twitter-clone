import React from "react";

function SidebarLink({ Icon, text, active }) {
   return (
      <div className={`text-gray-100 w-max flex xl:justify-start space-x-5 hoverAnimation ${active && 'font-bold'}`}>
         <Icon className="h-7" fontSize={28}/>
         <span className="hidden xl:inline text-xl">{text}</span>
      </div>
   );
}

export default SidebarLink;
