import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import AdminDashboard from '../demobuoi13/AdminDashboard';
import CategoryManagementScreen from '../demobuoi13/CategoryManagementScreen';
import ProductManagementScreen from '../demobuoi13/ProductManagementScreen';
import UserManagementScreen from '../demobuoi13/UserManagementScreen';
import { AdminStackParamList } from './types';

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="CategoryManagement" component={CategoryManagementScreen} />
      <Stack.Screen name="ProductManagement" component={ProductManagementScreen} />
    </Stack.Navigator>
  );
};

export default AdminStackScreen;

