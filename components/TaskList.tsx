import { ITaskData } from "@/interfaces/Task";
import {
  FieldTimeOutlined,
  HistoryOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Space, Tag, Typography, Tooltip } from "antd";
import React from "react";
import Moment from "react-moment";

type Props = {
  task: ITaskData;
};

const TaskList = ({
  task: { title, dueDate, assignee, attachment, createdAt },
}: Props) => {
  return (
    <>
      <Space className="flex items-center justify-between">
        <Space>
          <Avatar
            className="rounded bg-purple-500 outline-dashed outline-[1px] outline-[#ffffff15]"
            src={attachment}
          >
            {!attachment ? "N/A" : "L/F"}
          </Avatar>
          <Typography.Text>{title}</Typography.Text>
        </Space>
        <Space>
          {dueDate && (
            <Tag color="orange">
              <Moment format="DD MMM YYYY">{dueDate}</Moment>{" "}
              <HistoryOutlined />
            </Tag>
          )}
          <Typography.Text>
            <Moment fromNow ago>
              {createdAt}
            </Moment>{" "}
          </Typography.Text>{" "}
          {assignee && (
            <Tooltip title={assignee}>
              <Avatar
                className="bg-blue-500 outline-dashed outline-[1px] outline-[#ffffff15]"
                size="small"
                src={attachment}
              >
                {assignee[0]}
              </Avatar>
            </Tooltip>
          )}{" "}
          <Button disabled size="small" icon={<PlusOutlined />} />
          <Button disabled size="small" icon={<MoreOutlined />} />
        </Space>
      </Space>
      <div className="my-1 h-[0.2px] bg-[#ffffff0d]"></div>
    </>
  );
};

export default TaskList;
