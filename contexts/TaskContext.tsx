import { ITaskData } from "@/interfaces/Task";
import { db } from "@/lib/firebaseConfig";
import { message } from "antd";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useEffect, useState, useContext } from "react";
import { useAuth } from "./AuthContext";

export interface ITaskContext {
  tasks: ITaskData[];
  createTask: (task: ITaskData) => any;
}

const defaultValues: ITaskContext = {
  tasks: [],
  createTask: () => {},
};

const TaskContext = createContext<ITaskContext>(defaultValues);

export function useTaskContext() {
  return useContext(TaskContext);
}

export function TaskContextProvider({ children }: any) {
  const { authUser } = useAuth();
  const [tasks, setTasks] = useState<ITaskData[]>(defaultValues.tasks);
  const TaskRef = collection(db, "tasks");
  const createTask = async (task: ITaskData) => {
    const taskSnap = await addDoc(TaskRef, task);
    if (taskSnap) {
      getUserTasks(authUser?.uid as string);
      message.success("Task created successfully");
    } else {
      message.error("Failed to create task");
    }
  };

  const getUserTasks = async (uid: string) => {
    const q = query(collection(db, "tasks"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const tasks: ITaskData[] = querySnapshot.docs.map(
      (doc) => doc.data() as ITaskData
    );
    console.log("Changed here");
    setTasks(tasks);
  };

  useEffect(() => {
    authUser && getUserTasks(authUser?.uid as string);
  }, [authUser?.uid]);

  const value: ITaskContext = {
    tasks,
    createTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
