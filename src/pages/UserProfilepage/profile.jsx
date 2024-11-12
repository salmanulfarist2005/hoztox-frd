import React from "react";
import Layout from "../../components/layout/Layout";
import Profile from "../../components/UserProfile/Profile";
import BreadcrumbSection from '../../components/breadcrumb/BreadcrumbSection'
const UserProfile = () => {
  return (
    <Layout>
       <BreadcrumbSection title={"My Profile"} current={"My Profile"}/>
      <Profile/>
    </Layout>
  );
};

export default UserProfile;
