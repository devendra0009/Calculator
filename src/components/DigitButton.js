import { ACTIONS } from "../App";

//gonna take the digit as a prop and our dispatch so that we can pass that digit to "dispatch" in our app.js and there it can be used as a payload.digit
export default function DigitButton({dispatch,digit}) 
{
    //So we are making a digit button basically so that when we click it, it will set our dispatch with a object in which type of action is ADD_DIGIT and payload is {digit} which is being clicked 
    //We'gonna use payload property to add the clicked digit on our screen 
    return <button onClick={()=>{
        dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit}})
        }}>{digit}</button>
}