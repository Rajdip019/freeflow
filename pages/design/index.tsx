import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import ImageUploadModal from "@/components/ImageUploadModal";
import ImageDeleteModalConfirmation from "@/components/Modal/ImageDeleteModalConfirmation";
import { useImageContext } from "@/contexts/ImagesContext";
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
import { APP_URL } from "@/helpers/constants";
import Head from "next/head";
import SendInvitesIconModal from "@/components/ImageReview/SendInvitesIconModal";
import { orderBy } from "lodash-es";
import Copy from "@/components/shared/Copy";
import PublicAndPrivate from "@/components/ImageReview/PublicAndPrivate";

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
                <Th textAlign="right" isNumeric>
                  Password
                </Th>
                <Th isNumeric>Views</Th>
                <Th isNumeric>Created at</Th>
                <Th isNumeric>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderBy(images, ["timeStamp"], ["desc"]).map((image) => {
                return (
                  <Tr className="hover:bg-sec-black text-white" key={image.id}>
                    <Td>
                      <Link
                        target="_blank"
                        rel="noreferrer"
                        href={`/review-image/${image.id}`}
                        className=" flex items-center gap-4"
                      >
                        <img
                          src={image.imageURL}
                          alt=""
                          className=" aspect-square w-8 rounded object-cover "
                        />
                        <p className="group flex items-center gap-2 truncate hover:underline">
                          {image.imageName}{" "}
                        </p>
                        <svg
                          fill="none"
                          className="relative z-40 w-4 cursor-pointer text-gray-400 group-hover:text-white"
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
                    </Td>
                    <Td isNumeric>
                      <div className=" flex justify-end">
                        <PublicAndPrivate image={image} isText={true} />
                      </div>
                    </Td>
                    <Td isNumeric>{image.views}</Td>
                    <Td isNumeric>
                      <Moment className="text-gray-400" format="MMM Do">
                        {image.timeStamp}
                      </Moment>
                    </Td>
                    <Td isNumeric>
                      <div className="flex gap-2">
                        <ImageDeleteModalConfirmation image={image} />
                        <Copy value={`${APP_URL}/review-image/${image.id}`} />
                        <SendInvitesIconModal image={image} />
                      </div>
                    </Td>
                  </Tr>
                );
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
