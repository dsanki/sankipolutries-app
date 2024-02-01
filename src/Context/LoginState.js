import react, { useState } from "react";
import LoginContext from "./LoginContext";

const LoginState = (props) => {
    const _loginstate = {

        username: "",
        islogin: true,
        isadmin: true
    }

    const [state, setLoginState] = useState(_loginstate);

    return (
        <LoginContext.Provider value={state}>
            {props.children}
        </LoginContext.Provider>
    )
}

export default LoginState;