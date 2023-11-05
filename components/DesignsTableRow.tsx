import { IReviewImageData } from "@/interfaces/ReviewImageData";
import React from "react";
import Moment from "react-moment";
import { Table, Image, Tag, Typography } from "antd";
const { Column } = Table;
interface Props {
  images: IReviewImageData[];
  setSideImage: React.Dispatch<React.SetStateAction<IReviewImageData | null>>;
  setSideVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesignsTableRow: React.FC<Props> = ({
  images,
  setSideImage,
  setSideVisible,
}) => {
  images = images.sort((a, b) => {
    return new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime();
  });
  return (
    <>
      <Table
        dataSource={images}
        scroll={{ x: 300 }}
        pagination={false}
        bordered={false}
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
          render={(text, record: IReviewImageData) => (
            <>
              {record.currentVersion && record.imageURL ? (
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
              ) : (
                <div>
                  <Typography.Text className="text-center text-sm text-white">
                    Waiting for image...
                  </Typography.Text>
                </div>
              )}
            </>
          )}
        />
        <Column
          render={(text, record: IReviewImageData) => (
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
          render={(text, record: IReviewImageData) => (
            <Tag color="green">{record.newUpdate}</Tag>
          )}
          className="cursor-pointer"
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
          className="cursor-pointer"
        />
        <Column
          title="Size"
          dataIndex="size"
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
          className="cursor-pointer"
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
          sorter={(a: IReviewImageData, b: IReviewImageData) =>
            new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
          }
          className="cursor-pointer"
          onCell={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setSideImage(record);
              },
            };
          }}
        />
        {/* <Column
          title="Action"
          key={"action"}
          render={(text, record: IReviewImageData) => (
            <Space>
              <VersionUploadModal
                prevImage={record}
                isText={false}
                pos="start"
                isMenu={true}
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
                          isTooltip={false}
                          isMenuItem={true}
                        />
                      ),
                    },
                    {
                      label: <ImageDeleteModalConfirmation image={record} />,
                    },
                  ] as MenuProps["items"],
                }}
              >
                <Button icon={<MoreOutlined />} size="small" />
              </Dropdown>
            </Space>
          )}
        /> */}
      </Table>
    </>
  );
};

export default DesignsTableRow;
