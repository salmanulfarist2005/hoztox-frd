import React from 'react'
import Layout from '../components/layout/Layout'
import AccountMain from '../components/main/AccountMain'
import { useLocation } from 'react-router-dom';
import AuthenticationSection from '../components/authentication/AuthenticationSection';

const Account = () => {
  const location = useLocation();

  if (location.pathname === '/') {
    return <AuthenticationSection />;
  }

  return (
    <Layout>
        <AccountMain/>
    </Layout>
  )
}

export default Account