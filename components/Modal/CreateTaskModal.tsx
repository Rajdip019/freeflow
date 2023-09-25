import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  PaperClipOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Segmented,
  Select,
  Space,
  Tooltip,
  Typography,
  Upload,
  message,
  Divider,
} from "antd";
import React, { useState } from "react";
import { ITaskData } from "@/interfaces/Task";
import { useAuth } from "@/contexts/AuthContext";
import { useTaskContext } from "@/contexts/TaskContext";

type Props = {
  teamName: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateTaskModal = ({ teamName, openModal, setOpenModal }: Props) => {
  const { authUser } = useAuth();
  const { createTask } = useTaskContext();
  const statusItem = [
    {
      label: (
        <Space>
          <Typography.Text>
            {" "}
            <SyncOutlined /> To Do
          </Typography.Text>
        </Space>
      ),
      value: "To Do",
    },
    {
      label: (
        <Space>
          <Typography.Text className="text-[#D89614]">
            <SyncOutlined /> In Progress
          </Typography.Text>
        </Space>
      ),
      value: "In Progress",
    },
    {
      label: (
        <Space>
          <Typography.Text className="text-[#1668DC]">
            <CheckCircleOutlined /> Done
          </Typography.Text>
        </Space>
      ),
      value: "Done",
    },
    {
      label: (
        <Space>
          <Typography.Text className="text-[#E84749]">
            <CloseCircleOutlined /> Cancelled
          </Typography.Text>
        </Space>
      ),
      value: "Cancelled",
    },
  ];
  const [okText, setOkText] = useState<string>("Task");
  const [data, setData] = useState<ITaskData>({
    uid: authUser?.uid as string,
    title: "",
    description: "",
    status: undefined,
    assignee: undefined,
    dueDate: undefined,
    attachment: "",
    createdAt: Date.now(),
  });

  const handleCreateTask = async () => {
    if (data.title === "") return message.error("Title is required");
    const newData: ITaskData = {
      ...data,
      status: data.status || "To Do",
      assignee: data.assignee || "",
      dueDate: data.dueDate || "",
    };
    await createTask(newData);
    setOpenModal(false);
    setData({
      uid: authUser?.uid as string,
      title: "",
      description: "",
      status: undefined,
      assignee: undefined,
      dueDate: undefined,
      attachment: "",
      createdAt: Date.now(),
    });
  };

  const uploadImage = (file: any) => {
    setData({
      ...data,
      attachment: file.name,
    });
  };

  return (
    <Modal
      title={
        <Typography.Text className="rounded border border-[#1668DC] p-1 px-2 text-[#1668DC]">
          {teamName}
        </Typography.Text>
      }
      open={openModal}
      width={800}
      cancelButtonProps={{ className: "hidden" }}
      confirmLoading={true}
      onCancel={() => {
        setOpenModal(false);
      }}
      footer={[
        <Space>
          <Tooltip title="Switch from Task to Project">
            <Typography.Text className="text-md mx-2 cursor-help text-[#ffffff70]">
              <InfoCircleOutlined />
            </Typography.Text>
          </Tooltip>
          <Tooltip title="Project add coming soon">
            <Segmented
              disabled
              options={["Task", "Project"]}
              onChange={(value) => {
                setOkText(value.toString());
              }}
            ></Segmented>
          </Tooltip>
          <Button
            key="submit"
            className="w-32"
            type="primary"
            onClick={handleCreateTask}
          >
            Create Task
          </Button>
        </Space>,
      ]}
    >
      <Space direction="vertical">
        <Input
          bordered={false}
          size="large"
          className="text-2xl outline-none"
          placeholder="Task Name"
          value={data.title}
          onChange={(e) =>
            setData({
              ...data,
              title: e.target.value,
            })
          }
        />
        <Input
          bordered={false}
          className="mb-2"
          placeholder="Add description..."
          value={data.description}
          onChange={(e) =>
            setData({
              ...data,
              description: e.target.value,
            })
          }
        />
        <Space>
          <ImgCrop showReset zoomSlider aspectSlider rotationSlider showGrid>
            <Upload
              maxCount={1}
              accept="image/png, image/jpg, image/jpeg"
              listType="picture"
              // showUploadList={false}
              onChange={(info) => {
                if (info.file.status === "done") {
                  uploadImage(info.file);
                  message.success(
                    `${info.file.name} file uploaded successfully`
                  );
                } else if (info.file.status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
              onRemove={() => {
                setData({
                  ...data,
                  attachment: "",
                });
              }}
            >
              {data.attachment === "" && (
                <Button icon={<PaperClipOutlined />} className="text-[#7d7d7d]">
                  Add attachment
                </Button>
              )}
            </Upload>
          </ImgCrop>
          <Tooltip
            title="Add any reference for this task"
            aria-title="Add any reference for this task"
          >
            <Button
              icon={<InfoCircleOutlined />}
              className="text-[#f7f7f769]"
            />
          </Tooltip>
        </Space>

        <Space direction="horizontal" className="mt-2">
          {/* Status */}
          <Select
            options={statusItem}
            placeholder="Status"
            className="w-36"
            value={data.status}
            onChange={(value) =>
              setData({
                ...data,
                status: value.toString() as
                  | "To Do"
                  | "In Progress"
                  | "Done"
                  | "Cancelled",
              })
            }
          />
          {/* Assignee */}
          <Tooltip
            title="Assign coming soon"
            aria-title="Assign coming soon"
            className="cursor-not-allowed"
          >
            <Select
              placeholder="Assignee"
              className="w-36 cursor-not-allowed"
              value={data.assignee}
              options={[
                {
                  label: "User A",
                  value: "User A",
                },
                {
                  label: "User B",
                  value: "User B",
                },
              ]}
              showSearch
            />
          </Tooltip>
          {/* Due date */}
          <DatePicker
            placeholder="Due Date"
            onChange={(value) => {
              setData({
                ...data,
                dueDate: value?.toString(),
              });
            }}
          />
        </Space>
      </Space>
      <Divider />
    </Modal>
  );
};

export default CreateTaskModal;
