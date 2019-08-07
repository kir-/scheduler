import React from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/header";
import Show from "components/Appointment/show";
import Empty from "components/Appointment/empty";

export function checkInterview(interview){
  if (interview) return <Show student={interview.student} interviewer={interview.interviewer}></Show>;
  return <Empty></Empty>;
}

export default function Appointment(props){
  return (<article className="appointment">
    <Header time={props.time}></Header>
    {checkInterview(props.interview)}
  </article>)
}