import { IS_PRODUCTION } from "@/helpers/constants";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { IUser } from "@/interfaces/User";
import { postJson } from "@/lib/fetch";

export const newUserEvent = async (user: Partial<IUser>) => {
  if (!IS_PRODUCTION) return;
  await postJson("/api/events/new-user", { user });
};

export const newReviewImageEvent = async (image: IReviewImageData) => {
  if (!IS_PRODUCTION) return;
  await postJson("/api/events/new-user", { image });
};
