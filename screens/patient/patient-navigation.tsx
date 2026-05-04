import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Home, Search, Calendar, Menu } from 'lucide-react-native';
import PatientHomeScreen from './m1/patient-home-screen';
import PatientSearchScreen from './m2/patient-search-screen';
import PatientBookingsScreen from './m3/patient-bookings-screen';
import PatientEmptyScreen from './m4/patient-empty-screen';
import { Routes } from '@/utils/variables/routes';
import { useAuthStore } from '@/zustand/auth-store';

const Tab = createBottomTabNavigator();

export function PatientNavigation() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useAuthStore(state => state.user);
  const shouldShowProfileCta = user?.role === 'patient' && !user.profile_complete;

  return (
    <View style={styles.container}>
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

      {shouldShowProfileCta ? (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate(Routes.PatientProfileOnboardingScreen)}
          activeOpacity={0.9}
        >
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
    backgroundColor: '#1565c0',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0c4a86',
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
