import { INewComment, IReview } from "@/interfaces/Thread";

export const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "prod";

export const APP_URL =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? "https://freeflow.to"
    : process.env.NEXT_PUBLIC_ENV === "stage"
    ? "https://freeflow-stage.vercel.app"
    : "http://localhost:3000";

export const defaultHighlightedThread: IReview = {
  id: "",
  initialComment: "",
  timeStamp: 0,
  name: "",
  version: 1,
  imageURL: "",
};

export const defaultNewThread: INewComment = {
  name: "",
  value: "",
};

export const sidebarData = [
  {
    title: "Tasks",
    url: "/tasks",
  },
  {
    title: "Design",
    url: "/design",
  },
];
