import React, { Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import {
   onSnapshot,
   doc,
   collection,
   addDoc,
   serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { MdOutlineClose } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import Image from "next/image";
import moment from "moment";

const Modal = () => {
   const { data: session } = useSession();
   const [isOpen, setIsOpen] = useRecoilState(modalState);
   const [post, setPost] = useState();
   const [showEmojis, setShowEmojis] = useState(false);
   const [postId, setPostId] = useRecoilState(postIdState);
   const [comment, setComment] = useState("");
   const router = useRouter();

   useEffect(
      () =>
         onSnapshot(doc(db, "posts", postId), (snapShot) => {
            setPost(snapShot.data());
         }),
      [db]
   );

   const addEmoji = (e) => {
      const sym = e.unified.split("-");
      const codesArr = [];
      sym.forEach((el) => codesArr.push("0x" + el));
      let emoji = String.fromCodePoint(...codesArr);

      setInput(input + emoji);
   };

   const sendComment = async (e) => {
      e.preventDefault();

      await addDoc(collection(db, "posts", postId, "comments"), {
         comment,
         username: session.user.name,
         tag: session.user.tag,
         userImg: session.user.image,
         timestamp: serverTimestamp(),
      });

      setIsOpen(false);
      setComment("");

      router.push(`/${postId}`);
   };

   return (
      <Transition show={isOpen}>
         <Dialog
            as="div"
            className="fixed z-50 inset-0 pt-8"
            onClose={setIsOpen}
         >
            <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 text-center sm:block sm:p-0">
               <Transition.Child
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
               </Transition.Child>
               <Transition.Child
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
               >
                  <div className="inline-block align-bottom bg-black rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                     <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                        <div
                           className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                           onClick={() => setIsOpen(false)}
                        >
                           <MdOutlineClose className="w-[22px] text-white" />
                        </div>
                     </div>
                     <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                        <div className="w-full">
                           <div className="text-[#6e767d] flex gap-x-3 relative">
                              <span className="w-0.5 h-full -z-10 absolute left-5 top-11 bg-gray-600" />
                              <Image
                                 src={post?.userImg}
                                 alt="userImg"
                                 width={44}
                                 height={44}
                                 className="self-start rounded-full"
                              />
                              <div>
                                 <div className="inline-block group">
                                    <h4 className="inline-block font-bold text-[15px] sm:text-base text-gray-300">
                                       {post?.username}
                                    </h4>
                                    <span className="text-sm mx-1.5 sm:text-[15px] text-gray-500">
                                       @{post?.tag}
                                    </span>
                                 </div>
                                 ·
                                 <span className="hover:underline text-gray-500 text-sm sm:text-[15px] ml-1.5">
                                    {moment(
                                       post?.timestamp?.toDate()
                                    ).fromNow()}
                                 </span>
                                 <p className="text-gray-300 text-[15px] sm:text-base">
                                    {post?.text}
                                 </p>
                              </div>
                           </div>

                           <div className="mt-7 flex space-x-3 w-full">
                              <Image
                                 src={session.user.image}
                                 alt=""
                                 height={44}
                                 width={44}
                                 className="rounded-full self-start"
                              />
                              <div className="flex-grow mt-2">
                                 <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tweet your reply"
                                    className="bg-transparent outline-none text-gray-200 placeholder-gray-500 tracking-wide w-full min-h-[50px]"
                                 />
                                 <div className="flex justify-between items-center soace-x-3 mt-10">
                                    <div
                                       className="icon text-xl"
                                       onClick={() =>
                                          setShowEmojis((emo) => !emo)
                                       }
                                    >
                                       <BsEmojiSmile />
                                    </div>

                                    <button
                                       className="px-5 py-1.5 rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] shadow-md font-semibold text-gray-200 disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                                       disabled={!comment.trim()}
                                       onClick={sendComment}
                                    >
                                       Reply
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </Transition.Child>
            </div>
         </Dialog>
      </Transition>
   );
};

export default Modal;
