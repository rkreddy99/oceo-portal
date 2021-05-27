import React, { useState } from 'react'
import { all } from "@/middlewares/index";
import { findUserById, findPostById, getUnapprovedProfCards } from "@/db/index";
import { extractUser } from "@/lib/api-helpers"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label,Input, Form, FormGroup } from "reactstrap";
function index() {
    // const [state, set] = useState(initialState)
    const handleSubmit = (event)=>{
        var formData = new FormData;
        formData.append("feedback", true);
        formData.append("postId", props.post._id);
        formData.append("userId", props.user._id);
        formData.append("q1", event.currentTarget.q1.value);
        formData.append("q2", event.currentTarget.q2.value);
        formData.append("q3", event.currentTarget.q3.value);
        // alert(event.currentTarget.q1.value);
        const res = fetch("/api/posts", {
            method: "PATCH",
            body: formData,
          });
          
        if (res.status === 200) {

        }
        
        window.location.reload();
    }
    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>How do you rate the performance of the student on a scale of 10.</Label>
                    <Input type="number" max="10" min="0" name="q1"></Input>
                </FormGroup>
                <FormGroup>
                    <Label>If given another opportunity, what are the chances that the same student will be hired.</Label>
                    <Input type='select' name="q2">
                        <option>Yes</option>
                        <option>No</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label>If the performance is not up to the mark, would you like the activity to be terminated.</Label>
                    <Input type='select' name="q3">
                        <option>Yes</option>
                        <option>No</option>
                        <option>NA</option>
                    </Input>
                </FormGroup>
                <Button type="submit" style={{backgroundColor: "blue"}}>Submit</Button>
            </Form>

        </div>)
    
}

export default index
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
