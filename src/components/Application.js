import React from "react";

import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDayV2 } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";


export default function Application(props) {
    const {
      state,
      setDay,
      bookInterview,
      deleteInterview
    } = useApplicationData();

  const appointments = getAppointmentsForDay({days: state.days, appointments: state.appointments},state.day);

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForDayV2(state, state.day);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        deleteInterview={deleteInterview}
      />
    );
  });
  console.log(state);
  return (
    <main className="layout">
      <section className="sidebar">
          <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <DayList days={state.days} day={state.day} setDay={(day)=>setDay(day)} />
        <nav className="sidebar__menu" />
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
          {schedule}
          <Appointment key="last" time="5pm" bookInterview={bookInterview}></Appointment>
      </section>
    </main>
  );
}
