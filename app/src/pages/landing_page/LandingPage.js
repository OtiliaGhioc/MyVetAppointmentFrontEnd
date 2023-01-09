import { useNavigate } from "react-router-dom";
import { browserHasJWTokens } from "../../util/JWTUtil";
import * as React from 'react'

const LandingPage = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        if(browserHasJWTokens())
            navigate('/me');
        else
            navigate('/login')
    }, [navigate]);

    return (
        <></>
    )
}

export default LandingPage;