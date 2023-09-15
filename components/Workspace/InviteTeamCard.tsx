import {
  DeleteOutlined,
  PlusOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button, Divider, Form, Input, Space, Typography } from "antd";
import { icons } from "antd/es/image/PreviewGroup";
import React, { useState } from "react";
const { Text, Title } = Typography;
type Props = {
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
};

const InviteTeamCard = ({ setCurrentTab }: Props) => {
  const [emailList, setEmailList] = useState<string[]>([""]);

  const handleContinue = () => {
    console.log(emailList);
    console.log("Send to the dashboard");
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
              <UsergroupAddOutlined />
            </Text>
          </div>
          <div className="mt-3">
            <Title level={3}>Invite your team</Title>
          </div>
          <div>
            <Text type="secondary">Start collaborating with your team </Text>
          </div>
        </div>
        <Divider />
        {/* Twitter */}
        <Text className="text-sm">Email addresses</Text>
        {emailList.map((email, index) => {
          return (
            <Form.Item
              key={index}
              name={`email-${index}`}
              rules={[
                { required: true, message: "Please input an email address" },
              ]}
            >
              <div className="flex">
                <Input
                  placeholder="Email address"
                  className="w-full"
                  type="email"
                  onChange={(e) => {
                    const newEmailList = [...emailList];
                    newEmailList[index] = e.target.value;
                    setEmailList(newEmailList);
                  }}
                  allowClear
                />
                <Button
                  type="link"
                  className="text-red-500"
                  onClick={() => {
                    const newEmailList = [...emailList];
                    newEmailList.splice(index, 1);
                    setEmailList(newEmailList);
                  }}
                  icon={<DeleteOutlined />}
                />
              </div>
            </Form.Item>
          );
        })}
        <Text className={`text-sm ${emailList.length >= 5 && "text-red-300"} `}>
          {emailList.length < 5
            ? "Invite up to 5 members"
            : "You can invite up to 5 members"}
        </Text>
        <Button
          type="dashed"
          className="w-fit"
          onClick={() => {
            setEmailList([...emailList, ""]);
          }}
          icon={<PlusOutlined />}
          disabled={
            emailList.length >= 5 ||
            emailList.map((email) => email.length).includes(0)
          }
          htmlType="submit"
        >
          Add more
        </Button>

        {/* Submit and Back button */}
        <div className="flex w-full justify-between gap-4">
          <Button className="w-full">Skip</Button>

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

export default InviteTeamCard;
