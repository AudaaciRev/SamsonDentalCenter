import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import RegisterContainer from '../../components/auth/Register/RegisterContainer';

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async ({
        firstName,
        middleName,
        lastName,
        suffix,
        email,
        phone,
        password,
    }) => {
        setError(null);
        setLoading(true);
        try {
            await register(email, password, { 
                first_name: firstName, 
                middle_name: middleName, 
                last_name: lastName, 
                suffix 
            }, phone);
            navigate('/patient/book');
        } catch (err) {
            if (err.data?.code === 'STUB_PROFILE_EXISTS') {
                navigate('/auth/claim-profile', { 
                    state: { 
                        email, 
                        password,
                        profile_id: err.data.profile_id 
                    } 
                });
            } else {
                setError(err.message || 'Registration failed');
            }
        }
        setLoading(false);
    };

    return (
        <AuthLayout>
            <RegisterContainer
                onSubmit={handleRegister}
                loading={loading}
                error={error}
            />
        </AuthLayout>
    );
};

export default RegisterPage;
