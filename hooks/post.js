import useSWR from "swr";
import fetcher from "@/lib/fetch";

export function getPostById(id) {
  const data = useSWR(`/api/post/${id}`, fetcher, fetcher, {
    revalidateOnFocus: false,
  });
  console.log(data, "databjhsvd");
  //   const user = data?.user;
  //   return [user, { mutate }];
}
