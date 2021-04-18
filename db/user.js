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

export async function updateUserPosts(db, userid, postid, userObj) {
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
      { $push: { applicants: userObj } },
      { returnOriginal: false }
    )
    .then(({ value }) => value);
  return updateUserPost;
}
export async function updatePostComment(db, postid, comment) {

  const update = await db
    .collection("posts")
    .findOneAndUpdate(
      { _id: postid },
      { $push: { comments: comment } },
      { returnOriginal: false }
    )
    .then(({ value }) => value);
  return update;
}
export async function updateUserPostsifSelected(db, userid, postid, userObj, isAdmin) {
  // console.log(userObj, "inside db index upadateifselect");
  console.log(isAdmin);
  if(userObj.selected){
      if (!isAdmin){
        console.log("Prof");
        const updatePostApplicants = await db
        .collection("posts")
        .findOneAndUpdate(
          { _id: postid },
          { $push: { profselectedApplicants: userid } },
          { returnOriginal: false }
        )
        .then(({ value }) => value);
      } else {
        console.log("Admin");
        const updateUserPost = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: userid },
          { $push: { selectedPosts: postid } },
          { returnOriginal: false }
        )
        .then(({ value }) => value);
        const updatePostApplicants = await db
        .collection("posts")
        .findOneAndUpdate(
          { _id: postid },
          { $push: { selectedApplicants: userid } },
          { returnOriginal: false }
        )
        .then(({ value }) => value);
      }
  }
  else{
    if (!isAdmin){
      const updatePostApplicants = await db
        .collection("posts")
        .findOneAndUpdate(
          { _id: postid },
          { $pull: {applicants: {userid: userid}} } ,
          { returnOriginal: false },
          {multi: true}
        )
        .then(({ value }) => value);
    } else {
      const updatePostApplicants = await db
        .collection("posts")
        .findOneAndUpdate(
          { _id: postid },
          { $pull: {applicants: {userid: userid}} } ,
          { returnOriginal: false },
          {multi: true}
        )
        .then(({ value }) => value);
      const updatePostApplicants2 = await db
        .collection("posts")
        .findOneAndUpdate(
          { _id: postid },
          { $pull: {profselectedApplicants: {userid: userid}} } ,
          { returnOriginal: false},
          {multi: true}
        )
        .then(({ value }) => value);  
    }  
  }
  
  return updateUserPostsifSelected;
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
