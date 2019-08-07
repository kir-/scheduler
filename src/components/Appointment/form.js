import React, {useState} from "react"

import Button from 'components/Button';
import InterviewerList from "components/InterviewerList";

export default function Form(props){

  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  return(
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            value={name}
            onChange={event => setName(event.target.value)}
            className="appointment__create-input text--semi-bold"
            name="student-name"
            type="text"
            placeholder="Enter Student Name"
          />
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer}/>
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={()=>props.onCancel()}>Cancel</Button>
          <Button confirm onClick={()=>props.onSave(name, interviewer)}>Save</Button>
        </section>
      </section>
    </main>
  )
}