import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, LogIn, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';

const { width } = Dimensions.get('window');

const DoctorLoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#394fd0', '#5d74f2']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.logoWrap}>
              <Text style={styles.logoText}>B</Text>
            </View>
            <Text style={styles.title}>دخول الأطباء</Text>
            <Text style={styles.subtitle}>لوحة تحكم B-linked الاحترافية</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <View style={styles.inputWrap}>
              <Mail size={18} color="#8498ab" />
              <TextInput
                style={styles.input}
                placeholder="doctor@example.com"
                keyboardType="email-address"
                textAlign="right"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>كلمة المرور</Text>
            <View style={styles.inputWrap}>
              <Lock size={18} color="#8498ab" />
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry
                textAlign="right"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate(Routes.DoctorNavigation)}
          >
            <Text style={styles.loginBtnText}>تسجيل الدخول</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotBtnText}>نسيت كلمة المرور؟</Text>
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
  logoWrap: { width: 80, height: 80, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  logoText: { fontSize: 36, fontWeight: '900', color: '#394fd0' },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  content: { padding: 24, marginTop: -30 },
  form: { backgroundColor: '#fff', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#394fd0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8 },
  field: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#17324a', marginBottom: 8, textAlign: 'right' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fbfdff', borderRadius: 14, paddingHorizontal: 12, height: 52, borderWidth: 1, borderColor: '#dbe6f0' },
  input: { flex: 1, marginRight: 10, fontSize: 14, color: '#17324a' },
  loginBtn: { backgroundColor: '#394fd0', borderRadius: 16, paddingVertical: 16, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  forgotBtn: { marginTop: 20, alignItems: 'center' },
  forgotBtnText: { fontSize: 13, color: '#394fd0', fontWeight: '600' },
});

export default DoctorLoginScreen;
