import React, { useEffect } from "react";
import { all } from "@/middlewares/index";
import { useCurrentUser } from "@/hooks/index";
import PostEditor from "@/components/post/editor";
import Posts from "@/components/post/posts";
import FourOhFour from "pages/404";

export default function ApplicantPage({user}) {
  if (user?.role != "admin") return <FourOhFour />;

  return (
    <>
      <div>
        <h3>Applicants requiring approval</h3>
        <Posts approved={true} deadlineDate={new Date()} viewApp={true}/>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
    await all.run(context.req, context.res);
    const user = context.req.user;
    // console.log(user);
    if (!user) context.res.statusCode = 404;
    return {
      props: {user} 
    };
}

// export default ApplicantPage;
