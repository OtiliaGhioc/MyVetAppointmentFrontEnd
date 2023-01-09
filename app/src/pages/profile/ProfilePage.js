import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { API_ROOT, BACKGROUND_COLOR } from '../../env';
import { getDocumentName } from '../../util/DocumentUtil';
import { disconnectUser, getAccessToken, getRefreshToken, makeRequestWithJWT } from '../../util/JWTUtil';
import ProfileUserCard from './ProfileUserCard';

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

const ProfilePage = ({ locationChangeCallback }) => {
    const [username, setUsername] = React.useState('username');
    const [isMedic, setIsMedic] = React.useState(false);
    const [hasOffice, setHasOffice] = React.useState(false);
    const [joinedDate, setJoinedDate] = React.useState('March 2020');

    const navigate = useNavigate();

    const location = useLocation();

    React.useEffect(() => {
        document.title = getDocumentName('Profile')
    }, [])

    React.useEffect(() => {
        locationChangeCallback(location);
    }, [location]);

    const setPageData = (data) => {
        setUsername(data.username);
        setIsMedic(data.isMedic);
        setJoinedDate(data.joinedDate);
        setHasOffice(data.hasOffice);
    }

    React.useEffect(() => {
        document.body.style.backgroundColor = BACKGROUND_COLOR;

        const fetchData = async () => {
            const res = await makeRequestWithJWT(
                `${API_ROOT}/v1.0/Users/me/`, {
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
        fetchData();
    }, [navigate])

    return (
        <ThemeProvider theme={profileTheme}>
            <Box sx={{ flexGrow: 1, margin: '2rem auto 0 auto' }}>
                <Grid container spacing={2}>
                    <Grid item xs={4}/>
                    <Grid item xs={4}>
                        <Item>
                            <ProfileUserCard username={username} isMedic={isMedic} joinedDate={joinedDate} hasOffice={hasOffice} />
                        </Item>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

export default ProfilePage;