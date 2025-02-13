import React from "react";

import "components/InterviewerList.scss";
import PropTypes from 'prop-types';

import InterviewerListItem from "components/InterviewerListItem";

export default function InterviewerList(props){
  
  InterviewerList.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired
  };

  return(
    <section className='interviewers'>
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
      {props.interviewers.map((interviewer)=>{
        return <InterviewerListItem key={interviewer.id} name={interviewer.name} avatar={interviewer.avatar} selected={props.value === interviewer.id} setInterviewer={()=>props.onChange(interviewer.id)}></InterviewerListItem>
      })}
      </ul>
    </section>
  )
}