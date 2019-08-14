import {useEffect, useReducer} from "react";
import axios from "axios";

// const SET_DAY = "SET_DAY";
// const SET_SPOTS = "SET_SPOTS";
// const SET_INTERVIEW = "SET_INTERVIEW";
// const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

// function reducer(state, action) {
  
//   switch (action.type) {
//     case SET_DAY:
//       return {...state, day: action.value};
//     case SET_APPLICATION_DATA:
//       return {...state, ...action.value};
//     case SET_INTERVIEW: {
//       const appointment = {
//         ...state.appointments[action.id],
//         interview: action.interview
//       };
//       const appointments = {
//         ...state.appointments,
//         [action.id]: appointment
//       };

//       const days = state.days.map((element)=>{
//         let spots = element.appointments.length;
//         for(let appointment of element.appointments){
//           if(appointments[appointment].interview !== null){
//             spots-=1;
//           }
//         }
//         return {...element, spots}
//       })

//       return {...state, appointments, days};
//     }
//     case SET_SPOTS: {
//         const days = state.days.map((element)=>{
//           let spots = 5;
//           for(let appointment of element.appointments){
//             if(state.appointments[appointment].interview !== null){
//               spots-=1;
//             }
//           }
//           return {...element, spots}
//         })
//         return {...state, days}
//     }
//     default:
//       throw new Error(
//         `Tried to reduce with unsupported action type: ${action.type}`
//       );
//   }
// }


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
      dispatch({type: SET_INTERVIEW, id, interview})
      // dispatch({type: SET_SPOTS})
    })
  }

  function deleteInterview(id){
    return axios.delete(`/api/appointments/${id}`).then(()=>{
      dispatch({type: SET_INTERVIEW, id, interview: null})
      // dispatch({type: SET_SPOTS})
    })
  }

  const setDay = day => {
    dispatch({type: SET_DAY, value: day})
    // dispatch({type: SET_SPOTS})
  };

  useEffect(()=>{
    let socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    socket.onmessage = function(event){
      let data = JSON.parse(event.data);
      
      switch (data.type) {
        case SET_INTERVIEW:
          if(data.interview){
              dispatch({type: SET_INTERVIEW, id: data.id, interview: data.interview})
              // dispatch({type: SET_SPOTS})
            } else {
              dispatch({type: SET_INTERVIEW, id: data.id, interview: data.interview})
              // dispatch({type: SET_SPOTS})
            }
          break;
        default:
      }
    }

    socket.onopen = function(){
      socket.send("ping")
    }
    
    Promise.all([axios.get("/api/days"),axios.get("/api/appointments"),axios.get("/api/interviewers")])
    .then((daysObject)=>{
      dispatch({type: SET_APPLICATION_DATA, value: {days: [...daysObject[0].data], appointments: {...daysObject[1].data}, interviewers: {...daysObject[2].data}} })
    })
  },[]);

  return{state,
    setDay,
    bookInterview,
    deleteInterview}
}