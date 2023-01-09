import Container from '@mui/material/Container';
import * as React from 'react';
import BaseDataTable from '../../components/data_table/BaseDataTable';

const createAppointmentRowEntry = (appointmentId, title, dueDate, dueTime, appointer) => {
    return {
        title,
        dueDate,
        dueTime,
        appointer,
        button: {
            isButton: true,
            href: `/appointment/${appointmentId}`,
            text: 'View'
        }
    };
}

const AppointmentsList = ({ appointments }) => {
    const appointmentsTableHeaderValues = [
        {
            id: 'title',
            numeric: false,
            disablePadding: true,
            canBeSorted: false,
            label: 'Title',
        },
        {
            id: 'dueDate',
            numeric: true,
            disablePadding: false,
            canBeSorted: true,
            label: 'Due Date',
        },
        {
            id: 'dueTime',
            numeric: true,
            disablePadding: false,
            canBeSorted: true,
            label: 'Due Time',
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

    const [appointmentsData, setAppointmentsData] = React.useState([]);

    React.useEffect(() => {
        if (typeof appointments === 'undefined') return;
        setAppointmentsData([...appointments.map((item) => {
            return createAppointmentRowEntry(item.appointmentId, item.title, item.dueDate, item.dueTime, item.appointer);
        })])
    }, [appointments])

    return (
        <>
            <Container style={{ width: '100%', padding: '1rem', backgroundImage: 'url(/img/dog_paws_pattern.jpg)', backgroundSize: '150%' }}>
                <BaseDataTable tableHeaderValues={appointmentsTableHeaderValues} tableRows={appointmentsData} />
            </Container>
        </>
    )
}

export default AppointmentsList;