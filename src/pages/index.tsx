import Head from "next/head";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "../components/Login";
import Modal from "../components/Modal";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import Widgets from "../components/Widgets";
import axios from "axios";

export default function Home({ trendingResults, followResults, providers }) {
   const { data: session } = useSession();
   const [isOpen, setIsOpen] = useRecoilState(modalState);

   if (!session) return <Login providers={providers} />;
   return (
      <div className="">
         <Head>
            <title>Twitter Clone</title>
            <meta name="description" content="Twitter Clone by Khoerul Rizal" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
            <Sidebar />
            <Feed />
            <Widgets
               trendingResults={trendingResults}
               followResults={followResults}
            />
            {isOpen && <Modal />}
         </main>
      </div>
   );
}

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
