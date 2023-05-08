export const appUrl = () => {
  if (process.env.NEXT_PUBLIC_ENV === "prod") {
    return "https://freeflow.to";
  } else if (process.env.NEXT_PUBLIC_ENV === "stage") {
    return "https://freeflow-stage.vercel.app";
  } else {
    return "http://localhost:3000";
  }
};
