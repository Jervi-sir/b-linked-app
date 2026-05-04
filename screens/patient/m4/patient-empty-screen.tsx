import React from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CalendarDays,
  ChevronLeft,
  FileText,
  HeartPulse,
  LogOut,
  MapPin,
  Phone,
  Search,
  Shield,
  User,
} from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';
import { useAuthStore } from '@/zustand/auth-store';

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
};

const PatientEmptyScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const isProfileComplete = user?.profile_complete ?? true;

  const handlePlaceholder = (title: string) => {
    Alert.alert(title, 'هذه الواجهة جاهزة للتوصيل بالشاشة أو الـ API المناسب لاحقاً.');
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: Routes.LandingScreen }] });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerCard}>
            <View style={styles.avatarWrap}>
              <User size={34} color="#1565c0" />
            </View>
            <Text style={styles.name}>{user?.full_name ?? 'حساب المريض'}</Text>
            <Text style={styles.email}>{user?.email ?? 'لا يوجد بريد إلكتروني'}</Text>

            <View style={styles.inlineInfo}>
              <View style={styles.inlineInfoItem}>
                <Phone size={14} color="#71869b" />
                <Text style={styles.inlineInfoText}>{user?.phone ?? 'غير متوفر'}</Text>
              </View>
              <View style={styles.inlineInfoItem}>
                <Shield size={14} color="#71869b" />
                <Text style={styles.inlineInfoText}>حساب نشط</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <StatCard value="3" label="حجوزات" icon={<CalendarDays size={18} color="#1565c0" />} />
            <StatCard value="2" label="عمليات بحث" icon={<Search size={18} color="#1565c0" />} />
            <StatCard value="1" label="ملفات" icon={<FileText size={18} color="#1565c0" />} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الحساب والمتابعة</Text>
            <MenuItem
              icon={<User size={20} color="#1565c0" />}
              title="تعديل ملفي الشخصي"
              subtitle={isProfileComplete ? 'الاسم، الهاتف، المعلومات الأساسية' : 'استكمال تاريخ الميلاد والجنس والعنوان والمدينة والملاحظات الطبية'}
              onPress={() => navigation.navigate(Routes.PatientProfileOnboardingScreen)}
            />
            <MenuItem
              icon={<CalendarDays size={20} color="#1565c0" />}
              title="حجوزاتي"
              subtitle="عرض ومتابعة حالة كل المواعيد"
              onPress={() => navigation.navigate(Routes.PatientBookingsScreen)}
            />
            <MenuItem
              icon={<HeartPulse size={20} color="#1565c0" />}
              title="إحصاءاتي الصحية"
              subtitle="ملخص مبسط لنشاطي وحجوزاتي"
              onPress={() => handlePlaceholder('إحصاءاتي الصحية')}
            />
            <MenuItem
              icon={<MapPin size={20} color="#1565c0" />}
              title="عناويني المفضلة"
              subtitle="العيادات والمخابر التي زرتها مؤخراً"
              onPress={() => handlePlaceholder('عناويني المفضلة')}
            />
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={18} color="#c8403b" />
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const StatCard = ({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconWrap}>{icon}</View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const MenuItem = ({ icon, title, subtitle, onPress }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <ChevronLeft size={18} color="#8aa0b4" />
    <View style={styles.menuTextWrap}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.menuIconWrap}>{icon}</View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  safeArea: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbe6f0',
    marginBottom: 18,
  },
  avatarWrap: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: '#eef5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  name: { fontSize: 22, fontWeight: '900', color: '#17324a', marginBottom: 4 },
  email: { fontSize: 13, color: '#71869b', marginBottom: 14 },
  inlineInfo: { flexDirection: 'row-reverse', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  inlineInfoItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fbff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e3edf7',
  },
  inlineInfoText: { fontSize: 12, color: '#5a7288', fontWeight: '700' },
  statsRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbe6f0',
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#eef5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 20, fontWeight: '900', color: '#17324a' },
  statLabel: { fontSize: 11, color: '#71869b', marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', marginBottom: 12, textAlign: 'right' },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbe6f0',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTextWrap: { flex: 1, marginHorizontal: 12 },
  menuTitle: { fontSize: 15, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 4 },
  menuSubtitle: { fontSize: 12, color: '#71869b', textAlign: 'right', lineHeight: 18 },
  menuIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#eef5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#fdecee',
  },
  logoutText: { color: '#c8403b', fontSize: 15, fontWeight: '800' },
});

export default PatientEmptyScreen;
