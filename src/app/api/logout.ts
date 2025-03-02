import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).end();
  }

  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      maxAge: -1,
      path: "/",
    })
  );

  res.status(200).json({ message: "Logged out" });
}
