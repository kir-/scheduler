import {useEffect, useReducer} from "react";
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
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      const newDays = state.days.map((element)=>{
        if (element.name === state.day){
          const subtract = {...element, spots: element.spots - action.days}
          return subtract
        } 
        return element
      })
      return {...state, appointments: appointments, days: newDays};
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

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`,{
      interview
    }).then(()=>{
      dispatch({type: SET_INTERVIEW, id, interview, days: 0})
    })
  }

  function deleteInterview(id){
    return axios.delete(`/api/appointments/${id}`).then(()=>{
      dispatch({type: SET_INTERVIEW, id, interview: null, days: 0})
    })
  }

  const setDay = day => {
    dispatch({type: SET_DAY, value: day})
  };

  useEffect(()=>{
    let socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    socket.onmessage = function(event){
      console.log("Message Recieved: " + event.data);
      let data = JSON.parse(event.data);
      
      switch (data.type) {
        case SET_INTERVIEW:
          if(data.interview){
              dispatch({type: SET_INTERVIEW, id: data.id, interview: data.interview, days: 1})
            } else {
              dispatch({type: SET_INTERVIEW, id: data.id, interview: data.interview, days: -1})
            }
          break;
        default:
      }
    }

    socket.onopen = function(){
      socket.send("ping")
    }
    
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