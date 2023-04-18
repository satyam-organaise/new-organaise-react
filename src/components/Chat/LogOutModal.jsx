import * as React from 'react';
import { IconButton,Box,Button,Typography,Modal,InputAdornment,OutlinedInput,Badge,Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 12,
  padding:'2rem 2rem',
  borderRadius:"6px"
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      // animation: 'ripple 1.2s infinite ease-in-out',
      // border: '1px solid currentColor',
      content: '""',
    },
  },
}));


const LogOut = ({handleLogout}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
      <div>
        <Button
        id="logout-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
        variant="text"
        size='small'
        sx={{ width: "100%", justifyContent: 'flex-start' }}
    >
        <LogoutIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
        <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
            Logout
        </span>
        </Button>

        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            
          <Box sx={{...style, width: {xs:'100%',sm:350,md:520}, }}>
          
       
            
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
            <Typography id="modal-modal-title" color={'black'} fontSize={'21px'}fontWeight={600} >
            Are you sure you want to Logout?
            </Typography>
            <Typography mt='1rem' width={'95%'} color='#777777' fontWeight={400} id="modal-modal-title" textAlign={'center'} fontSize={'16px'} lineHeight={'148.19%'}>
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </Typography>
            </Box>
     
            
            <Box mt='1.2rem' mb='.5rem' display={'flex'} justifyContent={'space-between'}>
            <Button variant="outlined" sx={{width:'48%',fontSize:'16px',textTransform:'capitalize',outline:'none !important' }} onClick={handleClose} >
                Cancel
            </Button>
            <Button variant="contained" sx={{width:'48%',fontSize:'16px',textTransform:'capitalize',outline:'none !important' }} onClick={handleLogout} >
                Log out
            </Button>
            </Box>
          
  
          
          </Box>
        </Modal>
      </div>
    );
}

export default LogOut