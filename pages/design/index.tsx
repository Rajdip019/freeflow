import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import ImageUploadModal from "@/components/ImageUploadModal";
import { useImageContext } from "@/contexts/ImagesContext";
import React, { useState } from "react";
import Head from "next/head";
import { filter, orderBy } from "lodash-es";
import DesignsTableRow from "@/components/DesignsTableRow";
import DesignsGridView from "@/components/DesignsGridView";
import {
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Divider,
  Input,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  BellOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useUserContext } from "@/contexts/UserContext";

const Design = () => {
  const { user } = useUserContext();
  const { images } = useImageContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredImages = images.filter((image) =>
    image.imageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isGridView, setIsGridView] = useState<boolean>(false);
  const options = images.map((image) => {
    return {
      value: image.imageName,
    };
  });
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the Ctrl (or Command on Mac) key and the 'k' key are pressed simultaneously
    if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      event.preventDefault();
      console.log("Ctrl + K pressed");
      // Focus on the input field
      inputRef.current?.focus();
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>FreeFlow | Design</title>
      </Head>
      <section className="flex w-full items-center justify-between border-b border-[#2c2b2b] bg-[#141414] px-8 py-4">
        <AutoComplete
          className="w-1/3"
          options={options}
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={(value) => setSearchQuery(value)}
        >
          <Input
            prefix={<SearchOutlined />}
            size="large"
            placeholder="Search by name, tag, color..."
            onKeyDown={handleKeyDown}
          />
        </AutoComplete>
        <div className="flex">
          <Space>
            <Badge
              count={images.length}
              className="mr-4 cursor-not-allowed"
              size="small"
            >
              <BellOutlined className="text-xl" />
            </Badge>

            <Typography.Text>{user?.name}</Typography.Text>
            <Avatar
              src={user?.imageURL}
              alt={user?.name}
              className="cursor-pointer"
            />
          </Space>
        </div>
      </section>
      <div className="flex items-center justify-between bg-[#141414] px-8 py-3">
        <Typography.Title>Designs</Typography.Title>
        <div className="flex items-center gap-2">
          <Space>
            <Tooltip title="List View" aria-title="List View">
              <Button
                type={isGridView ? "default" : "primary"}
                icon={<UnorderedListOutlined />}
                onClick={() => setIsGridView(false)}
              />
            </Tooltip>
            <Tooltip title="Grid View" aria-title="Grid View">
              <Button
                type={isGridView ? "primary" : "default"}
                icon={<AppstoreOutlined />}
                onClick={() => setIsGridView(true)}
              />
            </Tooltip>
            <ImageUploadModal />
          </Space>
        </div>
      </div>

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
          <div className="my-4">
            <DesignsTableRow images={filteredImages} />
          </div>
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
