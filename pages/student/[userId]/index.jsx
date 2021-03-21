import React, {useEffect} from 'react';
import { useCurrentUser } from '@/hooks/index';
import PostEditor from '@/components/post/editor';
import Posts from '@/components/post/posts';
import FourOhFour from 'pages/404'

const IndexPage = () => {
  const [user] = useCurrentUser();

  return (
    <>
      <div>
        <h3>All available opportunities
        </h3>
        <Posts approved={true}/>
      </div>
    </>
  );
};

export default IndexPage;
