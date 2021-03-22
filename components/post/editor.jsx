import React, { useState } from 'react';
import { useCurrentUser } from '@/hooks/index';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import enIN from 'date-fns/locale/en-IN'
registerLocale('enIN', enIN);

export default function PostEditor() {
  const [user] = useCurrentUser();

  const [deadline, setdeadline] = useState(null);

  const [msg, setMsg] = useState(null);

  if (!user) {
    return (
      <div style={{ color: '#555', textAlign: 'center' }}>
        Please sign in to post
      </div>
    );
  }

  async function hanldeSubmit(e) {
    e.preventDefault();
    setdeadline(null)    
    const body = {
      title: e.currentTarget.title.value,
      description: e.currentTarget.description.value,
      eligibility: e.currentTarget.eligibility.value,
      approved: false,
      deadline: deadline
    };
    // console.log(JSON.stringify(body))
    // if (!e.currentTarget.content.value) return;
    e.currentTarget.title.value = '';
    e.currentTarget.description.value = '';
    e.currentTarget.eligibility.value = '';
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMsg('Posted!');
      setTimeout(() => setMsg(null), 5000);
    }
  }

  return (
    <>
      <p style={{ color: '#0070f3', textAlign: 'center' }}>
        {msg}
      </p>
      <form onSubmit={hanldeSubmit} style={{ flexDirection: 'column' }} autoComplete="off">
        <label htmlFor="title">
          <input
            required
            id="title"
            name="title"
            type="text"
            placeholder="Title"
          />
        </label>
        <label htmlFor="description">
          <input
            required
            id="description"
            name="description"
            type="text"
            placeholder="Description"
          />
        </label>
        <label htmlFor="eligibility">
          <input
            required
            id="eligibility"
            name="eligibility"
            type="text"
            placeholder="Eligibility"
          />
        </label>
        <label htmlFor="deadline">
          <DatePicker selected={deadline} onChange={date => setdeadline(date)} minDate={new Date()} locale="enIN" placeholderText="Date of deadline"/>
        </label>
        <button type="submit" style={{ marginLeft: '0.5rem' }}>Post</button>
        <button type="reset" style={{ marginLeft: '0.5rem' }}>Discard</button>
      </form>
    </>
  );
}
