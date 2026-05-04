import React, { ReactNode, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronLeft, LogOut, Settings, Shield, User } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';
import { useAuthStore } from '@/zustand/auth-store';
import { api } from '@/utils/auth';

type ProfileResponse = {
  profile: {
    full_name: string | null;
    speciality: string | null;
  };
};

const DoctorProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [fullName, setFullName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const isProfileComplete = user?.profile_complete ?? true;

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const { data } = await api.get<ProfileResponse>('/doctor/profile');

        if (!isMounted) {
          return;
        }

        setFullName(data.profile.full_name ?? '');
        setSpeciality(data.profile.speciality ?? '');
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل بيانات الحساب');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({ index: 0, routes: [{ name: Routes.LandingScreen }] });
    } catch {
      Alert.alert('خطأ', 'تعذر تسجيل الخروج حالياً');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#394fd0', '#5d74f2']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.profileInfo}>
              <Text style={styles.headerTitle}>حسابي</Text>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.headerSub}>{fullName ? `د. ${fullName}` : 'الملف الشخصي'}</Text>
                  {speciality ? <Text style={styles.headerMeta}>{speciality}</Text> : null}
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإعدادات العامة</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon={<User size={20} color="#394fd0" />}
              label={isProfileComplete ? 'البيانات الشخصية' : 'استكمال الملف المهني'}
              onPress={() => navigation.navigate(Routes.DoctorPersonalDataScreen)}
            />
            <MenuItem
              icon={<Settings size={20} color="#394fd0" />}
              label="تعديل الجدول الأسبوعي"
              onPress={() => navigation.navigate(Routes.DoctorWeeklyScheduleScreen)}
            />
            {!isProfileComplete ? <MenuItem icon={<Shield size={20} color="#394fd0" />} label="عرض البيانات الناقصة" onPress={() => navigation.navigate(Routes.DoctorProfileOnboardingScreen)} /> : null}
            <MenuItem icon={<Bell size={20} color="#394fd0" />} label="تنبيهات المواعيد" disabled />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الأمان والخصوصية</Text>
          <View style={styles.menuCard}>
            <MenuItem icon={<Shield size={20} color="#394fd0" />} label="تغيير كلمة المرور" disabled />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color="#c8403b" />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

type MenuItemProps = {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

const MenuItem = ({ icon, label, onPress, disabled = false }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={disabled}>
    <ChevronLeft size={18} color="#8498ab" />
    <Text style={[styles.menuLabel, disabled && styles.menuLabelDisabled]}>{label}</Text>
    <View style={styles.menuIconWrap}>{icon}</View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 30, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerContent: { paddingHorizontal: 24, paddingTop: 10, alignItems: 'flex-end' },
  profileInfo: { alignItems: 'flex-end' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  headerMeta: { fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 2 },
  scrollContent: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#71869b', marginBottom: 12, textAlign: 'right', marginRight: 8 },
  menuCard: { backgroundColor: '#fff', borderRadius: 24, paddingVertical: 8, borderWidth: 1, borderColor: '#dbe6f0' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f8fbff' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: '#17324a', textAlign: 'right', marginRight: 16 },
  menuLabelDisabled: { color: '#9aabba' },
  menuIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eef1ff', alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 16, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20, borderWidth: 1, borderColor: '#fdecee' },
  logoutText: { color: '#c8403b', fontSize: 16, fontWeight: '800' },
});

export default DoctorProfileScreen;
