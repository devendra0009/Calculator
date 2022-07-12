import { useReducer } from "react";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  ADD_OPERATION: "add-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

//evaluate values function
function evaluate({ currOperand, prevOperand, operation }) {
  const prev = parseFloat(prevOperand);
  const curr = parseFloat(currOperand);
  if (isNaN(prev) || isNaN(curr)) return "";
  let evaluatedVal = "";
  switch (operation) {
    case "+":
      evaluatedVal = prev + curr;
      break;
    case "-":
      evaluatedVal = prev - curr;
      break;
    case "/":
      evaluatedVal = prev / curr;
      break;
    case "*":
      evaluatedVal = prev * curr;
      break;
    default:
      break;
  }
  return evaluatedVal.toString();
}

//reducer take state and action as a parameter  and return a newState
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currOperand === "0") return state;
      if (payload.digit === "." && state.currOperand.includes("."))
        return state;

      //this is the case when we are adding digit after evaluating an answer so we must overWrite that answer with the digit clicked
      if (state.overWrite) {
        return {
          ...state,
          currOperand: payload.digit,
          overWrite: false,
        };
      }
      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`,
        //this payload.digit we have to pass to reducer through dispatch(by passing a object containing payload:{digit}) because dispatch helps to trigger the action in reducer function
      }
    case ACTIONS.ADD_OPERATION:
      //Isme Total 4cases bnege:-
      //agr prev and curr dono NUll hai or hmne operation click kia
      //agr prev !null but curr null hai or hmne operation click kia
      //agr curr null hai but prev !null hai or hmne operation click kia
      //age prev and curr dono hi !null hai or hmne operation click kia

      if (state.prevOperand == null && state.currOperand == null) return {};

      if (state.currOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      //currOperand ka check phle hi dekh lia hence it won't be null
      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currOperand,
          currOperand: null,
        };
      }
      //agr ek operation hone k bavjood kisine ek or operation click kia to previous vala solve hojana chiye or prevOperand me 'evaluated value and the new-operation' clicked ajane chiye
      //So this is the case when neither prevOperand nor currOperand is null and we are clicking on the AddOperation button
      return {
        ...state,
        prevOperand: evaluate(state), //expexting a string of answer from this funciton
        operation: payload.operation,
        currOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.currOperand == null) return state; //no changes
      if (state.overWrite)
        return {
          ...state,
          overWrite: false,
          currOperand: null,
          prevOperand: null,
          operation: null,
        };
      return {
        ...state,
        currOperand: state.currOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      // if(state.operation===null&&state.prevOperand===null&&state.currOperand===null) return state
      return {
        ...state,
        overWrite: true,
        currOperand: evaluate(state),
        prevOperand: null,
        operation: null,
      };
    default:
      break;
  }
}

//Formatiing our integer
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  //if letsay we have operand as 12.0 then our integer will be 12 and decimal will be 0
  const [integer, decimal] = operand.split(".");
  //agr decimal nhi hai to format krde
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  //vrna no need to format
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  //my state here has three things->currOperand,prevOperand,operation which will change acc to user's need
  const [{ currOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="prev-operand">
          {formatOperand(prevOperand)} {operation}
        </div>
        <div className="curr-operand">{formatOperand(currOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => {
          dispatch({
            type: ACTIONS.CLEAR,
          });
        }}
      >
        AC
      </button>
      <button
        onClick={() => {
          dispatch({
            type: ACTIONS.DELETE_DIGIT,
          });
        }}
      >
        DEL
      </button>
      {/* So dispatch basically is button me jakr set-vet hokr ajaega  */}
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => {
          dispatch({
            type: ACTIONS.EVALUATE,
          });
        }}
      >
        =
      </button>
    </div>
  );
}

export default App;
