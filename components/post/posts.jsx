import React, { useState } from "react";
import { useSWRInfinite } from "swr";
import Link from "next/link";
import { useUser } from "@/hooks/index";
import fetcher from "@/lib/fetch";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label,Input, Form, FormGroup } from "reactstrap";
import { defaultProfilePicture } from "@/lib/default";
import { useCurrentUser } from "@/hooks/index";
import { MdEdit } from "react-icons/md";
function Post({ post, va }) {
  const [currentUser, { mutate }] = useCurrentUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showCommentHistoryModal, setShowCommentHistoryModal] = useState(false);

  var [hide, setHide] = useState(false);

  async function apply() {
    const formdata = new FormData();
    formdata.append("postid", post._id);
    formdata.append("applying", true);
    formdata.append("userid", currentUser._id);
    const res = await fetch("/api/user", {
      method: "PATCH",
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
      setMsg({ message: "Applied" });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
    setIsUpdating(false);
  }
  async function handleComment(event) {
  
    event.preventDefault();
    console.log(event.currentTarget)
    setShowCommentModal(false)
    alert(event.currentTarget.comment.value);
  //
  const formdata = new FormData();
  formdata.append("postid", post._id);
  formdata.append("comment", event.currentTarget.comment.value);
  const res = await fetch("/api/user", {
    method: "PATCH",
    body: formdata,
  });
  if (res.status === 200) {
    // const userData = await res.json();
    // mutate({
    //   user: {
    //     ...user,
    //     ...userData.user,
    //   },
    // });
    // setMsg({ message: "Applied" });
  } else {
    setMsg({ message: await res.text(), isError: true });
  }
  setIsUpdating(false);
  }
  
  async function approve(bool) {
    const body = JSON.stringify({
      postId: post._id,
      approve: bool === true,
    });
    if (bool) {
      var res = await fetch("api/posts", {
        method: "PATCH",
        body: body,
      });
    } else if (!bool) {
      var res = await fetch("api/posts", {
        method: "DELETE",
        body: body,
      });
    }
    if (res.status === 200) {
      setMsg({ message: "Approved" });
      setHide(true);
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
    setIsUpdating(false);
  }

  const user = useUser(post?.creatorId);
  const deadline = new Date(post?.deadline).toDateString();
  if (!hide) {
    return (
      <>
        <style jsx>
          {`
            div {
              box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
              padding: 1.5rem;
              margin-bottom: 0.5rem;
              transition: box-shadow 0.2s ease 0s;
              position: relative;
            }
            div:hover {
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
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
            #approved {
              color: green;
              font-weight: 600;
            }
            #not-approved {
              color: red;
              font-weight: 600;
            }
            #edit-button {
              float: right;
            }
          `}
        </style>
        <div>
          {post?.creatorId == currentUser?._id ? (
            <editbutton id="edit-button">
              <Link
                href={`/edit-post?title=${post?.title}&eligibility=${post?.eligibility}&description=${post?.description}&deadline=${deadline}&id=${post?._id}`}
              >
                <Button outline>
                  <MdEdit />
                </Button>
              </Link>
            </editbutton>
          ) : null}
          {post?.creatorId == currentUser?._id && post?.approved ? (
            <p id="approved">Approved by admin</p>
          ) : post?.creatorId == currentUser?._id && post?.approved == false ? (
            <p id="not-approved">Pending admin approval</p>
          ) : null}
          <p>
            <b>Title</b>
            <br />
            {post?.title}
            <br />
            <br />
            <b>Description</b>
            <br />
            {post?.description}
            <br />
            <br />
            <b>Eligibility</b>
            <br />
            {post?.eligibility}
            <br />
            <br />
            <b>Deadline</b>
            <br />
            {deadline}
            {user?._id != currentUser?._id
              ? [
                  <br />,
                  <br />,
                  <b>Posted by - </b>,
                  <Link href={`/user/${user?._id}`}>
                    <a style={{ display: "inline-flex", alignItems: "center" }}>
                      {/* <img width="27" height="27" style={{ borderRadius: '50%', objectFit: 'cover', marginRight: '0.3rem' }} src={user.profilePicture || defaultProfilePicture(user._id)} alt={user.name} /> */}
                      <b>{user?.name}</b>
                    </a>
                  </Link>,
                ]
              : null}
            <br />
            <br />
          </p>
          {/* <small>{new Date(post.createdAt).toLocaleString()}</small> */}
          {currentUser?.role == "student" ? (
            currentUser?.posts.includes(post?._id) ? (
              <p id="applied">Applied!</p>
            ) : (
              // <Button type="button" onClick={apply}>
              //   Apply
              // </Button>
              <Link href={`/user/${currentUser?._id}/apply/${post?._id}`}>
                <Button
                  type="button"
                  onClick={console.log("button clicked", user)}
                >
                  {`Application Form`}
                </Button>
              </Link>
            )
          ) : null}
          {(currentUser?.role == "admin" && !va) ? (
            <>
              <Button type="button" onClick={() => approve(true, post)} style={{backgroundColor: "blue",
               marginRight: 10}}>
                Approve
              </Button>
              <Button type="button" onClick={() => approve(false, post)} style={{backgroundColor: "red",
               marginRight: 10}}>
                Delete
              </Button>
              <Button type="button" onClick={() => setShowCommentModal(true)} style={{backgroundColor: "orange",
               marginRight: 10}}>
                Add Comment
              </Button >
              <Button type="button" onClick={() => setShowCommentHistoryModal(true)} style={{backgroundColor: "green",
               marginRight: 10}}>
                All Admin Comments
                </Button>
              <Modal isOpen={showCommentModal} >
              <Form onSubmit={handleComment}>
                <ModalHeader >Add Comment</ModalHeader>
                <ModalBody>
                  
                    <FormGroup>
                      <Label>Type Comment Here</Label>
                      <Input name="comment"></Input>                  
                    </FormGroup>
                  
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit">Submit</Button>
                  <Button color="secondary" onClick={()=>setShowCommentModal(false)}>Cancel</Button>
                </ModalFooter>
                </Form>
              </Modal>
              <Modal isOpen={showCommentHistoryModal} >
                <ModalHeader >{post.title}</ModalHeader>
                <ModalBody>
                  {post.comments.map((comment)=><p>{comment}</p>)}
                  
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={()=>setShowCommentHistoryModal(false)}>Close</Button>
                </ModalFooter>
              </Modal>
            </>
          ) : null}
          {((post?.creatorId == currentUser?._id || currentUser?.role=="admin") && post?.approved) ? (
            <div>
            <Link href={`/post/${post._id}/applicants`}>
              <Button style={{backgroundColor: "blue",
            marginRight: 10}}> View All Applicants </Button>
            </Link>
          
            </div>
          ) : null}
          {post?.creatorId == currentUser?._id && !post?.approved ? (
            <div>
            <Button type="button" onClick={() => setShowCommentHistoryModal(true)} style={{backgroundColor: "green",
            marginRight: 10}}>
             Comments from Admin
         </Button>
           <Modal isOpen={showCommentHistoryModal} >
           <ModalHeader >{post?.title}</ModalHeader>
           <ModalBody>
             {post.comments? Array(post.comments).map((comment)=>{return (<p>{`${comment} \n`}</p>)}) : "no available comments"}
             
           </ModalBody>
           <ModalFooter>
             <Button color="secondary" onClick={()=>setShowCommentHistoryModal(false)}>Close</Button>
           </ModalFooter>
         </Modal>
         </div>
          ) : null}
        </div>
      </>
    );
  } else if (hide) return null;
}

const PAGE_SIZE = 10;

export function usePostPages({ creatorId, approved, deadlineDate } = {}) {
  return useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.posts.length === 0) return null;

      // first page, previousPageData is null
      if (index === 0) {
        return `/api/posts?limit=${PAGE_SIZE}&approved=${approved}${
          creatorId ? `&by=${creatorId}` : ""
        }${deadlineDate ? `&deadlineDate=${deadlineDate}` : ""}`;
      }

      // using oldest posts createdAt date as cursor
      // We want to fetch posts which has a datethat is
      // before (hence the .getTime() - 1) the last post's createdAt
      const from = new Date(
        new Date(
          previousPageData.posts[previousPageData.posts.length - 1].createdAt
        ).getTime() - 1
      ).toJSON();

      return `/api/posts?from=${from}&limit=${PAGE_SIZE}&approved=${approved}${
        creatorId ? `&by=${creatorId}` : ""
      }${deadlineDate ? `&deadlineDate=${new Date()}` : ""}`;
    },
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
    }
  );
}

export default function Posts({ creatorId, approved, deadlineDate, viewApp }) {
  const { data, error, size, setSize } = usePostPages({
    creatorId,
    approved,
    deadlineDate,
  });

  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0].posts?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.posts.length < PAGE_SIZE);
  var va = false;
  if(typeof viewApp=== "undefined"){
    va = false;
  } else {
    va = viewApp;
  }
  // console.log(viewApp);
  // console.log("here");
  // console.log(va);
  return (
    <div>
      {posts.map((post) => (
        <Post va={va} key={post._id} post={post} />
      ))}
      {!isReachingEnd && (
        <button
          type="button"
          style={{
            background: "transparent",
            color: "#000",
          }}
          onClick={() => setSize(size + 1)}
          disabled={isReachingEnd || isLoadingMore}
        >
          {isLoadingMore ? ". . ." : "load more"}
        </button>
      )}
    </div>
  );
}

export const Applications = ({ post }) => {
  if (post != null) {
    return (
      <div>
        <Post va={false} post={post} />
      </div>
    );
  } else {
    return null;
  }
};
