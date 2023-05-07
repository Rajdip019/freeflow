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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import Moment from "react-moment";
import CopyToClipboard from "react-copy-to-clipboard";
import { template } from "@/helpers/apiTemplateString";
import Head from "next/head";

const Design = () => {
  const { images } = useImageContext();

  const [tooltipText, setTooltipText] = useState<string>("Copy");

  const handleClick = () => {
    setTooltipText("Copied");

    setTimeout(() => {
      setTooltipText("Copy");
    }, 5000);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>FreeFlow | Design</title>
      </Head>
      <Header title="Designs" />
      <div className=" min-h-[88.1vh] px-5 md:min-h-min md:px-10">
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
                    <Td>
                      <Link
                        target="_blank"
                        rel="noreferrer"
                        href={`/review-image/${image.id}`}
                      >
                        <p className=" group flex items-center gap-2 hover:underline">
                          {image.imageName}{" "}
                          <svg
                            fill="none"
                            className=" w-4 cursor-pointer text-gray-400 group-hover:text-white"
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
                        </p>
                      </Link>
                    </Td>
                    <Td isNumeric>{image.views}</Td>
                    <Td isNumeric>
                      <Moment className=" text-gray-400" format="MMM Do YYYY">
                        {image.timeStamp}
                      </Moment>
                    </Td>
                    <Td isNumeric>
                      <div className=" flex gap-2">
                        <ImageDeleteModalConfirmation image={image} />
                        <Tooltip label={tooltipText}>
                          <div onClick={handleClick}>
                            <CopyToClipboard
                              text={`${template}/review-image/${image.id}`}
                            >
                              <svg
                                className=" w-5 cursor-pointer text-gray-400 hover:text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  clipRule="evenodd"
                                  fillRule="evenodd"
                                  d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
                                />
                              </svg>
                            </CopyToClipboard>
                          </div>
                        </Tooltip>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        {images.length === 0 && (
          <div className=" mt-24 flex flex-col items-center justify-center gap-5 font-semibold text-white">
            <span className=" text-2xl">Upload a image to start 🚀</span>
            <ImageUploadModal />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Design;
