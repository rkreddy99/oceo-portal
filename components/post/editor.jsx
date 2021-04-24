import React, { useState } from "react";
import { useCurrentUser } from "@/hooks/index";
import DatePicker from "reactstrap-date-picker";
import { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
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
import enIN from "date-fns/locale/en-IN";
registerLocale("enIN", enIN);

export default function PostEditor({ post }) {
  const route = useRouter();

  const [user] = useCurrentUser();

  const edit = post ? true : false;
  const [edit_title, setEditTitle] = post
    ? useState(post.title)
    : useState(null);
  const [edit_description, setEditDescription] = post
    ? useState(post.description)
    : useState(null);
  const [edit_eligibility, setEditEligibility] = post
    ? useState(post.eligibility)
    : useState(null);

  const [deadline, setdeadline] = useState(null);

  const [msg, setMsg] = useState(null);

  if (!user) {
    return (
      <div style={{ color: "#555", textAlign: "center" }}>
        <Alert color="danger">Please sign in to post</Alert>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = JSON.stringify({
      postId: post?.id,
      title: e.currentTarget.title.value,
      description: e.currentTarget.description.value,
      eligibility: e.currentTarget.eligibility.value,
      comments: post?.comments,
      approved: false,
      deadline: deadline,
    });
    setdeadline(null);
    // if (!e.currentTarget.content.value) return;

    e.currentTarget.title.value = "";
    e.currentTarget.description.value = "";
    e.currentTarget.eligibility.value = "";
    if (edit == true) {
      const res = await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMsg("Edited!");
        setTimeout(() => setMsg(null), 3000);
        async function routing() {
          await route.replace(`/user/${user._id}`);
        }
        routing();
      }
    } else {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });
      if (res.ok) {
        setMsg("Posted!");
        setTimeout(() => setMsg(null), 3000);
      }
    }
  }

  return (
    <>
      {edit ? (
        <h2>
          {" "}
          Editing <em>{post?.title}</em>
        </h2>
      ) : (
        <h2>Create an opportunity</h2>
      )}
      {msg ? (
        <>
          <br />
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Alert color="success">{msg}</Alert>
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
                  <h5>Title</h5>
                </Label>
                <Input
                  required
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Title"
                  value={post ? edit_title : null}
                  onChange={(e) => {
                    setEditTitle(e.target.value);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <FormGroup>
                <Label for="description">
                  <h5>Description</h5>
                </Label>
                <Input
                  required
                  type="textarea"
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={post ? edit_description : null}
                  onChange={(e) => {
                    setEditDescription(e.target.value);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <FormGroup>
                <Label for="password">
                  <h5>Eligibility</h5>
                </Label>
                <Input
                  required
                  type="textarea"
                  name="eligibility"
                  id="eligibility"
                  placeholder="Eligibility"
                  value={post ? edit_eligibility : null}
                  onChange={(e) => {
                    setEditEligibility(e.target.value);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <FormGroup>
                <Label for="deadline">
                  <h5>Deadline Date</h5>
                </Label>
                <DatePicker
                  required
                  value={deadline}
                  onChange={(date) => setdeadline(date)}
                  minDate={new Date().toISOString()}
                  locale="enIN"
                  placeholderText="Date of deadline"
                  valid
                />
              </FormGroup>
            </Col>
          </Row>
          <Col sm="12" md={{ size: 8, offset: 3 }}>
            <Button>Submit</Button>
          </Col>
        </Form>
      </Container>
    </>
  );
}
