import PostEditor from "@/components/post/editor";

function editPost(post) {
  return <PostEditor post={post} />;
}

export async function getServerSideProps(ctx) {
  return { props: ctx.query };
}

export default editPost;
