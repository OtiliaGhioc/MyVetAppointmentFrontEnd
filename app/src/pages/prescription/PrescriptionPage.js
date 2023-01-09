import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useEffect } from 'react';
import PrescriptionDataContainer from './PrescriptionDataContainer';
import { useLocation } from "react-router";
import CreatePrescriptionModal from "./CreatePrescriptionModal";

const profileTheme = createTheme({
    palette: {
        primary: {
            main: '#8fc3e3',
        },
        secondary: {
            main: '#ffffff',
        },
    },
});

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const PrescriptionPage = ({ locationChangeCallback }) => {
    const location = useLocation()
    useEffect(() => { document.body.style.backgroundColor = '#ebf6fc' }, [])
    const [prescriptionsList, setPrescriptionsList] = React.useState([]);

    React.useEffect(() => {
        locationChangeCallback(location);
    }, [location]);

    
    const [isCreatePrescriptionModalOpen, setIsCreatePrescriptionModalOpen] = React.useState(false);

    
    const openCreateDrugModal = () => {
        setIsCreatePrescriptionModalOpen(true);
    }

    const handleCreatePrescriptionModalClose = () => {
        setIsCreatePrescriptionModalOpen(false);
    }

    const updatePrescriptionsListState = (prescriptionData) => {
        setPrescriptionsList([...prescriptionsList, {
            id: prescriptionData.id,
            description: prescriptionData.description
        }])
    }

    return (
        <>
            <ThemeProvider theme={profileTheme}>
                <Box sx={{ flexGrow: 1, margin: '2rem auto 0 auto' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={1} />
                        <Grid item xs={8}>
                            <Item>
                                <PrescriptionDataContainer />
                            </Item>
                        </Grid>
                        <Grid item xs={2}>
                            <Item>
                                <Container style={{ width: '100%', height: 'fit-content', padding: '1rem', backgroundColor: "#8fc3e3", backgroundImage: 'url(/img/dog_paws_pattern.jpg)', backgroundSize: '500%' }}>
                                    <Button variant="contained" style={{ margin: '0 auto', border: '3px solid', color: 'white', backgroundColor: "#0155a4" }} onClick={openCreateDrugModal}>Add Prescription</Button>
                                    <Button variant="contained" style={{ margin: '0 auto', border: '3px solid', color: 'red', backgroundColor: "#0155a4" }} href='/me'>Back</Button>
                                    
                                    <CreatePrescriptionModal
                                        isOpen={isCreatePrescriptionModalOpen}
                                        handleClose={handleCreatePrescriptionModalClose}
                                        updateDrugsList={updatePrescriptionsListState} />
                                </Container>
                            </Item>
                        </Grid>
                        <Grid item xs={1} />
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    )
}

export default PrescriptionPage;