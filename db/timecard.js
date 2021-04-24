import { nanoid } from "nanoid";
import { findPostById } from "./post";

export async function submitCard(
  db,
  {
    month,
    week1,
    week2,
    week3,
    week4,
    week5,
    bankname,
    accnum,
    ifsc,
    userId,
    postId,
  }
) {
  const postdata = await findPostById(db, postId);
  const profId = JSON.parse(postdata).creatorId;
  const postName = JSON.parse(postdata).title;
  console.log(profId);
  const { value } = await db.collection("timecards").insertOne({
    _id: nanoid(12),
    month,
    week1,
    week2,
    week3,
    week4,
    week5,
    bankname,
    accnum,
    ifsc,
    userId,
    postId,
    postName,
    profId,
    submittedAt: new Date(),
    approvedByProf: false,
    approvedByAdmin: false,
  });
  return value;
}

export async function getSubmittedCards(db, userId) {
  return db.collection("timecards").find({ userId: userId }).toArray();
}

export async function getUnapprovedProfCards(db, userId) {
  console.log(userId);
  return db
    .collection("timecards")
    .find({ profId: userId, approvedByProf: false })
    .toArray();
}

export async function getUnapprovedAdminCards(db) {
  return db
    .collection("timecards")
    .find({ approvedByAdmin: false, approvedByProf: true })
    .toArray();
}

export async function profApproveTimecard(db, { timecardId }) {
  return db
    .collection("timecards")
    .findOneAndUpdate(
      { _id: timecardId },
      { $set: { approvedByProf: true } },
      { returnOriginal: false }
    )
    .then(({ value }) => value);
}

export async function getApprovedTimeCards(db, month) {
  return db
    .collection("timecards")
    .find({ approvedByAdmin: true, approvedByProf: true, month: month })
    .toArray();
}
