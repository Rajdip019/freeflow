import { SearchOutlined } from "@ant-design/icons";
import { Modal, Input, Button, AutoComplete } from "antd";
import React, { useEffect } from "react";

interface SearchModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  options: {
    value: string;
  }[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  options,
  searchQuery,
  setSearchQuery,
  setVisible,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleKeyDown = (e: any) => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); // Prevent default browser behavior
      inputRef.current?.focus();
    }
  };

  inputRef.current?.focus();

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
    >
      <AutoComplete
        ref={inputRef as any}
        onBlur={() => inputRef.current?.focus()}
        options={options}
        value={searchQuery}
        filterOption={(inputValue, option) =>
          option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        onChange={(value) => setSearchQuery(value)}
        size="large"
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
          className="w-[300px]"
        />
      </AutoComplete>
    </Modal>
  );
};

export default SearchModal;
