import { NextApiRequest, NextApiResponse } from "next";
import { admin } from "../../lib/firebaseAdmin";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn });

    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    };

    res.setHeader("Set-Cookie", serialize("token", sessionCookie, options));
    res.status(200).end();
  } catch (error) {
    console.error("Error creating session cookie:", error);
    res.status(500).end();
  }
}
