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

const drugStockSchema = object({
    drugName: string()
        .min(1, 'Drug drugName length cannot be less than 1')
        .max(64, 'Drug drugName length limit exceeded')
});

const CreateDrugModal = ({ isOpen, handleClose, updateDrugsList }) => {
    const [open, setOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(drugStockSchema)
    });

    React.useEffect(() => {
        if (typeof isOpen === 'undefined')
            return;
        if (isOpen)
            reset();
        setOpen(isOpen);
    }, [isOpen])

    const submitDrugStockUpdate = async (data) => {
        const res = await fetch(`${API_ROOT}/v1.0/Drugs/`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: data.drugName
            })
        });

        if (res.ok) {
            let jsonData = await res.json();
            updateDrugsList(jsonData);
            handleClose();
            return;
        }
    }

    const processSubmit = (data) => {
        submitDrugStockUpdate(data);
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <span style={{ fontWeight: '600', marginRight: '2rem' }}>Create a new drug entry</span>
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
                            {...register("drugName", { required: true })}
                            margin="normal"
                            required
                            fullWidth
                            id="drugName"
                            label="Drug Name"
                            name="drugName"
                            autoFocus
                            error={!!errors['drugName']}
                            helperText={errors['drugName'] ? errors['drugName'].message : ''}
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

export default CreateDrugModal;