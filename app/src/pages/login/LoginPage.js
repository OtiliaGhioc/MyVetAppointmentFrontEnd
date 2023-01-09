import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { object, string } from 'zod';
import { API_ROOT } from '../../env';
import { getDocumentName } from "../../util/DocumentUtil";
import { getRefreshToken, storeTokens } from '../../util/JWTUtil';

const theme = createTheme();

const loginSchema = object({
    username: string()
        .min(1, 'Username is required')
        .min(4, 'Username must be at least 4 characters')
        .max(32, 'Username must be max 32 characters'),
    password: string()
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters')
});

const LoginPage = ({ locationChangeCallback }) => {
    const navigate = useNavigate();
    const location = useLocation()

    React.useEffect(() => {
        locationChangeCallback(location);
    }, [location]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    React.useEffect(() => {
        document.title = getDocumentName('Login');
    }, []);

    React.useEffect(() => {
        if (getRefreshToken() !== null)
            navigate('/me');
    }, [navigate])

    const performLogin = async (username, password) => {
        if (username === null || password === null) {
            console.log("Error logging in")
            return;
        }

        const res = await fetch(`${API_ROOT}/v1.0/Auth/login/`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!res.ok) {
            console.log("Error logging in")
            return;
        }

        const jsonData = await res.json();
        storeTokens(jsonData.accessToken, jsonData.refreshToken);
        navigate("/me");
    }

    const processSubmit = (data) => {
        performLogin(data.username, data.password)
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(/img/login_page_side.webp)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit(processSubmit)} sx={{ mt: 1 }}>
                            <TextField
                                {...register("username", { required: true })}
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                error={!!errors['username']}
                                helperText={errors['username'] ? errors['username'].message : ''}
                            />
                            <TextField
                                {...register("password", { required: true })}
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={!!errors['password']}
                                helperText={errors['password'] ? errors['password'].message : ''}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/register" variant="body2">
                                        {"Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default LoginPage;