import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import CreateTaskModal from "@/components/Modal/CreateTaskModal";
import { useTaskContext } from "@/contexts/TaskContext";
import { ITaskData } from "@/interfaces/Task";
import Head from "next/head";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Empty, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import DragBox from "@/components/DragTask/DragBox";
import { StyledCollapse } from "@/theme/themeConfig";
import { useDrop } from "react-dnd";
import TaskHeader from "@/components/TaskHeader";

const Tasks = () => {
  const { tasks } = useTaskContext();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [inProgressTask, setInProgressTask] = useState<ITaskData[]>([]);
  const [toDoTask, setToDoTask] = useState<ITaskData[]>([]);
  const [doneTask, setDoneTask] = useState<ITaskData[]>([]);
  const [cancelledTask, setCancelledTask] = useState<ITaskData[]>([]);
  const [defaultStatus, setDefaultStatus] = useState<
    undefined | "In Progress" | "To Do" | "Done" | "Cancelled"
  >(undefined);
  const [progressDropActive, setProgressDropActive] = useState<boolean>(false);
  const [toDoDropActive, setToDoDropActive] = useState<boolean>(false);
  const [doneDropActive, setDoneDropActive] = useState<boolean>(false);
  const [cancelledDropActive, setCancelledDropActive] =
    useState<boolean>(false);

  useEffect(() => {
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

  const [{ canDrop, isOver }, dropProgress] = useDrop(() => ({
    accept: "box",
    drop: () => ({ name: "dropProgress" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  useEffect(() => {
    if (canDrop && isOver) {
      setProgressDropActive(true);
    } else {
      setProgressDropActive(false);
    }
  }, [canDrop, isOver]);

  const [, dropToDo] = useDrop(() => ({
    accept: "box",
    drop: () => ({ name: "dropToDo" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const [, dropDone] = useDrop(() => ({
    accept: "box",
    drop: () => ({ name: "dropDone" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const [, dropCancelled] = useDrop(() => ({
    accept: "box",
    drop: () => ({ name: "dropCancelled" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <DashboardLayout>
      <Head>
        <title>FreeFlow | Tasks</title>
      </Head>
      <TaskHeader />
      <Space direction="vertical" className="w-full">
        <CreateTaskModal
          teamName="Task Details"
          openModal={openModal}
          setOpenModal={setOpenModal}
          defaultStatus={defaultStatus}
          setDefaultStatus={setDefaultStatus}
        />
        <StyledCollapse
          defaultActiveKey={[
            inProgressTask && inProgressTask.length !== 0 ? "1" : "",
            toDoTask && toDoTask.length !== 0 ? "2" : "",
            doneTask && doneTask.length !== 0 ? "3" : "",
            cancelledTask && cancelledTask.length !== 0 ? "4" : "",
          ]}
          bordered={false}
          rootClassName="rounded-none"
        >
          <Collapse.Panel
            extra={
              <Button
                size="small"
                onClick={(event) => {
                  event.stopPropagation(),
                    setDefaultStatus("In Progress"),
                    setOpenModal(true);
                }}
                icon={<PlusOutlined />}
              />
            }
            header={
              <Typography.Text className="text-[#D89614]">
                <SyncOutlined /> In Progress
              </Typography.Text>
            }
            key="1"
          >
            <div className="relative w-full" ref={dropProgress}>
              {inProgressTask && inProgressTask.length !== 0 ? (
                inProgressTask.map((task) => {
                  return <DragBox task={task} />;
                })
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
              {progressDropActive && (
                <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded border border-[#a71bf83d] bg-[#a71bf81d]">
                  <Typography.Text className=" text-xl opacity-30">
                    Change status to in progress
                  </Typography.Text>
                </div>
              )}
            </div>
          </Collapse.Panel>
          <Collapse.Panel
            extra={
              <Button
                size="small"
                onClick={(event) => {
                  event.stopPropagation(),
                    setDefaultStatus("To Do"),
                    setOpenModal(true);
                }}
                icon={<PlusOutlined />}
              />
            }
            header={
              <Typography.Text>
                <CheckCircleOutlined /> To Do
              </Typography.Text>
            }
            key="2"
          >
            <div className="w-full" ref={dropToDo}>
              {toDoTask && toDoTask.length !== 0 ? (
                toDoTask.map((task) => {
                  return <DragBox task={task} />;
                })
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </Collapse.Panel>
          <Collapse.Panel
            extra={
              <Button
                size="small"
                onClick={(event) => {
                  event.stopPropagation(),
                    setDefaultStatus("Done"),
                    setOpenModal(true);
                }}
                icon={<PlusOutlined />}
              />
            }
            header={
              <Typography.Text className="text-[#1668DC]">
                <CheckCircleOutlined /> Done
              </Typography.Text>
            }
            key="3"
          >
            <div className="w-full" ref={dropDone}>
              {doneTask && doneTask.length !== 0 ? (
                doneTask.map((task) => {
                  return <DragBox task={task} />;
                })
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </Collapse.Panel>
          <Collapse.Panel
            extra={
              <Button
                size="small"
                onClick={(event) => {
                  event.stopPropagation(),
                    setDefaultStatus("Cancelled"),
                    setOpenModal(true);
                }}
                icon={<PlusOutlined />}
              />
            }
            header={
              <Typography.Text className="text-[#E84749]">
                <CloseCircleOutlined /> Cancelled
              </Typography.Text>
            }
            key="4"
          >
            <div ref={dropCancelled} className="w-full">
              {cancelledTask && cancelledTask.length !== 0 ? (
                cancelledTask.map((task) => {
                  return <DragBox task={task} />;
                })
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </Collapse.Panel>
        </StyledCollapse>
      </Space>
    </DashboardLayout>
  );
};

export default Tasks;
