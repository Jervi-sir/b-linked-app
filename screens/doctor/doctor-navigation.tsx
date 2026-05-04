import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Users, UserCircle } from 'lucide-react-native';
import DoctorHomeScreen from './doctor-home-screen';
import DoctorApptsScreen from './doctor-appts-screen';
import DoctorPatientsScreen from './doctor-patients-screen';
import DoctorProfileScreen from './doctor-profile-screen';
import { Routes } from '@/utils/variables/routes';

const Tab = createBottomTabNavigator();

export function DoctorNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#394fd0',
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
        name={Routes.DoctorHomeScreen}
        component={DoctorHomeScreen}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.DoctorApptsScreen}
        component={DoctorApptsScreen}
        options={{
          tabBarLabel: 'المواعيد',
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.DoctorPatientsScreen}
        component={DoctorPatientsScreen}
        options={{
          tabBarLabel: 'المرضى',
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.DoctorProfileScreen}
        component={DoctorProfileScreen}
        options={{
          tabBarLabel: 'حسابي',
          tabBarIcon: ({ color }) => <UserCircle size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
