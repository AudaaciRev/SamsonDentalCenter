import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConfirmAppointment from './pages/ConfirmAppointment';
import AppointmentConfirmed from './pages/AppointmentConfirmed';
import AppointmentError from './pages/AppointmentError';
import AppointmentAlreadyConfirmed from './pages/AppointmentAlreadyConfirmed';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorMessage from './components/common/ErrorMessage';
import LoginForm from './components/auth/Login/components/LoginForm.jsx';

import { api } from './utils/api.js';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path='/confirm-appointment'
                    element={<ConfirmAppointment />}
                />
                <Route
                    path='/appointment-confirmed'
                    element={<AppointmentConfirmed />}
                />
                <Route
                    path='/appointment-error'
                    element={<AppointmentError />}
                />
                <Route
                    path='/appointment-already-confirmed'
                    element={<AppointmentAlreadyConfirmed />}
                />
                <Route
                    path='/login'
                    element={<LoginPage />}
                />
                <Route
                    path='/register'
                    element={<RegisterPage />}
                />
                <Route
                    path='/'
                    element={
                        <div className='flex items-center justify-center min-h-screen'>
                            <h1>Welcome</h1>
                            {/* <LoadingSpinner />
                            <ErrorMessage message={'Error '} /> */}
                            {/* <LoginForm onSubmit={() => {}} /> */}
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

// // Test Health
// const health = await api.get('/api/health');
// console.log(health);

// // Test
// try {
//     const data = await api.get('/api/services');
//     console.log(data);

//     // data.services.map((service) => console.log(service.name));
// } catch (err) {
//     console.log(err.status); // 401
//     console.log(err.message); // "No token provided" or similar
// }
