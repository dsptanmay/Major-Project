import NavCards from "@/components/nav-cards";
import { currentUser } from "@clerk/nextjs/server";
import { Eye, FileStack, MessageSquareDot } from "lucide-react";
import React from "react";

async function OrganizationDashboard() {
  const user = await currentUser();
  const cards = [
    {
      title: "Request Access",
      description: "Request access to a particular record",
      icon: <FileStack className="size-6" />,
      url: "/request-access",
    },
    {
      title: "Notifications",
      description: "See the list of pending requests for access to documents",
      icon: <MessageSquareDot className="size-10" />,
      url: "/notifications",
    },
    {
      title: "View Granted Records",
      description: "See the records to which you have been granted access",
      icon: <Eye className="size-10" />,
      url: "/granted-records",
    },
  ];

  return (
    <div className="flex max-h-72 w-full max-w-6xl flex-grow flex-col justify-between space-y-5 border-2 border-border bg-white px-8 py-10 shadow-light">
      <div className="flex flex-col space-y-2">
        <h1>
          Welcome, <span className="font-heading">{user?.username}</span>!
        </h1>
        <h2 className="text-sm font-base text-gray-700">
          Here you can access the functions available to you as an organization
        </h2>
      </div>
      <NavCards cards={cards} />
    </div>
  );
}

export default OrganizationDashboard;
