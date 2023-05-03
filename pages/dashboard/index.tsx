import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import StorageStats from "@/components/Dashboard/Stats/StorageStats";
import TotalImagesStats from "@/components/Dashboard/Stats/TotalImagesStats";
import TotalViews from "@/components/Dashboard/Stats/TotalViews";
import React from "react";

const Dashboard = () => {
    return (
        <DashboardLayout>
            <Header title="Dashboard" />
            <div className=" flex gap-10 mt-8">
                <TotalImagesStats />
                <TotalViews />
                <StorageStats />
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
