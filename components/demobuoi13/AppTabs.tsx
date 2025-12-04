import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';

import AdminStackScreen from '../demobuoi13/AdminStackScreen';
import HomeStackScreen from '../demobuoi13/HomeStackScreen';
import LoginScreen from '../demobuoi13/LoginScreen';
import SignupScreen from '../demobuoi13/SignupScreen';
import { AdminStackParamList, HomeStackParamList } from './types';
import { useUser } from './UserContext';

export type BottomTabParamList = {
  UserHome: NavigatorScreenParams<HomeStackParamList> | undefined;
  AdminHome: NavigatorScreenParams<AdminStackParamList> | undefined;
  Signup: undefined;
  Login: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const AppTabs = () => {
  const { currentUser } = useUser();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 52,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      {/* Tab Home luôn hiển thị */}
      <Tab.Screen
        name="UserHome"
        component={HomeStackScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🏠</Text>,
        }}
      />

      {/* Tab Admin chỉ hiển thị với admin */}
      {currentUser?.role === 'admin' && (
        <Tab.Screen
          name="AdminHome"
          component={AdminStackScreen}
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🛡️</Text>,
          }}
        />
      )}

      {/* Tab Signup và Login luôn hiển thị */}
      <Tab.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          title: 'Sign up',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>📝</Text>,
        }}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🔐</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;

