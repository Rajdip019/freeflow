import { NextApiRequest, NextApiResponse } from "next";
import { ZAPIER_WEBHOOKS } from "@/lib/api/zapier";
import { postJson } from "@/lib/fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { image } = req.body;
    if (!image) {
      return res.status(400).end();
    }
    await postJson(ZAPIER_WEBHOOKS.NEW_REVIEW_IMAGE, { image });
    return res.status(200).end();
  }

  return res.status(404).end();
}
