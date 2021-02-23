import React, { useState } from 'react';
import { useCurrentUser } from '@/hooks/index';

export default function PostEditor() {
  const [user] = useCurrentUser();

  const [msg, setMsg] = useState(null);

  if (!user) {
    return (
      <div style={{ color: '#EC473F', textAlign: 'center' }}>
        Please sign in to create or apply for an opportunity.
      </div>
    );
  }

  async function hanldeSubmit(e) {
    e.preventDefault();
    const body = {
      content: e.currentTarget.content.value,
    };
    if (!e.currentTarget.content.value) return;
    e.currentTarget.content.value = '';
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

  async function handleReset(e) {
    e.preventDefault();
    e.currentTarget.title.value = '';
    e.currentTarget.description.value = '';
    e.currentTarget.eligibility.value = '';
  }

  return (
    <>
      <p style={{ color: '#0070f3', textAlign: 'center' }}>
        {msg}
      </p>
      <form onSubmit={hanldeSubmit} onReset={handleReset} style={{ flexDirection: 'column' }} autoComplete="off">
        <label htmlFor="name">
          <input
            name="content"
            type="text"
            placeholder="Title"
          />
        </label>
        <label htmlFor="description">
          <input
            name="description"
            type="text"
            placeholder="Description"
          />
        </label>
        <label htmlFor="eligibility">
          <input
            name="eligibility"
            type="text"
            placeholder="Eligibility Criteria"
          />
        </label>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <button type='reset' >Discard</button>
          <button type="submit" >Create</button>
        </div>
      </form>
    </>
  );
}
