import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import ImageUploadModal from "@/components/ImageUploadModal";
import { useImageContext } from "@/contexts/ImagesContext";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { orderBy } from "lodash-es";
import DesignsTableRow from "@/components/DesignsTableRow";
import DesignsGridView from "@/components/DesignsGridView";
import { Button, Empty, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ImageInfoDrawer from "./Dashboard/ImageInfoDrawer";
import DesignHeader from "./Dashboard/DesignHeader";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import SearchModal from "./Modal/SearchModel";

const DesignHomePage = () => {
  const { images } = useImageContext();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const filteredImages = images.filter((image) =>
    image.imageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [sideImage, setSideImage] = useState<IReviewImageData | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

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
      <SearchModal
        options={options}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        visible={visible}
        setVisible={setVisible}
      />
      <div className="flex w-full">
        <div className="w-[74%]">
          <DesignHeader isGridView={isGridView} setIsGridView={setIsGridView} />
          <div
            className="min-h-[88.1vh] overflow-scroll px-5 md:min-h-min"
            style={{
              height: "calc(100vh - 40px)",
            }}
          >
            {filteredImages.length !== 0 ? (
              <>
                {isGridView ? (
                  <div className="py-8">
                    <div className="flex flex-wrap gap-4">
                      {orderBy(filteredImages, ["timeStamp"], ["desc"]).map(
                        (image) => {
                          return (
                            <DesignsGridView
                              image={image}
                              key={image.id}
                              setSideImage={setSideImage}
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
        <ImageInfoDrawer image={sideImage} />
      </div>
    </DashboardLayout>
  );
};

export default DesignHomePage;
