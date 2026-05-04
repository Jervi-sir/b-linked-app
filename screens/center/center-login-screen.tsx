import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Lock, ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';
import { useAuthStore } from '@/zustand/auth-store';

const getRouteForRole = (role?: string | null) => {
  if (role === 'center') {
    return Routes.CenterNavigation;
  }

  if (role === 'doctor') {
    return Routes.DoctorNavigation;
  }

  return Routes.PatientNavigation;
};

const CenterLoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await login({
        email: email.trim(),
        password,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: getRouteForRole(user.role) }],
      });
    } catch (error) {
      Alert.alert('فشل تسجيل الدخول', error instanceof Error ? error.message : 'تعذر تسجيل الدخول');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0c7058', '#12916d']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.logoWrap}>
              <Building2 size={40} color="#0c7058" />
            </View>
            <Text style={styles.title}>دخول المراكز والمخابر</Text>
            <Text style={styles.subtitle}>إدارة خدماتك الصحية بكل سهولة</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>رقم الترخيص أو البريد</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="center@example.com"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                textAlign="right"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>كلمة المرور</Text>
            <View style={styles.inputWrap}>
              <Lock size={18} color="#8aa0b4" />
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                textAlign="right"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginBtnText}>{isLoading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerContent: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', marginBottom: 10 },
  logoWrap: { width: 80, height: 80, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  content: { padding: 24, marginTop: -30 },
  form: { backgroundColor: '#fff', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#0c7058', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8 },
  field: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#17324a', marginBottom: 8, textAlign: 'right' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fbfdff', borderRadius: 14, paddingHorizontal: 12, height: 52, borderWidth: 1, borderColor: '#dbe6f0' },
  input: { flex: 1, fontSize: 14, color: '#17324a' },
  loginBtn: { backgroundColor: '#0c7058', borderRadius: 16, paddingVertical: 16, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default CenterLoginScreen;
