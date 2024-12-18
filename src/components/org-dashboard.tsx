"use client";
import PageHeader from "@/components/page-header";
import PageFooter from "@/components/page-footer";
import React from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Eye, FileStack, MessageSquareDot } from "lucide-react";

function OrganizationDashboardPage() {
  const { user } = useUser();

  const cards = [
    {
      title: "View Granted Records",
      description: "See the records to which you have been granted access",
      url: "/granted-records",
      icon: <Eye />,
    },
    {
      title: "Request Access",
      description: "Request access to a particular record",
      url: "/request-access",
      icon: <FileStack />,
    },
    {
      title: "Notifications",
      description: "See the list of pending requests for access to documents",
      url: "/org_notifications",
      icon: <MessageSquareDot />,
    },
  ];
  return (
    <div className="inset-0 flex min-h-screen w-full flex-col items-center justify-between space-y-10 bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
      <PageHeader title="Dashboard" />
      <div className="flex w-full px-5">
        <div className="flex w-full flex-col space-y-8 border-2 border-black bg-white p-8">
          <h2 className="text-gray-700">
            Welcome, <b>{user?.username}</b>!
            <br />
            Here you can access the dashboard functions available to you as an
            organization.
          </h2>
          <div className="flex items-center">
            <div className="w-container grid w-full max-w-full grid-cols-3 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card, i) => (
                <Link href={card.url} key={i}>
                  <div
                    className="flex min-h-full flex-grow -translate-x-1 -translate-y-1 items-center space-x-5 border-2 border-border bg-white px-5 py-5 shadow-light transition-all duration-200 hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0"
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

export default OrganizationDashboardPage;
