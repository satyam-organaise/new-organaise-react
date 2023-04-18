import React, { useCallback, useEffect, useState } from 'react'
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
    Box, Toolbar, List, ListItem, ListItemButton, ListItemIcon, InputBase,
    ListItemText, Grid, CssBaseline, Typography, Divider, IconButton, Tooltip, Avatar, Menu, MenuItem,
    Button, FormHelperText, FormControl, Select, LinearProgress, Paper, CardMedia
} from '@mui/material/';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import MuiDrawer from "@mui/material/Drawer"
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

import { useLocation, useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentModels from '../../pages/ContentModels';
// import {
//     createChannel, describeChannel, listChannelMembershipsForAppInstanceUser, getAwsCredentialsFromCognito,
//     sendChannelMessage, listChannelMessages
// }
//     from "../../api/ChimeApi/ChimeApi";
import appConfig from "../../Config";
//////////get the all users from congnito ///////////////////
// import { IdentityService } from '../../services/IdentityService.js';
import { useMutation } from 'react-query';
import { fetchAllChatSingleUserOrGroup, getCompanyName } from '../../api/InternalApi/OurDevApi';
import { toast } from 'react-toastify';
import BusinessIcon from '@mui/icons-material/Business';
import { ChatState } from '../../Context/ChatProvider';
import { getSender } from '../../utils/chatLogic';
import { BorderLeft } from '@mui/icons-material';
import oLogo from "../../assets/svg/oLogo.svg"
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import LogOutModal from '../Chat/LogOutModal';

const drawerWidth = '200px';

const openedMixin = (theme) => ({
    // width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration['20000'],
    }),  
    overflowX: 'hidden',
    borderLeft: '2px solid  rgba(0, 0, 0, 0.06)',
    [theme.breakpoints.up('xs')]: {
        marginLeft: '3rem',
        display:'none'
    },
    [theme.breakpoints.up('sm')]: {
        marginLeft: '3.8rem',
        display:'inherit',
        width:'160px'
    },
    [theme.breakpoints.up('md')]: {
        width: drawerWidth,
    },
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.complex,
    }),
    overflowX: 'hidden',
    // marginLeft: '5rem',
    width: `calc(${theme.spacing(3.2)} + 1px)`,
    [theme.breakpoints.up('xs')]: {
        width: `calc(${theme.spacing(3.2)} + 0px)`,
        display:'none'
    },
    [theme.breakpoints.up('sm')]: {
        marginLeft: '3rem',
        display:'inherit',
    },
    [theme.breakpoints.up('md')]: {
        marginLeft: '4rem',
    },
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
        }),
    }),
);

const styleCss = {
    appBarCss: {
        backgroundColor: "#ffffff !important",
        boxShadow: "none",
        borderBottom: "1px solid #efefef !important",
        height: "65px",
    }
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 1),
    color: "#333333",
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 1),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        fontSize: "14px",
        color: "#333333",
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));



