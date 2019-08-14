const SET_DAY = "SET_DAY";
const SET_SPOTS = "SET_SPOTS";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";

export {SET_INTERVIEW, SET_APPLICATION_DATA, SET_DAY, SET_SPOTS}
export default function reducer(state, action) {

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

      const days = state.days.map((element)=>{
        let spots = element.appointments.length;
        for(let appointment of element.appointments){
          if(appointments[appointment].interview !== null){
            spots-=1;
          }
        }
        return {...element, spots}
      })

      return {...state, appointments, days};
    }
    case SET_SPOTS: {
        const days = state.days.map((element)=>{
          let spots = 5;
          for(let appointment of element.appointments){
            if(state.appointments[appointment].interview !== null){
              spots-=1;
            }
          }
          return {...element, spots}
        })
        return {...state, days}
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
