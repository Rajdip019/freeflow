import { ITaskData } from "@/interfaces/Task";
import {
  CalendarOutlined,
  CalendarTwoTone,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Dropdown,
  MenuProps,
  Popconfirm,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import Moment from "react-moment";
import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { useTaskContext } from "@/contexts/TaskContext";
import { useRouter } from "next/router";
import ChangeDueDateModal from "../Modal/ChangeDueDateModal";

type Props = {
  task: ITaskData;
};

const DragBox = ({
  task: { title, dueDate, createdAt, status, task_id },
  task,
}: Props) => {
  const { updateTask, deleteTask } = useTaskContext();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dateTask, setdateTask] = useState<ITaskData>();
  const changeStatus = async (status: string) => {
    message.loading("Updating task status...", 1.5);
    await updateTask(
      task_id as string,
      {
        ...task,
        status: status as "In Progress" | "To Do" | "Done" | "Cancelled",
      },
      true
    );
  };
  const changeDueDate = async (dueDate: string) => {
    message.loading("Updating task status...", 1.5);
    await updateTask(
      task_id as string,
      {
        ...task,
        dueDate: dueDate as string,
      },
      true
    );
  };

  const statusItems = [
    {
      key: "1",
      label: (
        <Space>
          <Typography.Text>
            {" "}
            <SyncOutlined /> To Do
          </Typography.Text>
        </Space>
      ),
      onClick: () => changeStatus("To Do"),
    },
    {
      key: "2",
      label: (
        <Space>
          <Typography.Text className="text-[#D89614]">
            <SyncOutlined /> In Progress
          </Typography.Text>
        </Space>
      ),
      onClick: () => changeStatus("In Progress"),
    },
    {
      key: "3",
      label: (
        <Space>
          <Typography.Text className="text-[#1668DC]">
            <CheckCircleOutlined /> Done
          </Typography.Text>
        </Space>
      ),
      onClick: () => changeStatus("Done"),
    },
    {
      key: "4",
      label: (
        <Space>
          <Typography.Text className="text-[#E84749]">
            <CloseCircleOutlined /> Cancelled
          </Typography.Text>
        </Space>
      ),
      onClick: () => changeStatus("Cancelled"),
    },
  ];

  const changeDueDateItems = [
    {
      label: (
        <Space>
          <CalendarOutlined />
          <Typography.Text>Tomorrow</Typography.Text>{" "}
          <Moment format="DD MMM">
            {new Date(new Date().setDate(new Date().getDate() + 1))}
          </Moment>
        </Space>
      ),
      key: "1",
      onClick: () =>
        changeDueDate(
          new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
        ),
    },
    {
      label: (
        <Space>
          <CalendarOutlined />
          <Typography.Text>Next Week</Typography.Text>{" "}
          <Moment format="DD MMM">
            {new Date(new Date().setDate(new Date().getDate() + 7))}
          </Moment>
        </Space>
      ),
      key: "2",
      onClick: () =>
        changeDueDate(
          new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()
        ),
    },
    {
      label: (
        <Space>
          <CalendarOutlined />
          <Typography.Text>Custom Date</Typography.Text>
        </Space>
      ),
      key: "3",
      onClick: () => {
        setOpenModal(true);
        setdateTask(task);
      },
    },
  ];

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Typography.Text className="text-white-400">
          {" "}
          <SyncOutlined /> Change Status
        </Typography.Text>
      ),
      children: statusItems,
    },
    {
      key: "2",
      label: (
        <Typography.Text className="text-blue-400">
          {" "}
          <CalendarTwoTone /> Change Due Date &nbsp; &nbsp;
        </Typography.Text>
      ),
      children: changeDueDateItems,
    },
    {
      key: "3",
      label: (
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          icon={<DeleteOutlined style={{ color: "red" }} />}
          onConfirm={async () => {
            message.loading("Deleting task...", 1.5);
            await deleteTask(task_id as string);
          }}
        >
          <Typography.Text className="text-red-400">
            <DeleteOutlined /> Delete Task
          </Typography.Text>
        </Popconfirm>
      ),
    },
  ];
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "box",
    item: "Hello it's me",
    end: async (item, monitor) => {
      const dropResult = monitor.getDropResult<{ name: string }>();
      if (item && dropResult) {
        let currentStatus;
        if (dropResult.name === "dropProgress") {
          currentStatus = "In Progress";
        } else if (dropResult.name === "dropToDo") {
          currentStatus = "To Do";
        } else if (dropResult.name === "dropDone") {
          currentStatus = "Done";
        } else if (dropResult.name === "dropCancelled") {
          currentStatus = "Cancelled";
        }
        if (currentStatus !== status) {
          message.loading("Updating task status...", 1.5);
          await updateTask(
            task_id as string,
            {
              ...task,
              status: currentStatus as
                | "In Progress"
                | "To Do"
                | "Done"
                | "Cancelled",
            },
            true
          );
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));
  const router = useRouter();
  return (
    <div
      ref={drag}
      data-testid={`box${title}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      className="-mx-4 border-b border-[#ffffff15] bg-black p-2.5 px-8"
    >
      <ChangeDueDateModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        task={dateTask as ITaskData}
      />
      <Dropdown trigger={["contextMenu"]} menu={{ items }}>
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center justify-start gap-3">
            <Dropdown
              trigger={["click"]}
              menu={{ items: statusItems }}
              className="cursor-pointer"
            >
              <div>
                {status === "In Progress" && (
                  <Typography.Text className="text-[#D89614]">
                    <SyncOutlined />
                  </Typography.Text>
                )}
                {status === "To Do" && (
                  <Typography.Text>
                    {" "}
                    <SyncOutlined />
                  </Typography.Text>
                )}
                {status === "Done" && (
                  <Typography.Text className="text-[#1668DC]">
                    <CheckCircleOutlined />
                  </Typography.Text>
                )}
                {status === "Cancelled" && (
                  <Typography.Text className="text-[#E84749]">
                    <CloseCircleOutlined />
                  </Typography.Text>
                )}
              </div>
            </Dropdown>
            <Typography.Text
              className="w-full cursor-pointer text-[15px]"
              onClick={() => {
                router.push(`/tasks/${task_id}`);
              }}
            >
              {title}
            </Typography.Text>
          </div>
          <div className="flex w-[13%] items-center justify-end">
            {dueDate && (
              <Typography.Text className="cursor-pointer">
                <Dropdown
                  placement="bottomRight"
                  trigger={["click"]}
                  menu={{
                    items: changeDueDateItems,
                  }}
                >
                  {task.dueDate ? (
                    <Tag
                      color={
                        new Date(task.dueDate).getTime() -
                          new Date().getTime() <
                        4 * 24 * 60 * 60 * 1000
                          ? "red"
                          : new Date(task.dueDate).getTime() -
                              new Date().getTime() <
                            14 * 24 * 60 * 60 * 1000
                          ? "orange"
                          : "green"
                      }
                    >
                      due <Moment format="DD MMM">{task.dueDate}</Moment>{" "}
                    </Tag>
                  ) : (
                    <Tag>Add due date</Tag>
                  )}
                </Dropdown>
              </Typography.Text>
            )}
            <Moment
              format="MMM DD"
              className="text-[12px] font-light text-[#ffffff74]"
            >
              {createdAt}
            </Moment>{" "}
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default DragBox;
