import React, { useMemo } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Building2, ChevronLeft, CircleAlert, Clock3, FlaskConical, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '@/utils/variables/routes';
import { useAuthStore } from '@/zustand/auth-store';

const getMissingCenterItems = (center: any) => {
  const missing: string[] = [];

  if (!center?.license_number?.trim?.()) missing.push('رقم الترخيص');
  if (!center?.description?.trim?.()) missing.push('وصف المركز');
  if (!center?.address?.trim?.()) missing.push('العنوان');
  if (!center?.city?.trim?.()) missing.push('المدينة');
  if (!center?.emergency_24_7) missing.push('تفعيل خدمة 24/7');
  if (!center?.is_active) missing.push('تفعيل الحساب');
  if (!center?.center_services?.length) missing.push('خدمة واحدة على الأقل');
  if (!center?.time_slots?.length) missing.push('موعد متاح واحد على الأقل');

  return missing;
};

const CenterProfileOnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const center = useAuthStore(state => state.user?.center);
  const missingItems = useMemo(() => getMissingCenterItems(center), [center]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0c7058', '#12916d']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>استكمال ملف المركز</Text>
              <Text style={styles.headerSub}>أكمل بيانات المركز المطلوبة لتفعيل الملف بالكامل</Text>
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

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate(Routes.CenterBasicDataScreen)}>
          <View style={styles.actionIconWrap}>
            <Building2 size={20} color="#0c7058" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>البيانات الأساسية</Text>
            <Text style={styles.actionSub}>رقم الترخيص، الوصف، خدمة 24/7، وتفاصيل المركز الأساسية</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate(Routes.CenterLocationScreen)}>
          <View style={styles.actionIconWrap}>
            <MapPin size={20} color="#0c7058" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>الموقع والعنوان</Text>
            <Text style={styles.actionSub}>يجب إدخال المدينة والعنوان التفصيلي</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate(Routes.CenterServicesScreen)}>
          <View style={styles.actionIconWrap}>
            <FlaskConical size={20} color="#0c7058" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>الخدمات</Text>
            <Text style={styles.actionSub}>أضف خدمة واحدة على الأقل ليظهر المركز بشكل صحيح</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate(Routes.CenterWorkingHoursScreen)}>
          <View style={styles.actionIconWrap}>
            <Clock3 size={20} color="#0c7058" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>المواعيد وساعات العمل</Text>
            <Text style={styles.actionSub}>أضف موعداً متاحاً واحداً على الأقل</Text>
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
  actionIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#eaf9f4', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  actionTextWrap: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 4 },
  actionSub: { fontSize: 12, color: '#71869b', textAlign: 'right', lineHeight: 18 },
});

export default CenterProfileOnboardingScreen;
