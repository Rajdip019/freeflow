import { TeamOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, Typography } from "antd";
import React, { useState } from "react";
const { Text, Title } = Typography;
type Props = {
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
};

const StudioNameCard = ({ setCurrentTab }: Props) => {
  const [studioName, setStudioName] = useState<string>("");

  const handleContinue = () => {
    setCurrentTab(3);
    localStorage.setItem("currentTab", "3");
  };

  return (
    <div className="rounded-2xl bg-[#141414] p-5 px-7 text-white md:w-[50%]">
      <Form
        layout="vertical"
        className="flex flex-col space-y-5"
        initialValues={{ remember: true }}
      >
        <div>
          <div>
            <Text type="secondary" className="text-4xl">
              <TeamOutlined />
            </Text>
          </div>
          <div className="mt-3">
            <Title level={3}>Let’s set up your first team</Title>
          </div>
          <div>
            <Text type="secondary">
              This could be your agency/studio name or just a random name{" "}
            </Text>
          </div>
        </div>
        <Divider />
        {/* Twitter */}
        <Form.Item name="studioName">
          <Input
            placeholder="Awesome Studio Name"
            onChange={(e) => {
              setStudioName(e.target.value);
            }}
          />
        </Form.Item>
        {/* Submit and Back button */}
        <div className="flex w-full justify-between gap-4">
          <Button
            className="w-full"
            onClick={() => {
              setCurrentTab(1);
              localStorage.setItem("currentTab", "1");
            }}
          >
            Back
          </Button>

          <Button
            type="primary"
            className="w-full"
            htmlType="submit"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default StudioNameCard;
