import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Home, ClipboardList, FlaskConical, Settings } from 'lucide-react-native';
import CenterHomeScreen from './m1/center-home-screen';
import CenterBookingsScreen from './m2/center-bookings-screen';
import CenterServicesScreen from './m3/center-services-screen';
import CenterProfileScreen from './m4/center-profile-screen';
import { Routes } from '@/utils/variables/routes';
import { useAuthStore } from '@/zustand/auth-store';

const Tab = createBottomTabNavigator();

export function CenterNavigation() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useAuthStore(state => state.user);
  const shouldShowProfileCta = user?.role === 'center' && !user.profile_complete;

  return (
    <View style={styles.container}>
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

      {shouldShowProfileCta ? (
        <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate(Routes.CenterProfileOnboardingScreen)} activeOpacity={0.9}>
          <Text style={styles.floatingButtonText}>Complete my profile</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  floatingButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 96,
    backgroundColor: '#0c7058',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0b5f4b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});
