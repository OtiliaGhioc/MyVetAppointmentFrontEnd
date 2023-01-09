import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { boolean, object, string } from 'zod';
import { API_ROOT } from '../../env';
import { getDocumentName } from "../../util/DocumentUtil";
import { getRefreshToken, storeTokens } from '../../util/JWTUtil';

const theme = createTheme();

const registerSchema = object({
    username: string()
        .min(1, 'Username is required')
        .min(4, 'Username must be at least 4 characters')
        .max(32, 'Username must be max 32 characters'),
    password: string()
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string().min(1, 'Please confirm your password'),
    isMedic: boolean()
}).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
});

const RegisterPage = ({locationChangeCallback}) => {
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
        resolver: zodResolver(registerSchema)
    });

    React.useEffect(() => {
        document.title = getDocumentName('Register');
    }, []);

    React.useEffect(() => {
        if (getRefreshToken() !== null)
            navigate('/me');
    }, [navigate])

    const performRegister = async (username, password, isMedic) => {
        if (username === null || password === null) {
            console.log("Error registering user")
            return;
        }

        const res = await fetch(`${API_ROOT}/v1.0/Auth/register/`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                isMedic: isMedic
            })
        });

        if (!res.ok) {
            console.log("Error registering user")
            return;
        }

        const jsonData = await res.json();
        storeTokens(jsonData.accessToken, jsonData.refreshToken);
        navigate("/me");
    }

    const processSubmit = (data) => {
        performRegister(data.username, data.password, data.isMedic)
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
                        backgroundImage: 'url(/img/register_page_side.jpg)',
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
                            Sign up
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
                            <TextField
                                {...register("passwordConfirm", { required: true })}
                                margin="normal"
                                required
                                fullWidth
                                name="passwordConfirm"
                                label="Confirm Password"
                                type="password"
                                id="confirm_password"
                                error={!!errors['passwordConfirm']}
                                helperText={
                                    errors['passwordConfirm'] ? errors['passwordConfirm'].message : ''
                                }
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox defaultChecked={false} />}
                                    label="I am a medic"
                                    {...register('isMedic')} />
                            </FormGroup>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        {"Sign In"}
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

export default RegisterPage;