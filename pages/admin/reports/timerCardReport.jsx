import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";

function TimeCardReport() {
  const csvData = [
    ["firstname", "lastname", "email"],
    ["John", "Doe", "john.doe@xyz.com"],
    ["Jane", "Doe", "jane.doe@xyz.com"],
  ];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [month, setMonth] = useState(null);

  console.log(month);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  async function download_csv_file() {
    const res = await fetch(`/api/timecard?month=${month}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const posts_data = {};
    const users_data = {};
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

      if (!users_data[student_id]) {
        const student = await fetch(`/api/users/${student_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const { user } = await student.json();
        users_data[student_id] = [user.name, user.email];
      }

      if (!users_data[prof_id]) {
        const prof = await fetch(`/api/users/${prof_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const { user } = await prof.json();
        users_data[prof_id] = [user.name];
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
        users_data[student_id][1],
        users_data[student_id][0],
        posts_data[post_id],
        approvedtimecards[i].month,
        users_data[prof_id][0],
        total_hours,
        rateApproved,
        totalAmount,
        approvedtimecards[i].bankname,
        parseInt(approvedtimecards[i].accnum),
        approvedtimecards[i].ifsc,
      ]);
    }

    console.log(timeCardReport);

    var csv = "";
    timeCardReport.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });
    // //display the created CSV data on the web browser
    document.write(csv);
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    //provide the name for the CSV file to be downloaded
    hiddenElement.download = `Time Card Report for ${month}.csv`;
    hiddenElement.click();
    window.location.reload();
  }

  // console.log(timeCardReport);

  return (
    <>
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
    </>
  );
}
export default TimeCardReport;
