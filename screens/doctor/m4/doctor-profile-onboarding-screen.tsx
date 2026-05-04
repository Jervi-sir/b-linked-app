import React, { useMemo } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, CircleAlert, CalendarClock, UserRoundCog } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '@/utils/variables/routes';
import { useAuthStore } from '@/zustand/auth-store';

const getMissingDoctorItems = (doctor: any) => {
  const missing: string[] = [];

  if (!doctor?.specialty_id) missing.push('التخصص');
  if (!doctor?.license_number?.trim?.()) missing.push('رقم الترخيص');
  if (!doctor?.years_experience?.trim?.()) missing.push('سنوات الخبرة');
  if (!doctor?.bio?.trim?.()) missing.push('النبذة');
  if (!doctor?.address?.trim?.()) missing.push('العنوان');
  if (!doctor?.city?.trim?.()) missing.push('المدينة');
  if (!doctor?.is_available) missing.push('تفعيل التوفر');
  if (!doctor?.schedules?.length) missing.push('جدول أسبوعي واحد على الأقل');

  return missing;
};

const DoctorProfileOnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const doctor = useAuthStore(state => state.user?.doctor);
  const missingItems = useMemo(() => getMissingDoctorItems(doctor), [doctor]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#394fd0', '#5d74f2']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>استكمال الملف المهني</Text>
              <Text style={styles.headerSub}>أكمل البيانات المطلوبة ليصبح ملف الطبيب جاهزاً بالكامل</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.noticeCard}>
          <View style={styles.noticeHeader}>
            <CircleAlert size={18} color="#8a5600" />
            <Text style={styles.noticeTitle}>العناصر الناقصة</Text>
          </View>
          <Text style={styles.noticeText}>{missingItems.length > 0 ? missingItems.join(' - ') : 'الملف مكتمل'}</Text>
        </View>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate(Routes.DoctorPersonalDataScreen)}>
          <View style={styles.actionIconWrap}>
            <UserRoundCog size={20} color="#394fd0" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>البيانات المهنية الأساسية</Text>
            <Text style={styles.actionSub}>التخصص، الترخيص، الخبرة، النبذة، العنوان، المدينة، التوفر</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate(Routes.DoctorWeeklyScheduleScreen)}>
          <View style={styles.actionIconWrap}>
            <CalendarClock size={20} color="#394fd0" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>الجدول الأسبوعي</Text>
            <Text style={styles.actionSub}>يجب إضافة جدول أسبوعي واحد على الأقل</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { marginLeft: 16 },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', textAlign: 'right', marginTop: 4 },
  content: { padding: 16, paddingBottom: 40 },
  noticeCard: { backgroundColor: '#fff7e8', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#ffe0a3', marginBottom: 16 },
  noticeHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginBottom: 8 },
  noticeTitle: { fontSize: 15, fontWeight: '900', color: '#8a5600' },
  noticeText: { fontSize: 13, color: '#8a5600', textAlign: 'right', lineHeight: 20 },
  actionCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#dbe6f0', flexDirection: 'row-reverse', marginBottom: 12 },
  actionIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#eef1ff', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  actionTextWrap: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 4 },
  actionSub: { fontSize: 12, color: '#71869b', textAlign: 'right', lineHeight: 18 },
});

export default DoctorProfileOnboardingScreen;
