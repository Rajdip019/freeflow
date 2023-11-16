import { useImageContext } from "@/contexts/ImagesContext";
import { SearchOutlined } from "@ant-design/icons";
import { Modal, Input, Button, AutoComplete, Space } from "antd";
import React, { useEffect, useState } from "react";

interface SearchModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchModal: React.FC<SearchModalProps> = ({ visible, setVisible }) => {
  const { images, searchQuery, setSearchQuery } = useImageContext();
  const [options, setOptions] = useState<{ value: string }[]>([]);
  useEffect(() => {
    setOptions(
      images.map((image) => {
        return {
          value: image.imageName,
        };
      })
    );
  }, [images]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleKeyDown = (e: any) => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); // Prevent default browser behavior
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
    }
  }, [Date.now()]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);
  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      closeIcon={false}
      width={800}
    >
      <Space className="items-center justify-center">
        {visible && (
          <AutoComplete
            onBlur={() => inputRef.current?.focus()}
            onFocus={() => {
              inputRef.current?.focus();
            }}
            open
            ref={inputRef as any}
            options={options}
            autoFocus={true}
            value={searchQuery}
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            onChange={(value) => setSearchQuery(value)}
          >
            <Input.Search
              //  cols={100}
              className="text-xl transition-all"
              size="large"
              htmlSize={100}
              autoFocus={true}
              onSearch={(e) => {
                if (e) setVisible(false);
              }}
              // suffix={
              //   <Button size="small">
              //     {navigator.platform.toUpperCase().indexOf("MAC") >= 0
              //       ? "⌘ + K"
              //       : "Ctrl + K"}
              //   </Button>
              // }
              // suffix={<SearchOutlined />}
              placeholder="Search by name, tag, color..."
              allowClear
              value={searchQuery}
            />
          </AutoComplete>
        )}
      </Space>
    </Modal>
  );
};

export default SearchModal;
