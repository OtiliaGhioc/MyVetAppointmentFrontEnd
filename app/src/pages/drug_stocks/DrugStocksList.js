import Container from '@mui/material/Container';
import * as React from 'react';
import BaseDataTable from '../../components/data_table/BaseDataTable';


const createDrugStockRowEntry = (drugStockId, title, quantity, price, supplyDrugCallback) => {
    return {
        title,
        quantity,
        price: `${price}$`,
        button: {
            isButton: true,
            text: 'Edit',
            onClick: () => { supplyDrugCallback(drugStockId, title); }
        }
    };
}

const DrugStocksList = ({ drugStockEntries, supplyDrugCallback }) => {
    const drugStocksHeaderValues = [
        {
            id: 'title',
            numeric: false,
            disablePadding: true,
            canBeSorted: false,
            label: 'Title',
        },
        {
            id: 'quantity',
            numeric: true,
            disablePadding: false,
            canBeSorted: true,
            label: 'Quantity',
        },
        {
            id: 'price',
            numeric: true,
            disablePadding: false,
            canBeSorted: true,
            label: 'Price per item',
        },
        {
            id: 'edit',
            numeric: true,
            disablePadding: false,
            canBeSorted: false,
            label: 'Edit',
        }
    ]

    const [drugStocksData, setDrugStocksData] = React.useState([]);

    React.useEffect(() => {
        if (typeof drugStockEntries === 'undefined') return;
        setDrugStocksData([...drugStockEntries.map((item) => {
            return createDrugStockRowEntry(item.drugStockId, item.drugName, item.quantity, item.pricePerItem, supplyDrugCallback);
        })])
    }, [drugStockEntries])

    return (
        <>
            <Container style={{ width: '100%', padding: '1rem', backgroundImage: 'url(/img/dog_paws_pattern.jpg)', backgroundSize: '150%' }}>
                <BaseDataTable tableHeaderValues={drugStocksHeaderValues} tableRows={drugStocksData} />
            </Container>
        </>
    )
}

export default DrugStocksList;