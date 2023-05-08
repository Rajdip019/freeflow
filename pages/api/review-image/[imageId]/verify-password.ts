import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

interface Data {
  verified: boolean;
}

interface Error {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const { imageId, password } = req.query;
  const docRef = doc(db, "reviewImages", imageId as string, "private/password");
  const docSnap = await getDoc(docRef);
  if (!docSnap) {
    return res.status(403).json({ error: "We could not verify that password" });
  }
  if (docSnap.data()?.password === password) {
    return res.status(200).json({ verified: true });
  }
  res.status(403).json({ error: "We could not verify that password" });
}
