import {
    Box, Grid, Typography, TextField,
    Button, IconButton, InputAdornment
} from '@mui/material'

import CircularProgress from '@mui/material/CircularProgress';
import React, { useState, useEffect } from 'react'
import organaiseLogo from "../../assets/Logo/organaise-logo.png";
import { useSelector } from 'react-redux';
import loginPageBackgroundImg from "../../assets/BackgroundImages/loginBackGroundImg.png"
import forgetPassPageBGImg from "../../assets/BackgroundImages/forgetPasswordBgImg.png"
import signupPageBgImg from "../../assets/BackgroundImages/signupBackgroundImg.png"
import otpVerificationBgImg from "../../assets/BackgroundImages/otpVerificationBgImg.png"
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import OtpField from 'react-otp-field';
import { toast } from 'react-toastify';
/////Import react query functions
import { useMutation } from 'react-query'
// import {
//     userSignIn, resendConfermationEMail,
//     CognitoSignUp, SignUpOtpVarify,
//     otpWithResetPassword, resetPasswordFun
// } from "../../api/CognitoApi/CognitoApi";
import { passwordValidator } from '../../utils/validation';
import { userCreateAccount } from '../../api/InternalApi/OurDevApi';
import { ServiceState } from '../../Context/ServiceProvider';


const cssStyle = {
    parent_box: {
        width: "100%",
        maxWidth: "1200px",
        height: "100vh"
    },
    content_container_box: {
        backgroundColor: "#ffffff",
        // padding: "10% 20%",
        padding: "10% 20%",
        minHeight: "500px",
        maxHeight: "100vh"
    },
    box_container_form: {
        margin: "20% 0%",
    },
    btn_textfield: {
        width: "100%",
        marginBottom: "3px",
        '& .MuiInputLabel-root': {
            color: '#1c529b', // default label color
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'primary' // default border color
            },
            '&:hover fieldset': {
                borderColor: 'primary' // border color on hover
            },
            '&.Mui-focused fieldset ': {
                borderColor: 'primary' // border color when focused
            },

        }
    },
    grid_textBox_button: {
        margin: "4px 0px"
    },
}

