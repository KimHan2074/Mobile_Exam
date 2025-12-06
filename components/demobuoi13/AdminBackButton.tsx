import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AdminStackParamList } from './types';

const AdminBackButton = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('AdminDashboard');
          }
        }}
        style={styles.button}
        activeOpacity={0.85}
      >
        <Text style={styles.icon}>←</Text>
        <Text style={styles.text}>Quay lại trang quản trị</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8, 
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,                     
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    borderRadius: 999,
    paddingHorizontal: 10,      
    paddingVertical: 6,         
  },
  icon: {
    fontSize: 14,               
    color: '#4338CA',
  },
  text: {
    color: '#4338CA',
    fontWeight: '600',
    fontSize: 14,               
  },
});

export default AdminBackButton;

