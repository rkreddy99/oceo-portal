import { nanoid } from "nanoid";

export async function getPosts(db, from = new Date(), by, limit, approved) {
  return db
    .collection("posts")
    .find({
      // Pagination: Fetch posts from before the input date or fetch from newest
      ...(from && {
        createdAt: {
          $lte: from,
        },
      }),
      ...(by && { creatorId: by }),
      ...{ approved: approved === true },
    })
    .sort({ createdAt: -1 })
    .limit(limit || 10)
    .toArray();
}

export async function findPostById(db, postId) {
  const _post = await db.collection("posts").findOne({ _id: postId });
  const post = JSON.stringify(_post);
  return post;
}

export async function insertPost(
  db,
  { title, description, eligibility, approved, applicants, creatorId }
) {
  return db
    .collection("posts")
    .insertOne({
      _id: nanoid(12),
      title,
      description,
      eligibility,
      approved,
      applicants,
      creatorId,
      createdAt: new Date(),
    })
    .then(({ ops }) => ops[0]);
}

export async function approvePost(db, { postId, approve }) {
  return db
    .collection("posts")
    .findOneAndUpdate(
      { _id: postId },
      { $set: { approved: approve === true } },
      { upsert: false }
    );
}
