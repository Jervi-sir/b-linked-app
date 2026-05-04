import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, Calendar, Menu } from 'lucide-react-native';
import PatientHomeScreen from './m1/patient-home-screen';
import PatientSearchScreen from './m2/patient-search-screen';
import PatientBookingsScreen from './m3/patient-bookings-screen';
import PatientEmptyScreen from './m4/patient-empty-screen';
import { Routes } from '@/utils/variables/routes';

const Tab = createBottomTabNavigator();

export function PatientNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1565c0',
        tabBarInactiveTintColor: '#8498ab',
        tabBarStyle: {
          height: 80,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#dbe6f0',
          paddingBottom: 15,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name={Routes.PatientHomeScreen}
        component={PatientHomeScreen}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.PatientSearchScreen}
        component={PatientSearchScreen}
        options={{
          tabBarLabel: 'بحث',
          tabBarIcon: ({ color }) => <Search size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.PatientBookingsScreen}
        component={PatientBookingsScreen}
        options={{
          tabBarLabel: 'حجوزاتي',
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.PatientEmptyScreen}
        component={PatientEmptyScreen}
        options={{
          tabBarLabel: 'أخرى',
          tabBarIcon: ({ color }) => <Menu size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}