import { IReviewImageData } from "@/interfaces/ReviewImageData";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
  Tr,
  useClipboard,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import Moment from "react-moment";
import Copy from "./shared/Copy";
import { APP_URL } from "@/utils/constants";
import PublicAndPrivate from "./ImageReview/PublicAndPrivate";
import ChangeFileNameModal from "./Modal/ChangeFileNameModal";
import SendInvitesIconModal from "./Modal/SendInvitesIconModal";
import VersionUploadModal from "./VersionControl/VersionUploadModal";
import {
  Table,
  Image,
  Tag,
  Typography,
  Button,
  Space,
  MenuProps,
  Dropdown,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import ImageDeleteModalConfirmation from "./Modal/ImageDeleteModalConfirmation";
const { Column } = Table;
interface Props {
  images: IReviewImageData[];
}

const DesignsTableRow: React.FC<Props> = ({ images }) => {
  return (
    <>
      <Table dataSource={images} scroll={{ x: 300 }} pagination={false}>
        <Column
          title="Design"
          dataIndex="imageName"
          key="imageName"
          render={(text, record: IReviewImageData) => (
            <div className="flex cursor-pointer items-center gap-2">
              <Image
                src={
                  record.currentVersion
                    ? record.imageURL[record.currentVersion - 1]
                    : (record.imageURL as any)
                }
                width={50}
                height={50}
                preview={true}
                className="rounded"
              />
              <Link
                target="_blank"
                rel="noreferrer"
                href={`/review-image/${record.id}`}
              >
                <p className="group flex items-center gap-2 truncate hover:underline">
                  {record.imageName}{" "}
                </p>
              </Link>
            </div>
          )}
        />
        <Column
          title="Status"
          dataIndex="newUpdate"
          key="newUpdate"
          render={(text, record: IReviewImageData) => (
            <Tag color="green">{record.newUpdate}</Tag>
          )}
        />
        <Column
          title="Views"
          dataIndex="views"
          key="views"
          render={(text, record: IReviewImageData) => (
            <Typography.Text>
              {record.views ? (
                <span> {record.views}</span>
              ) : (
                <span>No Data</span>
              )}
            </Typography.Text>
          )}
        />
        <Column
          title="Size"
          dataIndex="timestamp"
          key="size"
          render={(text, record: IReviewImageData) => (
            <Typography.Text>
              {record.size ? (
                <span>{Math.round(record.size * 1024)} KB</span>
              ) : (
                <span>No Data</span>
              )}
            </Typography.Text>
          )}
        />
        <Column
          title="Created At"
          dataIndex="timestamp"
          key="timestamp"
          render={(text, record: IReviewImageData) => (
            <Typography.Text>
              {record.timeStamp ? (
                <span>
                  <Moment format="DD MMM YYYY">{record.timeStamp}</Moment>
                </span>
              ) : (
                <span>No Data</span>
              )}
            </Typography.Text>
          )}
        />
        <Column
          title="Action"
          key={"action"}
          render={(text, record: IReviewImageData) => (
            <Space>
              <Button
                icon={
                  <VersionUploadModal
                    prevImage={record}
                    isText={false}
                    pos="start"
                  />
                }
                size="small"
              />
              <Dropdown
                menu={{
                  items: [
                    {
                      label: <ChangeFileNameModal image={record} />,
                    },

                    {
                      label: (
                        <SendInvitesIconModal
                          image={record}
                          isText={true}
                          isIcon={false}
                          isTooltip={false}
                          isMenuItem={true}
                        />
                      ),
                    },
                    {
                      label: (
                        <ImageDeleteModalConfirmation image={record} onlyText />
                      ),
                    },
                  ] as MenuProps["items"],
                }}
              >
                <Button icon={<MoreOutlined />} size="small" />
              </Dropdown>
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default DesignsTableRow;
