import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import {Alert, Link, Snackbar} from "@mui/material";
import {useQuery} from "react-query";
import {logout} from "../api/usersApi";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import {useUserStore} from "../store";


const Navbar = () => {
    const currentUserId = useUserStore(state => state.userId)
    const currentAuthToken = useUserStore(state => state.authToken)
    const removeAuthToken = useUserStore((state) => state.removeAuthToken)
    const removeUserId = useUserStore((state) => state.removeUserId)
    const [axiosError, setAxiosError] = React.useState("")
    const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false)
    const [openLogoutSnackbar, setOpenLogoutSnackbar] = React.useState(false)
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const { refetch } = useQuery ('logout', () => logout(currentAuthToken), {enabled: false,
        onSuccess: () => {
            setOpenLogoutSnackbar(true)
        },
        onError: (error: AxiosError) => {
            setAxiosError("Please log in again: " + error.message)
            setOpenErrorSnackbar(true)
        },
        onSettled: () => {
            removeAuthToken()
            removeUserId()
        }})
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const Logo = () => {
        return <img width="90" src="/logo.png" alt="filmVerse logo"/>
    }

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLogOut = () => {
        handleMenuClose()
        void refetch()
    }

    const handleLogin = () => {
        handleMenuClose()
        navigate('/login')
    }

    const handleSignup = () => {
        handleMenuClose()
        navigate('/signup')
    }
    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false)
    };

    const handleCloseLogoutSnackbar = () => {
        setOpenLogoutSnackbar(false)
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            { currentUserId !== -1 && <MenuItem onClick={handleMenuClose}>Profile</MenuItem>}
            { currentUserId !== -1 && <MenuItem onClick={handleLogOut}>Log Out</MenuItem>}
            { currentUserId === -1  && <MenuItem onClick={handleLogin}>Log in</MenuItem>}
            { currentUserId === -1  && <MenuItem onClick={handleSignup}>Sign up</MenuItem>}

        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>

            <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={handleCloseErrorSnackbar} anchorOrigin={{ vertical:"bottom", horizontal:"left" }}>
                <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
                    {axiosError}
                </Alert>
            </Snackbar>

            <Snackbar open={openLogoutSnackbar} autoHideDuration={6000} onClose={handleCloseLogoutSnackbar} anchorOrigin={{ vertical:"bottom", horizontal:"left" }}>
                <Alert onClose={handleCloseLogoutSnackbar} severity="info" sx={{ width: '100%' }}>
                    Successfully logged out
                </Alert>
            </Snackbar>

            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link href="/films">
                        <Logo />
                    </Link>
                    <Typography
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        <Link
                            href="/films"
                            underline="none"
                            color="#FFFFFF"
                            variant="inherit">
                            FilmVerse
                        </Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>

    );
}

export default Navbar;