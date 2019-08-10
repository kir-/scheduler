import React, {useEffect} from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/header";
import Show from "components/Appointment/show";
import Empty from "components/Appointment/empty";
import Form from "components/Appointment/form";
import Status from "components/Appointment/status";
import Confirm from "components/Appointment/confirm";
import Error from "components/Appointment/error";

import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_DELETE = "ERROR_DELETE";
const ERROR_SAVE = "ERROR_SAVE";

export default function Appointment(props){

  const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => transition(SHOW)).catch(() => transition(ERROR_SAVE,true));
  }

  function deleter(){
    transition(DELETING);
    props.deleteInterview(props.id).then(() => transition(EMPTY)).catch(() => transition(ERROR_DELETE, true));
  }

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
     transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
     transition(EMPTY);
    }
   }, [props.interview, transition, mode]);
  
  return (<article className="appointment">
    <Header time={props.time}></Header>
    {mode === EMPTY && <Empty onAdd={()=>transition(CREATE)}/>}
    {mode === SHOW && props.interview &&
    (<Show student={props.interview.student} interviewer={props.interview.interviewer} onEdit={()=>transition(EDIT)} onDelete={()=>deleter()} />)
    }
    {mode === CREATE && <Form name={""} interviewer={""} interviewers={props.interviewers} onSave={(name, interviewer)=>save(name, interviewer)} onCancel={()=>back()}/>}
    {mode === SAVING && <Status message="Saving"></Status>}
    {mode === DELETING && <Status message="Deleting"></Status>}
    {mode === CONFIRM && <Confirm message="Delete the appointment?" onConfirm={()=>transition(EMPTY)} onCancel={()=>back()}/>}
    {mode === EDIT && <Form name={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers} onSave={(name, interviewer)=>save(name, interviewer)} onCancel={()=>back()}/>}
    {mode === ERROR_SAVE && <Error message={"Could not create appointment"} onClose={()=>back()}/>}
    {mode === ERROR_DELETE && <Error message={"Could not delete appointment."} onClose={()=>back()}/>}
  </article>)
}
