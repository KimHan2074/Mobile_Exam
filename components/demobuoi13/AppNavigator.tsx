import React from 'react';
import AppTabs from '../demobuoi13/AppTabs';
import { UserProvider } from './UserContext';

const AppNavigator = () => (
  <UserProvider>
      <AppTabs />
  </UserProvider>
  );

export default AppNavigator;
