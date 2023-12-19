import { useRouteError } from "react-router-dom";
import ErrorImage from "../../img/foxStealing.gif"
import "./styles_errorPage.css"

export default function ErrorPage() {

  const error = useRouteError();
  console.error(error);

  return (
    <>
      <div id="errorText">
        <h1 id="errorHeader">Whoops! This is not what you were looking for!</h1>
        <img id="errorImage" src={ErrorImage} alt="errorImage" />
        <p className="errorP-msg">
          <span id="msgSwiper">
            Swiper </span>
          might steal the info and possibly money from your accout!
        </p>
        <p className="errorP-contact">Please contact our
          detective <a id="contactDora" href="mailto:csk.sakthi@gmail.com">
            Dora</a> for further investigation or go <a id="goHome" href="/">
            Home.</a></p>
        <br></br>
        <br></br>
        <hr></hr>
        <p className="errorP-errortext">Error message:
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </>
  );
}