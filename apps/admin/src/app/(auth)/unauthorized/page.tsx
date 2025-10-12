"use client";

import { useAuth } from "@clerk/nextjs";

const Page = () => {
  const { signOut } = useAuth();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <h1 className="text-3xl font-bold">You do not have an access!</h1>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
};

export default Page;
