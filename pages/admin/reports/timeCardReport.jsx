import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Alert,
  Col,
} from "reactstrap";
import { all } from "@/middlewares/index";
import { getStudents } from "@/db/index";

function TimeCardReport({ allstudents, idToEmail, postToUser }) {
  const postUserMap = JSON.parse(postToUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [month, setMonth] = useState(null);
  const [msg, setMsg] = useState(null);
  const [color, setColor] = useState(null);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const download_csv_file = async () => {
    if (!month) {
      setColor("danger");
      setMsg("Please select a month");
      setTimeout(() => setMsg(null), 2000);
      return;
    } else {
      setColor("warning");
      setMsg("Downloading Time Card report...");
    }
    const res = await fetch(`/api/timecard?month=${month}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const posts_data = {};
    const students_data = {};
    const prof_data = {};
    const { approvedtimecards } = await res.json();

    const timeCardReport = [
      [
        "ROLL NO",
        "student email".toUpperCase(),
        "student name".toUpperCase(),
        "activity title".toUpperCase(),
        "month".toUpperCase(),
        "ta advisor".toUpperCase(),
        "number of hours".toUpperCase(),
        "rate approved".toUpperCase(),
        "total amount".toUpperCase(),
        "bank name".toUpperCase(),
        "bank account number".toUpperCase(),
        "bank ifsc".toUpperCase(),
        "ADVISOR APPROVED",
        "ADMIN APPROVED",
      ],
    ];

    for (let i = 0; i < approvedtimecards.length; i++) {
      let post_id = approvedtimecards[i]?.postId;
      let student_id = approvedtimecards[i]?.userId;
      let prof_id = approvedtimecards[i]?.profId;

      if (!posts_data[post_id]) {
        const post_new = await fetch(`/api/post/${post_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const { post } = await post_new.json();
        posts_data[post_id] = JSON.parse(post).title;
      }

      if (!students_data[student_id]) {
        students_data[student_id] = [
          idToEmail[student_id][0],
          idToEmail[student_id][1],
          1,
          idToEmail[student_id][2],
        ];
      } else {
        students_data[student_id][2] += 1;
      }

      if (!prof_data[prof_id]) {
        const prof = await fetch(`/api/users/${prof_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const { user } = await prof.json();
        prof_data[prof_id] = [user.name];
      }

      const total_hours =
        parseInt(approvedtimecards[i].week1) +
        parseInt(approvedtimecards[i].week2) +
        parseInt(approvedtimecards[i].week3) +
        parseInt(approvedtimecards[i].week4) +
        parseInt(approvedtimecards[i].week5);

      const rateApproved = 150;

      const totalAmount = rateApproved * total_hours;

      timeCardReport.push([
        students_data[student_id][3],
        students_data[student_id][1],
        students_data[student_id][0],
        posts_data[post_id],
        approvedtimecards[i].month,
        prof_data[prof_id][0],
        total_hours,
        rateApproved,
        totalAmount,
        approvedtimecards[i].bankname,
        approvedtimecards[i].accnum,
        approvedtimecards[i].ifsc,
        approvedtimecards[i].approvedByProf ? "TRUE" : "FALSE",
        approvedtimecards[i].approvedByAdmin ? "TRUE" : "FALSE",
      ]);
    }

    var csv = "";
    timeCardReport.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = `Time Card Report for ${month}.csv`;
    hiddenElement.click();

    setColor("success");
    setMsg("Downloaded Time Card Report");
    setTimeout(() => setMsg(null), 1500);
  };

  const notSubmittedTmcrd = async () => {
    if (!month) {
      setColor("danger");
      setMsg("Please select a month");
      setTimeout(() => setMsg(null), 2000);
      return;
    } else {
      setColor("warning");
      setMsg("Notifying students to submit Time Card");
    }
    const res = await fetch(`/api/timecard?month=${month}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const postStudentTmcrd = {};
    const notsubmittedTmcrdIds = new Set();
    const notsubmittedTmcrdEmail = [];
    const { approvedtimecards } = await res.json();

    for (let i = 0; i < approvedtimecards.length; i++) {
      let post_id = approvedtimecards[i]?.postId;
      let student_id = approvedtimecards[i]?.userId;
      if (postStudentTmcrd[post_id]) {
        postStudentTmcrd[post_id].push(student_id);
      } else {
        postStudentTmcrd[post_id] = [student_id];
      }
    }

    for (let i in postUserMap) {
      if (i in postStudentTmcrd) {
        let students = postUserMap[i].filter(
          (x) => !postStudentTmcrd[i].includes(x)
        );
        students.forEach((item) => notsubmittedTmcrdIds.add(item));
      } else {
        postUserMap[i].forEach((item) => notsubmittedTmcrdIds.add(item));
      }
    }
    const notsubmittedTmcrdIdsarr = Array.from(notsubmittedTmcrdIds);

    notsubmittedTmcrdIdsarr.forEach((item) =>
      notsubmittedTmcrdEmail.push(idToEmail[item][1])
    );

    if (!notsubmittedTmcrdEmail.length) {
      setColor("success");
      setMsg(`Everybody has submitted timecard for ${month}`);
      setTimeout(() => setMsg(null), 2000);
      return;
    }

    console.log(notsubmittedTmcrdEmail);

    let sent = false;

    for (let index = 0; index < notsubmittedTmcrdEmail.length; index++) {
      const res = await fetch(
        `/api/timecard/notifytmcrd?email=${notsubmittedTmcrdEmail[index]}&month=${month}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {
        sent = true;
      } else {
        sent = false;
      }

      if (index == notsubmittedTmcrdEmail.length - 1) {
        if (sent) {
          setColor("success");
          setMsg(
            `Email sent to ${notsubmittedTmcrdEmail.length} student(s) to submit Time Card`
          );
          setTimeout(() => setMsg(null), 3000);
        } else {
          setColor("danger");
          setMsg(await res.text());
          setTimeout(() => setMsg(null), 3000);
        }
      }
    }
  };

  return (
    <div id="createreport">
      {msg ? (
        <>
          <br />
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Alert color={color}>{msg}</Alert>
          </Col>
          <br />
        </>
      ) : null}
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret>
          {month ? month : "Select the month"}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => setMonth("January")}>
            January
          </DropdownItem>
          <DropdownItem onClick={() => setMonth("February")}>
            February
          </DropdownItem>
          <DropdownItem onClick={() => setMonth("March")}>March</DropdownItem>
          <DropdownItem onClick={() => setMonth("April")}>April</DropdownItem>
          <DropdownItem onClick={() => setMonth("May")}>May</DropdownItem>
          <DropdownItem onClick={() => setMonth("June")}>June</DropdownItem>
          <DropdownItem onClick={() => setMonth("July")}>July</DropdownItem>
          <DropdownItem onClick={() => setMonth("August")}>August</DropdownItem>
          <DropdownItem onClick={() => setMonth("September")}>
            September
          </DropdownItem>
          <DropdownItem onClick={() => setMonth("October")}>
            October
          </DropdownItem>
          <DropdownItem onClick={() => setMonth("November")}>
            November
          </DropdownItem>
          <DropdownItem onClick={() => setMonth("December")}>
            December
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <br />
      <Button
        onClick={download_csv_file}
        color="info"
        style={{ marginRight: "10px" }}
      >
        Download Time Card Report
      </Button>

      <Button
        onClick={notSubmittedTmcrd}
        color="danger"
        style={{ marginLeft: "10px" }}
      >
        Notify Students to submit Time Card
      </Button>
    </div>
  );
}
export default TimeCardReport;

export async function getServerSideProps(context) {
  await all.run(context.req, context.res);
  const allstudents = await getStudents(context.req.db);
  const idToEmail = {};
  const post2User = {};
  allstudents.forEach((student) => {
    if (student) {
      idToEmail[student._id] = [student.name, student.email, student.rollno];
      const setSelectedPosts = new Set(student.selectedPosts);
      for (let i of setSelectedPosts) {
        if (post2User[i]) {
          post2User[i].add(student._id);
        } else {
          post2User[i] = new Set().add(student._id);
        }
      }
    }
  });

  for (let i in post2User) {
    post2User[i] = Array.from(post2User[i]);
  }
  const postToUser = JSON.stringify(post2User);

  return { props: { allstudents, idToEmail, postToUser } };
}
