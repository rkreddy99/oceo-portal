import nc from "next-connect";
import { all } from "@/middlewares/index";
import { getApprovedTimeCards } from "@/db/index";

const handler = nc();

handler.use(all);

const maxAge = 1 * 24 * 60 * 60;

handler.get(async (req, res) => {
  const approvedtimecards = await getApprovedTimeCards(req.db, req.query.month);
  res.send({ approvedtimecards });
});

export default handler;
