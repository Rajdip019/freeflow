import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotificationProps {
  type: NotificationType;
  message: string;
  description?: string;
  duration?: number;
}

export const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const notify = ({
    type,
    message,
    description,
    duration = 4,
  }: NotificationProps) => {
    return api[type]({
      message: message,
      description: description,
      duration: duration,
      placement: "bottomLeft",
    });
  };

  return { notify, contextHolder };
};
