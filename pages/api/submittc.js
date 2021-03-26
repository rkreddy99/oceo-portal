import nc from "next-connect";
import { all } from "@/middlewares/index";
import { submitCard } from "@/db/timecard";

const handler = nc();

handler.use(all);

handler.post(async (req, res) => {
    const { month,week1, week2, week3, week4, week5, bankname, accnum, ifsc, userId, postId} = req.body;
    console.log(req.body);
    if (!month || !week1 || !week2 || !week3 || !week4 || !week5 || !bankname || !accnum ||!ifsc || !userId || !postId) {
      res.status(400).send("Missing field(s)");
      return;
    }
    const card= await submitCard(req.db,
      req.body
    );
    res.status(200).send("Timecard Sent")
  });
  
  export default handler;