const LeftSideBar = (props) => {

    ////// use conetext use here
    const { user, setSelectedChatV1, currentChats, setCurrentChats, chats, setChats, compNameContext, setCompNameContext } = ChatState();
    const theme = useTheme();
    const navegate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = React.useState(true);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
    const [activePage, setActivePage] = useState("HomePage");
    const [activeChatId, setActiveChatId] = useState("")

    const [showGroups,setShowGroups]=useState(true);
    const [showInbox,setShowInbox]=useState(true);

    //////new model  open when click on the left side bar options and some others options like add folder and add teammate and so more
    const [openNewModel, setOpenNewModel] = useState(false);
    const [show, setShow] = useState(false);
    const [NewModelOpen, setNewModelOpen] = useState(false);
    const [activeModel, setActiveModel] = useState("")


    //////////// Store the userid of user ////////
    const [UserId, setUserId] = useState("");
    const [subUserId, setSubUserId] = useState("");
    ////////// Create and store Identity service //////
    // const [IdentityServiceObject] = useState(
    //     () => new IdentityService(appConfig.region, appConfig.cognitoUserPoolId)
    // );
    //////////When this page render then user_id store , and channel list also load
    // useEffect(() => {
    //     getAwsCredentialsFromCognito();
    //     IdentityServiceObject.setupClient();
    //     let getLoginUserName = localStorage.getItem(`CognitoIdentityServiceProvider.${appConfig.cognitoAppClientId}.LastAuthUser`);
    //     let selectUserData = localStorage.getItem(`CognitoIdentityServiceProvider.${appConfig.cognitoAppClientId}.${getLoginUserName}.userData`);
    //     let userid = (JSON.parse(selectUserData).UserAttributes.find((d) => d.Name === "profile")).Value;
    //     let GetsubUserId = (JSON.parse(selectUserData).UserAttributes.find((d) => d.Name === "sub")).Value;
    //     setUserId(userid)
    //     setSubUserId(GetsubUserId);
    //     //setMember({ username: getLoginUserName, userId: userid });
    // }, [])

    useEffect(() => {
        if (props?.data?.pageName === "Folder") {
            setOpen(!open);
        }
    }, [props.data])


    //////// here we are call api to getting company name
    const [comNameSave, SetComName] = useState([]);
    const { mutateAsync: getComName, isLoading: GetComNameIsLoading } = useMutation(getCompanyName);

    const getComFun = async (subUserId = localStorage.getItem("userInfo")) => {
        try{
            const responseGetCom = await getComName(subUserId);
            if (responseGetCom.status!==404&&responseGetCom?.status === true) {
                SetComName(responseGetCom?.data[0]?.companyName)
                setCompNameContext(responseGetCom?.data[0]?.companyName)
            }  
        }catch(error)
        {
            toast.info("Company name is required");
            navegate("/companyDetail")
        }
    }
    useEffect(() => {
        if (compNameContext === "") {
            getComFun(subUserId);
        }
    }, [compNameContext])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (data = "") => {
        if (data === 'Account') {
            navegate("/account")
        }
        if (data === 'Dashboard') {
            navegate("/chat")
        }
        if (data === "Logout") {
            localStorage.clear();
            window.location = "/login";
        }
        setAnchorElUser(null);
    };

    const changePage = (indexVal) => {
        let pagesArray = ['dashboard', 'message', 'folder', 'data', 'privacy-policy', 'settings'];
        if (indexVal === 0) {
            navegate(`/`);
        } else {
            if (indexVal === 2) {
                setOpen(!open);
            }
            navegate(`/${pagesArray[indexVal]}`);
        }

    }

    ///// Show company Drop Down
    const [age, setAge] = React.useState(10);

    const handleChange = (event) => {
        setAge(event.target.value);
    };


    ////// Handle  Logout function
    const handleLogout = () => {
        localStorage.clear();
        window.location = "/login";
    }

    ///// navigate the page
    const navigatePage = (NavigateNewPage) => {
        navegate(`/${NavigateNewPage}`)
    }

    ///// Model Open function like create channel
    const modelOpens = () => {
        setOpenNewModel(true);/////this change the state in this page and then model show
        setShow(true);/////active model in diffrent page
        setActiveModel("CreateGroup");/////// which type of model active
        setNewModelOpen(true);////// Real dilog box open
    }

    const singleMessTeamMemberModel = () => {
        setOpenNewModel(true);/////this change the state in this page and then model show
        setShow(true);/////active model in diffrent page
        setActiveModel("SingleMemberChat");/////// which type of model active
        setNewModelOpen(true);////// Real dilog box open
    }



    /////////////////////////////////////////////////////
    /////////// Get the channel list and store  it //////
    //////// Here we are store a channel name list //////
    /////////////////////////////////////////////////////
    const [channelList, setChannelList] = useState([]);
    ///////  Here store channel interval
    const [ChannelInterval, setChannelInterval] = useState(null);
    // const channelListFunction = async (userid) => {
    //     const userChannelMemberships = await listChannelMembershipsForAppInstanceUser(
    //         userid
    //     );
    //     const userChannelList = userChannelMemberships.map(
    //         (channelMembership) => {
    //             const channelSummary = channelMembership.ChannelSummary;
    //             channelSummary.SubChannelId =
    //                 channelMembership.AppInstanceUserMembershipSummary.SubChannelId;
    //             return channelSummary;
    //         }
    //     );
    //     setChannelList(userChannelList);
    // }

    /////// run first time and get the channel list and store it

    // useEffect(() => {
    //     if ((UserId !== "") && (location.pathname === "/")) {
    //         clearInterval(ChannelInterval);
    //         setChannelList([]);
    //         setChannelInterval(setInterval(() => {
    //             channelListFunction(UserId);
    //         }, [3000]))
    //     } else {
    //         if (UserId !== "") {
    //             clearInterval(ChannelInterval);
    //             channelListFunction(UserId);
    //         }
    //     }
    // }, [UserId, location])

    //////// useLocation Check and update the state according to left sidebar options 
    useEffect(() => {
        if (location.pathname === "/chat") {
            setActivePage("groups");
        }

    }, [location])

    //when user in another page and want to acccess messaging part
    const InanotherPage = async (type, data) => {
        if (type === "1") {
            setSelectedChatV1(data);
            // props.data.setSelectedChannel(data);
            props.data.setMessagingActive(true);
        } else {
            if (location.pathname !== "/chat") {
                setActivePage("groups");
                navegate(`/chat`)
            }
        }
    }


    /////// get the chat of selected group or selected member v1
    const { mutateAsync: userGroupFetchChat } = useMutation(fetchAllChatSingleUserOrGroup);
    // const [loggedUser, setLoggedUser] = useState(null);
    const fetchChat = async () => {
        try {
            const response = await userGroupFetchChat();
            if (response) {
                setChats(response);
                // setLoggedUser(localStorage.getItem("userInfo"));
            }
        } catch (error) {
            console.log("NewMessageGrid", error.response);
        }
    }
    ////// If selected chat  value change then  this use effect run
    useEffect(() => {
        fetchChat();
        setSubUserId(localStorage.getItem("userInfo"))
    }, [])


    return (
        <>
            <Box id="main_container_box" sx={{ display: 'flex' }}>
                <CssBaseline />

                {
                <AppBar sx={styleCss.appBarCss} position="fixed" open={open}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box display={'flex'} width={drawerWidth&&drawerWidth} alignItems={'center'}>
            
                    <Box flex={0.2}>
                    <CardMedia
                    className='blog-img'
                    component="img"
                    image={oLogo}
                    alt="Image"
                    sx={{ height:'40px',width:'40px' }}
                    onClick={handleDrawerOpen}
                    />
                    </Box>
                   
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "500", fontSize:{base:'13px',sm:"15px",lg:'17px',xl:'22px'}, lineHeight: 2.75 ,color:'#646464',textTransform:"capitalize",flex:0.8,textAlign:'center'}}
                    color="primary">
                        {compNameContext || comNameSave?.length !== 0 && comNameSave}
                    </Typography>



                            </Box>

                            {/* <Box id="search_field_in_App_bar" pl='2rem'>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon sx={{ fontSize: "18px" }} />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            sx={{ border:'1px solid #BEBEBE'}}
                        />
                    </Search>
                </Box> */}

                            {/* <Box sx={{ flexGrow: 0, width: "60%" }} display="inline-flex"
                    justifyContent={props.data.pageName === "Data" ? 'space-between' : "end"}
                >
                    {props.data.pageName === "Data" &&
                        <Box id="file_upload_icon">
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#03CF80",
                                    color: "#ffffff",
                                    textTransform: "none"
                                }}
                                onClick={() => props.setOpen(true)}
                            >
                                Upload Data
                            </Button>
                        </Box>
                    }

                    <Box id="show_for_all_pages_menu_opt" display={"inline-flex"} justifyContent={'space-between'} alignItems={'center'}>
                        
                        <Box id="notification_icon" px='1rem' display={'flex'} alignItems={'center'} >
                            <NotificationsNoneOutlinedIcon
                                sx={{ width: "28px", height: "28px", fontSize: '30px', color: "#333", opacity: 0.5 }} />
                        </Box>
                        <Box id="profile_icon"  px='1rem'>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" sx={{ width: "30px", height: "30px" }} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={() => handleCloseUserMenu()}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Box>
                </Box> */}
                        </Toolbar>
                    </AppBar>
                }


                {/* New sidebar  */}
                <Box height={'100vh'} position={'fixed'} width={{xs:'60px',xl:'70px'}} display={{xs:'none',sm:'flex'}} flexDirection={'column'} overflow={'hidden'}>
                    

                    <Box borderBottom={'1px solid rgba(0, 0, 0, 0.06)'} height={'65px'} width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'} visibility={open ? "normal" : "hidden"}>
                        <CardMedia
                            className='blog-img'
                            component="img"
                            image={oLogo}
                            alt="Image"
                            sx={{ height: '40px', width: '40px' }}
                        />
                    </Box>



                    <Box bgcolor={'white'} height={'5rem'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                        <Button onClick={() => { navigatePage("chat") }} display='flex' flexDirection='column' sx={{
                            color: location.pathname.split(['/'])[1] === "chat" ? "#448DF0" : "#646464"
                        }}
                        >
                            <ChatTwoToneIcon fontSize='small' />
                        </Button>
                        <Typography sx={{ color: location.pathname.split(['/'])[1] === "chat" ? "#448DF0" : "#646464", fontSize: '14px' }}>Chat</Typography>
                    </Box>



                    <Box bgcolor={'white'} height={'5rem'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                        <Button onClick={() => { navigatePage("files/allFiles") }} display='flex' flexDirection='column' sx={{
                            color: location.pathname.split(['/'])[1] === "files" ? "#448DF0" : "#646464"
                        }}
                        >
                            <ArticleOutlinedIcon fontSize='small' />
                        </Button>
                        <Typography sx={{ color: location.pathname.split(['/'])[1] === "files" ? "#448DF0" : "#646464", fontSize: '14px' }}>Files</Typography>
                    </Box>

                    {/* <Box bgcolor={'white'} height={'5rem'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                        <Button onClick={()=>{navigatePage("account")}} display='flex' flexDirection='column' sx={{
                                color: location.pathname === "/account" ? "#448DF0" : "#646464"
                            }}
                        >
                            <AccountCircleOutlinedIcon fontSize='small'/>
                        </Button>
                            <Typography sx={{color: location.pathname.split(['/'])[1] === "account" ? "#448DF0" : "#646464",fontSize:'13px'}}>Account</Typography>
                    </Box> */}


                </Box>



                <Drawer
                    variant="permanent"
                    open={open}
                    position='relative'
                >   
                    <Box position={'absolute'} right={'0%'} bottom={'20%'} zIndex={50}>
                        {
                            open ? <ChevronLeftIcon sx={{ fontSize: "1.5rem", bgcolor: 'whitesmoke', boxShadow: '4px 0px 18px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(0, 0, 0, 0.4)', color: 'gray', borderRadius: "50%"  }} onClick={() => handleDrawerClose()} /> : (
                                <ChevronRightIcon sx={{ fontSize: "1.5rem", bgcolor: 'whitesmoke', boxShadow: '4px 0px 18px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(0, 0, 0, 0.4)', color: 'gray', borderRadius: "50%" }} onClick={handleDrawerOpen} />
                            )
                        }

                    </Box>

                    {/* <DrawerHeader >
                        <Grid
                            container
                            display="flex"
                            justifyContent="center"
                            sx={{ transform: "translateX(-18px)" }}
                          
                        >
                             {open &&
                                <IconButton onClick={handleDrawerClose} sx={{ padding: "12px" }}>
                                    {theme.direction === 'rtl' ?
                                    <ChevronRightIcon /> :
                                    // <ChevronLeftIcon />
                                    <MenuIcon />
                                }
                                </IconButton>
                            }

                            {open && <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "500", fontSize: "22px", lineHeight: 2.75 ,color:'#646464'}}
                                color="primary">Microsoft</Typography>
                            } 
                        </Grid>
                    </DrawerHeader> */}

                    <DrawerHeader />

                    {open && <Box>

                        {/* <Box display="flex" justifyContent="center" width={'100%'}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "500", fontSize: "22px", lineHeight: 2.75 ,color:'#646464'}}
                            color="primary">Microsoft
                        </Typography>
                            
                    </Box> */}
                        <Divider />

                        <FormControl sx={{ m: 1, minWidth: 120, paddingLeft: "15px", paddingRight: "15px", }}>
                            {/* <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    border: "1px solid #3333336e", width: "auto", borderRadius: "5px",
                                    padding: "10px", fontSize: "15px", fontWeight: "800",
                                    color: "#333333e8", backgroundColor: "#534d4d14", position: "relative"
                                }}
                            >
                                <BusinessIcon /><span style={{ position: "absolute", marginTop: "3px", marginLeft: "5px", textTransform: "capitalize" }}>{comNameSave.length !== 0 && comNameSave[0].companyName}</span>
                            </Typography>
                        </Box> */}
                            {/* <Select
                            value={age}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label', }}
                        >
                            <MenuItem value={10}>Microsoft</MenuItem>
                            <MenuItem value={20}>Google</MenuItem>
                        </Select> */}
                        </FormControl>

                        {
                            location.pathname.split(['/'])[1] === "chat" && (
                                <>
                                    <Box id="channel_box">
                                        <Box sx={{ paddingLeft: {sm:'10px',md:"25px"}, paddingRight: {sm:'10px',md:"25px"} }} onClick={()=>{setShowGroups(!showGroups)}}>
                                            <Button
                                                id="channel-create-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={() => { setActivePage("groups"); setActiveChatId(""); }}
                                                // onClick={() => navigatePage("")}
                                                variant={activePage === "groups" ? "contained" : "text"}
                                                size='small'
                                                sx={{
                                                    width: "100%", justifyContent: 'flex-start',
                                                    color: activePage === "groups" ? "#ffffff" : "#646464"
                                                }}
                                                endIcon={<KeyboardArrowDownIcon sx={{ position: "absolute", right: "10px", top: "8px" }} />}
                                            >
                                                <GroupAddIcon sx={{ fontSize: "20px", marginRight: "8px" }} />
                                                <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px", }}>
                                                    Groups
                                                </span>
                                            </Button>
                                        </Box>
                                        {showGroups&&<Box>
                                            <List sx={{ padding: "0px" }} >
                                                {/* <ListItem sx={{ paddingTop: "0px", paddingBottom: "0px", paddingLeft: "60px" }}>
                                    <ListItemText
                                        primary={`# General`}
                                        sx={{
                                            opacity: open ? 1 : 0, marginTop: "4px", marginBottom: "0px",
                                            "& span": { fontSize: "13px", color: "#5454D4", fontWeight: 500 }
                                        }}
                                    />
                                </ListItem>
                                <ListItem sx={{ paddingTop: "0px", paddingBottom: "0px", paddingLeft: "60px" }}>
                                    <ListItemText
                                        primary={`# Random`}
                                        sx={{
                                            opacity: open ? 1 : 0, marginTop: "4px",
                                            marginBottom: "0px", "& span": { fontSize: "13px", fontWeight: 500, color: "#333333b5" }
                                        }}
                                    />
                                </ListItem> */}

                                                {
                                                    //channelList.length !== 0 && channelList.map((d) =>
                                                    chats.length !== 0 && chats?.map((d, index) =>
                                                    
                                                        <ListItem
                                                            key={index}
                                                            sx={{ paddingTop: "2px", paddingBottom: "0px", paddingLeft: {sm:'25px',md:'40px',xl:"42px"}, cursor: "pointer" }}
                                                            // onClick={() =>
                                                            //     (location.pathname === "/chat" ? InanotherPage("1", d) : InanotherPage("2", d);setActiveChatId(d._id);setActivePage("groups");)
                                                            // }

                                                            onClick={() => { location.pathname === "/chat" ? InanotherPage("1", d) : InanotherPage("2", d); setActiveChatId(d?._id); setActivePage("groups") }
                                                            }
                                                        >
                                                           <ListItemText
                                                                primary={
                                                                    //    d.Name.charAt(0).toUpperCase() + d.Name.slice(1)
                                                                    Object.keys(d).length > 0 &&
                                                                    (d?.isGroupChat && (`# ${d?.chatName}`))
                                                                }
                                                                sx={{
                                                                    opacity: open ? 1 : 0, marginTop: "0px",
                                                                    marginBottom: "0px", "& span": { fontSize: "13px", fontWeight: activeChatId == d?._id ? 700 : 500, color: activeChatId == d?._id ? "#3976C9" : "#333333b5" }
                                                                }}
                                                            />
                                                        </ListItem>
                                                    )
                                                }
                                                <ListItem
                                                    sx={{
                                                        paddingTop: "0px", paddingBottom: "0px",
                                                        paddingLeft: {sm:'22px',md:'38px',xl:"42px"}, cursor: "pointer"
                                                    }}
                                                    onClick={() => modelOpens()}
                                                >
                                                    <AddBoxOutlinedIcon
                                                        sx={{
                                                            fontSize: "13px", marginTop: "0px", marginRight: "2px", color: "#333333b4",
                                                        }} />
                                                    <ListItemText
                                                        primary={`Create Group`}
                                                        sx={{
                                                            opacity: open ? 1 : 0,
                                                            marginTop: "3px", marginBottom: "0px",
                                                            "& span": { fontSize: "13px", fontWeight: 500, color: "#333333b5" }
                                                        }}
                                                    />
                                                </ListItem>
                                            </List>
                                        </Box>}
                                    </Box>



                                    <Box id="single_user_box">
                                        <Box sx={{marginTop:'.5rem' , paddingLeft:{sm:'10px',md:"25px"} , paddingRight:{sm:'10px',md:"25px" } }} onClick={()=>setShowInbox(!showInbox)}>
                                            <Button
                                                id="single-user-inbox-create-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={() => { setActivePage("inbox"); setActiveChatId(""); }}
                                                // onClick={() => {navigatePage(""),setActivePage("inbox")}}
                                                variant={activePage === "inbox" ? "contained" : "text"}
                                                size='small'
                                                sx={{
                                                    width: "100%", justifyContent: 'flex-start',
                                                    color: activePage === "inbox" ? "#ffffff" : "#646464"
                                                }}
                                                endIcon={<KeyboardArrowDownIcon sx={{ position: "absolute", right: "10px", top: "8px" }} />}
                                            >
                                                <GroupAddIcon sx={{ fontSize: "20px", marginRight: "8px" }} />
                                                <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px", }}>
                                                    Inbox
                                                </span>
                                            </Button>
                                        </Box>

                                        {showInbox&&<Box>
                                            <List sx={{ padding: "0px" }} >
                                                {chats.length !== 0 && chats.map((d, index) =>

                                                    <ListItem
                                                        key={index}
                                                        sx={{ paddingTop: "0px", paddingBottom: "0px", paddingLeft: {sm:'25px',md:"40px",xl:'42px'}, cursor: "pointer" }}
                                                        onClick={() => { location.pathname === "/chat" ? InanotherPage("1", d) : InanotherPage("2", d); setActiveChatId(d?._id); setActivePage("inbox") }
                                                        }
                                                    >
                                                        {
                                                            Object.keys(d).length > 0 && (
                                                                !d?.isGroupChat && <Avatar
                                                                    alt="Remy Sharp"
                                                                    src="https://images.pexels.com/photos/839633/pexels-photo-839633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                                                    sx={{ width: 12, height: 12, mr: '8px' }}
                                                                />
                                                            )

                                                        }

                                                        <ListItemText
                                                            primary={
                                                                Object.keys(d).length > 0 && 
                                                                ((!d?.isGroupChat && getSender(user, d.users)).length<11?(!d?.isGroupChat && getSender(user, d.users)):(!d?.isGroupChat && getSender(user, d.users).slice(0,10)+" .."))
                                                            }
                                                            sx={{
                                                                opacity: open ? 1 : 0, marginTop: "1px",
                                                                marginBottom: "0px", "& span": { fontSize: "13px", fontWeight: activeChatId == d?._id ? 700 : 500, color: activeChatId == d?._id ? "#3976C9" : "#333333b5" }
                                                            }}
                                                        />
                                                    </ListItem>
                                                )
                                                }
                                                <ListItem
                                                    sx={{
                                                        paddingTop: "0px", paddingBottom: "0px",
                                                        paddingLeft: {sm:'22px',md:'38px',xl:"42px"}, cursor: "pointer"
                                                    }}
                                                    onClick={() => singleMessTeamMemberModel()}
                                                >
                                                    <AddBoxOutlinedIcon
                                                        sx={{
                                                            fontSize: "13px", marginTop: "4px", marginRight: "2px", color: "#333333b4",
                                                        }} />
                                                    <ListItemText
                                                        primary={`Add Mamber`}
                                                        sx={{
                                                            opacity: open ? 1 : 0, marginTop: "4px",
                                                            marginBottom: "0px",
                                                            "& span": { fontSize: "13px", fontWeight: 500, color: "#333333b5" }
                                                        }}
                                                    />
                                                </ListItem>
                                            </List>
                                        </Box>}
                                    </Box>
                                </>
                            )
                        }


                    {
                        location.pathname.split(['/'])[1]=='files'&&(
                            <>
                            <Box id="all_files" mt={1}>
                                    <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                        <Button
                                            id="all_file_button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            // onClick={() => navigatePage("allFiles")}
                                            // onClick={() => {navigatePage("files/allFiles"),setActivePage("allFiles")}}
                                            onClick={() => navigatePage("files/allFiles")}
                                            variant={location.pathname === "/files/allFiles" ? "contained" : "text"}
                                            size='small'
                                            sx={{
                                                width: "100%", justifyContent: 'flex-start',
                                                color: location.pathname === "/files/allFiles" ? "#ffffff" : "#646464"
                                            }}
                                        >
                                            <TextSnippetIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
                                            <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
                                                All files
                                            </span>
                                        </Button>
                                    </Box>
                                </Box>
                                <Box id="Upload_file_box" mt={1}>
                                    <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                        <Button
                                            id="upload-file-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            // onClick={() => {navigatePage("files/upload"),setActivePage("upload")}}
                                            onClick={() => navigatePage("files/upload")}
                                            variant={location.pathname === "/files/upload"? "contained" : "text"}
                                            size='small'
                                            sx={{
                                                width: "100%", justifyContent: 'flex-start',
                                                color: location.pathname === "/files/upload" ? "#ffffff" : "#646464"
                                            }}
                                        >
                                            <CloudUploadOutlinedIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
                                            <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
                                                Upload Data
                                            </span>
                                        </Button>
                                    </Box>
                                 </Box>
                                
                                <Box id="create_folder_box" mt={1}>
                                    <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                        <Button
                                            id="create_folder-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            // onClick={() => navigatePage("create-folder")}
                                            // onClick={() => {navigatePage("files/create-folder"),setActivePage("createFolder")}}
                                            onClick={() => navigatePage("files/folder")}
                                            variant={location.pathname === ("/files/folder") ? "contained" : "text"}
                                            size='small'
                                            sx={{
                                                width: "100%", justifyContent: 'flex-start',
                                                color: location.pathname === "/files/folder" ? "#ffffff" : "#646464"
                                            }}
                                        >
                                            <FolderOutlinedIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
                                            <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
                                                All Folders
                                            </span>
                                        </Button>
                                    </Box>
                                </Box>

                                    {/* <Box id="my_account_box" mt={1}>
                                    <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                        <Button
                                            id="my-account-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={() => navigatePage("upload")}
                                            variant="contained"
                                            size='small'
                                            disabled={true}
                                            sx={{ width: "100%", justifyContent: 'flex-start' }}
                                        >
                                            <PersonIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
                                            <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
                                                My Account
                                            </span>
                                        </Button>
                                    </Box>
                                </Box>
                                <Box id="settings_box" mt={1}>
                                    <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                        <Button
                                            id="setting-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={() => navigatePage("upload")}
                                            variant="contained"
                                            size='small'
                                            disabled={true}
                                            sx={{ width: "100%", justifyContent: 'flex-start' }}
                                        >
                                            <SettingsOutlinedIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
                                            <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
                                                Settings
                                            </span>
                                        </Button>
                                    </Box>
                                </Box>
                                <Box id="StorageProgrssBar" mx={3.5} mt={2}>
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress variant="determinate" value={20} />
                                    </Box>
                                    <Box display={'flex'} justifyContent={"space-between"}>
                                        <Typography sx={{ fontSize: "10px", fontWeight: "600" }} variant="body2">0 MB</Typography>
                                        <Typography sx={{ fontSize: "10px", fontWeight: "600" }} variant="body2">1 GB</Typography>
                                    </Box>
                                </Box> */}
                                </>
                            )
                        }


                        <Box id="logout_box" sx={{ position: "absolute", bottom: "10px", width: "100%", borderTop: "1px solid #CFCFCF", paddingTop: {sm:'8px',md:"10px"},background:"white" }} mt={1}>
                            <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                {/* <Button
                                id="logout-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleLogout}
                                variant="text"
                                size='small'
                                sx={{ width: "100%", justifyContent: 'flex-start' }}
                            >
                                <LogoutIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
                                <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
                                    Logout
                                </span>
                            </Button> */}
                                <LogOutModal handleLogout={handleLogout} />
                            </Box>
                        </Box>

                        <List sx={{
                            paddingLeft: open ? "25px" : "5px",
                            paddingRight: open ? "25px" : "5px"
                        }}>
                            {/* ['Dashboard', 'Messaging', 'Folders', 'Data', 'Privacy Policy', 'Settings'] */}

                            {/* {['Dashboard', 'Messaging', 'Folders', 'Data'].map(
                        (text, index) => (
                            <ListItem key={text} disablePadding px="auto" sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 40,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                        paddingTop: "0px",
                                        paddingBottom: "0px",
                                        border: open && index === props.data.index ? "1px solid #5454D3" : "none",
                                        borderRadius: open ? "25px" : "10px",
                                        marginTop: "15px",
                                        backgroundColor: (open && index === props.data.index) ? "#5454D4" : index === props.data.index ? "#5454D4" : "#fff",
                                        color: (open && index === props.data.index) ? "#ffffff" : index === props.data.index ? "#ffffff" : "#333333",
                                        opacity: open && index !== props.data.index ? 0.7 : 1,
                                        "&:hover": {
                                            backgroundColor: (open && index === props.data.index) ? "#5454D4" : index === props.data.index ? "#5454D3" : "#fff",

                                        },
                                        boxShadow: open && index === props.data.index ? "0px 0px 10px 10px rgba(0, 0, 0, 0.15)" : "none",
                                    }}
                                    onClick={() => changePage(index)}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : 'auto',
                                            justifyContent: 'center',
                                            color: (open && index === props.data.index) ? "#ffffff" : index === props.data.index ? "#ffffff" : "#333333",

                                        }}
                                    >
                                        {index === 0 && <HomeOutlinedIcon sx={{ fontSize: "20px" }} />}
                                        {index === 1 && <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: "18px" }} />}
                                        {index === 2 && <FolderOutlinedIcon sx={{ fontSize: "18px" }} />}
                                        {index === 3 && <DescriptionOutlinedIcon sx={{ fontSize: "18px" }} />}
                                        {index === 4 && <HelpOutlineOutlinedIcon sx={{ fontSize: "18px" }} />}
                                        {index === 5 && <SettingsOutlinedIcon sx={{ fontSize: "18px" }} />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))} */}
                        </List>

                    </Box>}
                </Drawer>


                {/* <DrawerHeader /> */}
                <Box component="main" sx={{ flexGrow: 1, py: 3, px: 0 }}>
                    <Box mt={5.5}>
                        {
                            props.children
                        }
                    </Box>
                </Box>
            </Box>
            {openNewModel &&
                <ContentModels
                    activeModel={activeModel} //////  which type of model
                    show={show} //// boolen value of avtive  state model
                    NewModelOpen={NewModelOpen} ///// boolean value of dialog box open
                    setOpenNewModel={setOpenNewModel}
                    setShow={setShow}
                    setActiveModel={setActiveModel}
                    setNewModelOpen={setNewModelOpen}
                    InanotherPage={InanotherPage}
                />
            }
        </>
    )
}

export default LeftSideBar