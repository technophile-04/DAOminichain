import { NextApiRequest, NextApiResponse } from "next";

export default function async(_req: NextApiRequest, res: NextApiResponse) {
  const randomNo = Math.random();
  res.send(`Hello world! ${randomNo}`);
}
