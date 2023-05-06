import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import ImagesWithNoFeedback from "@/components/Dashboard/ImagesWithNoFeedback";
import RecentUploads from "@/components/Dashboard/RecentUploads";
import StorageStats from "@/components/Dashboard/Stats/StorageStats";
import TotalImagesStats from "@/components/Dashboard/Stats/TotalImagesStats";
import TotalViews from "@/components/Dashboard/Stats/TotalViews";
import React from "react";

const Dashboard = () => {
    return (
        <DashboardLayout>
            <Header title="Dashboard" />
            <div className=" px-10">
                <div className=" flex gap-10 mt-8 overflow-x-scroll">
                    <TotalImagesStats />
                    <TotalViews />
                    <StorageStats />
                </div>
                <div className=" mt-10 flex flex-col md:flex-row justify-between gap-10 items-start pb-10">
                    <RecentUploads />
                    <ImagesWithNoFeedback />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
