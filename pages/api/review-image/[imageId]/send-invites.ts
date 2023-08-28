import { APP_URL } from "@/utils/constants";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uniq } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { imageId } = req.query;
    const { emails } = req.body;

    try {
      const docRef = doc(db, "reviewImages", imageId as string);
      const docSnap = await getDoc(docRef);

      if (!docSnap) {
        return res.status(404).end();
      }
      const data = docSnap.data() as IReviewImageData;

      let designReviewPassword: string = "";
      if (data && data.isPrivate) {
        const passwordDocRef = doc(
          db,
          "reviewImages",
          imageId as string,
          "private/password"
        );
        const passwordDocSnap = await getDoc(passwordDocRef);
        if (passwordDocSnap) {
          designReviewPassword = passwordDocSnap.data()?.password ?? "";
        }
      }

      const designReviewUrl = `${APP_URL}/review-image/${imageId}`;

      const { templateData } = req.body;
      sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
      const sendPromises = emails.map(async (email: string) => {
        const msg = {
          to: email,
          from: "unsnarl.secure@gmail.com",
          templateId: "d-c1725864e64849639149782c58502a40",
          dynamic_template_data: { templateData },
        };
        await sgMail.send(msg);
      });

      await Promise.all(sendPromises);

      // Update sentEmailInvites field in db
      const existingEmailInvites = data.sentEmailInvites
        ? data.sentEmailInvites ?? []
        : [];
      const updatedEmailInvites = uniq([...existingEmailInvites, ...emails]);
      await updateDoc(docRef, {
        sentEmailInvites: updatedEmailInvites,
      });
      return res.status(200).end();
    } catch (err) {
      console.error("Error sending invites", imageId, emails, err);
      return res.status(500).json({ error: err });
    }
  }

  return res.status(404).end();
}
