import DesignReviewInvite from "@/components/EmailTemplates/DesignReviewInvite";
import { APP_URL } from "@/helpers/constants";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { resend } from "@/lib/api/mailer";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uniq } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";

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
      if (data.isPrivate) {
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

      const sendPromises = emails.map(async (email: string) => {
        await resend.sendEmail({
          from: "FreeFlow <noreply@freeflow.to>",
          to: email,
          subject: `[FreeFlow] ${data.uploadedBy} requested your feedback on a design`,
          // @ts-expect-error
          react: DesignReviewInvite({
            designReviewUrl,
            designReviewPassword,
            inviter: data.uploadedBy,
          }),
        });
      });

      await Promise.all(sendPromises);

      // Update sentEmailInvites field in db
      const existingEmailInvites = data.sentEmailInvites ?? [];
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
