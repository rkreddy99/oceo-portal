import React, {useState} from 'react'
import { all } from "@/middlewares/index";
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle
  } from 'reactstrap';
import { Container, Row, Col } from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { findUserById, findPostById, getUnapprovedProfCards } from "@/db/index";
import { extractUser } from "@/lib/api-helpers";
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
import Link from "next/link";
import { useCurrentUser } from "@/hooks/index";


export default function showApplicants({post}) {
    const [currentUser, { mutate }] = useCurrentUser();
    const [applicants, setApplicants] = useState(post.applicants);


    async function handleAccepted(event){
        // console.log(event.target.getAttribute("userid"));
        var formData = new FormData;
        // console.log(event.target.getAttribute("applicant"));
        formData.append("userid", event.target.getAttribute("userid"));
        formData.append("username", event.target.getAttribute("username"));
        formData.append("useremail", event.target.getAttribute("useremail"));
        formData.append("posttitle", post.title);
        formData.append("postid", post._id);
        formData.append("selected", true);
        const res = await fetch("/api/user", {
            method: "PATCH",
            body: formData,
          });
          
        if (res.status === 200) {
            const userData = await res.json();
            mutate({
                
                user: {
                    // ...props.user,
                    ...userData.user,
                },
              });
            console.log("submitted successfully!")
        }
        else{
            console.log("failed application contact admin.")
        }
        alert("automatic email sent to selected student!")
        window.location.reload();
    }
    async function handleRejected(){

    }
    async function handleEmail(){

    }

    return (
        <div >
            {post.applicants.map((applicant)=>!((post.selectedApplicants.includes(applicant.userid))||(!applicant.rejected)) ?
                (<Card style={{ height: "1fr", backgroundColor: "#E8E8E8"}}>
                    <CardBody>
                    <CardTitle tag="h5">{applicant.name}</CardTitle>
                    <CardSubtitle tag="h6" style={{whiteSpace:"pre"}}>{applicant.programme+
                    "\t\t Graduation Year " + applicant.graduatingYear+"\t\t Stream "+ applicant.stream}</CardSubtitle>
                    <CardTitle tag="h6" className="mb-2 text-muted">{`CPI: ${applicant.cpi}`}</CardTitle>
                    <a href={applicant.resume} style={{padding: "70px 0px !important"}}>Applicant Resume</a>
                    <CardText>{applicant.sop}</CardText>
                    <Button style={{backgroundColor:"#5b92e5"}} onClick={handleAccepted} 
                    userid={applicant.userid} username={applicant.name}
                    useremail={applicant.email}
                    >Accept
                    </Button>
                    <Button style={{backgroundColor:"red"}} onClick={handleRejected}>Reject</Button>
                    <Button style={{backgroundColor:"orange"}} onClick={handleEmail}>Email</Button>
                    </CardBody>
                </Card>):null
            )
        }
        </div>
    )
}

export async function getServerSideProps(context) {
    await all.run(context.req, context.res);
    
    var post = await findPostById(context.req.db, context.params.postId)
    post = JSON.parse(post)
    return {
      props: {post}, 
    }
  }