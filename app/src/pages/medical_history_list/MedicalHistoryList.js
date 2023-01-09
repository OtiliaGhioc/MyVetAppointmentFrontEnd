import Container from '@mui/material/Container';
import * as React from 'react';
import BaseDataTable from '../../components/data_table/BaseDataTable';


const createMedicalHistoryRowEntry = (medicalEntryId, title, date, appointer) => {
    return {
        title,
        date,
        appointer,
        button: {
            isButton: true,
            href: `/medical=entry/${medicalEntryId}`,
            text: 'View'
        }
    };
}

const MedicalHistoryList = ({ medicalHistoryEntries }) => {
    const medicalHistoryHeaderValues = [
        {
            id: 'title',
            numeric: false,
            disablePadding: true,
            canBeSorted: false,
            label: 'Title',
        },
        {
            id: 'date',
            numeric: true,
            disablePadding: false,
            canBeSorted: true,
            label: 'Date',
        },
        {
            id: 'appointer',
            numeric: true,
            disablePadding: false,
            canBeSorted: false,
            label: 'Appointer',
        },
        {
            id: 'view',
            numeric: true,
            disablePadding: false,
            canBeSorted: false,
            label: 'View',
        }
    ]

    const [medicalHistoryData, setMedicalHistoryData] = React.useState([]);

    React.useEffect(() => {
        if (typeof medicalHistoryEntries === 'undefined') return;
        setMedicalHistoryData([...medicalHistoryEntries.map((item) => {
            return createMedicalHistoryRowEntry(item.medicalHistoryEntryId, item.title, item.date, item.appointer);
        })])
    }, [medicalHistoryEntries])

    return (
        <>
            <Container style={{ width: '100%', padding: '1rem', backgroundImage: 'url(/img/dog_paws_pattern.jpg)', backgroundSize: '150%' }}>
                <BaseDataTable tableHeaderValues={medicalHistoryHeaderValues} tableRows={medicalHistoryData} />
            </Container>
        </>
    )
}

export default MedicalHistoryList;