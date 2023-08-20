import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import ImageUploadModal from "@/components/ImageUploadModal";
import { useImageContext } from "@/contexts/ImagesContext";
import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useState } from "react";
import Head from "next/head";
import { orderBy } from "lodash-es";
import DesignsTableRow from "@/components/DesignsTableRow";
import DesignsGridView from "@/components/DesignsGridView";

const Design = () => {
  const { images } = useImageContext();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredImages = images.filter((image) =>
    image.imageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isGridView, setIsGridView] = useState<boolean>(true);
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
          <div className="flex items-center gap-5">
            <button
              className={`${
                isGridView ? "bg-purple-500" : "bg-[#20232A]"
              } rounded-md px-3 py-2 text-white focus:outline-none`}
              onClick={() => setIsGridView(true)}
            >
              Grid
            </button>
            <button
              className={`${
                isGridView ? "bg-[#20232A]" : "bg-purple-500"
              } rounded-md px-3 py-2 text-white focus:outline-none`}
              onClick={() => setIsGridView(false)}
            >
              Table
            </button>
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
          <TableContainer className="mt-5">
            <Table size="sm" colorScheme="purple">
              <Thead>
                <Tr>
                  <Th w={"full"}>Name</Th>
                  {/* <Th textAlign="right" isNumeric>
                    Password
                  </Th> */}
                  <Th textAlign="right" isNumeric>
                    Versions
                  </Th>
                  <Th isNumeric>Views</Th>
                  <Th isNumeric>Created at</Th>
                  <Th isNumeric>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orderBy(filteredImages, ["timeStamp"], ["desc"]).map(
                  (image) => {
                    return <DesignsTableRow image={image} key={image.id} />;
                  }
                )}
              </Tbody>
            </Table>
          </TableContainer>
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
