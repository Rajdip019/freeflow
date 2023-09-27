import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import CreateTaskModal from "@/components/Modal/CreateTaskModal";
import TaskList from "@/components/TaskList";
import { useTaskContext } from "@/contexts/TaskContext";
import { ITaskData } from "@/interfaces/Task";
import Head from "next/head";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditFilled,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Empty, Space, Typography, message } from "antd";
import React, { useEffect, useState } from "react";

const Tasks = () => {
  const { tasks } = useTaskContext();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [inProgressTask, setInProgressTask] = useState<ITaskData[]>([]);
  const [toDoTask, setToDoTask] = useState<ITaskData[]>([]);
  const [doneTask, setDoneTask] = useState<ITaskData[]>([]);
  const [cancelledTask, setCancelledTask] = useState<ITaskData[]>([]);

  useEffect(() => {
    console.log("Changed");
    let _inProgressTask: ITaskData[] = tasks?.filter(
      (task) => task.status === "In Progress"
    );
    let _toDoTask: ITaskData[] = tasks?.filter(
      (task) => task.status === "To Do"
    );
    let _doneTask: ITaskData[] = tasks?.filter(
      (task) => task.status === "Done"
    );
    let _cancelledTask: ITaskData[] = tasks?.filter(
      (task) => task.status === "Cancelled"
    );

    setInProgressTask(_inProgressTask);
    setToDoTask(_toDoTask);
    setDoneTask(_doneTask);
    setCancelledTask(_cancelledTask);
  }, [tasks]);

  return (
    <DashboardLayout>
      <Head>
        <title>FreeFlow | Tasks</title>
      </Head>
      <Space direction="vertical" className="w-full">
        <Space className="m-8 flex items-center justify-between">
          <Typography.Text className="text-5xl font-semibold">
            Tasks
          </Typography.Text>
          <Button
            size="large"
            icon={<EditFilled />}
            onClick={() => setOpenModal(true)}
          >
            Create Task
          </Button>
        </Space>
        <CreateTaskModal
          teamName="Task Details"
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
        <Collapse defaultActiveKey={["1"]} className="mx-8">
          <Collapse.Panel
            header={
              <Space className="flex items-center justify-between">
                <Typography.Text className="text-[#D89614]">
                  <SyncOutlined /> In Progress
                </Typography.Text>
                <Button
                  size="small"
                  icon={<PlusOutlined onClick={() => setOpenModal(true)} />}
                />
              </Space>
            }
            key="1"
          >
            <Space direction="vertical" className="w-full">
              {inProgressTask && inProgressTask.length !== 0 ? (
                inProgressTask?.map((task) => <TaskList task={task} />)
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Space>
          </Collapse.Panel>
          <Collapse.Panel
            header={
              <Space className="flex items-center justify-between">
                <Typography.Text>
                  <CheckCircleOutlined /> To Do
                </Typography.Text>
                <Button
                  size="small"
                  icon={<PlusOutlined onClick={() => setOpenModal(true)} />}
                />
              </Space>
            }
            key="2"
          >
            <Space direction="vertical" className="w-full">
              {toDoTask && toDoTask.length !== 0 ? (
                toDoTask?.map((task) => <TaskList task={task} />)
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Space>
          </Collapse.Panel>
          <Collapse.Panel
            header={
              <Space className="flex items-center justify-between">
                <Typography.Text className="text-[#1668DC]">
                  <CheckCircleOutlined /> Done
                </Typography.Text>
                <Button
                  size="small"
                  icon={<PlusOutlined onClick={() => setOpenModal(true)} />}
                />
              </Space>
            }
            key="3"
          >
            <Space direction="vertical" className="w-full">
              {doneTask && doneTask.length !== 0 ? (
                doneTask?.map((task) => <TaskList task={task} />)
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Space>
          </Collapse.Panel>
          <Collapse.Panel
            header={
              <Space className="flex items-center justify-between">
                <Typography.Text className="text-[#E84749]">
                  <CloseCircleOutlined /> Cancelled
                </Typography.Text>
                <Button
                  size="small"
                  icon={<PlusOutlined onClick={() => setOpenModal(true)} />}
                />
              </Space>
            }
            key="4"
          >
            <Space direction="vertical" className="w-full">
              {cancelledTask && cancelledTask.length !== 0 ? (
                cancelledTask?.map((task) => <TaskList task={task} />)
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Space>
          </Collapse.Panel>
        </Collapse>
      </Space>
    </DashboardLayout>
  );
};

export default Tasks;
