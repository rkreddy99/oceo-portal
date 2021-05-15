import React, { useEffect } from "react";
import { useCurrentUser } from "@/hooks/index";
import PostEditor from "@/components/post/editor";
import Posts from "@/components/post/posts";
import FourOhFour from "pages/404";
import { Card, Button, CardTitle, CardText } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas} from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";


library.add(fas);
const Home = () => {
  const [user] = useCurrentUser();

  if (user?.role == "professor") {
    return (
      <>
        <div>
          {/* <h3>Create an opportunity</h3> */}
          <PostEditor />
        </div>
      </>
    );
  } else if (user?.role == "student") {
    return (
      <>
        <div>
          <h3>All available opportunities</h3>
          <Posts approved={true} deadlineDate={new Date()} />
        </div>
      </>
    );
  } else if (user?.role == "admin") {
    // console.log(user);
    let tcLink = "/user/"+user?._id+"/timecard";
    let appLink = "/admin/applicants";
    return (
      <>
        <Container>
          <Row>
            <Col sm="1" md="4" style={{margin: "0.5em 0em 0.5em 0em"}}>
              <Link href={tcLink}>
              <Card body className="text-center" style={{height:"100%", cursor: "pointer"}}>
                <div style={{marginBottom: "0.5em"}}><FontAwesomeIcon icon="business-time" size="3x"/></div>
                <CardTitle style={{marginBottom: "0.25em"}} tag="h5">Timecards</CardTitle>
                <CardText>View individial timecards.</CardText>
              </Card>
              </Link>
            </Col>
            <Col sm="1" md="4" style={{margin: "0.5em 0em 0.5em 0em"}}>
            <Link href= {appLink}>
            <Card body className="text-center" style={{height:"100%", cursor: "pointer"}}>
                <div style={{marginBottom: "0.5em"}}><FontAwesomeIcon icon="portrait" size="3x"/></div>
                <CardTitle style={{marginBottom: "0.25em"}} tag="h5">Applicants</CardTitle>
                <CardText>View applicants pending approval.</CardText>
              </Card>
            </Link>
            </Col>
            <Col sm="1" md="4" style={{margin: "0.5em 0em 0.5em 0em"}}>
            <Link href="/admin/">
            <Card body className="text-center" style={{height:"100%", cursor: "pointer"}}>
                <div style={{marginBottom: "0.5em"}}><FontAwesomeIcon icon="clipboard-list" size="3x"/></div>
                <CardTitle style={{marginBottom: "0.25em"}} tag="h5">Posts</CardTitle>
                <CardText>View, moderate and approve posts.</CardText>
            </Card>
            </Link>
            </Col>
            <Col sm="1" md="4" style={{margin: "0.5em 0em 0.5em 0em"}}>
            <Link href="/admin/reports/timecardreport">
            <Card body className="text-center" style={{height:"100%", cursor: "pointer"}}>
                <div style={{marginBottom: "0.5em"}}><FontAwesomeIcon icon="file-excel" size="3x"/></div>
                <CardTitle style={{marginBottom: "0.25em"}} tag="h5">Reports</CardTitle>
                <CardText>Generate consise timecard report.</CardText>
            </Card>
            </Link>
            </Col>
            <Col sm="1" md="4" style={{margin: "0.5em 0em 0.5em 0em"}}>
            <Link href="/admin/">
            <Card body className="text-center" style={{height:"100%", cursor: "pointer"}}>
                <div style={{marginBottom: "0.5em"}}><FontAwesomeIcon icon="users-cog" size="3x"/></div>
                <CardTitle style={{marginBottom: "0.25em"}} tag="h5">Manage Users</CardTitle>
                <CardText>Create and manage user accounts.</CardText>
            </Card>
            </Link>
            </Col>
          </Row>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <h3> Please sign in to apply or create an opportunity</h3>
        <Posts approved={true} deadlineDate={new Date()} />
      </>
    );
  }
};

export default Home;
