import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button, Alert } from "reactstrap";
import DataTable from "react-data-table-component";

function App() {
  const [headers, setHeaders] = useState([]);
  const [peopleData, setData] = useState([]);
  const [msg, setMsg] = useState([null, null]);

  const makePassword = () => {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  };

  const addUsers = async () => {
    setMsg(["Adding user(s). Please don't refresh the page", "warning"]);
    console.log(peopleData);
    let error = false;
    for (let index = 0; index < peopleData.length; index++) {
      const element = peopleData[index];

      const body = {};

      for (let j = 0; j < headers.length; j++) {
        body[headers[j]] = element[headers[j]];
      }
      body.password = makePassword();
      body.posts = [];

      console.log(body);
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 201) {
        const userObj = await res.json();
      } else {
        error = true;
        setMsg([await res.text(), "danger"]);
      }
    }
    if (!error) {
      setMsg(["Added users successfully.", "success"]);
      setTimeout(() => setMsg([null, null]), 1000);
    }
  };

  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    console.log(dataStringLines, "dataStringLines");
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          console.log(d, "row");
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));
    console.log(list);

    setData(list);
    setHeaders(headers);
    console.log(headers);
    // console.log(peopleData, "list");
    // console.log(columns, "columns");
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div id="addusers">
      {msg[0] ? <Alert color={msg[1]}>{msg[0]}</Alert> : null}
      <h3>Add Users to the o-CEO Portal</h3>
      <input
        text="Choose"
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
        style={{ paddingTop: "10px" }}
      />
      <br />
      <br />
      <Button onClick={addUsers} color="primary">
        Add
      </Button>
    </div>
  );
}

export default App;
