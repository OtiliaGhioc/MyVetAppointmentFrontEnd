import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { API_ROOT } from '../../env';
import { getAccessToken, getRefreshToken, makeRequestWithJWT, disconnectUser } from "../../util/JWTUtil";


const PrescriptionDataContainer = () => {

    const navigate = useNavigate();
    const [prescription, setPrescription] = useState();

    const fetchDataPrescription = async () => {
        let path = `${API_ROOT}/v1.0/Prescriptions`
        const response = await makeRequestWithJWT(
            path, {
            method: 'GET',
            mode: 'cors'
        }, {
            accessToken: getAccessToken(),
            refreshToken: getRefreshToken()
        }
        )

        if (response.status === 401) {
            disconnectUser();
            navigate('/login');
            return;
        }

        if (!response.ok) {
            navigate("/not-found");
            return;
        }

        const json_data = await response.json();

        setPrescription(json_data);
    }

    async function cancelPrescription(prsID) {
        const res = await fetch(`${API_ROOT}/v1.0/Prescriptions/${prsID}`, {
            method: 'DELETE',
            mode: 'cors'
        });

        if (res.ok) {
            window.location.reload(true);
            return;
        }
    }

    function renderPrescriptions() {
        const prescriptionList = [];
        for(let i = 0; i < prescription.length; i++) {
            let drug = prescription[i].drugs;
            let descr = prescription[i].description;
            let id = prescription[i].prescriptionId;
            
            prescriptionList.push(<Container style={{ width: '100%', padding: '1rem', backgroundColor: "#8fc3e3", border: '1px solid white', backgroundImage: 'url(/img/dog_paws_pattern.jpg)', backgroundSize: '250%'}}>
            <h3 style={{color: "white"}}>Drugs: {drug}</h3>
            <h3 style={{color: "white"}}>Description: {descr}</h3>
            <Button variant="contained" style={{ margin: '0 auto 0 1rem', border: '3px solid', color: 'red', backgroundColor: "#0155a4" }} onClick={() => cancelPrescription(id)}>Remove</Button>
        </Container>);
        }
  
        return prescriptionList;
    }

    useEffect(() => {
        document.body.style.backgroundColor = '#ebf6fc';

        fetchDataPrescription();

    }, [navigate])

    if (prescription)
        return (
            <div>
                {
                    renderPrescriptions()
                }
            </div>
        )
}

export default PrescriptionDataContainer;