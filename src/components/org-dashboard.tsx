"use client";
import PageHeader from "@/components/page-header";
import PageFooter from "@/components/page-footer";
import React from "react";
import { useUser } from "@clerk/nextjs";

function OrganizationDashboardPage() {
  const { user } = useUser();
  return (
    <div className="inset-0 flex min-h-screen w-full flex-col items-center justify-between space-y-10 bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
      <PageHeader title="Dashboard" />
      <div className="flex w-full flex-grow p-5">
        <div className="flex w-full flex-grow flex-col space-y-5 border-2 border-black bg-white p-5">
          <h2 className="text-gray-700">
            Welcome, <span className="font-semibold">{user?.username}</span>!
            <br />
            Here you can access the dashboard functions available to you as an
            organization.
          </h2>
          <div className="flex flex-grow items-center">
            <div className="w-container grid w-full max-w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
              <div className="flex flex-col gap-3  border-2 border-border bg-white p-5 shadow-light">
                <h4 className="text-xl font-heading">Upload Document</h4>
                <p>Upload your documents and get them converted to NFTs</p>
              </div>
              <div className="flex flex-col gap-3  border-2 border-border bg-white p-5 shadow-light">
                <h4 className="text-xl font-heading">Records</h4>
                <p>View your added records</p>
              </div>
              <div className="flex flex-col gap-3  border-2 border-border bg-white p-5 shadow-light">
                <h4 className="text-xl font-heading">Notifications</h4>
                <p>
                  See the list of pending requests for access to your documents
                </p>
              </div>
              <div className="flex flex-col gap-3  border-2 border-border bg-white p-5 shadow-light">
                <h4 className="text-xl font-heading">Access Control</h4>
                <p>
                  See the documents which have been granted to organizations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  );
}

export default OrganizationDashboardPage;
