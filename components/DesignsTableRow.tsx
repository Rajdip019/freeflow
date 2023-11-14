import { IReviewImage } from "@/interfaces/ReviewImageData";
import React from "react";
import Moment from "react-moment";
import {
  Table,
  Image,
  Tag,
  Typography,
  Spin,
  Space,
  Dropdown,
  Button,
  MenuProps,
  message,
} from "antd";
import { CopyOutlined, MoreOutlined } from "@ant-design/icons";
import ImageDeleteModalConfirmation from "./Modal/ImageDeleteModalConfirmation";
import SendInvitesIconModal from "./Modal/SendInvitesIconModal";
import ChangeFileNameModal from "./Modal/ChangeFileNameModal";
import VersionUploadModal from "./VersionControl/VersionUploadModal";
import { APP_URL } from "@/utils/constants";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
const { Column } = Table;
interface Props {
  images: IReviewImage[];
  setSideImage: React.Dispatch<React.SetStateAction<IReviewImage | null>>;
  setSideVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesignsTableRow: React.FC<Props> = ({
  images,
  setSideImage,
  setSideVisible,
}) => {
  images = images.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const { renderWorkspace } = useWorkspaceContext();
  return (
    <>
      <Table
        dataSource={images}
        scroll={{ x: 300 }}
        pagination={false}
        rootClassName="ml-2"
        bordered={false}
        tableLayout="auto"
        onRow={(record) => {
          return {
            onClick: (event) => {
              setSideImage(record);
              setSideVisible(true);
            },
          };
        }}
      >
        <Column
          title="Design"
          dataIndex="imageName"
          key="imageName"
          width={50}
          render={(text, record: IReviewImage) => (
            <>
              {record.latestImageURL ? (
                <Image
                  src={record.latestImageURL}
                  width={50}
                  height={50}
                  preview={true}
                  className="rounded"
                />
              ) : (
                <div>
                  <Spin size={"large"} className="m-2.5" />
                </div>
              )}
            </>
          )}
          onCell={(record) => {
            return {
              onClick: (e) => {
                e.stopPropagation();
              },
            };
          }}
        />
        <Column
          title="Name"
          render={(text, record: IReviewImage) => (
            <Typography.Text className="group flex items-center truncate hover:underline">
              {record.imageName}{" "}
            </Typography.Text>
          )}
          className="cursor-pointer"
        />
        <Column
          // open image on this cell click
          title="Status"
          dataIndex="newUpdate"
          key="newUpdate"
          render={(text, record: IReviewImage) => (
            <Tag color="green">{record.newUpdate}</Tag>
          )}
          className="hidden cursor-pointer lg:table-cell"
        />
        <Column
          title="Size"
          dataIndex="size"
          key="size"
          render={(text, record: IReviewImage) => (
            <Typography.Text>
              {record.totalSize ? (
                <span>{Math.round(record.totalSize)} KB</span>
              ) : (
                <span>No Data</span>
              )}
            </Typography.Text>
          )}
          className="hidden cursor-pointer lg:table-cell"
          onCell={(record) => {
            return {
              onClick: () => {
                setSideImage(record);
              },
            };
          }}
        />
        <Column
          title="Created At"
          dataIndex="timestamp"
          key="timestamp"
          render={(text, record: IReviewImage) => (
            <Typography.Text>
              {record.createdAt ? (
                <span>
                  <Moment format="DD MMM YYYY">{record.createdAt}</Moment>
                </span>
              ) : (
                <span>No Data</span>
              )}
            </Typography.Text>
          )}
          sorter={(a: IReviewImage, b: IReviewImage) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          }
          className="cursor-pointer"
          onCell={(record) => {
            return {
              onClick: (event) => {
                setSideImage(record);
              },
            };
          }}
        />
        <Column
          title="Actions"
          key="action"
          render={(text, image: IReviewImage) => (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Space>
                <VersionUploadModal
                  prevImage={image}
                  isText={false}
                  pos="start"
                  isMenu={true}
                />

                <Dropdown
                  menu={{
                    items: [
                      {
                        label: "Copy feedback link",
                        icon: <CopyOutlined />,
                        onClick: () => {
                          navigator.clipboard.writeText(
                            `${APP_URL}/review-design/w/${renderWorkspace?.id}/d/${image.id}`
                          );
                          message.success("Link copied to clipboard");
                        },
                      },

                      {
                        label: <ChangeFileNameModal image={image} />,
                      },

                      {
                        label: (
                          <SendInvitesIconModal
                            image={image}
                            isTooltip={false}
                            isMenuItem={true}
                          />
                        ),
                      },
                      {
                        label: <ImageDeleteModalConfirmation image={image} />,
                      },
                    ] as MenuProps["items"],
                  }}
                >
                  <Button icon={<MoreOutlined />} size="small" />
                </Dropdown>
              </Space>
            </div>
          )}
          className="hidden cursor-pointer lg:table-cell "
        />
      </Table>
    </>
  );
};

export default DesignsTableRow;
