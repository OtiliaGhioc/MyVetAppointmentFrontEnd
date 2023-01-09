import Container from '@mui/material/Container';
import ToggleButton from '@mui/material/ToggleButton';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { API_ROOT } from '../../env';


const MedicalHistoryDataContainer = () => {

    const navigate = useNavigate();
    const [medicalHistory, setMedicalHistory] = useState();
    let { medicalEntryId } = useParams();
    
    const fetchDataMedicalHistory = async () => {
        let path = `${API_ROOT}/v1.0/MedicalEntries/${medicalEntryId}`
        const response = await fetch(path, {
            method: 'GET',
            mode: 'cors'
        })

        if (!response.ok) 
        {
            navigate("/not-found");
            return;
        }
        
        const json_data = await response.json();

        setMedicalHistory(json_data);
    }

    useEffect(() => {
        document.body.style.backgroundColor = '#ebf6fc';        

        fetchDataMedicalHistory();

    }, [navigate])  
    
    if (medicalHistory)
        return (
            <div>
                {
                       <>
                       <Container style={{ width: '100%', height: '5rem', padding: '1rem', backgroundColor: "#8fc3e3" }}>
                           <h1>{medicalEntryId}</h1>
                       </Container>
           
                       <Container style={{ width: '100%', padding: '1rem', backgroundColor: "#8fc3e3" }}>
                           {/* <h3>Date: {medicalHistoryData[0].date}</h3>
                           <h3>Appointer: {medicalHistoryData[0].appointer_name}</h3>
                           <h3>Customer: {medicalHistoryData[0].customer_name}</h3>  */}
                          
                           <ToggleButton color="secondary" value="appointment" style={{marginRight: 10} }  onClick={ () => navigate(`/appointment/${medicalHistory.appointmentId}`) } >Appointment</ToggleButton>
                           {/* <ToggleButton color="secondary" value="prescription" onClick={ () => navigate(`/prescription/${medicalHistory.prescriptionId}`) }>Prescription</ToggleButton> */}
                           
                       </Container>
                      
                   </>
                }
            </div>
        )
}

export default MedicalHistoryDataContainer;