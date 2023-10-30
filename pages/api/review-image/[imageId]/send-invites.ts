import { APP_URL } from "@/utils/constants";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uniq } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";
import { resend } from "@/lib/api/mailer";
import DesignReviewInvite from "@/emails/DesignReviewInvite";
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

      const designReviewUrl = `${APP_URL}/review-image/${imageId}`;

      const sendPromises = emails.map(async (email: string) => {
        if (data)
          await resend.sendEmail({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: `[FreeFlow] ${data.uploadedBy} requested your feedback on a design`,
            // @ts-expect-error
            react: DesignReviewInvite({
              designReviewUrl,
              inviter: data.uploadedBy,
            }),
          });
      });

      await Promise.all(sendPromises);

      // Update sentEmailInvites field in db
      const existingEmailInvites =
        data && data.sentEmailInvites ? data.sentEmailInvites ?? [] : [];
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
