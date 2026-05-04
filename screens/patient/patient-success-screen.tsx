import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Home, Calendar } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';


const PatientSuccessScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.content}>
        <View style={styles.successIconWrap}>
          <LinearGradient colors={['#eaf9f4', '#fff']} style={styles.iconBg}>
            <CheckCircle size={80} color="#12916d" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>تم الحجز بنجاح!</Text>
        <Text style={styles.subtitle}>
          رقم الحجز الخاص بك هو BK-2026-0211. يمكنك متابعة حالة طلبك من خلال صفحة حجوزاتي.
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryBtn}
            // TODO navigate to menu then this tab
            onPress={() => navigation.navigate(Routes.PatientBookingsScreen)}
          >
            <Calendar size={20} color="#fff" />
            <Text style={styles.primaryBtnText}>اذهب إلى حجوزاتي</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            // TODO navigate to menu then this tab
            onPress={() => navigation.navigate(Routes.PatientHomeScreen)}
          >
            <Home size={20} color="#1565c0" />
            <Text style={styles.secondaryBtnText}>العودة للرئيسية</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successIconWrap: { marginBottom: 32 },
  iconBg: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#17324a', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#71869b', textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  buttonGroup: { width: '100%', gap: 12 },
  primaryBtn: { backgroundColor: '#12916d', borderRadius: 16, paddingVertical: 16, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondaryBtn: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1, borderColor: '#1565c0' },
  secondaryBtnText: { color: '#1565c0', fontSize: 16, fontWeight: '800' },
});

export default PatientSuccessScreen;
