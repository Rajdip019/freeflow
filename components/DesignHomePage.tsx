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
  Button,
  Empty,
  Image,
  Input,
  Space,
  Tooltip,
  Dropdown,
  Typography,
} from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  CloseOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useUserContext } from "@/contexts/UserContext";
import { FFButton } from "@/theme/themeConfig";
import Avatar from "react-avatar";
import { useAuth } from "@/contexts/AuthContext";

const DesignHomePage = () => {
  const { user } = useUserContext();
  const { images } = useImageContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [contactUsButtonState, setContactUsButtonState] =
    useState<boolean>(false);
  const filteredImages = images.filter((image) =>
    image.imageName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const { logout } = useAuth();

  const [isGridView, setIsGridView] = useState<boolean>(true);
  useEffect(() => {
    setOptions(
      images.map((image) => {
        return {
          value: image.imageName,
        };
      })
    );
  }, [images]);

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

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className=" flex flex-col">
          <Typography.Text className="text-gray-500">
            Signed in as
          </Typography.Text>
          <Typography.Text className="text-gray-400">
            {user?.email}
          </Typography.Text>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <Typography.Text className="text-red-500" onClick={logout}>
          Sign out
        </Typography.Text>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>FreeFlow</title>
      </Head>
      <section className="flex w-full items-center justify-between border-b border-[#2c2b2b] bg-[#141414] px-8 py-4">
        <Image src="/logo/freeflow.png" width={120} preview={false} />
        <div className=" flex items-center justify-center gap-3">
          <AutoComplete
            ref={inputRef as any}
            options={options}
            value={searchQuery}
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            onChange={(value) => setSearchQuery(value)}
          >
            <Input
              suffix={
                <Button size="small">
                  {navigator.platform.toUpperCase().indexOf("MAC") >= 0
                    ? "⌘ + K"
                    : "Ctrl + K"}
                </Button>
              }
              prefix={<SearchOutlined />}
              size="large"
              placeholder="Search by name, tag, color..."
              allowClear
              value={searchQuery}
            />
          </AutoComplete>
          <div className="flex items-center gap-2">
            <Space>
              <Tooltip title="List View" aria-title="List View">
                <Button
                  type={isGridView ? "default" : "primary"}
                  icon={<UnorderedListOutlined />}
                  onClick={() => setIsGridView(false)}
                  className="h-9 w-9"
                />
              </Tooltip>
              <Tooltip title="Grid View" aria-title="Grid View">
                <Button
                  type={isGridView ? "primary" : "default"}
                  icon={<AppstoreOutlined />}
                  onClick={() => setIsGridView(true)}
                  className="h-9 w-9"
                />
              </Tooltip>
              <ImageUploadModal />
            </Space>
          </div>
          <div className="flex">
            <Space>
              <Dropdown menu={{ items }} placement="bottomRight">
                <div>
                  <Avatar
                    src={user?.imageURL}
                    name={user?.name}
                    alt={user?.name}
                    size="40"
                    round={true}
                    className="cursor-pointer"
                  />
                </div>
              </Dropdown>
            </Space>
          </div>
        </div>
      </section>
      <div className="min-h-[88.1vh] px-5 md:min-h-min">
        {filteredImages.length !== 0 ? (
          <>
            {isGridView ? (
              <div className="py-8">
                <div className="flex flex-wrap gap-4">
                  {orderBy(filteredImages, ["timeStamp"], ["desc"]).map(
                    (image) => {
                      return <DesignsGridView image={image} key={image.id} />;
                    }
                  )}
                </div>
              </div>
            ) : (
              <div className="my-4">
                <DesignsTableRow images={filteredImages} />
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center">
            <Empty
              className="w-fit"
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              description={
                <span className="text-gray-500">
                  No designs found{" "}
                  {searchQuery && (
                    <>
                      for <br />{" "}
                      <Space>
                        <Button
                          type="dashed"
                          size="small"
                          className="mt-2"
                          color="purple.100"
                        >
                          {searchQuery}
                        </Button>
                        <Button
                          type="dashed"
                          size="small"
                          className="mt-2"
                          icon={<CloseOutlined />}
                          onClick={() => setSearchQuery("")}
                        />
                      </Space>
                    </>
                  )}
                </span>
              }
            >
              <ImageUploadModal />
            </Empty>
          </div>
        )}
        <a
          href="https://linktr.ee/freeflowapp"
          target="_blank"
          rel="noreferrer"
        >
          <FFButton
            className="fixed bottom-5 z-50 w-6 rounded-full transition-all hover:w-auto"
            onMouseEnter={() => {
              setContactUsButtonState(true);
            }}
            onMouseLeave={() => setContactUsButtonState(false)}
          >
            {" "}
            {contactUsButtonState ? (
              "Contact Us"
            ) : (
              <QuestionCircleOutlined />
            )}{" "}
          </FFButton>
        </a>
      </div>
    </DashboardLayout>
  );
};

export default DesignHomePage;
