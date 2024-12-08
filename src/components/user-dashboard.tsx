"use client";
import PageHeader from "@/components/page-header";
import PageFooter from "@/components/page-footer";
import React from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  FileStack,
  FolderCog,
  MessageSquareDot,
  UploadIcon,
} from "lucide-react";

function UserDashboardPage() {
  const { user } = useUser();

  const cards = [
    {
      title: "Upload Document",
      description: "Upload your documents and get them converted to NFTs",
      url: "/upload",
      icon: <UploadIcon />,
    },
    {
      title: "Records",
      description: "View your added records",
      url: "/records",
      icon: <FileStack />,
    },
    {
      title: "Notifications",
      description:
        "See the list of pending requests for access to your documents",
      url: "/notifications",
      icon: <MessageSquareDot />,
    },
    {
      title: "Access Control",
      description: "See the documents which have been granted to organizations",
      url: "/access-control",
      icon: <FolderCog />,
    },
  ];
  return (
    <div className="inset-0 flex min-h-screen w-full flex-col items-center justify-between space-y-10 bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
      <PageHeader title="Dashboard" />
      <div className="flex w-full px-5">
        <div className="flex w-full flex-col space-y-8 border-2 border-black bg-white p-8">
          <h2 className="text-gray-700">
            Welcome, <span className="font-semibold">{user?.username}</span>!
            <br />
            Here you can access the dashboard functions available to you as a
            user.
          </h2>
          <div className="flex items-center">
            <div className="w-container grid w-full max-w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
              {cards.map((card, i) => (
                <Link href={card.url} key={i}>
                  <div
                    className="flex -translate-x-1 -translate-y-1 items-center space-x-5 border-2 border-border bg-white px-5 py-5 shadow-light transition-all duration-200 hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0"
                    key={i}
                  >
                    {card.icon}
                    <div>
                      <h4 className="text-xl font-heading">{card.title}</h4>
                      <p>{card.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  );
}

export default UserDashboardPage;
