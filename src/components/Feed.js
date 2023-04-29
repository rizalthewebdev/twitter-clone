import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoSparklesOutline } from "react-icons/io5";
import Input from "./Input";
import { useSession } from "next-auth/react";
import { db } from "../firebase";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import Post from "./Post";

const Feed = () => {
   const [posts, setPosts] = useState([]);

   useEffect(
      () =>
         onSnapshot(
            query(collection(db, "posts"), orderBy("timestamp", "desc")),
            (snapShot) => {
               setPosts(snapShot.docs);
            }
         ),
      [db]
   );

   return (
      <div className="text-gray-100 flex-grow border-l border-r border-zinc-800 max-w-2xl sm:ml-[90px] xl:ml-[315px]">
         <div className="flex items-center justify-between py-3 px-4 sticky top-0 z-50 bg-black/75 backdrop-blur-sm">
            <h4 className="text-lg font-bold cursor-pointer">Home</h4>
            <span className="p-2 hoverAnimation rounded-full">
               <IoSparklesOutline className="text-lg -rotate-90" />
            </span>
         </div>
         <Input />
         <div>
            {posts.map((post) => (
               <Post key={post.id} id={post.id} post={post.data()} />
            ))}
         </div>
      </div>
   );
};

export default Feed;
