import React, {userState} from 'react'
import { all } from "@/middlewares/index";
import { Container, Row, Col } from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { findUserById, findPostById, getUnapprovedProfCards } from "@/db/index";
import { extractUser } from "@/lib/api-helpers";
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
import Link from "next/link";
import { useCurrentUser } from "@/hooks/index";

  
// Generate numbers range 0..4
// range(0, 4, 1);
var d = new Date;
const yearList = range(2011,d.getFullYear(),1);
const programmeList = ["B. Tech", "M. Tech", "M. Sc", "MA"]
const streamList = ["CSE", "EE", "Mechanical Eng.", "Chemical Eng.", "Material Science and Eng.", "Civil Eng."]
export default function apply(props) {
    // console.log(props);
    const [currentUser, { mutate }] = useCurrentUser();
    async function handleSubmit(event){
        event.preventDefault();
        const userDetails = event.currentTarget;
        var formdata = new FormData();
        // formdata = event.currentTarget;
        formdata.append("postid", props.post._id);
        formdata.append("applying", true);
        formdata.append("userid", props.user._id);
        formdata.append("graduatingYear", userDetails.graduatingYear);
        formdata.append("cpi", userDetails.cpi);
        formdata.append("programme", userDetails.programme);
        formdata.append("sop", userDetails.sop);
        formdata.append("resume", userDetails.resume);
        formdata.append("email", userDetails.email);
        formdata.append("stream", userDetails.stream);
        const res = await fetch("/api/user", {
            method: "PATCH",
            body: formdata,
          });
          
        if (res.status === 200) {
            const userData = await res.json();
            mutate({
                
                user: {
                    ...props.user,
                    ...userData.user,
                },
              });
            console.log("submitted successfully!")
        }
        else{
            console.log("failed application contact admin.")
        }
        
        
        
        // </Link>
        
    }
    
    return (
        <div>
            <Form onSubmit = {handleSubmit}>
            <Row form>
                <Col md={6}>
                <FormGroup>
                    <Label for="exampleText">Full Name</Label>
                    <Input type="text" value={`${props.user.name}`} name="name"/>
                </FormGroup>
                </Col>
                <Col md={6}>
                <FormGroup>
                    <Label for="exampleEmail">Email</Label>
                    <Input type="email" name="email" id="exampleEmail" value={props.user.email} />
                </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <FormGroup>
                    <Label>Graduating year</Label>
                    <select name = "graduatingYear">
                        {yearList.map((year)=><option value={year}>{year}</option>)}
                    </select>
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                    <Label>Programme</Label>
                    <select name = "Programme">
                        {programmeList.map((year)=><option value={year}>{year}</option>)}
                    </select>
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                    <Label>Stream</Label>
                    <select name = "Stream">
                        {streamList.map((year)=><option value={year}>{year}</option>)}
                    </select>
                    </FormGroup>
                </Col>
            </Row>
            <FormGroup>
                    <Label for="exampleText">SOP</Label>
                    <Input type="textarea" name="sop"/>
                </FormGroup>
                    
            <Row>
            <Col md = {6}>
            <FormGroup>
                <Label for="exampleFile">Resume</Label>
                <Input type="file" name="resume" id="exampleFile" />
            </FormGroup>
            </Col>
            <Col md = {6}>
            <FormGroup>
                <Label for="exampleFile">CPI</Label>
                <Input type="text" name="cpi" id="exampleFile" />
            </FormGroup>
            </Col>
            </Row>
            {/* <Link href={`/user/${props.user._id}`}> */}
            <Button>Submit</Button>
            {/* </Link> */}
            </Form>
        </div>
    )
}
export async function getServerSideProps(context) {
    await all.run(context.req, context.res);
    const user = extractUser(
      await findUserById(context.req.db, context.params.userId)
    );
    var post = await findPostById(context.req.db, context.params.postId)
    post = JSON.parse(post)
    return {
      props: {user, post}, 
    }
  }