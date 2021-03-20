import React, { useState } from 'react';
import { useSWRInfinite } from 'swr';
import Link from 'next/link';
import { useUser } from '@/hooks/index';
import fetcher from '@/lib/fetch';
import { defaultProfilePicture } from '@/lib/default';
import { useCurrentUser } from '@/hooks/index';

function Post({ post }) {
  const [currentUser, { mutate }] = useCurrentUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState(null);

  async function apply(){
    const formdata = new FormData();
    formdata.append('postid', post._id);
    formdata.append('applying', true);
    formdata.append('userid', currentUser._id);
    const res = await fetch('/api/user', {
      method: 'PATCH',
      body: formdata,
    });
    if (res.status === 200) {
      const userData = await res.json();
      mutate({
        user: {
          ...user,
          ...userData.user,
        },
      });
      setMsg({ message: 'Applied' });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
    setIsUpdating(false);
  }
  const user = useUser(post.creatorId);
  return (
    <>
      <style jsx>
        {`
          div {
            box-shadow: 0 5px 10px rgba(0,0,0,0.12);
            padding: 1.5rem;
            margin-bottom: 0.5rem;
            transition: box-shadow 0.2s ease 0s;
          }
          div:hover {
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          }
          small {
            color: #777;
          }
          button {
            margin-top: 0.5rem;
            margin-bottom: -0.5rem;
          }
          #applied {
            color: green;
            font-weight: 600;
          }
        `}
      </style>
      <div>
        <p>
          <b>Title</b><br/>
          {post.title}<br/>
          <br/>
          <b>Description</b><br/>
          {post.description}<br/>
          <br/>
          <b>Eligibility</b><br/>
          {post.eligibility}
          { user?._id != currentUser?._id ? 
          [
            <br/>,<br/>,
          <b>Posted by - </b>,
          <Link href={`/user/${user?._id}`}>
            <a style={{ display: 'inline-flex', alignItems: 'center' }}>
              {/* <img width="27" height="27" style={{ borderRadius: '50%', objectFit: 'cover', marginRight: '0.3rem' }} src={user.profilePicture || defaultProfilePicture(user._id)} alt={user.name} /> */}
              <b>{user?.name}</b>
            </a>
          </Link>] : null}
        </p>
        {/* <small>{new Date(post.createdAt).toLocaleString()}</small> */}
        {currentUser?.role=='student' ?
        (currentUser?.posts.includes(post?._id) ? <p id="applied">Applied!</p> : <button type="button" onClick={apply}>Apply</button>) : null}
      </div>
    </>
  );
}

const PAGE_SIZE = 10;

export function usePostPages({ creatorId } = {}) {
  return useSWRInfinite((index, previousPageData) => {
    // reached the end
    if (previousPageData && previousPageData.posts.length === 0) return null;

    // first page, previousPageData is null
    if (index === 0) {
      return `/api/posts?limit=${PAGE_SIZE}${
        creatorId ? `&by=${creatorId}` : ''
      }`;
    }

    // using oldest posts createdAt date as cursor
    // We want to fetch posts which has a datethat is
    // before (hence the .getTime() - 1) the last post's createdAt
    const from = new Date(
      new Date(
        previousPageData.posts[previousPageData.posts.length - 1].createdAt,
      ).getTime() - 1,
    ).toJSON();

    return `/api/posts?from=${from}&limit=${PAGE_SIZE}${
      creatorId ? `&by=${creatorId}` : ''
    }`;
  }, fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
  });
}

export default function Posts({ creatorId }) {
  const {
    data, error, size, setSize,
  } = usePostPages({ creatorId });

  const posts = data ? data.reduce((acc, val) => [...acc, ...val.posts], []) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0].posts?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.posts.length < PAGE_SIZE);

  return (
    <div>
      {posts.map((post) => <Post key={post._id} post={post} />)}
      {!isReachingEnd && (
      <button
        type="button"
        style={{
          background: 'transparent',
          color: '#000',
        }}
        onClick={() => setSize(size + 1)}
        disabled={isReachingEnd || isLoadingMore}
      >
        {isLoadingMore ? '. . .' : 'load more'}
      </button>
      )}
    </div>
  );
}

export const Applications = ({post}) => {
  return (
    <div>
      <Post key={post._id} post={post} />
    </div>
  );
}
