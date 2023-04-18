import { Box, Grid, Typography, Avatar, Stack, Button, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
// import {
//     createChannel, describeChannel, listChannelMembershipsForAppInstanceUser, getAwsCredentialsFromCognito,
//     sendChannelMessage, listChannelMessages
// }
//     from "../../api/ChimeApi/ChimeApi";

// import appConfig from "../../Config";
//////////get the all users from congnito ///////////////////
// import { IdentityService } from '../../services/IdentityService.js';
import ContentModels from '../../pages/ContentModels';
import { useLocation } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';
import { useMutation } from 'react-query';
import { fetchAllChatSingleUserOrGroup, fetchMessagesV1, sendV1Message } 
from '../../api/InternalApi/OurDevApi';
import { getSender } from '../../utils/chatLogic';
import io from "socket.io-client";

import ListModal from '../Chat/ListModal';

const ENDPOINT = "https://devorganaise.com";
//"https://devorganaise.com/api"
//"http://13.57.89.208:8000"
//"http://localhost:8000"

var socket, selectedChatCompare;

const NewMessageGrid = ({ selectedChannel }) => {

    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const contentRef = useRef(null);
    const [isTyping, setisTyping] = useState(false);
    const [typing, setTyping] = useState(false);
    ////// socket connection state
    const [socketConnected, setSocketConnected] = useState(false);
    ////// use conetext use here
    const { user, setUser, selectChatV1, setSelectedChatV1, currentChats, setCurrentChats, chats, setChats } = ChatState();
    //////////// Store the userid of user ////////
    const [UserId, setUserId] = useState("");
    ////////// Create and store Identity service //////
    // const [IdentityServiceObject] = useState(
    //     () => new IdentityService(appConfig.region, appConfig.cognitoUserPoolId)
    // );

    useEffect(() => {
        setActiveChannel(selectedChannel);
    }, [selectedChannel])



    ///////// UseEffect for socket io
    useEffect(() => {
        //////// Here we are check the login user status
        socket = io(`${ENDPOINT}`, {
            debug: true
        });
        socket.on("connect_error", (err) => {
            console.error("Connection error:", err);
        });

        socket.on("connect_timeout", (timeout) => {
            console.error("Connection timeout:", timeout);
        });
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setisTyping(true));
        socket.on("stop typing", () => setisTyping(false));
    }, []);





    //////////When this page render then user_id store , nad channel list also load
    // useEffect(() => {
    //     getAwsCredentialsFromCognito();
    //     IdentityServiceObject.setupClient();
    //     let getLoginUserName = localStorage.getItem(`CognitoIdentityServiceProvider.${appConfig.cognitoAppClientId}.LastAuthUser`);
    //     let selectUserData = localStorage.getItem(`CognitoIdentityServiceProvider.${appConfig.cognitoAppClientId}.${getLoginUserName}.userData`);
    //     let userid = (JSON.parse(selectUserData).UserAttributes.find((d) => d.Name === "profile")).Value;
    //     setUserId(userid)
    //     setMember({ username: getLoginUserName, userId: userid });
    // }, [])

    /////////when user click on the channel/////////////
    //////// Here we are store the active channel //////
    const [ActiveChannel, setActiveChannel] = useState({});
    //////// All messges of channel  store here //////////////
    const [AllMessagesChannel, setAllMessgesOfChannel] = useState([]);
    const [messageInterval, setmessageInterval] = useState(null);

    /////////// Get the channel messaages///////
    // const GetMessagesListOnEverySec = (ActiveChannel, user_id) => {
    //     listChannelMessages(ActiveChannel.ChannelArn, user_id, undefined, null).then((md) => {
    //         setAllMessgesOfChannel(md.Messages)
    //     }).catch((error) => {
    //         console.log("error", error);
    //     })
    // }

    // useEffect(() => {
    //     console.log("messageInterval val", messageInterval)
    //     if ((Object.keys(ActiveChannel).length > 0) && (location.pathname === "/")) {/////Here we are check object is empty or not
    //         clearInterval(messageInterval);
    //         setAllMessgesOfChannel([]);
    //         setmessageInterval(setInterval(() => {
    //             GetMessagesListOnEverySec(ActiveChannel, UserId);
    //         }, [3000]))
    //         console.log("messageInterval", messageInterval);
    //     } else {
    //         clearInterval(messageInterval);
    //     }
    // }, [ActiveChannel, location])


    const cssStyle = {
        firstBoxMessage: { height: "80vh", backgroundColor: "#ffffff", marginTop: "0px" },
        groupNameBox: {
            position: "sticky", top: "65px", width: "100%", height: "50px", zIndex: "100",
            background: " #FFFFFF", boxSizing: "border-box", 
            borderBottom: "1px solid #F1F1F1"
        },
        avatarCss: { width: "25px", height: "25px" },
        listofPeopeBtn: { paddingLeft: "10px", paddingRight: "10px", fontSize: "10px" },
        timeRecMess: { fontSize: "10px", lineHeight: "25px", paddingLeft: "5px" },
        recRealMess: {
            paddingRight: "30px", paddingLeft: "10px", paddingTop: "10px", paddingBottom: "10px",
            fontSize: "14px", lineHeight: "15px",  color: "#323232", background: " #F8F8F8", borderRadius: "0px 10px 10px 10px"
        },
        sendRealMess: {
            paddingRight: "10px", paddingLeft: "10px", paddingTop: "10px", paddingBottom: "10px",
            fontSize: "14px", lineHeight: "15px",background: " #ECF4FF", color: "#323232", borderRadius: "10px 0px 10px 10px",
        },
        sendMessInput: {
            "& input": {
                fontSize: "13px !important"
            },
            "& fieldset": {
                borderRadius: "50px",
            }
        },
        sendMessIcon: {
            position: "absolute", right: "5px", top: "4px", fontSize: "28px", backgroundColor: "#333333", borderRadius: "25px", padding: "5px", color: "#fff", cursor: "pointer"
        },
        messageBoxCon: {
            backgroundColor: "#ffffff",
            height: "75vh", width: "100%", position: "absolute", overflowY: "auto",
            '&::-webkit-scrollbar': {
                width: '0px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
            },
        }
    }

    ///// Model Open function like create channel
    //////new model  open when click on the left side bar options and some others options like add folder and add teammate and so more
    const [openNewModel, setOpenNewModel] = useState(false);
    const [show, setShow] = useState(false);
    const [NewModelOpen, setNewModelOpen] = useState(false);
    const [activeModel, setActiveModel] = useState("")
    const modelOpens = () => {
        setOpenNewModel(true);/////this change the state in this page and then model show
        setShow(true);/////active model in diffrent page
        setActiveModel("AddTeamMate");/////// which type of model active
        setNewModelOpen(true);////// Real dilog box open
    }


    ////////////// When user type  the message then store the value here
    const [newMessage, setNewMessage] = useState("");
    ////////// login member data///////
    const [member, setMember] = useState({
        username: '',
        userId: '',
    });

    const setNewMessaageFun = (event) => {
        setNewMessage(event.target.value);

        /////// three dot show when typing start
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectChatV1._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectChatV1._id);
                setTyping(false);
                setisTyping(false);
            }
        }, timerLength)

    }

    ////////// Send message here //////
    // const sendMessageByUser = async (ActiveChannel, sendingMessgeHere, member) => {
    //     await sendChannelMessage(ActiveChannel.ChannelArn, sendingMessgeHere, "PERSISTENT", "STANDARD", member, undefined, null)
    //         .then((messData) => {
    //             listChannelMessages(ActiveChannel.ChannelArn, UserId, undefined, null).then((md) => {
    //                 setNewMessage("");
    //                 setAllMessgesOfChannel(md.Messages);
    //             }).catch((error) => {
    //                 console.log("error", error);
    //             })
    //         }).catch((error) => {
    //             console.log("message Sending error", error)
    //         })

    // }

    ////////// send message in new version //////
    const { mutateAsync: sendingMessageV1 } = useMutation(sendV1Message);
    const sendMessagev1 = async (message) => {
        socket.emit("stop typing", selectChatV1._id)
        try {
            const sendingMessData = {
                content: message,
                chatId: selectChatV1._id
            }
            setNewMessage("");
            const response = await sendingMessageV1(sendingMessData);
            setCurrentChats([...currentChats, response])

            //setMessages([...messages, response]);
            //fetchAllMessV1(selectChatV1._id);
            socket.emit("new message", response);

        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        socket.on("message recived", (newMessageRecived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecived.chat._id) {
                //give notification
            } else {
                console.log("send message and recove message test", [...currentChats, newMessageRecived]);
                setCurrentChats([...currentChats, newMessageRecived]);
                //setMessages([...messages, newMessageRecived]);

            }
        })
    })


    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (newMessage !== "") {
                //sendMessageByUser(ActiveChannel, newMessage, member)
                sendMessagev1(newMessage);
            }
            // setCurrentChats

        }
    };

    const clickSendMessButton = () => {
        if (newMessage !== "") {
            sendMessagev1(newMessage);
        }
    }


    /////////////// fetch message of chats in  new version /////////////
    const { mutateAsync: fetchingAllMess } = useMutation(fetchMessagesV1);
    const fetchAllMessV1 = async (chatId) => {
        try {
            const response = await fetchingAllMess({ chatId });
            setCurrentChats(response)
            socket.emit("join chat", chatId)
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        if (AllMessagesChannel.length !== 0) {
            console.log(AllMessagesChannel);
        }
    }, [AllMessagesChannel])


    /////////////////////// Here we are create new state for new Version  Apis ////////////////
    const [MyActiveChat, setMyActiveChat] = useState({});

    useEffect(() => {
        if (selectChatV1?._id) {
            setMyActiveChat(selectChatV1)
            setCurrentChats([]);
            fetchAllMessV1(selectChatV1._id)
            selectedChatCompare = selectChatV1;
        }
    }, [selectChatV1._id])

    /////// sccrollbard automatic movein bottom place
    useEffect(() => {
        const contentElement = contentRef.current;
        if (contentElement) {
            contentElement.scrollTop = contentElement.scrollHeight;
        }

    }, [currentChats])






    return (
        <>
            <Box container py="13px" px={"25px"} boxSizing={"border-box"} sx={cssStyle.groupNameBox} display="flex" justifyContent={"space-between"} >
                {
                    //Object.keys(ActiveChannel).length > 3 &&
                    //Object.keys(MyActiveChat).lenght > 0 &&
                    <>
                        <Box display={"flex"}>
                            <Typography fontWeight={"600"}
                                variant="subtitle2">
                                {/* {ActiveChannel.Name.charAt(0).toUpperCase() + ActiveChannel.Name.slice(1)} */}
                                {Object.keys(MyActiveChat).length > 0 &&
                                    (!MyActiveChat.isGroupChat ? getSender(user, MyActiveChat?.users) : (MyActiveChat.chatName))
                                }
                            </Typography>
                            <Stack ml={1} direction="row" spacing={-.25}>
                                <Avatar sx={cssStyle.avatarCss} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                                <Avatar sx={cssStyle.avatarCss} alt="Travis Howard" src="https://mui.com/static/images/avatar/2.jpg" />
                                <Avatar sx={cssStyle.avatarCss} alt="Cindy Baker" src="https://mui.com/static/images/avatar/3.jpg" />
                            </Stack>
                        </Box>


                       {
                        (selectChatV1?.isGroupChat==='true'||selectChatV1?.isGroupChat===true)&&<Box display={'flex'} alignItems={'center'} >
                        <Button
                            sx={{ ...cssStyle.listofPeopeBtn, marginRight: "10px" }}
                            variant="outlined"
                            size="small"
                            onClick={() => modelOpens()}>
                            Add Member
                        </Button>
                        {/* <Button sx={cssStyle.listofPeopeBtn} variant="contained" size="small">
                            List Of People
                        </Button> */}
                        <ListModal buttonStyle={cssStyle.listofPeopeBtn} addMemberFunction={modelOpens}/>
                    </Box>
                       } 
                    </>
                }

            </Box>
            <Box container position={'relative'} id="NewMessageBox" sx={cssStyle.firstBoxMessage}>
                <Box
                    container
                    position={'absolute'}
                    sx={cssStyle.messageBoxCon}
                    pt={"40px"}
                    pb={"30px"}
                    mt={"0px"}
                    px={"20px"}
                    ref={contentRef}
                >
                    {
                        /* 
                        {AllMessagesChannel.length !== 0 &&
                            AllMessagesChannel.map((mes) => {
                                if (mes.Sender.Name !== member.username) {
                                    return <Grid id="rec_mess_con_grid" sx={{
                                        marginTop: "0px", width: "100%", marginLeft: "0px",
                                        boxSizing: "borderBox",
                                    }} container spacing={5}>
                                        <Grid id="reciver_mess_grid" sx={{ paddingTop: "10px !important", paddingLeft: "0px !important" }} item xs={12} md={6}>
                                            <Box container display={'flex'} mb={1} py={0.5}>
                                                <Box id="mess_user_pic_box">
                                                    <Stack ml={1} direction="row">
                                                        <Avatar
                                                            sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }}
                                                            alt="Remy Sharp"
                                                            src="https://mui.com/static/images/avatar/1.jpg" />
                                                    </Stack>
                                                </Box>
                                                <Box ml={1}>
                                                    <Grid container>
                                                        <Grid container item>
                                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>
                                                                {mes.Sender.Name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >10:30 AM</Typography>
                                                        </Grid>
                                                        <Grid container item boxSizing={"border-box"} mr="16px" >
                                                            <Typography variant="body2" sx={cssStyle.recRealMess} >
                                                                {mes.Content}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid id="empty_reciver_mess_grid" item display={{ xs: "none", md: "block" }} xs={12} md={6}>
                                        </Grid>
                                    </Grid>
                                } else {
                                    return <Grid id="send_mess_con_grid" container spacing={5}>
                                        <Grid item id="empty_sender_mess_grid" display={{ xs: "none", md: "block" }} xs={12} md={6}>
                                        </Grid>
                                        <Grid item id="sender_mess_grid" xs={12} md={6}>
                                            <Box container display={'flex'} flexDirection="row-reverse" mb={1} py={0.5}>
                                                <Box id="mess_user_pic_box_send">
                                                    <Stack ml={1} direction="row">
                                                        <Avatar sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                                                    </Stack>
                                                </Box>
                                                <Box ml={1}>
                                                    <Grid container>
                                                        <Grid container item display={"flex"} justifyContent="flex-end">
                                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>
                                                                {mes.Sender.Name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >10:30 AM</Typography>
                                                        </Grid>
                                                        <Grid container item boxSizing={"border-box"} mr="16px" display={"flex"} justifyContent="end">
                                                            <Typography variant="body2" sx={{ ...cssStyle.sendRealMess, width: "auto", textAlign: "right" }} >
                                                                {mes.Content}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                }
                            })} 
                            
                            */
                    }

                    {(currentChats.length > 0&&selectChatV1) &&
                        <>
                            {currentChats?.map((mes, index) => {
                                if (mes?.sender?._id === selectChatV1?.users[0]?._id&&selectChatV1.isGroupChat!==true) {
                                    return <Grid
                                        id="rec_mess_con_grid"
                                        sx={{
                                            marginTop: "0px", width: "100%", marginLeft: "0px",
                                            boxSizing: "borderBox"
                                        }}
                                        container
                                        spacing={5}
                                        key={`message_left_revicer_${index}`}
                                    >
                                        <Grid id="reciver_mess_grid"
                                            sx={{ paddingTop: "10px !important", paddingLeft: "0px !important" }}
                                            item xs={12} md={6}
                                        >
                                            <Box container display={'flex'} mb={1} py={0.5}>
                                                <Box id="mess_user_pic_box">
                                                    <Stack ml={1} direction="row">
                                                        <Avatar
                                                            sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }}
                                                            alt="Remy Sharp"
                                                            src="https://mui.com/static/images/avatar/1.jpg" />
                                                    </Stack>
                                                </Box>
                                                <Box ml={1}>
                                                    <Grid container>
                                                        <Grid container item>
                                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>
                                                                {mes.sender.name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >10:30 AM</Typography>
                                                        </Grid>
                                                        <Grid container item boxSizing={"border-box"} mr="16px" >
                                                            <Typography variant="body2" sx={cssStyle.recRealMess} >
                                                                {mes.content}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid id="empty_reciver_mess_grid" item display={{ xs: "none", md: "block" }} xs={12} md={6}>
                                        </Grid>
                                    </Grid>
                                } else {
                                    return <Grid
                                        id="send_mess_con_grid"
                                        container
                                        spacing={5}
                                        key={`mess_sender_${index}`}

                                    >
                                        <Grid item id="empty_sender_mess_grid" display={{ xs: "none", md: "block" }} xs={12} md={6}>
                                        </Grid>
                                        <Grid item id="sender_mess_grid" xs={12} md={6}>
                                            <Box container display={'flex'} flexDirection="row-reverse" mb={1} py={0.5}>
                                                <Box id="mess_user_pic_box_send">
                                                    <Stack ml={1} direction="row">
                                                        <Avatar sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                                                    </Stack>
                                                </Box>
                                                <Box ml={1}>
                                                    <Grid container>
                                                        <Grid container item display={"flex"} justifyContent="flex-end">
                                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>
                                                                {mes.sender.name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >10:30 AM</Typography>
                                                        </Grid>
                                                        <Grid container item boxSizing={"border-box"} mr="16px" display={"flex"} justifyContent="end">
                                                            <Typography variant="body2" sx={{ ...cssStyle.sendRealMess, width: "auto", textAlign: "right" }} >
                                                                {mes.content}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                }
                            })}
                        </>}

                </Box>
                <Box position={'absolute'} sx={{ width: "100%", bottom: "3%", backgroundColor: "#ffffff" }} py={"10px"} container px={"25px"}>
                    {isTyping ? <Box sx={{ fontSize: "15px", marginLeft: "10px" }}>Typing...</Box> : <Box></Box>}
                    <Box container
                        sx={{
                            width: '100%',
                            position: 'relative'
                        }}
                    >
                        <TextField
                            size='small'
                            sx={{ ...cssStyle.sendMessInput, position: "absolute" }}
                            fullWidth
                            placeholder='Type a message'
                            id="messageInput"
                            value={newMessage}
                            onChange={(e) => setNewMessaageFun(e)}
                            onKeyPress={handleEnterKeyPress}

                        />
                        <AttachFileIcon sx={{ ...cssStyle.sendMessIcon, right: "35px", backgroundColor: "#fff", color: "#333" }} />
                        <SendIcon onClick={() => clickSendMessButton()} sx={cssStyle.sendMessIcon} />
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
                    ActiveChannel={ActiveChannel}
                />
            }

        </>

    )
}

export default NewMessageGrid