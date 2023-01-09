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
import { number, string, object, preprocess } from 'zod';
import CloseIcon from '@mui/icons-material/Close';
import { API_ROOT } from '../../env';

const drugStockSchema = object({
    supplyQuantity: preprocess(
        (qty) => parseInt(string().parse(qty), 10),
        number()
            .min(1, 'Must supply at least one item of this type')
            .max(10_000, 'Cannot supply more items in a single transaction')
    ),
    price: preprocess(
        (p) => parseInt(string().parse(p), 10),
        number()
            .min(1, 'Price cannot be lower than 1$')
            .max(10_000, 'Exceeded maximum allowed price for an item')
    )
});

const EditDrugStockModal = ({ isOpen, handleClose, drugStockId, drugName, updateDrugStockState }) => {
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
        const res = await fetch(`${API_ROOT}/v1.0/DrugStocks/${drugStockId}/`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                supplyQuantity: data.supplyQuantity,
                pricePerItem: data.price
            })
        });

        if (res.ok) {
            updateDrugStockState(drugStockId, data.supplyQuantity, data.price);
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
                    <span style={{ fontWeight: '600', marginRight: '2rem' }}>Edit stock status for {drugName}</span>
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
                            {...register("supplyQuantity", { required: true })}
                            margin="normal"
                            required
                            fullWidth
                            id="supplyQuantity"
                            label="Supply quantity"
                            name="supplyQuantity"
                            type="number"
                            autoFocus
                            error={!!errors['supplyQuantity']}
                            helperText={errors['supplyQuantity'] ? errors['supplyQuantity'].message : ''}
                        />
                        <TextField
                            {...register("price", { required: true })}
                            margin="normal"
                            required
                            fullWidth
                            id="editPrice"
                            label="Edit price per item"
                            name="price"
                            type="number"
                            autoFocus
                            error={!!errors['price']}
                            helperText={errors['price'] ? errors['price'].message : ''}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Submit
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default EditDrugStockModal;