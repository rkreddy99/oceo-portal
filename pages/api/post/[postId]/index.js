import nc from "next-connect";
import { all } from "@/middlewares/index";
import { findPostById } from "@/db/index";

const handler = nc();

handler.use(all);

const maxAge = 4 * 60 * 60; // 4 hours

handler.get(async (req, res) => {
  console.log("asdf");
  const post = await findPostById(req.db, req.query.postId);
  if (post) res.setHeader("cache-control", `public, max-age=${maxAge}`);
  res.send({ post });
});

export default handler;
