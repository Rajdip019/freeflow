import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import ImageUploadModal from "@/components/ImageUploadModal";
import ImageDeleteModalConfirmation from "@/components/Modal/ImageDeleteModalConfirmation";
import { useImageContext } from "@/contexts/ImagesContext";
import { useUserContext } from "@/contexts/UserContext";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import Moment from "react-moment";

const Design = () => {
  const { images } = useImageContext();
  const { user } = useUserContext();
  return (
    <DashboardLayout>
      <Header title="Designs" />
      <div className=" min-h-[88.1vh] md:min-h-min px-5 md:px-10">
        <TableContainer className=" mt-5">
          <Table size="sm" colorScheme="purple">
            <Thead>
              <Tr>
                <Th w={"full"}>Name</Th>
                <Th isNumeric>Views</Th>
                <Th isNumeric>Created at</Th>
                <Th isNumeric>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {images.map((image) => {
                return (
                  <Tr className=" text-white" key={image.id}>
                    <Td>{image.imageName}</Td>
                    <Td isNumeric>{image.views}</Td>
                    <Td isNumeric>
                      <Moment className=" text-gray-400" format="MMM Do YYYY">{image.timeStamp}</Moment>
                    </Td>
                    <Td isNumeric>
                      <div className=" flex gap-2">
                        <ImageDeleteModalConfirmation image={image} />
                        <Link
                          target="_blank"
                          rel="noreferrer"
                          href={`/review-image/${image.id}?uname=${user?.name}`}
                        >
                          <svg
                            fill="none"
                            className=" w-5 hover:text-white text-gray-400 cursor-pointer"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                            />
                          </svg>
                        </Link>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        {images.length === 0 && (
          <div className=" flex justify-center flex-col gap-5 items-center text-white font-semibold mt-24">
            <span className=" text-2xl">Upload a image to start 🚀</span>
            <ImageUploadModal />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Design;
