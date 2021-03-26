import React, { useEffect } from "react";
import { useCurrentUser } from "@/hooks/index";
import PostEditor from "@/components/post/editor";
import Posts from "@/components/post/posts";
import FourOhFour from "pages/404";

const IndexPage = () => {
  const [user] = useCurrentUser();
  if (user?.role != "admin") return <FourOhFour />;

  return (
    <>
      <div>
        <h3>Opportunities requiring approval.</h3>
        <Posts approved={false} deadlineDate={new Date()} />
      </div>
    </>
  );
};

export default IndexPage;
