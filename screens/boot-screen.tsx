import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Routes } from '../utils/variables/routes';

export function BootScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    navigation.navigate(Routes.LandingScreen)
  }, [])

  return (
    <View>
      <View></View>
    </View>
  );
}