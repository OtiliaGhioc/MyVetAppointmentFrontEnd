import * as React from 'react';
import { useLocation } from "react-router-dom";

const NotFound = ({ locationChangeCallback }) => {
    const location = useLocation()

    React.useEffect(() => {
        locationChangeCallback(location);
    }, [location]);

    return (
        <>
            <h1>Not found</h1>
        </>
    )
}

export default NotFound;