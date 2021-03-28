import React from "react";
import Head from "next/head";
import Link from "next/link";
import Error from "next/error";
import { all } from "@/middlewares/index";
import { useCurrentUser } from "@/hooks/index";
import Posts from "@/components/post/posts";
import { extractUser } from "@/lib/api-helpers";
import { findUserById, findPostById } from "@/db/index";
import { defaultProfilePicture } from "@/lib/default";
import { Applications } from "@/components/post/posts";

export default function UserPage({ user, posts }) {
  if (!user) return <Error statusCode={404} />;
  const { name, email, bio, profilePicture, _id } = user || {};
  // const posts = posts;
  const applications = posts.map((post) => JSON.parse(post));
  const [currentUser] = useCurrentUser();
  const isCurrentUser = currentUser?._id === user._id;
  // console.log(user.posts);
  return (
    <>
      <style jsx>
        {`
          h2 {
            text-align: left;
            margin-right: 0.5rem;
            margin-bottom: -0.35rem;
          }
          // button {
          //   margin: 0 0.25rem;
          // }
          // img {
          //   width: 10rem;
          //   height: auto;
          //   border-radius: 50%;
          //   box-shadow: rgba(0, 0, 0, 0.05) 0 10px 20px 1px;
          //   margin-right: 1.5rem;
          //   background-color: #f3f3f3;
          // }
          div {
            color: #777;
          }
          p {
            font-family: monospace;
            color: #444;
            margin: 0.25rem 0 0.75rem;
          }
          a {
            margin: 0.1rem 0 0.75rem;
            font-size: 0.75rem;
          }
        `}
      </style>
      <Head>
        <title>{name}</title>
      </Head>
      <div>
        {/* <img src={profilePicture || defaultProfilePicture(_id)} width="256" height="256" alt={name} /> */}
        {/* <section> */}
        <h2>{name}</h2>
        {isCurrentUser && (
          <Link href="/settings">
            <a>Edit Profile</a>
          </Link>
        )}
        <br />
        {/* Bio
          <p>{bio}</p> */}
        {/* Email
          <p>
            {email}
          </p>
            <br/> */}
        {/* </section> */}
      </div>
      <div>
        {user?.role == "student" ? (
          [
            <h3>My Applications</h3>,
            applications.map((post) => <Applications post={post} />),
          ]
        ) : (
          <>
            <h3>Posts</h3>
            <Posts creatorId={user?._id} />
          </>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await all.run(context.req, context.res);
  const user = extractUser(
    await findUserById(context.req.db, context.params.userId)
  );
  if (!user) context.res.statusCode = 404;
  const postIds = user?.posts;
  const posts = new Array(postIds?.length).fill(null);
  for (let index = 0; index < postIds.length; index++) {
    const element = postIds[index];
    posts[index] = await findPostById(context.req.db, element);
  }
  return { props: { user, posts } };
}
