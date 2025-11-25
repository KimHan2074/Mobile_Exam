// import React from 'react';
// import { Text } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeStackScreen from '../demobuoi13/HomeStackScreen';
// // import SignupScreen from './dbAsyncStorage/SignupScreen';
// // import LoginScreen from './dbAsyncStorage/LoginScreen';
// // import LoginSqlite from './dbSqlite/LoginSqlite';
// // import SignupSqlite from './dbSqlite/SignupSqlite';

// export type BottomTabParamList = {
//   HomeTab: undefined;
// //   Signup: undefined;  //minh họa cho users lưu ở AsyncStorage
// //   Login: undefined; //minh họa cho users lưu ở AsyncStorage
// //   SignupSqlite: undefined; //minh họa cho users lưu bằng Sqlite
// //   LoginSqlite: undefined; //minh họa cho users lưu bằng Sqlite
// };

// const Tab = createBottomTabNavigator<BottomTabParamList>();

// const AppTabs = () => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen
//         name="HomeTab"
//         component={HomeStackScreen}
//         options={{ title: 'Home',
//           tabBarIcon: ({ color, size }) => (
//             <Text style={{ fontSize: size, color }}>🏠</Text> // Unicode 🏠 (home)
//           ),
//          }}
//       />
//       {/*-----Tab dùng cho Signup và Login----- */}
//       {/* <Tab.Screen
//         name="Signup"
//         component={SignupScreen}
//         options={{ title: 'Signup' }}
//       />
//       <Tab.Screen
//         name="Login"
//         component={LoginScreen}
//         options={{ title: 'Login' }}
//       /> */}
//       {/*-----Tab dùng cho Signup và Login bằng Sqlite---- */}
//       {/* <Tab.Screen
//         name="SignupSqlite"
//         component={SignupSqlite}
//         options={{ title: 'Signup',
//           tabBarIcon: ({ color, size }) => (
//             <Text style={{ fontSize: size, color }}>➕</Text> // Unicode ➕
//           ),
//          }}
//       /> */}
//       {/* <Tab.Screen
//         name="LoginSqlite"
//         component={LoginSqlite}
//         options={{ title: 'Login',
//           tabBarIcon: ({ color, size }) => (
//             <Text style={{ fontSize: size, color }}>🔒</Text> // Unicode 🔒
//           ),
//          }}
//       /> */}
//     </Tab.Navigator>
//   );
// };

// export default AppTabs;
// // Không thể viết  <Tab.Screen name="Home" component={HomeScreen} /> mà phải viết
// //   <Tab.Screen name="Home" component={HomeScreen as React.ComponentType<any>} />
// //khi trong HomeScreen có sử dụng BottomTab vì
// // Lỗi này thường xảy ra do sự không tương thích giữa kiểu của HomeScreen và kiểu mà Tab Navigator mong đợi. Khi bạn khai báo HomeScreen với các props bắt buộc (navigation, route) từ Native Stack, thì khi sử dụng nó trong Bottom Tab Navigator, các màn hình của Tab Navigator được coi là có props rỗng (ví dụ: {}).
// // Để khắc phục, bạn có thể ép kiểu HomeScreen thành một component có kiểu phù hợp (ví dụ: React.ComponentType<any>) khi truyền vào màn hình có dùng Tab
// // Điều này sẽ buộc TypeScript chấp nhận HomeScreen như một component mà Tab Navigator có thể sử dụng, ngay cả khi HomeScreen yêu cầu các props navigation và route.

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';

import AdminStackScreen from '../demobuoi13/AdminStackScreen';
import HomeStackScreen from '../demobuoi13/HomeStackScreen';
import LoginScreen from '../demobuoi13/LoginScreen';
import SignupScreen from '../demobuoi13/SignupScreen';
import { AdminStackParamList, HomeStackParamList } from './types';

export type BottomTabParamList = {
  UserHome: NavigatorScreenParams<HomeStackParamList> | undefined;
  AdminHome: NavigatorScreenParams<AdminStackParamList> | undefined;
  Signup: undefined;
  Login: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const AppTabs = () => {
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
      <Tab.Screen
        name="UserHome"
        component={HomeStackScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="AdminHome"
        component={AdminStackScreen}
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🛡️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          title: 'Sign up',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📝</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔐</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