export const SignupPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);
    const { contextEmail, setSeviceType, setContextEmail, setContextPassword, setContextName } = ServiceState();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const emailRedux = useSelector((state) => state.CreateAccountUserData.email)
    const { mutateAsync: userPostApiFun, isLoading: userPostApiIsLoading } = useMutation(userCreateAccount);

    const createAccount = async () => {
        const userDataObj = {
            "email": emailAddress,
            "password": password,
            "given_name": firstName,
            "family_name": lastName,
        }


        try {

            const signUpCallApi = await userPostApiFun({ ...userDataObj });
            if (signUpCallApi.status == true) {
                toast.info("Please check your inbox");
                setSeviceType('createAccount')
                setContextEmail(emailAddress);
                setContextPassword(password)
                setContextName(`${firstName} ${lastName}`)
                navigate("/otpVerf")
            } else {
                console.log("enter into else")
                toast.error(signUpCallApi?.response?.message);
            }

        } catch (error) {

            toast.error(error?.response?.message || "Something is wrong");
        }
    };

    const buttonAction = () => {
        // if (firstName === "" || lastName === "" || emailAddress === "" || password === "" || confirmPassword === "" || phoneNumber === "") {
        if (firstName === "" || emailAddress === "" || password === "" || confirmPassword === "") {
            toast.error("Please fill all fields.")
            return null;
        }
        if (password !== confirmPassword) {
            toast.error("Password and confirm password not matched.")
            return null;
        }
        if (!passwordValidator(password) || !passwordValidator(confirmPassword)) {
            return null;
        }
        createAccount();
    }


    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfPassword = () => {
        setShowConfPass(!showConfPass);
    }

    useEffect(() => {
        if (emailRedux !== "") {
            console.log(emailRedux, "get in signup")
            setEmailAddress(emailRedux)
        }
    }, [emailRedux])

    return (
        <Box container   >
            <Grid container padding={{ xs: 1, sm: 5 }}>
                <Grid item xs={12} >
                    <Box container display={{xs:'start',sm:'flex'}} >
                        <Grid item xs={6} sm={10} paddingLeft={{ xs: 2, sm: 2, md: 6 }}>
                            <img
                                src={organaiseLogo}
                                style={{ width: "150px" }}
                                alt="organaise-logo-login-page" />
                        </Grid>
                        <Grid item xs={12} sm={9} md={8} display='flex' justifyContent={{xs:'center',sm:'start'}}  >
                            <Typography variant="h4" fontSize={{xs:'26px',sm:'33px', md:'40px'}} fontWeight='600' color="#333333" marginY={{xs:2,sm:0}}>
                                Create Account
                            </Typography>
                        </Grid>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={12} md={12} display={'flex'} justifyContent={'center'} >
                    <Grid container xs={12} display='flex' >
                        {/* <Box display='flex' gap={2} > */}
                        <Grid item xs={12} sm={6} paddingBottom={2}  >
                            <Box paddingLeft={4} display='flex' justifyContent='center'>
                                <img src={signupPageBgImg} style={{ width: "70%" }} alt="signUp-page-background-image" />
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} display='flex' justifyContent='center' >
                            <Grid item xs={11} sm={10} md={9} >
                                <Box display='flex' gap={1}>

                                    <TextField
                                        id="signup-name-user"
                                        label="First Name"
                                        variant='outlined'
                                        type="text"
                                        sx={cssStyle.btn_textfield}

                                        value={firstName ? firstName : ""}
                                        onChange={(e) => setFirstName(e?.target?.value)}
                                    />
                                    <TextField
                                        id="signup-name-user"
                                        label="Last Name"
                                        variant='outlined'
                                        type="text"
                                        sx={cssStyle.btn_textfield}
                                        value={lastName ? lastName : ""}
                                        onChange={(e) => setLastName(e?.target?.value)}
                                    />
                                </Box>
                                {/* </Box> */}

                                <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                    {/* <TextField
                                    id="login-signup-forgetPassword-email"
                                    label="Phone Number"
                                    variant='outlined'
                                    type="number"
                                    sx={cssStyle.btn_textfield}
                                    value={phoneNumber ? phoneNumber : ""}
                                    onChange={(e) => setPhoneNumber(e?.target?.value)}
                                /> */}
                                </Grid>
                                <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                    <TextField
                                        id="login-signup-forgetPassword-email"
                                        label="Email"
                                        variant='outlined'
                                        type="email"
                                        sx={cssStyle.btn_textfield}
                                        value={emailAddress ? emailAddress : ""}
                                        onChange={(e) => setEmailAddress(e?.target?.value)}
                                    />
                                </Grid>


                                <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                    <TextField
                                        id="login-signup-forgetPassword-password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        variant='outlined'
                                        sx={cssStyle.btn_textfield}
                                        value={password ? password : ""}
                                        onChange={(e) => setPassword(e?.target?.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end"
                                                    sx={{
                                                        display: password !== "" ? "contents" : "none"
                                                    }}
                                                >
                                                    {password.length > 2
                                                        ?
                                                        <IconButton onClick={handleTogglePassword}>
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                        : null
                                                    }
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                </Grid>


                                <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                    <TextField
                                        id="login-signup-forgetPassword-confirm-password"
                                        label="Confirm Password"
                                        type={showConfPass ? 'text' : 'password'}
                                        variant='outlined'
                                        sx={cssStyle.btn_textfield}
                                        value={confirmPassword ? confirmPassword : ""}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end"
                                                    sx={{
                                                        display: confirmPassword !== "" ? "contents" : "none"
                                                    }}

                                                >
                                                    {confirmPassword.length > 2
                                                        ?
                                                        <IconButton onClick={handleToggleConfPassword}>
                                                            {showConfPass ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                        : null
                                                    }
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sx={cssStyle.grid_textBox_button}>

                                    <Typography variant="subtitle2" align='center'>
                                        You have already Account so <Link to="/login">
                                            Click Here
                                        </Link>
                                    </Typography>

                                </Grid>

                                <Grid item xs={12} gap={2} paddingBottom={1}>
                                    <Typography fontWeight='bold' paddingBottom={1} >Password must have</Typography>
                                    <Typography as='li' color='red'>At least 8 characters </Typography>
                                    <Typography as='li' color='red'>At least 1 lestter (a,b,c...)</Typography>
                                    <Typography as='li' color='red'>At least 1 number (1,2,3...)</Typography>
                                    <Typography as='li' color='red'>Both uppercase & lowercase characters</Typography>
                                </Grid>

                                <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            ...cssStyle.btn_textfield,
                                            height: "50px", position: "relative",
                                            backgroundColor: "primary",
                                            '&:hover': {
                                                backgroundColor: '#1c529b'
                                                // background color on hover
                                            }
                                        }}
                                        // disabled={btnDisabed || isLoadingSignUpFun}
                                        disabled={userPostApiIsLoading}
                                        onClick={() => buttonAction()}

                                    >

                                        <CircularProgress
                                            size={24}
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: '3%',
                                                marginTop: -12,
                                                marginLeft: -12,
                                                color: "primary"
                                            }}
                                        />
                                        Create Account
                                    </Button>

                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                
            </Grid>
        </Box >
    )
}