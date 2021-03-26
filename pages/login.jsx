import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCurrentUser } from "@/hooks/index";
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

const LoginPage = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [user, { mutate }] = useCurrentUser();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) router.push("/");
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      setErrorMsg("Incorrect username or password. Try again!");
    }
  }

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>

      <>
        <h2>Sign in</h2>
        {errorMsg ? (
          <>
            <br />
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <Alert color="danger">{errorMsg}</Alert>
            </Col>
            <br />
          </>
        ) : null}
        <Container>
          <div id="alert-space"></div>
          <Form onSubmit={onSubmit}>
            <Row form>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <FormGroup>
                  <Label for="email">
                    <h5>Email Address</h5>
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <FormGroup>
                  <Label for="password">
                    <h5>Password</h5>
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={{ size: "auto", offset: 3 }}>
                <Button>Submit</Button>
              </Col>
              <Col md={{ size: "auto", offset: 2 }}>
                <Link href="/forget-password">
                  <a style={{ color: "red" }}>Forget password?</a>
                </Link>
              </Col>
            </Row>
          </Form>
        </Container>
      </>
    </>
  );
};

export default LoginPage;
