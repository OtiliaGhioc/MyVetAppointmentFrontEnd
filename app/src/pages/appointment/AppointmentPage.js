import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useEffect } from 'react';
import AppointmentDataContainer from './AppointmentDataContainer';

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

const AppointmentPage = () => {
    useEffect(() => { document.body.style.backgroundColor = '#ebf6fc' }, [])

    return (
        <>
            <ThemeProvider theme={profileTheme}>
                <Box sx={{ flexGrow: 1, margin: '2rem auto 0 auto' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={2} />
                        <Grid item xs={8}>
                            <Item>
                                <AppointmentDataContainer />
                            </Item>
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    )
}

export default AppointmentPage;