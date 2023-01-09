import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Container } from '@mui/system';
import * as React from 'react';

const CancelAppointmentModal = ({ isOpen, handleClose, cancelAppointmentCallback }) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        setOpen(isOpen);
    }, [isOpen])

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <span style={{ fontWeight: '600', marginRight: '2rem' }}>Cancel appointment ?</span>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Container style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button variant="contained" style={{ margin: '0 auto 0 auto', border: '2px solid', color: 'red', backgroundColor: '#751919' }} onClick={cancelAppointmentCallback}>Cancel</Button>
                    </Container>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CancelAppointmentModal;