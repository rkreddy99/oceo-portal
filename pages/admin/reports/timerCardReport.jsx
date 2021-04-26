import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { all } from "@/middlewares/index";
import { getStudents } from "@/db/index";

function TimeCardReport({ allstudents, idToEmail }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [month, setMonth] = useState(null);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const download_csv_file = async () => {
    console.log(idToEmail, "here");
    const res = await fetch(`/api/timecard?month=${month}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const posts_data = {};
    const students_data = {};
    const prof_data = {};
    const stdnt_tmcrd_not = [];
    const { approvedtimecards } = await res.json();

    const timeCardReport = [
      [
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
        console.log(idToEmail);
        console.log(idToEmail[student_id]);
        students_data[student_id] = [
          idToEmail[student_id][0],
          idToEmail[student_id][1],
          1,
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
        students_data[student_id][1],
        students_data[student_id][0],
        posts_data[post_id],
        approvedtimecards[i].month,
        prof_data[prof_id][0],
        total_hours,
        rateApproved,
        totalAmount,
        approvedtimecards[i].bankname,
        parseInt(approvedtimecards[i].accnum),
        approvedtimecards[i].ifsc,
      ]);
    }

    for (const [key, value] of Object.entries(students_data)) {
      if (value[2] < idToEmail[key][2]) {
        stdnt_tmcrd_not[key] = [value[0], value[1]];
        console.log("not submitted time card");
      }
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
  };

  // console.log(timeCardReport);

  return (
    <div id="createreport">
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
      <br />
      <Button onClick={download_csv_file} color="info">
        Download Time Card Report
      </Button>
    </div>
  );
}
export default TimeCardReport;

export async function getServerSideProps(context) {
  await all.run(context.req, context.res);
  const allstudents = await getStudents(context.req.db);
  const idToEmail = {};
  allstudents.forEach((student) => {
    if (student) {
      idToEmail[student._id] = [
        student.name,
        student.email,
        student.selectedPosts.length,
      ];
    }
  });
  return { props: { allstudents, idToEmail } };
}
