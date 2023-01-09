import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { API_ROOT, BACKGROUND_COLOR } from "../../env";
import { getDocumentName } from '../../util/DocumentUtil';
import { disconnectUser, getAccessToken, getRefreshToken, makeRequestWithJWT } from "../../util/JWTUtil";
import AppointmentsList from "./AppointmentsList";

const AppointmentsListPage = ({ locationChangeCallback }) => {
    const [appointments, setAppointments] = React.useState([]);
    const location = useLocation()
    const navigate = useNavigate()

    React.useEffect(() => {
        document.title = getDocumentName('Appointments');
    }, []);

    React.useEffect(() => {
        locationChangeCallback(location);
    }, [location]);

    const setPageData = (data) => {
        setAppointments(data.appointments);
    }

    React.useEffect(() => {
        document.body.style.backgroundColor = BACKGROUND_COLOR;

        const fetchMyAppointments = async () => {
            const res = await makeRequestWithJWT(
                `${API_ROOT}/v1.0/Users/me/appointments`, {
                method: 'GET',
                mode: 'cors'
            }, {
                accessToken: getAccessToken(),
                refreshToken: getRefreshToken()
            }
            )

            if (res.status === 401) {
                disconnectUser();
                navigate('/login');
                return;
            }

            if (!res.ok) {
                navigate('/not-found');
                return;
            }

            const jsonData = await res.json();
            setPageData(jsonData);
        }

        fetchMyAppointments();

    }, [navigate])

    return (
        <>
            <AppointmentsList appointments={appointments}></AppointmentsList>
        </>
    )
}

export default AppointmentsListPage;