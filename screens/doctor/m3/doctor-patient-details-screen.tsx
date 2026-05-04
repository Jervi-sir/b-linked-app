import React, { useEffect, useState } from 'react';
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
import { ChevronLeft, FileText, Mail, MapPin, Phone } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { api } from '@/utils/auth';

type PatientDetailsResponse = {
  patient: {
    id: number;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    city: string | null;
    gender: string | null;
    date_of_birth: string | null;
    address: string | null;
    medical_notes: string | null;
  };
  stats: {
    visits_count: number;
    medical_records_count: number;
    last_visit: string | null;
  };
  visits: Array<{
    id: number;
    reference: string;
    date: string | null;
    time: string | null;
    visit_type: string;
    status: string;
  }>;
  medical_records: Array<{
    id: number;
    title: string | null;
    diagnosis: string | null;
    treatment: string | null;
    notes: string | null;
    visit_date: string | null;
  }>;
};

const DoctorPatientDetailsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RouteProp<Record<string, { id?: number }>, string>>();
  const patientId = route.params?.id;
  const [payload, setPayload] = useState<PatientDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!patientId) {
        Alert.alert('خطأ', 'معرّف المريض غير متوفر');
        navigation.goBack();
        return;
      }

      try {
        const { data } = await api.get<PatientDetailsResponse>(`/doctor/patients/${patientId}`);

        if (isMounted) {
          setPayload(data);
        }
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل تفاصيل المريض');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [navigation, patientId]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#394fd0', '#5d74f2']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>تفاصيل المريض</Text>
              <Text style={styles.headerSub}>{payload?.patient.full_name ?? 'الملف الطبي'}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#394fd0" />
        </View>
      ) : payload ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>البيانات الأساسية</Text>
            <InfoRow icon={<Phone size={16} color="#394fd0" />} text={payload.patient.phone ?? 'رقم غير متوفر'} />
            <InfoRow icon={<Mail size={16} color="#394fd0" />} text={payload.patient.email ?? 'بريد غير متوفر'} />
            <InfoRow icon={<MapPin size={16} color="#394fd0" />} text={payload.patient.city ?? 'مدينة غير متوفرة'} />
            <InfoRow icon={<FileText size={16} color="#394fd0" />} text={`تاريخ الميلاد: ${payload.patient.date_of_birth ?? 'غير متوفر'}`} />
            <InfoRow icon={<FileText size={16} color="#394fd0" />} text={`الجنس: ${payload.patient.gender ?? 'غير متوفر'}`} />
            <InfoRow icon={<FileText size={16} color="#394fd0" />} text={`العنوان: ${payload.patient.address ?? 'غير متوفر'}`} />
            <InfoRow icon={<FileText size={16} color="#394fd0" />} text={`ملاحظات عامة: ${payload.patient.medical_notes ?? 'لا توجد'}`} />
          </View>

          <View style={styles.statsRow}>
            <StatCard label="الزيارات" value={String(payload.stats.visits_count)} />
            <StatCard label="السجلات" value={String(payload.stats.medical_records_count)} />
            <StatCard label="آخر زيارة" value={payload.stats.last_visit ?? '-'} compact />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>سجل الزيارات</Text>
            {payload.visits.length > 0 ? (
              payload.visits.map(visit => (
                <View key={visit.id} style={styles.historyItem}>
                  <Text style={styles.historyTitle}>{visit.visit_type}</Text>
                  <Text style={styles.historyMeta}>{`${visit.date ?? '-'} | ${visit.time ?? '-'} | ${visit.status}`}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>لا توجد زيارات مسجلة</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>السجل الطبي</Text>
            {payload.medical_records.length > 0 ? (
              payload.medical_records.map(record => (
                <View key={record.id} style={styles.historyItem}>
                  <Text style={styles.historyTitle}>{record.title ?? 'سجل طبي'}</Text>
                  <Text style={styles.historyMeta}>{record.visit_date ?? '-'}</Text>
                  <Text style={styles.historyBody}>{`التشخيص: ${record.diagnosis ?? 'غير متوفر'}`}</Text>
                  <Text style={styles.historyBody}>{`العلاج: ${record.treatment ?? 'غير متوفر'}`}</Text>
                  <Text style={styles.historyBody}>{`ملاحظات: ${record.notes ?? 'لا توجد'}`}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>لا توجد سجلات طبية لهذا المريض</Text>
            )}
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
};

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoText}>{text}</Text>
    <View style={styles.infoIcon}>{icon}</View>
  </View>
);

const StatCard = ({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) => (
  <View style={[styles.statCard, compact && styles.statCardWide]}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  backBtn: { marginLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'right' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 100, gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#dbe6f0' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 12 },
  infoRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 10 },
  infoIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#eef1ff', alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  infoText: { flex: 1, fontSize: 13, color: '#4b6075', textAlign: 'right' },
  statsRow: { flexDirection: 'row-reverse', gap: 10 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dbe6f0', alignItems: 'center' },
  statCardWide: { flex: 1.4 },
  statValue: { fontSize: 16, fontWeight: '900', color: '#394fd0', textAlign: 'center' },
  statLabel: { fontSize: 11, color: '#71869b', textAlign: 'center', marginTop: 4 },
  historyItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f4f8' },
  historyTitle: { fontSize: 14, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 4 },
  historyMeta: { fontSize: 12, color: '#71869b', textAlign: 'right', marginBottom: 6 },
  historyBody: { fontSize: 12, color: '#4b6075', textAlign: 'right', marginBottom: 3 },
  emptyText: { color: '#71869b', fontSize: 13, textAlign: 'center', paddingVertical: 8 },
});

export default DoctorPatientDetailsScreen;
