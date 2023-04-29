import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
   collection,
   doc,
   onSnapshot,
   orderBy,
   query,
} from "@firebase/firestore";
import { db } from "../firebase";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { getProviders, getSession, useSession } from "next-auth/react";
import Modal from "../components/Modal";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import Login from "../components/Login";
import { IoMdArrowBack } from "react-icons/io";
import Post from "../components/Post";
import Comment from "../components/Comment";
import Widgets from "../components/Widgets";
import axios, { AxiosHeaders } from "axios";

const PostPage = ({ trendingResults, followResults, providers }) => {
   const { data: session } = useSession();
   const [isOpen, setIsOpen] = useRecoilState(modalState);
   const [post, setPost] = useState();
   const [comments, setComments] = useState([]);
   const router = useRouter();
   const { id } = router.query;

   useEffect(
      () =>
         onSnapshot(doc(db, "posts", id), (snapshot) => {
            setPost(snapshot.data());
         }),
      [db]
   );

   useEffect(
      () =>
         onSnapshot(
            query(
               collection(db, "posts", id, "comments"),
               orderBy("timestamp", "desc")
            ),
            (snapshot) => setComments(snapshot.docs)
         ),
      [db, id]
   );

   if (!session) return <Login providers={providers} />;

   return (
      <div className="">
         <Head>
            <title>
               {post?.username} on Twitter : {post?.text}
            </title>
            <meta name="description" content="Twitter Clone by Khoerul Rizal" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
            <Sidebar />
            <div className="flex-grow border-x border-1 border-gray-700 max-w-2xl sm:ml-[90px] xl:ml-[315px]">
               <div
                  className="flex items-center px-1.5 py-2 border-b border-gray-700 text-gray-300 font-semibold text-xl gap-x-4 sticky
                 top-0 z-50 bg-black"
               >
                  <div
                     className="hoverAnimation w-9 h-9 flex items-center justify-center px-0 mr-3"
                     onClick={() => router.push("/")}
                  >
                     <IoMdArrowBack className="h-5 w-5 text-white" />
                  </div>
                  Tweet
               </div>
               <Post id={id} post={post} postPage />
               {comments.length > 0 && (
                  <div className="pb-72">
                     {comments.map((comment) => (
                        <Comment
                           key={comment.id}
                           id={comment.id}
                           comment={comment.data()}
                        />
                     ))}
                  </div>
               )}
            </div>
            <Widgets
               trendingResults={trendingResults}
               followResults={followResults}
            />
            {isOpen && <Modal />}
         </main>
      </div>
   );
};

export default PostPage;

export const getServerSideProps = async (context) => {
   const trendingResults = await fetch(
      "https://api.npoint.io/f3438aa0a1e9a86f95b5"
   ).then((res) => res.json());

   const followResults = await fetch(
      "https://api.npoint.io/f90bde69e8e4799ab181"
   ).then((res) => res.json());

   const providers = await getProviders();
   const session = await getSession(context);

   return {
      props: {
         trendingResults,
         followResults,
         providers,
         session,
      },
   };
};
