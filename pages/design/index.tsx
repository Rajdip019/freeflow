import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import ImageUploadModal from "@/components/ImageUploadModal";
import ImageDeleteModalConfirmation from "@/components/Modal/ImageDeleteModalConfirmation";
import { useImageContext } from "@/contexts/ImagesContext";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useClipboard,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import Moment from "react-moment";
import { APP_URL } from "@/helpers/constants";
import Head from "next/head";
import SendInvitesIconModal from "@/components/Modal/SendInvitesIconModal";
import { orderBy } from "lodash-es";
import Copy from "@/components/shared/Copy";
import PublicAndPrivate from "@/components/ImageReview/PublicAndPrivate";
import ChangeFileNameModal from "@/components/Modal/ChangeFileNameModal";
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
