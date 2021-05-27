import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { findUserById, findPostById, getUnapprovedProfCards,getUnapprovedAdminCards , getPosts } from "@/db/index";
import Posts from "@/components/post/posts";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import { all } from "@/middlewares/index";
import Head from "next/head";
import Link from "next/link";
import Error from "next/error";
import { useCurrentUser } from "@/hooks/index";
import { extractUser } from "@/lib/api-helpers";

async function approveProfCurr(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const body = { timecardId: e.currentTarget.timecardId.value };
  const res = await fetch("/api/profapprovetc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  var alertSpace = document.getElementById("alert-space");
  if (res.status === 200) {
    const response = await res.text();
    console.log(response);
    // console.log(form);
    document
      .getElementById("unapprovedCards")
      .removeChild(form.parentNode.parentNode.parentNode);
    var alertNode = document.createElement("div");
    var alertText = document.createTextNode("Time Card Approved");
    alertNode.appendChild(alertText);
    alertNode.className = "alert alert-success";
    alertSpace.appendChild(alertNode);
  } else {
    const response = await res.text();
    var alertNode = document.createElement("div");
    var alertText = document.createTextNode("Error: " + response);
    alertNode.appendChild(alertText);
    alertNode.className = "alert alert-danger";
    alertSpace.appendChild(alertNode);
    console.log("Error response!");
  }
  setTimeout(() => {
    alertSpace.removeChild(alertSpace.childNodes[0]);
  }, 7000);
}

const TimeCardDisplay = ({ timecard, admin }) => {
  if (admin){
    return (
      <>
      <Col md={6} style={{ marginTop: "1em" }}>
        <Card>
          <CardBody>
            <Form>
              <input
                name="timecardId"
                id="timecardId"
                value={timecard._id}
                style={{ display: "none" }}
              />
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="postname">Admin Timecard For</Label>
                    <Input
                      type="text"
                      value={timecard.postName}
                      name="postname"
                      id="postname"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="uname">Name</Label>
                    <Input
                      type="text"
                      value={timecard.studentName}
                      name="uname"
                      id="uname"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="month">Month</Label>
                    <Input
                      type="text"
                      value={timecard.month}
                      name="month"
                      id="month"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="week1">
                      Hours worked 1<sup>st</sup>-7<sup>th</sup>
                    </Label>
                    <Input
                      type="number"
                      value={timecard.week1}
                      name="week1"
                      id="week1"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="week2">
                      Hours worked 8<sup>th</sup>-14<sup>th</sup>
                    </Label>
                    <Input
                      type="number"
                      value={timecard.week2}
                      name="week2"
                      id="week2"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="week3">
                      Hours worked 15<sup>th</sup>-21<sup>st</sup>
                    </Label>
                    <Input
                      type="number"
                      value={timecard.week3}
                      name="week3"
                      id="week3"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="week4">
                      Hours worked 22<sup>nd</sup>-28<sup>th</sup>
                    </Label>
                    <Input
                      type="number"
                      value={timecard.week4}
                      name="week4"
                      id="week4"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="week5">
                      Hours worked 29<sup>th</sup>-31<sup>th</sup>
                    </Label>
                    <Input
                      type="number"
                      value={timecard.week5}
                      name="week5"
                      id="week5"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
    );
  }
  else {
  return (
    <>
      <Col md={6}>
        <Card>
          <CardBody>
            <Form onSubmit={approveProfCurr}>
              <input
                name="timecardId"
                id="timecardId"
                value={timecard._id}
                style={{ display: "none" }}
              />
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="postname">Timecard For</Label>
                    <Input
                      type="text"
                      value={timecard.postName}
                      name="postname"
                      id="postname"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="uname">Name</Label>
                    <Input
                      type="text"
                      value={timecard.studentName}
                      name="uname"
                      id="uname"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="month">Month</Label>
                    <Input
                      type="text"
                      value={timecard.month}
                      name="month"
                      id="month"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="week1">
                      Hours worked 1<sup>st</sup>-7<sup>th</sup>
                    </Label>
                    <Input
                      type="number"
                      value={timecard.week1}
                      name="week1"
                      id="week1"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="week2">
                      Hours worked 8<sup>th</sup>-14<sup>th</sup>
                    </Label>
                    <Input
                      type="number"
                      value={timecard.week2}
                      name="week2"
                      id="week2"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="week3">
                      Hours worked 15<sup>th</sup>-21<sup>st</sup>
                    </Label>
                    <Input
                      type="number"
                      value={timecard.week3}
                      name="week3"
                      id="week3"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="week4">
                      Hours worked 22<sup>nd</sup>-28<sup>th</sup>
                    </Label>
                    <Input
                      type="number"
                      value={timecard.week4}
                      name="week4"
                      id="week4"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="week5">
                      Hours worked 29<sup>th</sup>-31<sup>th</sup>
                    </Label>
                    <Input
                      type="number"
                      value={timecard.week5}
                      name="week5"
                      id="week5"
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Button>Approve</Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
  }
};

export default function TimeCardPage({ user, timecards }) {
  if (!user) return <Error statusCode={404} />;
  const { name, email, bio, profilePicture, _id } = user || {};
  const [currentUser] = useCurrentUser();
  const isCurrentUser = currentUser?._id === user._id;
  async function onSubmit(e) {
    e.preventDefault();
    var form = e.currentTarget;
    const body = {
      month: e.currentTarget.month.value,
      week1: e.currentTarget.week1.value,
      week2: e.currentTarget.week2.value,
      week3: e.currentTarget.week3.value,
      week4: e.currentTarget.week4.value,
      week5: e.currentTarget.week5.value,
      bankname: e.currentTarget.bankname.value,
      accnum: e.currentTarget.accnum.value,
      ifsc: e.currentTarget.ifsc.value,
      userId: user._id,
      postId: e.currentTarget.post.value,
    };
    console.log(body);
    const res = await fetch("/api/submittc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    var alertSpace = document.getElementById("alert-space");
    if (res.status === 200) {
      const response = await res.text();
      console.log(response);
      form.reset();
      var alertNode = document.createElement("div");
      var alertText = document.createTextNode(
        "Time Card Submitted Successfully"
      );
      alertNode.appendChild(alertText);
      alertNode.className = "alert alert-success";
      alertSpace.appendChild(alertNode);
    } else {
      const response = await res.text();
      var alertNode = document.createElement("div");
      var alertText = document.createTextNode("Error: " + response);
      alertNode.appendChild(alertText);
      alertNode.className = "alert alert-danger";
      alertSpace.appendChild(alertNode);
      console.log("Error response!");
    }
    setTimeout(() => {
      alertSpace.removeChild(alertSpace.childNodes[0]);
    }, 7000);
  }

  if(user?.role=="admin"){
    return (
      <>
        <Head>
          <title>Timecard for {name}</title>
        </Head>
        <h2>{name}</h2>

        <>
          <br></br>
          {/* <Button>Generate Report</Button> */}
          <h3> Timecards Submitted </h3>
          <Container>
            <div id="alert-space"></div>
            <Row id="unapprovedCards">
              {timecards.map((timecard) => (
                <TimeCardDisplay timecard={timecard} admin={true} />
              ))}
            </Row>
          </Container>
        </>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Timecard for {name}</title>
        </Head>
        <h2>{name}</h2>

        {user?.role == "student" ? (
          <>
            <h3>Timecard for Post</h3>
            <Container>
              <div id="alert-space"></div>
              <Form onSubmit={onSubmit}>
              <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="post">Timecard For</Label>
                      <Input type="select" name="post" id="post">
                        {user.selectedPosts.map((post)=>{return <option value={post}>{user.postmap[post]}</option>})}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="month">Month</Label>
                      <Input type="select" name="month" id="month">
                        <option>January</option>
                        <option>February</option>
                        <option>March</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                        <option>July</option>
                        <option>August</option>
                        <option>September</option>
                        <option>October</option>
                        <option>November</option>
                        <option>December</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="week1">
                        Hours worked 1<sup>st</sup>-7<sup>th</sup>
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        name="week1"
                        id="week1"
                        placeholder=""
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="week2">
                        Hours worked 8<sup>th</sup>-14<sup>th</sup>
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        name="week2"
                        id="week2"
                        placeholder=""
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="week3">
                        Hours worked 15<sup>th</sup>-21<sup>st</sup>
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        name="week3"
                        id="week3"
                        placeholder=""
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="week4">
                        Hours worked 22<sup>nd</sup>-28<sup>th</sup>
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        name="week4"
                        id="week4"
                        placeholder=""
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="week5">
                        Hours worked 29<sup>th</sup>-31<sup>th</sup>
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        name="week5"
                        id="week5"
                        placeholder=""
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="bankname">Name of Bank</Label>
                      <Input type="text" name="bankname" id="bankname" />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="accnum">Account Number</Label>
                      <Input type="text" name="accnum" id="accnum" />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="ifsc">IFS Code</Label>
                      <Input type="text" name="ifsc" id="ifsc" />
                    </FormGroup>
                  </Col>
                </Row>
                <Button>Submit</Button>
              </Form>
            </Container>
          </>
        ):(
          <>
            <h3> Timecards pending Approval </h3>
            <Container>
              <div id="alert-space"></div>
              <Row id="unapprovedCards">
                {timecards.map((timecard) => (
                  <TimeCardDisplay timecard={timecard} admin={false}/>
                ))}
              </Row>
            </Container>
          </>
        )}
      </>
    );
  }
  
}

export async function getServerSideProps(context) {
  await all.run(context.req, context.res);
  const user = extractUser(
    await findUserById(context.req.db, context.params.userId)
  );
  if (!user) context.res.statusCode = 404;
  var timecards = [null];
  if (user?.role == "professor") {
    console.log("Professor");
    timecards = await getUnapprovedProfCards(context.req.db, user._id);
    for (let i = 0; i < timecards.length; i++) {
      timecards[i].studentName = extractUser(
        await findUserById(context.req.db, timecards[i].userId)
      ).name;
      delete timecards[i]["submittedAt"];
    }
    // console.log(timecards);

  }
  if (user?.role == "admin") {
    console.log("Admin");
    timecards = await getUnapprovedAdminCards(context.req.db);
    for (let i = 0; i < timecards.length; i++) {
      timecards[i].studentName = extractUser(
        await findUserById(context.req.db, timecards[i].userId)
      ).name;
      delete timecards[i]["submittedAt"];
    }
    // console.log(timecards);

  }
  if (user?.role == "student") {
    console.log("Student");
    var postmap = {}
    for (let i =0; i< user.selectedPosts.length; i++){
      var currpost = await findPostById(context.req.db, user.selectedPosts[i]);
      currpost=JSON.parse(currpost);
      postmap[currpost._id] = currpost.title;
    }
    user["postmap"] = postmap;
    // console.log(postmap);
  }
  return { props: { user, timecards } };
}
