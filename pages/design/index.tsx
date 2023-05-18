import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import ImageUploadModal from "@/components/ImageUploadModal";
import { useImageContext } from "@/contexts/ImagesContext";
import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import Head from "next/head";
import { orderBy } from "lodash-es";
import DesignsTableRow from "@/components/DesignsTableRow";

const Design = () => {
  const { images } = useImageContext();

  return (
    <DashboardLayout>
      <Head>
        <title>FreeFlow | Design</title>
      </Head>
      <Header title="Designs" />
      <div className="min-h-[88.1vh] px-5 md:min-h-min md:px-10">
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
              {orderBy(images, ["timeStamp"], ["desc"]).map((image) => {
                return <DesignsTableRow image={image} key={image.id} />;
              })}
            </Tbody>
          </Table>
        </TableContainer>
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
