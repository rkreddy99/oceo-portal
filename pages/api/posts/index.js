import nc from "next-connect";
import { all } from "@/middlewares/index";
import { getPosts, insertPost, approvePost } from "@/db/index";

const handler = nc();

handler.use(all);

const maxAge = 1 * 24 * 60 * 60;

handler.get(async (req, res) => {
  const posts = await getPosts(
    req.db,
    req.query.from ? new Date(req.query.from) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined,
    req.query.approved
  );

  if (req.query.from && posts.length > 0) {
    // This is safe to cache because from defines
    //  a concrete range of posts
    res.setHeader("cache-control", `public, max-age=${maxAge}`);
  }

  res.send({ posts });
});

handler.post(async (req, res) => {
  if (!req.user) {
    return res.status(401).send("unauthenticated");
  }

  // if (!req.body.content) return res.status(400).send('You must write something');
  const post = await insertPost(req.db, {
    title: req.body.title,
    description: req.body.description,
    eligibility: req.body.eligibility,
    approved: req.body.approved,
    applicants: [],
    creatorId: req.user._id,
  });

  return res.json({ post });
});

handler.patch(async (req, res) => {
  if (!req.user) {
    req.status(401).end();
    return;
  }
  let body = JSON.parse(req.body);
  if (body.approve === true) {
    await approvePost(req.db, body);
  }
});

export default handler;
