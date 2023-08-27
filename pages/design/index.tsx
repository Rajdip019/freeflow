import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import ImageUploadModal from "@/components/ImageUploadModal";
import { useImageContext } from "@/contexts/ImagesContext";
import React, { useState } from "react";
import Head from "next/head";
import { orderBy } from "lodash-es";
import DesignsTableRow from "@/components/DesignsTableRow";
import DesignsGridView from "@/components/DesignsGridView";
import { HamburgerIcon } from "@chakra-ui/icons";
import DesignsTableRow2 from "@/components/DesignsTableRow";
import { Space, Tooltip } from "antd";

const Design = () => {
  const { images } = useImageContext();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredImages = images.filter((image) =>
    image.imageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isGridView, setIsGridView] = useState<boolean>(false);
  return (
    <DashboardLayout>
      <Head>
        <title>FreeFlow | Design</title>
      </Head>
      <Header title="Designs" />
      <section className="flex w-full items-center justify-between px-5 md:px-10">
        <div className="flex w-full items-center gap-5">
          <p className="text-xl text-[#94A3B8] ">Sort</p>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Designs"
              className="w-full rounded-md bg-[#20232A] px-3 py-2 text-white placeholder-gray-400 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Tooltip title="List View" aria-title="List View">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={`h-6 w-6 cursor-pointer transition-all ${
                  !isGridView
                    ? "h-7 w-7 text-purple-500 "
                    : "h-5 w-5 text-gray-500 "
                }`}
                onClick={() => setIsGridView(false)}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                />
              </svg>
            </Tooltip>
            <Tooltip title="Grid View" aria-title="Grid View">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.7"
                stroke="currentColor"
                className={`cursor-pointer transition-all  ${
                  isGridView
                    ? "h-7 w-7 text-purple-500 "
                    : "h-5 w-5 text-gray-500 "
                }`}
                onClick={() => setIsGridView(true)}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
            </Tooltip>
          </div>
        </div>
      </section>
      <div className="min-h-[88.1vh] px-5 md:min-h-min md:px-10">
        {isGridView ? (
          <div className="container mx-auto py-8">
            <div className="flex flex-wrap gap-4">
              {orderBy(filteredImages, ["timeStamp"], ["desc"]).map((image) => {
                return <DesignsGridView image={image} key={image.id} />;
              })}
            </div>
          </div>
        ) : (
          <div className="my-4">
            <DesignsTableRow images={images} />
          </div>
        )}

        {images.length === 0 && (
          <div className="mt-24 flex flex-col items-center justify-center gap-5 font-semibold text-white">
            <span className="text-2xl">Upload a image to start 🚀</span>
            <ImageUploadModal />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Design;
