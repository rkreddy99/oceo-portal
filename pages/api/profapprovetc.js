import nc from "next-connect";
import { all } from "@/middlewares/index";
import { profApproveTimecard } from "@/db/timecard";

const handler = nc();

handler.use(all);

handler.post(async (req, res) => {
    const { timecardId } = req.body;
    // console.log(req.body);
    if (!timecardId) {
      res.status(400).send("Incorrect API call");
      return;
    }
    const card= await profApproveTimecard(req.db,
      req.body
    );
    res.status(200).send("Timecard Approved")
  });
  
  export default handler;
