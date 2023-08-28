import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import ImageUploadModal from "@/components/ImageUploadModal";
import { useImageContext } from "@/contexts/ImagesContext";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { orderBy } from "lodash-es";
import DesignsTableRow from "@/components/DesignsTableRow";
import DesignsGridView from "@/components/DesignsGridView";
import {
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Input,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
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
  const handleKeyDown = (e: any) => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); // Prevent default browser behavior
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return (
    <DashboardLayout>
      <Head>
        <title>FreeFlow | Design</title>
      </Head>
      <section className="flex w-full items-center justify-between border-b border-[#2c2b2b] bg-[#141414] px-8 py-4">
        <AutoComplete
          ref={inputRef as any}
          className="w-1/3"
          options={options}
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={(value) => setSearchQuery(value)}
        >
          <Input
            suffix={
              <Button size="small">
                {navigator.platform.toUpperCase().indexOf("MAC") >= 0
                  ? "⌘ + k"
                  : "Ctrl + k"}
              </Button>
            }
            prefix={<SearchOutlined />}
            size="large"
            placeholder="Search by name, tag, color..."
            allowClear
            value={searchQuery}
          />
        </AutoComplete>
        <div className="flex">
          <Space>
            <Tooltip title="Coming soon" aria-title="Coming soon">
              <Badge
                count={images.length}
                className="mr-4 cursor-not-allowed"
                size="small"
              >
                <BellOutlined className="text-xl" />
              </Badge>
            </Tooltip>

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
