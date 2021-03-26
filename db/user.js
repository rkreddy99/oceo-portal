import { nanoid } from "nanoid";

export async function findUserById(db, userId) {
  return db
    .collection("users")
    .findOne({
      _id: userId,
    })
    .then((user) => user || null);
}

export async function findUserByEmail(db, email) {
  return db
    .collection("users")
    .findOne({
      email,
    })
    .then((user) => user || null);
}

export async function updateUserById(db, id, update) {
  return db
    .collection("users")
    .findOneAndUpdate({ _id: id }, { $set: update }, { returnOriginal: false })
    .then(({ value }) => value);
}

export async function updateUserPosts(db, userid, postid) {
  const updateUserPost = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: userid },
      { $push: { posts: postid } },
      { returnOriginal: false }
    )
    .then(({ value }) => value);
  const updatePostApplicants = await db
    .collection("posts")
    .findOneAndUpdate(
      { _id: postid },
      { $push: { applicants: userid } },
      { returnOriginal: false }
    )
    .then(({ value }) => value);
  return updateUserPost;
}
export async function updateSelectedCandidates(db, userid, postid){
  const updateSelectedCandidate = await db
  .collection("users")
  .findOneAndUpdate(
    { _id: userid },
    { $push: { selectedPosts: postid } },
    { returnOriginal: false }
  )
  .then(({ value }) => value);
  const updatePostSelectedApplicants = await db
    .collection("posts")
    .findOneAndUpdate(
      { _id: postid },
      { $push: { selected_applicants: userid } },
      { returnOriginal: false }
    )
    .then(({ value }) => value);
    return updateSelectedCandidate;
}

export async function insertUser(
  db,
  { email, password, bio = "", name, profilePicture, role, posts, selectedPosts }
) {
  return db
    .collection("users")
    .insertOne({
      _id: nanoid(12),
      emailVerified: false,
      profilePicture,
      email,
      password,
      name,
      bio,
      role,
      posts,
      selectedPosts
    })
    .then(({ ops }) => ops[0]);
}
