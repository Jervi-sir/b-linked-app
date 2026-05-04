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
import { Calendar, UserCircle, Users } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { Routes } from '@/utils/variables/routes';

type HeaderData = {
  doctor_name: string | null;
  speciality: string;
  date_label: string;
};

type StatItem = {
  key: string;
  label: string;
  value: string;
};

type AgendaItemData = {
  id: number;
  time: string;
  patient_name: string;
  visit_type: string;
  status: string;
  active: boolean;
};

type ActionItem = {
  key: string;
  title: string;
  subtitle: string;
};

type HomeResponse = {
  header: HeaderData;
  stats: StatItem[];
  agenda: AgendaItemData[];
  actions: ActionItem[];
};

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

type AgendaItemProps = AgendaItemData;

const defaultHeader: HeaderData = {
  doctor_name: null,
  speciality: 'طبيب',
  date_label: '',
};

const metricIcons: Record<string, ReactNode> = {
  today_bookings: <Calendar size={18} color="#fff" />,
  unique_patients: <Users size={18} color="#fff" />,
  completed_bookings: <UserCircle size={18} color="#fff" />,
};

const DoctorHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [header, setHeader] = useState<HeaderData>(defaultHeader);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [agenda, setAgenda] = useState<AgendaItemData[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const { data } = await api.get<HomeResponse>('/doctor/home');

        if (!isMounted) {
          return;
        }

        setHeader(data.header);
        setStats(data.stats);
        setAgenda(data.agenda);
        setActions(data.actions);
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل بيانات الصفحة الرئيسية');
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
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#394fd0', '#5d74f2']} style={styles.headerWrap}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.profileRow}>
              <View style={styles.profileInfo}>
                <Text style={styles.greeting}>{`أهلاً ${header.doctor_name ? `د. ${header.doctor_name}` : 'دكتور'}`}</Text>
                <Text style={styles.speciality}>{header.speciality}</Text>
                <Text style={styles.date}>{header.date_label}</Text>
              </View>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar} />
              </View>
            </View>

            <View style={styles.metricsGrid}>
              {stats.map(stat => (
                <MetricCard
                  key={stat.key}
                  icon={metricIcons[stat.key] ?? <Calendar size={18} color="#fff" />}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#394fd0" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>أجندة اليوم</Text>

          <View style={styles.agenda}>
            {agenda.length > 0 ? (
              agenda.map(item => <AgendaItem key={item.id} {...item} />)
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>لا توجد مواعيد اليوم</Text>
                <Text style={styles.emptyText}>ستظهر مواعيد المرضى هنا عند توفرها.</Text>
              </View>
            )}
          </View>

          {actions.map(action => (
            <TouchableOpacity
              key={action.key}
              style={styles.actionCard}
              onPress={() => navigation.navigate(Routes.DoctorApptsScreen)}
            >
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSub}>{action.subtitle}</Text>
              </View>
              <View style={styles.actionIcon}>
                <Calendar size={24} color="#394fd0" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const MetricCard = ({ icon, label, value }: MetricCardProps) => (
  <View style={styles.metric}>
    <View style={styles.metricIcon}>{icon}</View>
    <View>
      <Text style={styles.metricVal}>{value}</Text>
      <Text style={styles.metricLab}>{label}</Text>
    </View>
  </View>
);

const AgendaItem = ({ time, patient_name, visit_type, status, active = false }: AgendaItemProps) => (
  <View style={[styles.agendaItem, active && styles.agendaActive]}>
    <View style={styles.agendaTime}>
      <Text style={[styles.timeText, active && styles.textWhite]}>{time}</Text>
    </View>
    <View style={styles.agendaInfo}>
      <Text style={[styles.patientName, active && styles.textWhite]}>{patient_name}</Text>
      <Text style={[styles.visitType, active && styles.textWhiteOp]}>{visit_type}</Text>
    </View>
    <View style={[styles.statusBadge, active && styles.badgeWhite]}>
      <Text style={[styles.statusText, active && styles.textVio]}>{status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  headerWrap: { paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerContent: { paddingHorizontal: 20, paddingTop: 10 },
  profileRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 24 },
  avatarWrap: { width: 56, height: 56, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 3 },
  avatar: { flex: 1, borderRadius: 17, backgroundColor: '#fff' },
  profileInfo: { flex: 1, paddingRight: 12 },
  greeting: { fontSize: 18, fontWeight: '900', color: '#fff', textAlign: 'right' },
  speciality: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'right', marginTop: 2 },
  date: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'right', marginTop: 2 },
  metricsGrid: { gap: 12 },
  metric: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 12, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  metricIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  metricVal: { fontSize: 18, fontWeight: '900', color: '#fff' },
  metricLab: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', marginBottom: 16, textAlign: 'right' },
  agenda: { gap: 12, marginBottom: 24 },
  agendaItem: { backgroundColor: '#fff', borderRadius: 20, padding: 12, flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0' },
  agendaActive: { backgroundColor: '#394fd0', borderColor: '#394fd0', shadowColor: '#394fd0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8 },
  agendaTime: { width: 60, alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#f0f4f8' },
  timeText: { fontSize: 14, fontWeight: '800', color: '#394fd0' },
  agendaInfo: { flex: 1, paddingRight: 12 },
  patientName: { fontSize: 15, fontWeight: '800', color: '#17324a', textAlign: 'right' },
  visitType: { fontSize: 12, color: '#71869b', textAlign: 'right' },
  statusBadge: { backgroundColor: '#f0f4f8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeWhite: { backgroundColor: '#fff' },
  statusText: { fontSize: 10, fontWeight: '800', color: '#5a7288' },
  textVio: { color: '#394fd0' },
  textWhite: { color: '#fff' },
  textWhiteOp: { color: 'rgba(255,255,255,0.7)' },
  emptyCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#dbe6f0' },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 6 },
  emptyText: { fontSize: 12, color: '#71869b', textAlign: 'right' },
  actionCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  actionIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#eef1ff', alignItems: 'center', justifyContent: 'center' },
  actionInfo: { flex: 1, paddingRight: 16 },
  actionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', textAlign: 'right' },
  actionSub: { fontSize: 12, color: '#71869b', textAlign: 'right' },
});

export default DoctorHomeScreen;
