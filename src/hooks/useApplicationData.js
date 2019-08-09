import {useEffect, useState, useReducer} from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";


function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {...state, day: action.value};
    case SET_APPLICATION_DATA:
      return {...state, ...action.value};
    case SET_INTERVIEW: {
      return {...state, appointments: action.value.appointments, days: action.value.days};
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}



export default function useApplicationData(data){
  const [state, dispatch] = useReducer(reducer,{
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: []
  })

  function newDays(x) {
    const newDays = state.days.map((element)=>{
      if (element.name === state.day){
        const subtract = {...element, spots: element.spots - x}
        
        return subtract
      } 
      return element
    })
    return newDays;
  }

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`,{
      interview
    }).then(()=>{
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      
      dispatch({type: SET_INTERVIEW, value: {appointments, days: newDays(1)}})
    })
  }

  function deleteInterview(id){
    return axios.delete(`/api/appointments/${id}`).then(()=>{
      const appointment = {
        ...state.appointments[id],
        interview: null
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      
      dispatch({type: SET_INTERVIEW, value: {appointments, days: newDays(-1)}})
    })
  }

  const setDay = day => {
    dispatch({type: SET_DAY, value: day})
  };

  useEffect(()=>{
    Promise.all([axios("/api/days"),axios("/api/appointments"),axios("/api/interviewers")])
    .then((daysObject)=>{
      dispatch({type: SET_APPLICATION_DATA, value: {days: [...daysObject[0].data], appointments: {...daysObject[1].data}, interviewers: {...daysObject[2].data}} })
    })
  },[]);

  return{state,
    setDay,
    bookInterview,
    deleteInterview}
}