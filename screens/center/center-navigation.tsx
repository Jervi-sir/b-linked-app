import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ClipboardList, FlaskConical, Settings } from 'lucide-react-native';
import CenterHomeScreen from './center-home-screen';
import CenterBookingsScreen from './center-bookings-screen';
import CenterServicesScreen from './center-services-screen';
import CenterProfileScreen from './center-profile-screen';
import { Routes } from '@/utils/variables/routes';

const Tab = createBottomTabNavigator();

export function CenterNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0c7058',
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
        name={Routes.CenterHomeScreen}
        component={CenterHomeScreen}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.CenterBookingsScreen}
        component={CenterBookingsScreen}
        options={{
          tabBarLabel: 'الحجوزات',
          tabBarIcon: ({ color }) => <ClipboardList size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.CenterServicesScreen}
        component={CenterServicesScreen}
        options={{
          tabBarLabel: 'الخدمات',
          tabBarIcon: ({ color }) => <FlaskConical size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.CenterProfileScreen}
        component={CenterProfileScreen}
        options={{
          tabBarLabel: 'حسابي',
          tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
