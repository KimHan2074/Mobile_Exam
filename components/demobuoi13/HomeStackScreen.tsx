// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from '../demobuoi13/HomeScreen';
// import DetailsScreen from '../demobuoi13/DetailsScreen';
// import { HomeStackParamList } from './types';
// // import FashionScreen from './FashionScreen';
// // import AccessoryScreen from './AccessoryScreen';
// // import CategoriesScreen from './CategoriesScreen';
// // import AboutScreen from './AboutScreen';
// // import AdminDashboard from './admin/AdminDashboard';
// // import CategoryManagement from './admin/categories/CategoryManagement';
// // import UserManagement from './admin/users/UserManagement';
// // import AddUser from './admin/users/AddUser';
// // import EditUser from './admin/users/EditUser';
// // import ProductManagement from './admin/products/ProductManagement';

// const Stack = createNativeStackNavigator<HomeStackParamList>();

// const HomeStackScreen = () => {
//   return (
//     // Màn hình đầu tiên (<Stack.Screen ... />) trong <Stack.Navigator> sẽ mặc định là màn hình được mở đầu tiên.
//     <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="Details" component={DetailsScreen} />
//       {/* <Stack.Screen name="Categories" component={CategoriesScreen} />
//       <Stack.Screen name="Fashion" component={FashionScreen} />
//       <Stack.Screen name="Accessory" component={AccessoryScreen} />
//       <Stack.Screen name="About" component={AboutScreen} />
//       <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
//       <Stack.Screen name="CategoryManagement" component={CategoryManagement} />
//       <Stack.Screen name="UserManagement" component={UserManagement} />
//       <Stack.Screen name="ProductManagement" component={ProductManagement} />
//       <Stack.Screen name="AddUser" component={AddUser} />
//       <Stack.Screen name="EditUser" component={EditUser} /> */}

//     </Stack.Navigator>
//   );
// };

// export default HomeStackScreen;//------------------------

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../demobuoi13/HomeScreen';
import DetailsScreen from '../demobuoi13/DetailsScreen';
import ProductsByCategoryScreen from '../demobuoi13/ProductsByCategoryScreen';
import { HomeStackParamList } from './types';

// export type HomeStackParamList = {
//   Home: undefined;
//   Details: { product: { id: string; name: string; price: string; image: any } };
// };

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
    </Stack.Navigator>
  );
};

export default HomeStackScreen;
