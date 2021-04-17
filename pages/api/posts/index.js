import nc from "next-connect";
import { all } from "@/middlewares/index";
import {
  getPosts,
  insertPost,
  approvePost,
  deletePost,
  editPost,
} from "@/db/index";

const handler = nc();

handler.use(all);

const maxAge = 1 * 24 * 60 * 60;

handler.get(async (req, res) => {
  const deadlineDate =
    req.query.deadlineDate != undefined
      ? new Date(req.query.deadlineDate)
      : undefined;
  const approved =
    req.query.approved == "true"
      ? true
      : req.query.approved == "undefined"
      ? null
      : false;
  const posts = await getPosts(
    req.db,
    req.query.from ? new Date(req.query.from) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined,
    approved,
    deadlineDate
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
    comments: [],
    approved: req.body.approved,
    applicants: [],
    selectedApplicants: [],
    creatorId: req.user._id,
    deadline: req.body.deadline,
  });

  return res.json({ post });
});

handler.patch(async (req, res) => {
  if (!req.user) {
    req.status(401).end();
  }
  let body = JSON.parse(req.body);
  if (body.approve === true) {
    const r = await approvePost(req.db, body);
    return res.json({ r });
  } else {
    const r = await editPost(req.db, body);
    return res.json({ r });
  }
});

handler.delete(async (req, res) => {
  if (!req.user) {
    req.status(401).end();
    return;
  }
  let body = JSON.parse(req.body);
  if (body.approve === false) {
    const r = await deletePost(req.db, body);
    return res.json({ r });
  }
});

export default handler;
