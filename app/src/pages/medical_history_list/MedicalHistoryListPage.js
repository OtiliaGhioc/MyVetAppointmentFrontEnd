import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { API_ROOT, BACKGROUND_COLOR } from "../../env";
import { getDocumentName } from '../../util/DocumentUtil';
import { disconnectUser, getAccessToken, getRefreshToken, makeRequestWithJWT } from "../../util/JWTUtil";
import MedicalHistoryList from './MedicalHistoryList';

const MedicalHistoryListPage = ({ locationChangeCallback }) => {
    const [medicalHistoryEntries, setMedicalHistoryEntries] = React.useState([]);
    const location = useLocation()
    const navigate = useNavigate()

    React.useEffect(() => {
        document.title = getDocumentName('Medical Entries');
    }, []);

    React.useEffect(() => {
        locationChangeCallback(location);
    }, [location]);

    const setPageData = (data) => {
        setMedicalHistoryEntries(data.medicalHistoryEntries);
    }

    React.useEffect(() => {
        document.body.style.backgroundColor = BACKGROUND_COLOR;

        const fetchMyMedicalHistoryEntries = async () => {
            const res = await makeRequestWithJWT(
                `${API_ROOT}/v1.0/Users/me/medical-history`, {
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

        fetchMyMedicalHistoryEntries();

    }, [navigate])

    return (
        <>
            <MedicalHistoryList medicalHistoryEntries={medicalHistoryEntries}></MedicalHistoryList>
        </>
    )
}

export default MedicalHistoryListPage;