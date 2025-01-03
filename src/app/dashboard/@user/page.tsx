import { currentUser } from "@clerk/nextjs/server";
import {
  FileStack,
  FolderCog,
  History,
  MessageSquareDot,
  UploadIcon,
} from "lucide-react";
import NavCards from "@/components/nav-cards";
import React from "react";

async function UserDashboard() {
  const user = await currentUser();
  const cards = [
    {
      title: "Upload Document",
      description: "Upload your documents and get them converted to NFTs",
      url: "/upload",
      icon: <UploadIcon className="size-10" />,
    },
    {
      title: "Records",
      description: "View your added records",
      url: "/records",
      icon: <FileStack className="size-6" />,
    },
    {
      title: "Notifications",
      description:
        "See the list of pending requests for access to your documents",
      url: "/notifications",
      icon: <MessageSquareDot className="size-10" />,
    },
    {
      title: "Access Control",
      description: "See the documents which have been granted to organizations",
      url: "/access-control",
      icon: <FolderCog className="size-10" />,
    },
    {
      title: "History",
      description: "See the list of events conducted with your records",
      url: "/history",
      icon: <History className="size-8" />,
    },
  ];

  return (
    <div className="flex w-full max-w-6xl flex-col space-y-6 border-2 border-border bg-white px-8 py-10 shadow-light">
      <div className="flex flex-col space-y-2">
        <h1>
          Welcome, <span className="font-heading">{user?.username}</span>!
        </h1>
        <h2 className="text-sm font-base text-gray-700">
          Here you can access the functions available to you as a user
        </h2>
      </div>
      {/* <TestCards cards={cards} /> */}
      <NavCards cards={cards} />
    </div>
  );
}

export default UserDashboard;
