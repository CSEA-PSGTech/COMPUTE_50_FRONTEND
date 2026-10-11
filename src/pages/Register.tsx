import React from 'react';
import { Container } from '../components/common/Container';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Register: React.FC = () => {
  return (
    <div className="pt-6 sm:pt-12 pb-32 sm:pb-16 bg-[var(--bg-main)] min-h-[calc(100vh-160px)] flex flex-col justify-start sm:justify-center items-center transition-colors">
      <Container size="lg" className="w-full">
        <RegisterForm />
      </Container>
    </div>
  );
};

export default Register;
