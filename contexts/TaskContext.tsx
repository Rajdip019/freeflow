import { ITaskData } from "@/interfaces/Task";
import { db } from "@/lib/firebaseConfig";
import { message } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, useEffect, useState, useContext } from "react";
import { useAuth } from "./AuthContext";

export interface ITaskContext {
  tasks: ITaskData[];
  createTask: (task: ITaskData) => any;
  updateTask: (uid: string, task: ITaskData) => any;
  deleteTask: (uid: string) => any;
}

const defaultValues: ITaskContext = {
  tasks: [],
  createTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
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
    const tasks: ITaskData[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ ...doc.data(), task_id: doc.id } as ITaskData);
    });
    setTasks(tasks);
  };

  const updateTask = async (uid: string, task: ITaskData) => {
    try {
      const updateTaskRef = doc(db, "tasks", uid);
      await updateDoc(updateTaskRef, {
        ...task,
      });
      await getUserTasks(authUser?.uid as string);
      message.success("Task updated successfully", 1);
    } catch (error) {
      console.log(error);
      message.error("Failed to update task");
    }
  };

  const deleteTask = async (uid: string) => {
    try {
      const deleteTaskRef = doc(db, "tasks", uid);
      await deleteDoc(deleteTaskRef);
      await getUserTasks(authUser?.uid as string);
      message.success("Task deleted successfully");
    } catch (error) {
      console.log(error);
      message.error("Failed to delete task");
    }
  };

  useEffect(() => {
    authUser && getUserTasks(authUser?.uid as string);
  }, [authUser?.uid]);

  const value: ITaskContext = {
    tasks,
    createTask,
    updateTask,
    deleteTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
