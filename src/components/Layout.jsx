import React from 'react';

import MyNavbar from '../components/MyNavbar';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '10vh' }}>
      <MyNavbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
