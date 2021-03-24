import React, { useState } from "react";
import Head from "next/head";
import nc from "next-connect";
import Router from "next/router";
import { database } from "@/middlewares/index";
import { findTokenByIdAndType } from "@/db/index";

const ResetPasswordTokenPage = ({ tokenId, valid }) => {
  const [msg, setMsg] = useState({
    message: "Enter the new password",
    isError: false,
  });
  console.log(tokenId, valid);
  async function handleSubmit(event) {
    event.preventDefault();
    console.log(event.currentTarget.password.value);
    console.log(event.currentTarget.new_password.value);
    if (
      event.currentTarget.password.value ===
      event.currentTarget.new_password.value
    ) {
      const body = {
        password: event.currentTarget.password.value,
        tokenId,
      };

      const res = await fetch("/api/user/password/reset", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 200) Router.replace("/");
    } else {
      setMsg({ message: "The passwords don't match!", isError: true });
    }
  }

  return (
    <>
      <Head>
        <title>Forget password</title>
      </Head>
      <style jsx>
        {`
          p {
            text-align: center;
          }
        `}
      </style>
      <h2>Forget password</h2>
      {valid ? (
        <>
          {msg.message ? (
            <p
              style={{
                color: msg.isError ? "red" : "#0070f3",
                textAlign: "center",
              }}
            >
              {msg.message}
            </p>
          ) : null}
          <form onSubmit={handleSubmit}>
            <div>
              <input
                required
                name="password"
                type="password"
                placeholder="Enter the new password"
              />
              <br />
              <br />
              <input
                required
                name="new_password"
                type="password"
                placeholder="Re-enter the password"
              />
            </div>
            <br />
            <button type="submit">Set new password</button>
          </form>
        </>
      ) : (
        <p>This link may have been expired</p>
      )}
    </>
  );
};

export async function getServerSideProps(ctx) {
  console.log(ctx.query);
  const handler = nc();
  handler.use(database);
  await handler.run(ctx.req, ctx.res);
  const { tokenId } = ctx.query;

  console.log(tokenId);

  const tokenDoc = await findTokenByIdAndType(
    ctx.req.db,
    ctx.query.tokenId,
    "passwordReset"
  );

  console.log(tokenDoc);

  return { props: { tokenId, valid: !!tokenDoc } };
}

export default ResetPasswordTokenPage;
