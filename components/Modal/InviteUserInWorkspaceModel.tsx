import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Modal,
  Input,
  Select,
  Button,
  message,
  Typography,
  Form,
  Space,
} from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { IUser, IWorkspaceInUser } from "@/interfaces/User";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IUserInWorkspace } from "@/interfaces/Workspace";
import { useUserContext } from "@/contexts/UserContext";
import Avatar from "react-avatar";

const { Option } = Select;

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const InviteUserInWorkspaceModel: React.FC<Props> = ({
  visible,
  setVisible,
}) => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [wrongInviteEmail, setWrongInviteEmail] = useState<boolean>(false);
  const [alreadyEmail, setAlreadyEmail] = useState<boolean>(false);

  const {
    renderWorkspace,
    addUserInWorkspace,
    currentUserInWorkspace,
    fetchFullWorkspace,
    fetchUserWork,
  } = useWorkspaceContext();
  const { addWorkspaceInUser } = useUserContext();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWrongInviteEmail(false);
    setEmail(e.target.value);
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  useEffect(() => {
    if (email) {
      setAlreadyEmail(
        currentUserInWorkspace?.some((user) => user.email === email)
      );
    }
  }, [email]);

  const handleConfirm = () => {
    setConfirmLoading(true);
    handleInviteInWorkspace();
  };

  const handleInviteInWorkspace = async () => {
    const emailUserRef = collection(db, "users");
    const q = query(emailUserRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setWrongInviteEmail(true);
      setConfirmLoading(false);
    } else {
      const userData: IUser = querySnapshot.docs[0].data() as IUser;
      inviteUser(userData, querySnapshot.docs[0].id, role);
      setVisible(false);
      setConfirmLoading(false);
    }
  };

  const inviteUser = async (userData: IUser, id: string, role: string) => {
    if (renderWorkspace) {
      const currentWorkspaceId = localStorage.getItem("currentWorkspaceId");
      if (currentWorkspaceId) {
        const newUserInWorkspaceData: IUserInWorkspace = {
          id: id,
          role: role as "owner" | "admin" | "editor" | "viewer",
          name: userData.name,
          email: userData.email,
          inviteTime: Date.now(),
          imageURL: userData?.imageURL || "",
          status: "Pending",
        };

        // add workspace to the user sub collection

        const newWorkspaceInUserData: IWorkspaceInUser = {
          id: currentWorkspaceId as string,
          role: role as "owner" | "admin" | "editor" | "viewer",
          name: renderWorkspace.name,
          avatarUrl: "",
          status: "Pending",
        };

        try {
          console.log(newWorkspaceInUserData);
          console.log(newUserInWorkspaceData);

          // await addUserInWorkspace(currentWorkspaceId, newUserInWorkspaceData);
          // await addWorkspaceInUser(id, newWorkspaceInUserData);

          // await fetchUserWork();

          // message.success("User invited successfully");
          setEmail("");
          setRole("");
        } catch (err) {
          message.error("Failed to invite user");
        }
      }
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      title={
        <Space className="-mt-1">
          <Typography.Title level={4}>
            <Avatar
              name={renderWorkspace?.name}
              size="25"
              className="-mt-0.5 mr-2 rounded"
            />
            Invite to your workspace
          </Typography.Title>
        </Space>
      }
      footer={null}
    >
      <div className="mb-3 h-0.5 bg-[#ffffff25]" />
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={handleConfirm}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email" },
          ]}
          validateStatus={
            alreadyEmail || wrongInviteEmail ? "error" : undefined
          }
          help={
            alreadyEmail
              ? "This user is already in the workspace"
              : wrongInviteEmail
              ? "This email is not registered"
              : undefined
          }
        >
          <Input
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please input your role!" }]}
        >
          <Select
            placeholder="Select a role"
            value={role}
            onChange={handleRoleChange}
            style={{ width: "100%" }}
          >
            <Option value="admin">Admin</Option>
            <Option value="editor">Editor</Option>
            <Option value="viewer">Viewer</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            key="confirm"
            type="primary"
            loading={confirmLoading}
            htmlType="submit"
          >
            Confirm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InviteUserInWorkspaceModel;
