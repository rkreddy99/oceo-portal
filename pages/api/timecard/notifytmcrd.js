import nc from "next-connect";
import { sendEmail } from "@/lib/mail";
import { database } from "@/middlewares/index";
import { findUserByEmail } from "@/db/index";

const handler = nc();

handler.use(database);

handler.post(async (req, res) => {
  console.log(req.query);
  const user = await findUserByEmail(req.db, req.query.email);
  if (!user) {
    res.status(401).send("The email is not found");
    return;
  }
  const msg = {
    to: process.env.EMAIL_FROM,
    from: process.env.EMAIL_FROM,
    subject: `Time Card Submission`,
    text: `Dear ${user.name},\nGentle reminder to submit the Time Card of ${req.query.month}`,
  };
  console.log(msg);
  await sendEmail(msg);
  res.end("ok");
});

export default handler;
