import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Drawer } from "antd";
import React, { useState } from "react";

const Test = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className=" relative h-screen w-screen overflow-hidden">
      <Button
        className=" absolute right-0 top-[10vh] h-[90vh] rounded-r-none"
        type="primary"
        onClick={showDrawer}
        icon={<LeftOutlined size={26} />}
      ></Button>
      <div className="absolute right-0 top-[10vh] h-[90vh] bg-white ">
        <Drawer
          placement="right"
          onClose={onClose}
          open={open}
          maskClosable={false}
          mask={false}
          closeIcon={null}
          getContainer={false}
        >
          <Button
            className=" absolute left-0 top-0 h-[90vh] rounded-r-none"
            type="primary"
            onClick={onClose}
            icon={<RightOutlined size={26} />}
          ></Button>
        </Drawer>
      </div>
    </div>
  );
};

export default Test;
