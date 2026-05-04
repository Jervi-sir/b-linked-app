import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Home, Calendar, Users, UserCircle } from 'lucide-react-native';
import DoctorHomeScreen from './m1/doctor-home-screen';
import DoctorApptsScreen from './m2/doctor-appts-screen';
import DoctorPatientsScreen from './m3/doctor-patients-screen';
import DoctorProfileScreen from './m4/doctor-profile-screen';
import { Routes } from '@/utils/variables/routes';
import { useAuthStore } from '@/zustand/auth-store';

const Tab = createBottomTabNavigator();

export function DoctorNavigation() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useAuthStore(state => state.user);
  const shouldShowProfileCta = user?.role === 'doctor' && !user.profile_complete;

  return (
    <View style={styles.container}>
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

      {shouldShowProfileCta ? (
        <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate(Routes.DoctorProfileOnboardingScreen)} activeOpacity={0.9}>
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
    backgroundColor: '#394fd0',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2a3eb0',
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
