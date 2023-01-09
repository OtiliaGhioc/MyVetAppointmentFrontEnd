import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import { API_ROOT } from '../../env';
import { object, string } from 'zod';

const prescriptionSchema = object({
    prescriptionDescr: string()
        .min(1, 'Prescription prescriptionDescr length cannot be less than 1')
        .max(256, 'Prescription prescriptionDescr length limit exceeded')
});

const CreatePrescriptionModal = ({ isOpen, handleClose, updatePrescriptionList }) => {
    const [open, setOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(prescriptionSchema)
    });

    React.useEffect(() => {
        if (typeof isOpen === 'undefined')
            return;
        if (isOpen)
            reset();
        setOpen(isOpen);
    }, [isOpen])

    const submitPrescriptionUpdate = async (data) => {
        const res = await fetch(`${API_ROOT}/v1.0/Prescriptions/`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: data.prescriptionDescr
            })
        });

        if (res.ok) {
            window.location.reload(true);
            handleClose();
            return;
        }
    }

    const processSubmit = (data) => {
        submitPrescriptionUpdate(data);
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <span style={{ fontWeight: '600', marginRight: '2rem' }}>Create a new prescription entry</span>
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
                    <Box component="form" noValidate onSubmit={handleSubmit(processSubmit)} sx={{ mt: 1 }}>
                        <TextField
                            {...register("prescriptionDescr", { required: true })}
                            margin="normal"
                            required
                            fullWidth
                            id="prescriptionDescr"
                            label="Prescription Description"
                            name="prescriptionDescr"
                            autoFocus
                            error={!!errors['prescriptionDescr']}
                            helperText={errors['prescriptionDescr'] ? errors['prescriptionDescr'].message : ''}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CreatePrescriptionModal;