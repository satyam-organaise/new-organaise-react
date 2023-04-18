import * as React from 'react';
import { IconButton,Box,Button,Typography,Modal,InputAdornment,OutlinedInput,Badge,Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { fetchAllChatSingleUserOrGroup } from '../../api/InternalApi/OurDevApi';
import { ChatState } from '../../Context/ChatProvider';

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





const DeleteModal = ({handleDelete,value,pageName,closeParentModal,toggleDeleteModal,type,refetch}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { setSelectedChatV1, setChats } = ChatState();

    const fetchChat = async () => {
      try {
          const response = await fetchAllChatSingleUserOrGroup();
          if (response) {
              setChats(response);
              setSelectedChatV1(response)
              // setLoggedUser(localStorage.getItem("userInfo"));
          }
      } catch (error) {
          console.log("NewMessageGrid", error.response);
      }
    }

    return (
      <div>
        {/* <DeleteForeverIcon
            sx={{
                fontSize: "19px",
                cursor: "pointer",
                marginRight: "5px",
                color: "#e70f0fc2"
            }}
            onClick={handleOpen}
        />  */}
         {type=='list'?<CloseIcon  onClick={handleOpen} sx={{color:'red'}}/>
         :<Typography onClick={handleOpen} color={'red'}>Delete</Typography>}

        
        <Modal
          open={open}
          onClose={()=>{handleClose();closeParentModal()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            
          <Box sx={{...style, width: {xs:'90%',sm:350,md:520}, }}>
          
       
            
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
            {type=='list'?<Typography id="modal-modal-title" color={'black'} fontSize={'21px'}fontWeight={600} >
            Are you sure do you want to remove this user ?
            </Typography>:<Typography id="modal-modal-title" color={'black'} fontSize={'21px'}fontWeight={600} >
            Are you sure do you want to delete this {pageName==='folder'?"folder":"file"} ?
            </Typography>}
            <Typography mt='1rem' width={'95%'} color='#777777' fontWeight={400} id="modal-modal-title" textAlign={'center'} fontSize={'16px'} lineHeight={'148.19%'}>
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </Typography>
            </Box>
     
            
            <Box mt='1.2rem' mb='.5rem' display={'flex'} justifyContent={'space-between'}>
            <Button variant="outlined" sx={{width:'48%',fontSize:'16px',textTransform:'capitalize',outline:'none !important' }} onClick={()=>{handleClose();closeParentModal();}} >
                Cancel
            </Button>
            
         
           {type=='list'? <Button variant="contained" sx={{width:'48%',fontSize:'16px',textTransform:'capitalize',outline:'none !important' }} onClick={()=>{handleDelete();handleClose();}}>
            Remove
          </Button>:<Button variant="contained" sx={{width:'48%',fontSize:'16px',textTransform:'capitalize',outline:'none !important' }} onClick={()=>{handleDelete(value);handleClose();closeParentModal();}}>
            Delete
          </Button>}
            
            
            
            
            </Box>
          
  
          
          </Box>
        </Modal>
      </div>
    );
}

export default DeleteModal