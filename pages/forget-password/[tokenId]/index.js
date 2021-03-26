import React, { useState } from "react";
import Head from "next/head";
import nc from "next-connect";
import Router from "next/router";
import { database } from "@/middlewares/index";
import { findTokenByIdAndType } from "@/db/index";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";

const ResetPasswordTokenPage = ({ tokenId, valid }) => {
  const [msg, setMsg] = useState({
    message: "Enter the new password",
    isError: false,
  });
  async function handleSubmit(event) {
    event.preventDefault();
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
          <br />
          {msg.isError && msg.message ? (
            <>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Alert color="danger">{msg.message}</Alert>
              </Col>
            </>
          ) : null}
          <Container>
            <div id="alert-space"></div>
            <Form onSubmit={handleSubmit}>
              <Row form>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                  <FormGroup>
                    <Label for="password">
                      <h5>New Password</h5>
                    </Label>
                    <Input
                      required
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter new password"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                  <FormGroup>
                    <Label for="new_password"></Label>
                    <Input
                      required
                      type="password"
                      name="new_password"
                      id="new_password"
                      placeholder="Re-enter the password"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={{ size: "auto", offset: 3 }}>
                  <Button>Submit</Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </>
      ) : (
        <p>This link may have been expired</p>
      )}
    </>
  );
};

export async function getServerSideProps(ctx) {
  const handler = nc();
  handler.use(database);
  await handler.run(ctx.req, ctx.res);
  const { tokenId } = ctx.query;

  const tokenDoc = await findTokenByIdAndType(
    ctx.req.db,
    ctx.query.tokenId,
    "passwordReset"
  );

  return { props: { tokenId, valid: !!tokenDoc } };
}

export default ResetPasswordTokenPage;
