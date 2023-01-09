import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import SideDrawer from './components/nav/SideDrawer';
import AppointmentPage from './pages/appointment/AppointmentPage';
import AppointmentsListPage from './pages/appointments_list/AppointmentsListPage';
import DrugStocksPage from './pages/drug_stocks/DrugStocksPage';
import LandingPage from './pages/landing_page/LandingPage';
import LoginPage from './pages/login/LoginPage';
import MedicalHistoryPage from './pages/medical_history/MedicalHistoryEntryPage';
import MedicalHistoryListPage from './pages/medical_history_list/MedicalHistoryListPage';
import NotFound from './pages/not_found/NotFound';
import ProfilePage from './pages/profile/ProfilePage';
import RegisterPage from './pages/register/RegisterPage';
import PrescriptionPage from './pages/prescription/PrescriptionPage';

const App = () => {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

  const handleLocationChange = (location) => {
    setCurrentPath(location.pathname);
  }

  return (
    <SideDrawer currentPath={currentPath}>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/me" element={<ProfilePage locationChangeCallback={handleLocationChange} />} />
          <Route exact path="/appointments" element={<AppointmentsListPage locationChangeCallback={handleLocationChange} />} />
          <Route exact path="/medical-history" element={<MedicalHistoryListPage locationChangeCallback={handleLocationChange} />} />
          <Route exact path="/drug-stocks" element={<DrugStocksPage locationChangeCallback={handleLocationChange} />} />
          <Route exact path="/prescriptions" element={<PrescriptionPage locationChangeCallback={handleLocationChange} />} />
          <Route exact path="/login" element={<LoginPage locationChangeCallback={handleLocationChange} />} />
          <Route exact path="/register" element={<RegisterPage locationChangeCallback={handleLocationChange} />} />
          <Route exact path="/medical-history/:id" element={<MedicalHistoryPage />} />
          <Route exact path="/appointment/:id" element={<AppointmentPage />} />
          <Route exact path="*" element={<NotFound locationChangeCallback={handleLocationChange} />} />
        </Routes>
      </Router>
    </SideDrawer>
  );
}

export default App;
