import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import ChangeDueDateModal from "@/components/Modal/ChangeDueDateModal";
import TaskHeader from "@/components/TaskHeader";
import { useTaskContext } from "@/contexts/TaskContext";
import { useUserContext } from "@/contexts/UserContext";
import { ITaskData } from "@/interfaces/Task";
import { db } from "@/lib/firebaseConfig";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  PaperClipOutlined,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Input,
  Layout,
  Space,
  Spin,
  Tag,
  Timeline,
  Typography,
  message,
} from "antd";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";

type Props = {};

const TaskDetails = (props: Props) => {
  const { updateTask } = useTaskContext();
  const { user } = useUserContext();
  const router = useRouter();
  const task_id = router.query.TaskId as string;
  const [task, setTask] = useState<ITaskData>();
  const [prevTask, setPrevTask] = useState<ITaskData>();
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    fetchTask();
  }, [task_id]);

  const fetchTask = async () => {
    const TaskRef = doc(db, "tasks", task_id);
    const data = await getDoc(TaskRef);
    setTask(data.data() as ITaskData);
    setPrevTask(data.data() as ITaskData);
  };

  const [items, setItems] = useState<any[]>([]);
  const [commentLoader, setCommentLoader] = useState<boolean>(false);
  const [syncLoader, setSyncLoader] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dateTask, setdateTask] = useState<ITaskData>();

  useEffect(() => {
    if (task) {
      let _items: any[] = [];
      task.activity &&
        task.activity.map((activity) => {
          if (activity.type === "title" || activity.type === "description") {
            _items.push({
              dot: <EditOutlined />,
              children: (
                <Typography.Text>
                  <Typography.Text className="text-semibold">
                    {activity.user}
                  </Typography.Text>{" "}
                  <Typography.Text className="text-[#ffffff65]">
                    changed the {activity.type} -{" "}
                    <Moment format={"DD MMM"}>{activity.createdAt}</Moment>
                  </Typography.Text>
                </Typography.Text>
              ),
            });
          } else if (activity.type === "attachment") {
            _items.push({
              dot: <PaperClipOutlined />,
              children: (
                <Typography.Text>
                  <Typography.Text className="text-semibold">
                    {activity.user}
                  </Typography.Text>{" "}
                  added an attachment
                </Typography.Text>
              ),
            });
          } else {
            _items.push({
              dot: (
                <Avatar
                  className="bg-purple-600"
                  src={activity.userImageUrl}
                  size={"small"}
                >
                  {activity.user && activity.user[0]}
                </Avatar>
              ),
              children: (
                <Space
                  className="w-full  rounded-lg border-[1px] border-[#ffffff2a] p-2 px-4"
                  direction="vertical"
                >
                  <Typography.Text className="text-[14px]">
                    {activity.user} &nbsp;&nbsp;{" "}
                    <Moment className="text-sm text-[#ffffff3c]" fromNow>
                      {activity.createdAt}
                    </Moment>
                  </Typography.Text>
                  <Typography.Text className="text-[17px]">
                    {activity.message}
                  </Typography.Text>
                </Space>
              ),
            });
          }
        });
      setItems(_items);
    }
  }, [task]);

  const handleComment = async () => {
    setCommentLoader(true);
    if (comment.trim() !== "") {
      const _task = task as ITaskData;
      _task.activity = task?.activity
        ? [
            ...(task?.activity as any[]),
            {
              type: "comment",
              message: comment,
              createdAt: new Date().toISOString(),
              user: user?.name,
              userImageUrl: user?.imageURL,
            },
          ]
        : [
            {
              type: "comment",
              message: comment,
              createdAt: new Date().toISOString(),
              user: user?.name,
              userImageUrl: user?.imageURL,
            },
          ];
      await updateTask(task_id, _task, false);
      setPrevTask(_task);
      fetchTask();
      setComment("");
    }
    setCommentLoader(false);
  };

  const handleBlur = async (type: string) => {
    if (type == "title" && task?.title === prevTask?.title) return;
    if (type == "description" && task?.description === prevTask?.description)
      return;
    setSyncLoader(true);
    const _newTask = {
      ...task,
      activity: task?.activity
        ? task.activity[task.activity.length - 1].type === type
          ? task.activity.map((activity, index) => {
              if (index === task.activity.length - 1) {
                return {
                  ...activity,
                  createdAt: new Date().toISOString(),
                };
              }
              return activity;
            })
          : [
              ...task.activity,
              {
                type: type,
                createdAt: new Date().toISOString(),
                user: user?.name,
                userImageUrl: user?.imageURL,
              },
            ]
        : [
            {
              type: type,
              createdAt: new Date().toISOString(),
              user: user?.name,
              userImageUrl: user?.imageURL,
            },
          ],
    };
    await updateTask(task_id, _newTask as ITaskData, false);
    setPrevTask(_newTask as ITaskData);
    setTask(_newTask as ITaskData);
    setSyncLoader(false);
  };

  const changeStatus = async (status: string) => {
    message.loading("Updating task status...", 1.5);
    task &&
      status &&
      (await updateTask(
        task_id as string,
        {
          ...task,
          status: status as "In Progress" | "To Do" | "Done" | "Cancelled",
        },
        true
      ));
    setTask({
      ...task,
      status: status as "In Progress" | "To Do" | "Done" | "Cancelled",
    } as ITaskData);
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
  const changeDueDate = async (dueDate: string) => {
    message.loading("Updating task status...", 1.5);
    task &&
      (await updateTask(
        task_id as string,
        { ...task, dueDate: dueDate as string },
        true
      ));
    setTask({ ...task, dueDate: dueDate as string } as ITaskData);
  };

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

  return (
    <DashboardLayout>
      <Head>
        <title>Task Details | Freeflow</title>
      </Head>
      <ChangeDueDateModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        task={dateTask as ITaskData}
      />
      <div className="bg-sec flex h-screen overflow-hidden">
        <Space direction="vertical" className="bg-sec w-full">
          <div className="sticky z-50">
            <TaskHeader title={task?.title.substring(0, 15) + "..."} />
          </div>

          <Space
            direction="vertical"
            className="bg-sec small-scrollbar h-full w-full overflow-auto p-8"
            style={{
              height: "calc(100vh - 100px)",
            }}
          >
            {syncLoader && (
              <Space className="ml-3">
                <Spin size="small" />
              </Space>
            )}
            <Input
              type="text"
              className="text-2xl"
              bordered={false}
              placeholder="task title"
              value={task?.title}
              onChange={(e) => {
                task && setTask({ ...task, title: e.target.value });
              }}
              onBlur={(e) => {
                if (e.target.value.trim() !== "") handleBlur("title");
                else message.error("Title cannot be empty");
              }}
            />
            <Input.TextArea
              className="text-lg text-[#ffffff68]"
              bordered={false}
              placeholder="Add description..."
              value={task?.description}
              onChange={(e) => {
                task && setTask({ ...task, description: e.target.value });
              }}
              onBlur={() => handleBlur("description")}
            />
            <Button
              type="text"
              className="text-[#ffffffa2]"
              icon={<PlusOutlined />}
            >
              Add an attachment
            </Button>
            <Divider />
            <Typography.Text className="text-xl text-[#ffffffa2]">
              Activity
            </Typography.Text>
            <Timeline
              className="mt-4"
              items={[
                ...items,
                {
                  dot: (
                    <Avatar
                      className="bg-purple-600"
                      src={user?.imageURL}
                      size={"small"}
                    >
                      {user?.name && user?.name[0]}
                    </Avatar>
                  ),
                  children: (
                    <Space
                      className="w-full rounded-lg border-[1px] border-[#ffffff2a]"
                      direction="vertical"
                    >
                      <Input
                        bordered={false}
                        placeholder="Leave a comment.."
                        className="text-lg"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Space className="w-full justify-end p-2">
                        <Button
                          className="text-[#ffffffa2]"
                          onClick={handleComment}
                          loading={commentLoader}
                        >
                          Comment
                        </Button>
                      </Space>
                    </Space>
                  ),
                },
              ]}
            />
          </Space>
        </Space>
        <div className="w-[30%] border-[1px] border-l border-[#ffffff1a]">
          <div className="p-4">
            <Typography.Text className="text-xl text-[#ffffffa2]">
              Manage
            </Typography.Text>
          </div>

          <div className="h-[1px] bg-[#ffffff18]" />
          <div className="flex items-center gap-14 p-4">
            <Typography.Text className="text-[17px] text-[#ffffffa2]">
              Status
            </Typography.Text>
            <Dropdown
              trigger={["click"]}
              menu={{ items: statusItems }}
              className="cursor-pointer"
            >
              <div>
                {task?.status === "In Progress" && (
                  <Typography.Text className="text-[#D89614]">
                    <SyncOutlined /> {task.status}
                  </Typography.Text>
                )}
                {task?.status === "To Do" && (
                  <Typography.Text>
                    <SyncOutlined /> {task.status}
                  </Typography.Text>
                )}
                {task?.status === "Done" && (
                  <Typography.Text className="text-[#1668DC]">
                    <CheckCircleOutlined /> {task.status}
                  </Typography.Text>
                )}
                {task?.status === "Cancelled" && (
                  <Typography.Text className="text-[#E84749]">
                    <CloseCircleOutlined /> {task.status}
                  </Typography.Text>
                )}
              </div>
            </Dropdown>
          </div>
          <div className="flex items-center gap-8 px-4">
            <Typography.Text className="text-[17px] text-[#ffffffa2]">
              Assignee
            </Typography.Text>
            <Space>
              <Avatar
                size={"small"}
                className="bg-purple-600"
                src={user?.imageURL}
              >
                {user?.name && user.name[0]}
              </Avatar>
              <Typography.Text className="text-[14px] text-[#ffffffa2]">
                {user?.name}
              </Typography.Text>
            </Space>
          </div>
          <div className="flex items-center gap-8 px-4 pt-4">
            <Typography.Text className="text-[17px] text-[#ffffffa2]">
              Due Date
            </Typography.Text>
            <Space>
              {
                <Typography.Text className="cursor-pointer">
                  <Dropdown
                    placement="bottomRight"
                    trigger={["click"]}
                    menu={{
                      items: changeDueDateItems,
                    }}
                  >
                    {task?.dueDate ? (
                      <Tag
                        color={
                          new Date(task?.dueDate).getTime() -
                            new Date().getTime() <
                          4 * 24 * 60 * 60 * 1000
                            ? "red"
                            : new Date(task?.dueDate).getTime() -
                                new Date().getTime() <
                              14 * 24 * 60 * 60 * 1000
                            ? "orange"
                            : "green"
                        }
                      >
                        due <Moment format="DD MMM">{task?.dueDate}</Moment>{" "}
                      </Tag>
                    ) : (
                      <Tag>Add due date</Tag>
                    )}
                  </Dropdown>
                </Typography.Text>
              }
            </Space>
          </div>
          <Divider />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TaskDetails;
