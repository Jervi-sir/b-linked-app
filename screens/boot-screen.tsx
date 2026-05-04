import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuthStore } from '@/zustand/auth-store';
import { Routes } from '../utils/variables/routes';

const getRouteForRole = (role?: string | null) => {
  if (role === 'doctor') {
    return Routes.DoctorNavigation;
  }

  if (role === 'center') {
    return Routes.CenterNavigation;
  }

  if (role === 'patient') {
    return Routes.PatientNavigation;
  }

  return Routes.LandingScreen;
};

export function BootScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const hydrate = useAuthStore(state => state.hydrate);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const user = await hydrate();

      if (!isMounted) {
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: getRouteForRole(user?.role) }],
      });
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [hydrate, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1565c0" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f8fc',
  },
});
