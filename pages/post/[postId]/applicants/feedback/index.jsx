import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label,Input, Form, FormGroup } from "reactstrap";
function index() {
    // const [state, set] = useState(initialState)
    const handleSubmit = (event)=>{
        alert(event.currentTarget.q1.value);
    }
    return (
        sdidfdfsdsfsddfs
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
{/* 1.  (drop-down menu- selection option)
2. If given another opportunity, what are the chances that the same student will be hired. (Sure, Maybe, Not)
3. If the performance is not up to the mark, would you like the activity to be terminated.  (Yes, NA, No) */}

        </div>
    )
}

export default index
