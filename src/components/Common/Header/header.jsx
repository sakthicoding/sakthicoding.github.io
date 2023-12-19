import React from "react";

import ImageLogo from "../../../img/logo.svg"

export default function Header() {
    return (
        <>
            {/*Insert Logo*/}
            <div className="header">
                <div className="inline-block float-left logo">
                    <a className="home">
                        <img id="imageLogo" src={ImageLogo} alt="errorImage" />
                    </a>
                </div>
            </div>
        </>
    )
}