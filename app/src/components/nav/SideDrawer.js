import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HistoryIcon from '@mui/icons-material/History';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';
import MedicationIcon from '@mui/icons-material/Medication';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { BACKGROUND_COLOR } from '../../env';
import { pageHasSideDrawer } from '../../util/DocumentUtil';
import { disconnectUser } from '../../util/JWTUtil';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: BACKGROUND_COLOR,
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    backgroundColor: BACKGROUND_COLOR,
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        })
    }),
);

const pathTitleMap = {
    '/me': 'My Profile',
    '/appointments': 'My Appointments',
    '/medical-history': 'My Medical History',
    '/drug-stocks': 'Drug Stocks',
    '/prescriptions': 'Prescriptions',
}

const commonDrawerItems = [
    { title: 'Profile', icon: <AccountBoxIcon />, href: '/me' },
    { title: 'Appointments', icon: <FactCheckIcon />, href: '/appointments' },
    { title: 'Medical history', icon: <HistoryIcon />, href: '/medical-history' }
]

const medicDrawerItems = [
    { title: 'Drug stocks', icon: <InventoryIcon />, href: '/drug-stocks' },
    { title: 'Prescriptions', icon: <MedicationIcon />, href: '/prescriptions' },
    { title: 'Logout', icon: <LogoutIcon style={{ color: 'red' }} />, onClick: () => { disconnectUser(); window.location.pathname = '/login'; } }
]

export default function SideDrawer(props) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [isEnabled, setIsEnabled] = React.useState(false);
    const [pageTitle, setPageTitle] = React.useState('');

    React.useEffect(() => {
        if (pageHasSideDrawer(props.currentPath)) {
            setIsEnabled(true);
            handlePageChange(props.currentPath);
        } else {
            setIsEnabled(false);
        }
    }, [props.currentPath])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handlePageChange = (path) => {
        setPageTitle(pathTitleMap[path])
    }

    return (
        <>
            {isEnabled ? <Box sx={{ display: 'flex' }} >
                <CssBaseline />
                <AppBar position="fixed" open={open} style={{
                    backgroundImage: 'url(/img/dog_paws_pattern.jpg)',
                    backgroundSize: '120%',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography id={pageTitle} variant="h6" noWrap component="div" style={{ fontWeight: '600', textShadow: '2px 2px 4px black' }}>
                            {pageTitle}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {commonDrawerItems.map((item) => (
                            <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                    href={item.href}
                                    onClick={item.onClick}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {medicDrawerItems.map((item) => (
                            <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                    href={item.href}
                                    onClick={item.onClick}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    {props.children}
                </Box>
            </Box> :
                <>{props.children}</>}
        </>
    );
}