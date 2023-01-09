import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, IconButton, InputLabel, MenuItem, Select, Typography } from '@mui/material';
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
import { object, preprocess, string, number } from 'zod';

const drugStockSchema = object({
    quantity: preprocess(
        (qty) => parseInt(string().parse(qty), 10),
        number()
            .min(1, 'Must provide at least one item of this type')
            .max(10_000, 'Cannot provide more items of a drug')
    ),
    price: preprocess(
        (p) => parseInt(string().parse(p), 10),
        number()
            .min(1, 'Price cannot be lower than 1$')
            .max(10_000, 'Exceeded maximum allowed price for an item')
    ),
    drugId: string()
});

const CreateDrugStockModal = ({ isOpen, handleClose, updateDrugStocksList, drugsList }) => {
    const [open, setOpen] = React.useState(false);
    const [drugType, setDrugType] = React.useState('');

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
        if (isOpen) {
            setDrugType('');
            reset();
        }
        setOpen(isOpen);
    }, [isOpen])


    const submitDrugStockUpdate = async (data) => {
        const res = await fetch(`${API_ROOT}/v1.0/DrugStocks/`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                typeId: data.drugId,
                quantity: data.quantity,
                pricePerItem: data.price
            })
        });

        if (res.ok) {
            let jsonData = await res.json();
            updateDrugStocksList(jsonData);
            handleClose();
            return;
        }
    }

    const processSubmit = (data) => {
        submitDrugStockUpdate(data);
    };

    const handleDrugTypeChange = (event) => {
        setDrugType(event.target.value);
    };


    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <span style={{ fontWeight: '600', marginRight: '2rem' }}>Create a new drug stock entry</span>
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
                    {drugsList.length > 0 ?
                        <Box component="form" noValidate onSubmit={handleSubmit(processSubmit)} sx={{ mt: 1 }}>
                            <TextField
                                {...register("quantity", { required: true })}
                                margin="quantity"
                                required
                                fullWidth
                                id="quantity"
                                label="Quantity"
                                name="quantity"
                                type="number"
                                autoFocus
                                error={!!errors['quantity']}
                                helperText={errors['quantity'] ? errors['quantity'].message : ''}
                                style={{ margin: '1rem 0' }}
                            />
                            <TextField
                                {...register("price", { required: true })}
                                margin="price"
                                required
                                fullWidth
                                id="price"
                                label="Price"
                                name="price"
                                type="number"
                                autoFocus
                                error={!!errors['price']}
                                helperText={errors['price'] ? errors['price'].message : ''}
                                style={{ margin: '1rem 0' }}
                            />
                            <FormControl fullWidth style={{ margin: '1rem 0' }}>
                                <InputLabel id="selectDrugTypeLabel">Drug</InputLabel>
                                <Select
                                    {...register("drugId", { required: true })}
                                    labelId="selectDrugTypeLabel"
                                    id="selectDrugType"
                                    value={drugType}
                                    label="Drug"
                                    onChange={handleDrugTypeChange}
                                >
                                    {drugsList.map(drug => {
                                        return (
                                            <MenuItem value={drug.id}>{drug.title}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Create
                            </Button>
                        </Box> :
                        <Box>
                            <Typography variant="h5" component="div" style={{ overflow: 'hidden', padding: '0.5rem' }} >
                                No drugs available
                            </Typography>
                            <Typography variant="h7" component="div" style={{ overflow: 'hidden', padding: '0.5rem' }} >
                                Add drugs to be able to create stock entries
                            </Typography>
                        </Box>}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CreateDrugStockModal;