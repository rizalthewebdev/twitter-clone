import Image from "next/image";
import React, { useState, useRef } from "react";
import { db, storage } from "../firebase";
import {
   addDoc,
   collection,
   doc,
   serverTimestamp,
   updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { MdOutlineClose } from "react-icons/md";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";
import { useSession } from "next-auth/react";
import data from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import { useAtom } from "jotai";
import { activePostIdAtom, isShowModalAtom } from "@/atoms/jotaiStore";
import { useRouter } from "next/router";

const Input = ({ isComment = false }) => {
   const router = useRouter();
   const [input, setInput] = useState("");
   const [selectedFile, setSelectedFile] = useState(null);
   const [showEmojis, setShowEmojis] = useState(false);
   const [postId] = useAtom(activePostIdAtom);
   const [, setIsOpen] = useAtom(isShowModalAtom);
   const [loading, setLoading] = useState(false);
   const filePickerRef = useRef();
   const { data: session } = useSession();

   const addImagePost = (e) => {
      const reader = new FileReader();
      if (e.target.files[0]) {
         reader.readAsDataURL(e.target.files[0]);
      }

      reader.onload = (readerEvent) => {
         setSelectedFile(readerEvent.target.result);
      };
   };

   const addEmoji = (e) => {
      const sym = e.unified.split("-");
      const codesArr = [];
      sym.forEach((el) => codesArr.push("0x" + el));
      let emoji = String.fromCodePoint(...codesArr);

      setInput(input + emoji);
   };

   const sendPost = async () => {
      if (loading) return;
      setLoading(true);

      if (isComment) {
         await addDoc(collection(db, "posts", postId, "comments"), {
            comment: input,
            username: session.user.name,
            tag: session.user.tag,
            userImg: session.user.image,
            timestamp: serverTimestamp(),
         });

         router.push(`/${postId}`);
         setIsOpen(false);
      } else {
         const docRef = await addDoc(collection(db, "posts"), {
            id: session.user.uid,
            username: session.user.name,
            userImg: session.user.image,
            tag: session.user.tag,
            text: input,
            timestamp: serverTimestamp(),
         });

         const imageRef = ref(storage, `posts/${docRef.id}/image`);

         if (selectedFile) {
            await uploadString(imageRef, selectedFile, "data_url").then(
               async () => {
                  const downloadURL = await getDownloadURL(imageRef);
                  await updateDoc(doc(db, "posts", docRef.id), {
                     image: downloadURL,
                  });
               }
            );
         }
      }

      setLoading(false);
      setInput("");
      setShowEmojis(false);
      setSelectedFile(null);
   };

   return (
      <div
         className={
            isComment
               ? "mt-7 flex space-x-3 z-[9999]"
               : `border-b border-zinc-800 px-4 py-2 flex space-x-4 items-start ${
                    loading && "opacity-60"
                 }`
         }
      >
         <Image
            src={session.user.image}
            alt="profile"
            className="rounded-full cursor-pointer self-start"
            width={50}
            height={50}
         />
         <div className="flex-col w-full">
            <div
               className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}
            >
               <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={2}
                  className="bg-transparent outline-none w-full mt-2 text-xl placeholder:text-[20px] placeholder:text-gray-500 min-h-[50px] overflow-y-scroll scrollbar-hide text-white"
                  placeholder={
                     isComment ? "Tweet your reply" : "What's happening?"
                  }
               />
               {selectedFile && (
                  <div className="relative">
                     <div
                        className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                        onClick={() => setSelectedFile(null)}
                     >
                        <MdOutlineClose />
                     </div>
                     <Image
                        src={selectedFile}
                        alt="files"
                        className="rounded-2xl max-h-80 object-contain"
                     />
                  </div>
               )}
            </div>
            {!loading && (
               <div className="flex justify-between items-center py-2">
                  {!isComment ? (
                     <div className="flex items-center">
                        <div
                           className="icon"
                           onClick={() => filePickerRef.current.click()}
                        >
                           <HiOutlinePhotograph size={24} />
                           <input
                              type="file"
                              hidden
                              onChange={addImagePost}
                              ref={filePickerRef}
                           />
                        </div>

                        <div
                           className="icon text-xl"
                           onClick={() => setShowEmojis((emo) => !emo)}
                        >
                           {showEmojis ? (
                              <BsEmojiSmileFill />
                           ) : (
                              <BsEmojiSmile />
                           )}
                        </div>

                        {showEmojis && (
                           <div
                              style={{
                                 position: "absolute",
                                 marginTop: "465px",
                                 marginLeft: -40,
                                 maxWidth: "320px",
                                 borderRadius: "20px",
                                 zIndex: 100000,
                              }}
                           >
                              <EmojiPicker
                                 data={data}
                                 onEmojiSelect={addEmoji}
                                 // onClickOutside={() => setShowEmojis(false)}
                                 theme="dark"
                              />
                           </div>
                        )}
                     </div>
                  ) : (
                     <div />
                  )}
                  <button
                     className={`px-5 py-1.5 rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] shadow-md font-semibold disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default ${
                        isComment && "self-end"
                     }`}
                     disabled={!input.trim() && !selectedFile}
                     onClick={sendPost}
                  >
                     {isComment ? "Comment" : "Tweet"}
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

export default Input;
