import React, { useState, useEffect } from "react";
import Head from "next/head";
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
import Router from "next/router";
import { useCurrentUser } from "@/hooks/index";

const SignupPage = () => {
  const [user, { mutate }] = useCurrentUser();
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.replace("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(e.currentTarget.email.value);
    const body = {
      email: e.currentTarget.email.value,
      name: e.currentTarget.name.value,
      rollno: e.currentTarget.rollno.value,
      password: e.currentTarget.password.value,
      role: e.currentTarget.role.value,
      posts: [],
    };
    console.log(body);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 201) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      setErrorMsg(await res.text());
      console.log(errorMsg);
    }
  };

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <>
        <h2>Sign up</h2>
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
          <Form onSubmit={handleSubmit}>
            <Row form>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <FormGroup>
                  <Label for="name">
                    <h5>Name</h5>
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <FormGroup>
                  <Label for="rollno">
                    <h5>Roll Number</h5>
                  </Label>
                  <Input
                    type="text"
                    name="rollno"
                    id="rollno"
                    placeholder="Enter your roll number"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <FormGroup>
                  <Label for="email">
                    <h5>Email Address</h5>
                  </Label>
                  <Input
                    type="text"
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
            <Row form>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <FormGroup>
                  <Label for="role">
                    <h5>Role</h5>
                  </Label>
                  <Input type="select" name="role" id="role">
                    <option>student</option>
                    <option>professor</option>
                    <option>admin</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Col sm="12" md={{ size: 8, offset: 3 }}>
              <Button>Submit</Button>
            </Col>
          </Form>
        </Container>
      </>
    </>
  );
};

export default SignupPage;
