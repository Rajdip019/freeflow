import { INewThread, IThread } from "@/interfaces/Thread";

export const APP_URL =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? "https://freeflow.to"
    : process.env.NEXT_PUBLIC_ENV === "stage"
    ? "https://freeflow-stage.vercel.app"
    : "http://localhost:3000";

export const defaultHighlightedThread: IThread = {
  id: "",
  imageDimension: { height: 0, width: 0 },
  top: 0,
  left: 0,
  initialComment: "",
  timeStamp: 0,
  name: "",
  color: "",
};

export const defaultNewThread: INewThread = {
  pos: {
    top: 0,
    left: 0,
  },
  comment: {
    name: "",
    value: "",
  },
  color: "gray-900",
  isHidden: true,
};

export const sidebarData = [
  {
    img: "/sidebar-icons/🏠.png",
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    img: "/sidebar-icons/🎨.png",
    title: "Design",
    url: "/design",
  },
];
