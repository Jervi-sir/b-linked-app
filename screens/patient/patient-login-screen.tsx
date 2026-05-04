import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Lock, Mail, Phone, User } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';
import { useAuthStore } from '@/zustand/auth-store';

type AuthMode = 'login' | 'register';

const PatientLoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const login = useAuthStore(state => state.login);
  const registerPatient = useAuthStore(state => state.registerPatient);
  const isLoading = useAuthStore(state => state.isLoading);

  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return mode === 'login' ? 'جارٍ تسجيل الدخول...' : 'جارٍ إنشاء الحساب...';
    }

    return mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب';
  }, [isLoading, mode]);

  const navigateToPatientApp = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: Routes.PatientNavigation }],
    });
  };

  const handleSubmit = async () => {
    try {
      if (mode === 'login') {
        await login({
          email: email.trim(),
          password,
        });
      } else {
        await registerPatient({
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          password,
          password_confirmation: passwordConfirmation,
        });
      }

      navigateToPatientApp();
    } catch (error) {
      Alert.alert(
        mode === 'login' ? 'فشل تسجيل الدخول' : 'فشل إنشاء الحساب',
        error instanceof Error ? error.message : 'تعذر إكمال العملية'
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0d3f6a', '#1f88e5']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.logoWrap}>
              <User size={36} color="#1565c0" />
            </View>

            <Text style={styles.title}>دخول المرضى</Text>
            <Text style={styles.subtitle}>سجّل الدخول أو أنشئ حساباً جديداً للمتابعة</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <View style={styles.modeSwitch}>
              <TouchableOpacity
                style={[styles.modeBtn, mode === 'register' && styles.modeBtnActive]}
                onPress={() => setMode('register')}
              >
                <Text style={[styles.modeText, mode === 'register' && styles.modeTextActive]}>
                  إنشاء حساب
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeBtn, mode === 'login' && styles.modeBtnActive]}
                onPress={() => setMode('login')}
              >
                <Text style={[styles.modeText, mode === 'login' && styles.modeTextActive]}>
                  تسجيل الدخول
                </Text>
              </TouchableOpacity>
            </View>

            {mode === 'register' ? (
              <View style={styles.field}>
                <Text style={styles.label}>الاسم الكامل</Text>
                <View style={styles.inputWrap}>
                  <User size={18} color="#8498ab" />
                  <TextInput
                    style={styles.input}
                    placeholder="محمد أحمد"
                    value={fullName}
                    onChangeText={setFullName}
                    textAlign="right"
                  />
                </View>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={styles.label}>البريد الإلكتروني</Text>
              <View style={styles.inputWrap}>
                <Mail size={18} color="#8498ab" />
                <TextInput
                  style={styles.input}
                  placeholder="patient@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  textAlign="right"
                />
              </View>
            </View>

            {mode === 'register' ? (
              <View style={styles.field}>
                <Text style={styles.label}>رقم الهاتف</Text>
                <View style={styles.inputWrap}>
                  <Phone size={18} color="#8498ab" />
                  <TextInput
                    style={styles.input}
                    placeholder="0555555555"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    textAlign="right"
                  />
                </View>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={styles.label}>كلمة المرور</Text>
              <View style={styles.inputWrap}>
                <Lock size={18} color="#8498ab" />
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

            {mode === 'register' ? (
              <View style={styles.field}>
                <Text style={styles.label}>تأكيد كلمة المرور</Text>
                <View style={styles.inputWrap}>
                  <Lock size={18} color="#8498ab" />
                  <TextInput
                    style={styles.input}
                    placeholder="********"
                    secureTextEntry
                    value={passwordConfirmation}
                    onChangeText={setPasswordConfirmation}
                    textAlign="right"
                  />
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitBtnText}>{submitLabel}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  flex: { flex: 1 },
  header: { paddingBottom: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerContent: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', marginBottom: 10 },
  logoWrap: { width: 80, height: 80, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  content: { padding: 24 },
  form: { backgroundColor: '#fff', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#1565c0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8 },
  modeSwitch: { flexDirection: 'row-reverse', backgroundColor: '#eef5fb', borderRadius: 16, padding: 4, marginBottom: 24 },
  modeBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: '#1565c0' },
  modeText: { fontSize: 14, fontWeight: '700', color: '#4b6075' },
  modeTextActive: { color: '#fff' },
  field: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#17324a', marginBottom: 8, textAlign: 'right' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fbfdff', borderRadius: 14, paddingHorizontal: 12, height: 52, borderWidth: 1, borderColor: '#dbe6f0' },
  input: { flex: 1, marginRight: 10, fontSize: 14, color: '#17324a' },
  submitBtn: { backgroundColor: '#1565c0', borderRadius: 16, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientLoginScreen;
