import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Calendar, Clock, MapPin, User, CheckCircle, ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';


const PatientConfirmScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0d3f6a', '#1f88e5']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>تأكيد الحجز</Text>
              <Text style={styles.headerSub}>مراجعة البيانات النهائية</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <CheckCircle size={40} color="#1565c0" />
            <Text style={styles.summaryTitle}>تفاصيل الموعد</Text>
          </View>

          <View style={styles.divider} />

          <DetailRow label="الطبيب / المركز" value="د. ياسين كمال" />
          <DetailRow label="التخصص" value="جراحة القلب والشرايين" />
          <DetailRow label="التاريخ" value="الأحد، 26 أفريل 2026" />
          <DetailRow label="الوقت" value="09:00 صباحاً" />
          <DetailRow label="المريض" value="أحمد محمد" />
          <DetailRow label="رقم الهاتف" value="0555 12 34 56" />

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>رسوم الكشف</Text>
            <Text style={styles.totalValue}>2000 دج</Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            * يرجى الحضور قبل الموعد بـ 15 دقيقة لتأكيد التسجيل في العيادة.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => navigation.navigate(Routes.PatientSuccessScreen)}
        >
          <Text style={styles.confirmBtnText}>تأكيد الحجز النهائي</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  backBtn: { marginLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'right' },
  scrollContent: { padding: 16 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#1565c0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 4 },
  summaryHeader: { alignItems: 'center', marginBottom: 20 },
  summaryTitle: { fontSize: 18, fontWeight: '900', color: '#17324a', marginTop: 12 },
  divider: { height: 1, backgroundColor: '#edf3f8', marginVertical: 16, borderStyle: 'dashed', borderRadius: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  label: { fontSize: 13, color: '#71869b' },
  value: { fontSize: 13, fontWeight: '700', color: '#17324a' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 15, fontWeight: '800', color: '#17324a' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#1565c0' },
  notice: { marginVertical: 20, padding: 12, backgroundColor: '#eaf4ff', borderRadius: 12, borderWidth: 1, borderColor: '#dbe6f0' },
  noticeText: { fontSize: 12, color: '#1565c0', textAlign: 'right', lineHeight: 18 },
  confirmBtn: { backgroundColor: '#1565c0', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientConfirmScreen;
