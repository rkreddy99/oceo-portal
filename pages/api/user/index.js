import nc from "next-connect";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { all } from "@/middlewares/index";
import { updateUserById, updateUserPosts, updateUserPostsifSelected, updatePostComment } from "@/db/index";
import { extractUser } from "@/lib/api-helpers";
import { sendEmail } from "@/lib/mail";
const upload = multer({ dest: "/tmp" });
const handler = nc();

/* eslint-disable camelcase */
const {
  hostname: cloud_name,
  username: api_key,
  password: api_secret,
} = new URL(process.env.CLOUDINARY_URL);

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

handler.use(all);

handler.get(async (req, res) => {
  // Filter out password
  if (!req.user) return res.json({ user: null });
  const { password, ...u } = req.user;
  // console.log("in api get", u);
  return res.json({ user: u });
});

handler.patch(upload.single("profilePicture"), async (req, res) => {
  if (!req.user) {
    req.status(401).end();
    return;
  }

  if (req.applying || req.body.applying) {
    const user = await updateUserPosts(
      req.db,
      req.body.userid,
      req.body.postid,
      req.body
    );
    res.json({ user: extractUser(user) });
  } 
  else if(req.body.selected && req.body.admin=="true"){
    // console.log("Admin idhar");
    // console.log(req.body.admin);
    const user = await updateUserPostsifSelected(
      req.db,
      req.body.userid,
      req.body.postid,
      req.body,
      true
    );
    const msg = {
      to: req.body.useremail,
      from: process.env.EMAIL_FROM,
      subject: "oCEO Selection Confirmation Email",
      html: `
        <div>
          <p>Hello, ${req.body.username}</p>
          <p>We are happy to inform you that you are accepted to work under oCEO job posting: ${req.body.posttitle}.</p>
        </div>
        `,
    };
    // console.log(req.body.email, req.)
    // await sendEmail(msg);
    sendEmail(msg);
    res.json({ user: extractUser(user) });
  }
  else if(req.body.selected){
    // console.log("Prof idhar");

    const user = await updateUserPostsifSelected(
      req.db,
      req.body.userid,
      req.body.postid,
      req.body,
      false
    );
    const msg = {
      to: req.body.useremail,
      from: process.env.EMAIL_FROM,
      subject: "oCEO Selection Confirmation Email",
      html: `
        <div>
          <p>Hello, ${req.body.username}</p>
          <p>We are happy to inform you that you are accepted to work under oCEO job posting: ${req.body.posttitle}.</p>
        </div>
        `,
    };
    // console.log(req.body.email, req.)
    // await sendEmail(msg);
    sendEmail(msg);
    res.json({ user: extractUser(user) });
  }
  else if(req.body.rejected && req.body.admin=="true"){
    const user = await updateUserPostsifSelected(
      req.db,
      req.body.userid,
      req.body.postid,
      req.body,
      true
    );
    const msg = {
      to: req.body.useremail,
      from: process.env.EMAIL_FROM,
      subject: "oCEO Opportunity Status Update",
      html: `
        <div>
          <p>Hello, ${req.body.username}</p>
          <p>We are sorry to inform you that your application for working on oCEO job posting: ${req.body.posttitle} is rejected.</p>
        </div>
        `,
    };
    // console.log(req.body.email, req.)
    // await sendEmail(msg);
    sendEmail(msg);
    res.json({user: extractUser(user) });
  }
  else if(req.body.rejected){
    const user = await updateUserPostsifSelected(
      req.db,
      req.body.userid,
      req.body.postid,
      req.body,
      false
    );
    const msg = {
      to: req.body.useremail,
      from: process.env.EMAIL_FROM,
      subject: "oCEO Opportunity Status Update",
      html: `
        <div>
          <p>Hello, ${req.body.username}</p>
          <p>We are sorry to inform you that your application for working on oCEO job posting: ${req.body.posttitle} is rejected.</p>
        </div>
        `,
    };
    // console.log(req.body.email, req.)
    // await sendEmail(msg);
    sendEmail(msg);
    res.json({ user: extractUser(user) });
  }
  else if(req.body.comment){
    const user = await updatePostComment(
      req.db,
      req.body.postid,
      req.body.comment,
      req.body
    );
  }
  
  
  else {
    let profilePicture;
    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path, {
        width: 512,
        height: 512,
        crop: "fill",
      });
      profilePicture = image.secure_url;
    }
    const { name, bio } = req.body;

    const user = await updateUserById(req.db, req.user._id, {
      ...(name && { name }),
      ...(typeof bio === "string" && { bio }),
      ...(profilePicture && { profilePicture }),
    });

    res.json({ user: extractUser(user) });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
