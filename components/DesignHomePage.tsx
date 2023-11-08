import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import ImageUploadModal from "@/components/ImageUploadModal";
import { useImageContext } from "@/contexts/ImagesContext";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { orderBy } from "lodash-es";
import DesignsTableRow from "@/components/DesignsTableRow";
import DesignsGridView from "@/components/DesignsGridView";
import { Button, Empty, Space, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ImageInfoDrawer from "./Dashboard/ImageInfoDrawer";
import DesignHeader from "./Dashboard/DesignHeader";
import { IReviewImage } from "@/interfaces/ReviewImageData";
import SearchModal from "./Modal/SearchModel";

const DesignHomePage = () => {
  const { images, searchQuery, setSearchQuery } = useImageContext();

  const filteredImages = images.filter((image) =>
    image.imageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [sideImage, setSideImage] = useState<IReviewImage | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [sideVisible, setSideVisible] = useState<boolean>(false);

  const [isGridView, setIsGridView] = useState<boolean>(true);

  const handleKeyDown = (e: any) => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); // Prevent default browser behavior
      setVisible(true);
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
        <title>FreeFlow</title>
      </Head>
      {visible && <SearchModal visible={visible} setVisible={setVisible} />}

      <div className="flex w-full">
        <div className={`${sideVisible ? "w-full lg:w-[74%]" : "w-full"}`}>
          <DesignHeader isGridView={isGridView} setIsGridView={setIsGridView} />

          <div
            className="min-h-[88.1vh] overflow-scroll px-5 md:min-h-min"
            style={{
              height: "calc(100vh - 40px)",
            }}
          >
            {searchQuery && (
              <Space className="-mb-4 mt-2">
                <Typography.Text type="secondary" className="text-md mt-5">
                  search result for <b>{searchQuery}</b>
                </Typography.Text>
              </Space>
            )}
            {filteredImages.length !== 0 ? (
              <>
                {isGridView ? (
                  <div className="py-4">
                    <div className="flex w-full flex-wrap items-center justify-center gap-4 md:justify-normal">
                      {orderBy(filteredImages, ["timeStamp"], ["desc"]).map(
                        (image) => {
                          return (
                            <DesignsGridView
                              image={image}
                              key={image.id}
                              setSideImage={setSideImage}
                              setSideVisible={setSideVisible}
                            />
                          );
                        }
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="my-4">
                    <DesignsTableRow
                      images={filteredImages}
                      setSideImage={setSideImage}
                      setSideVisible={setSideVisible}
                    />
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
          </div>
        </div>
        <ImageInfoDrawer
          image={sideImage}
          sideVisible={sideVisible}
          setSideVisible={setSideVisible}
        />
      </div>
    </DashboardLayout>
  );
};

export default DesignHomePage;
