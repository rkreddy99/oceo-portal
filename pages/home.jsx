import React, {useEffect} from 'react';
import { useCurrentUser } from '@/hooks/index';
import PostEditor from '@/components/post/editor';
import Posts from '@/components/post/posts';
import FourOhFour from 'pages/404'

const Home = () => {
  const [user] = useCurrentUser();

  if (user?.role == "professor") {
      return (
        <>
            <div>
            <h3>Create an opportunity
            </h3>
            <PostEditor />
            </div>
         </>
      )
  } else if (user?.role == "student") {
    return (
        <>
            <div>
                <h3>All available opportunities
                </h3>
                <Posts approved={true}/>
            </div>
        </>
    );
  } else {
      return (<>
      <h3> Please sign in to apply or create an opportunity</h3><Posts approved={true}/></>)
  }
};

export default Home;