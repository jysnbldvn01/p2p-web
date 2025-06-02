import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import '../../css/layout.css';

function MainLayout() {
  return (
    <div className="app-container">
      <NavigationBar />
      <div className="content-container">
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;