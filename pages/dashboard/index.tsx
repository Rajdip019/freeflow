import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import ImagesWithNoFeedback from "@/components/Dashboard/ImagesWithNoFeedback";
import RecentUpdates from "@/components/Dashboard/RecentUpdates";
import StorageStats from "@/components/Dashboard/Stats/StorageStats";
import TotalImagesStats from "@/components/Dashboard/Stats/TotalImagesStats";
import TotalViews from "@/components/Dashboard/Stats/TotalViews";
import Head from "next/head";
import React from "react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Head>
        <title>FreeFlow | Dashboard</title>
      </Head>
      <Header title="Dashboard" />
      <div className=" px-10">
        <div className=" mt-8 flex gap-10 overflow-x-scroll no-scrollbar">
          <TotalImagesStats />
          <TotalViews />
          <StorageStats />
        </div>
        <div className=" mt-10 flex flex-col items-start justify-between gap-10 pb-10 md:flex-row">
          <RecentUpdates />
          <ImagesWithNoFeedback />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
