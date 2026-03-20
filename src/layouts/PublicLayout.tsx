import React from 'react';
import { Outlet } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

export default function PublicLayout() {
  return (
    <>
      <Outlet />
      <Chatbot />
    </>
  );
}
