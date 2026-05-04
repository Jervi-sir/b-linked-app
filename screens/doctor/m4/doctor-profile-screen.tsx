import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReactNode } from 'react';
import { User, Settings, Shield, Bell, LogOut, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';
import { useAuthStore } from '@/zustand/auth-store';

const DoctorProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const logout = useAuthStore(state => state.logout);

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
              <Text style={styles.headerSub}>د. ياسين كمال</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإعدادات العامة</Text>
          <View style={styles.menuCard}>
            <MenuItem icon={<User size={20} color="#394fd0" />} label="البيانات الشخصية" />
            <MenuItem icon={<Settings size={20} color="#394fd0" />} label="تعديل الجدول الأسبوعي" />
            <MenuItem icon={<Bell size={20} color="#394fd0" />} label="تنبيهات المواعيد" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الأمان والخصوصية</Text>
          <View style={styles.menuCard}>
            <MenuItem icon={<Shield size={20} color="#394fd0" />} label="تغيير كلمة المرور" />
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
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
};

const MenuItem = ({ icon, label }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem}>
    <ChevronLeft size={18} color="#8498ab" />
    <Text style={styles.menuLabel}>{label}</Text>
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
  scrollContent: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#71869b', marginBottom: 12, textAlign: 'right', marginRight: 8 },
  menuCard: { backgroundColor: '#fff', borderRadius: 24, paddingVertical: 8, borderWidth: 1, borderColor: '#dbe6f0' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f8fbff' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: '#17324a', textAlign: 'right', marginRight: 16 },
  menuIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eef1ff', alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 16, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20, borderWidth: 1, borderColor: '#fdecee' },
  logoutText: { color: '#c8403b', fontSize: 16, fontWeight: '800' },
});

export default DoctorProfileScreen;
