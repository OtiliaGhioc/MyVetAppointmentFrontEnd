import { queryByAttribute, render, screen } from '@testing-library/react';
import App from '../App';
import LoginPage from '../pages/login/LoginPage';
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from "react-router-dom";
import SideDrawer from '../components/nav/SideDrawer';

const getById = queryByAttribute.bind(null, 'id');

test('render app', () => {
    render(<App />);
});

test('test login page', async () => {
    const dom = render(<Router><LoginPage locationChangeCallback={() => { }} /></Router>);
    const username = getById(dom.container, 'username');
    const password = getById(dom.container, 'password');
    expect(username).toHaveTextContent('')
    expect(password).toHaveTextContent('')
    await userEvent.click(screen.getByText('Sign In'))
});

test('test side drawer', async () => {
    const dom = render(<Router><SideDrawer locationChangeCallback={() => { }} /></Router>);
    const pageTitle = getById(dom.container, 'pageTitle');
    const pathname = window.location.pathname
    console.log(pathname)

    if (pathname == '/me')
        expect(pageTitle).toHaveTextContent('My Profile')
    else if (pathname == '/appointments')
        expect(pageTitle).toHaveTextContent('My Appointments')
    else if (pathname == '/medical-history')
        expect(pageTitle).toHaveTextContent('My Medical History')
    else if (pathname == '/drug-stocks')
        expect(pageTitle).toHaveTextContent('Drug Stocks')
    else if (pathname == '/prescriptions')
        expect(pageTitle).toHaveTextContent('Prescriptions')
});
