import "./styles.css";
import { useState, useEffect } from "react";

export default function App() {

  const [counter, setCounter] = useState(0);
  const [message, setMessage] = useState("BEFORE");
  const gotData = counter % 5 === 0 ? true : false;
  

  function increaseCounter() {
           setCounter(counter + 1)
  }

  useEffect(() => {
    // no dependency, no array, gets called on every rerender
    console.log("rendered")
  } )

  useEffect(() => {
    // empty dep array" gets called on first render
    setMessage("After")
    console.log("First!!")
  }, []
  )

  useEffect(() => {
      console.log("Got data!!!")
        }, [gotData]
  )


  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <div>{message}</div> 
      Counter: {counter} {" "}
      <button
      onClick = {() => increaseCounter()}
      >+ 1</button>
    </div>
  );
}