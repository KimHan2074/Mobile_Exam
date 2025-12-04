import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CartScreen from '../demobuoi13/CartScreen';
import CheckoutScreen from '../demobuoi13/CheckoutScreen';
import DetailsScreen from '../demobuoi13/DetailsScreen';
import HomeScreen from '../demobuoi13/HomeScreen';
import OrderHistoryScreen from '../demobuoi13/OrderHistoryScreen';
import ProductsByCategoryScreen from '../demobuoi13/ProductsByCategoryScreen';
import ProfileScreen from '../demobuoi13/ProfileScreen';
import { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="ProductsByCategory" component={ProductsByCategoryScreen} /> 
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackScreen;
