import React, { useState } from "react";
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

const ForgetPasswordPage = () => {
  const [msg, setMsg] = useState({ message: "", isError: false });
  const [mailSent, setMailSent] = useState(false);

  async function handleSubmit(e) {
    setMsg({ message: "Sending email with the link to update password" });
    e.preventDefault(e);

    const body = {
      email: e.currentTarget.email.value,
    };

    const res = await fetch("/api/user/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      setMsg({ message: "An email has been sent to your mailbox" });
      setMailSent(true);
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  }

  return (
    <>
      <Head>
        <title>Forget password</title>
      </Head>
      <h2>Forget password</h2>
      <br />
      {msg.isError && msg.message ? (
        <>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Alert color="danger">{msg.message}</Alert>
          </Col>
        </>
      ) : mailSent && msg.message ? (
        <>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Alert color="success">{msg.message}</Alert>
          </Col>
        </>
      ) : !mailSent && msg.message ? (
        <>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Alert color="warning">{msg.message}</Alert>
          </Col>
        </>
      ) : null}
      <Container>
        <div id="alert-space"></div>
        <Form onSubmit={handleSubmit}>
          <Row form>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <FormGroup>
                <Label for="email">
                  <h5>Email Address</h5>
                </Label>
                <Input
                  required
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email address"
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
  );
};

export default ForgetPasswordPage;
