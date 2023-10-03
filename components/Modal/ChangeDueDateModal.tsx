import { useTaskContext } from "@/contexts/TaskContext";
import { ITaskData } from "@/interfaces/Task";
import { DatePicker, Modal, Space, Typography } from "antd";
import React from "react";
import Moment from "react-moment";

type Props = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  task: ITaskData;
};

const ChangeDueDateModal = ({ openModal, setOpenModal, task }: Props) => {
  const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false);
  const [newDate, setNewDate] = React.useState<Date>();
  const { updateTask } = useTaskContext();
  return (
    <Modal
      title="Change Due Date"
      visible={openModal}
      okText="Update"
      onOk={async () => {
        setConfirmLoading(true);
        await updateTask(
          task.task_id as string,
          {
            ...task,
            dueDate: newDate?.toDateString(),
          },
          true
        );
        setConfirmLoading(false);
        setOpenModal(false);
        setNewDate(undefined);
      }}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setOpenModal(false);
      }}
    >
      <Space direction="vertical" className="p-5">
        <Typography.Title level={4}>
          Current Date: &nbsp;{" "}
          <span className="text-orange-400">
            {task?.dueDate ? (
              <Moment format="DD MMM YYYY">{task.dueDate}</Moment>
            ) : (
              "No Due Date Provided"
            )}
          </span>
        </Typography.Title>
        <Typography.Title level={4}>
          New Date:&nbsp;&nbsp;
          <DatePicker
            className="w-52"
            onChange={(date) => {
              setNewDate(date?.toDate());
            }}
          />{" "}
        </Typography.Title>
      </Space>
    </Modal>
  );
};

export default ChangeDueDateModal;
