import { IReviewImage } from "@/interfaces/ReviewImageData";
import React from "react";
import Moment from "react-moment";
import { Table, Image, Tag, Typography } from "antd";
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
                  <Typography.Text className="text-center text-sm text-white">
                    Waiting for image...
                  </Typography.Text>
                </div>
              )}
            </>
          )}
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
      </Table>
    </>
  );
};

export default DesignsTableRow;
