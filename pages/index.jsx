import React, {useEffect} from 'react';
import { useCurrentUser } from '@/hooks/index';
import {useRouter} from "next/router";
import PostEditor from '@/components/post/editor';
import Posts from '@/components/post/posts';
import FourOhFour from 'pages/404'

const IndexPage = () => {
  const [user] = useCurrentUser();
  const route = useRouter();
  useEffect(() => {
    if(user?.role == 'student'){
      console.log('student');console.log(user);
      async function routing(){
        // await route.replace(`/404`)
        await route.replace(`/student/${user._id}`)
      }
      routing();
    }
    else if(user?.role == 'professor'){
      async function routing(){
        await route.replace(`/professor/${user._id}`)
      }
      routing();
    }
    else if(user?.role == 'admin'){
      async function routing(){
        await route.replace(`/admin/${user._id}`)
      }
      routing();
    }
    else{
      async function routing(){
        await route.replace(`/admin/${user._id}`)
      }
      routing();
    }
  })
  return null
};

export default IndexPage;
