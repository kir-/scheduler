import React,{ useState, useEffect} from "react";

import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "components/Appointment";
import { getAppointmentsForDay } from "helpers/selectors";
import axios from "axios";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
  },
  {
    id: 4,
    time: "5pm",
    interview: {
      student: "Sarah Jones",
      interviewer: {
        id: 2,
        name: "The Teacher",
        avatar: "https://i.imgur.com/Nmx0Qxo.png",
      }
    }
  },
  {
    id: 5,
    time: "8pm",
    interview: {
      student: "Adam Savage",
      interviewer: {
        id: 3,
        name: "John Doe",
        avatar: "https://i.imgur.com/T2WwVfS.png",
      }
    }
  }
];

export default function Application(props) {
  // const [day, setDay] = useState(['Monday']);
  // const [days, setDays] = useState([]);
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: []
  });
  
  const setDay = day => setState(state=>({ ...state, day }));
  // const setDays = days => setState(state => ({ ...state, days }));
  // const setAppointments = appointments => setState(state => ({ ...state, appointments }));

  useEffect(()=>{
    Promise.all([axios("/api/days"),axios("/api/appointments"),axios("/api/interviewers")])
    .then((daysObject)=>{
      // setDays(daysObject[0].data)
      // setAppointments(daysObject[1].data)
      setState({...state, days: [...daysObject[0].data], appointments: {...daysObject[1].data}});
    })
  },[]);
  
  const appointments = getAppointmentsForDay({days: state.days, appointments: state.appointments},state.day);
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
       {appointments.map((appointment)=>{
         return <Appointment key={appointment.id} {...appointment} />
       })}
      </section>
    </main>
  );
}
