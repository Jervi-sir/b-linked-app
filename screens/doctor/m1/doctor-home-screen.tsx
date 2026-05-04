import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Users,
  Calendar,
  Home,
  UserCircle,
} from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';

const DoctorHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#394fd0', '#5d74f2']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.profileRow}>
              <View style={styles.profileInfo}>
                <Text style={styles.greeting}>أهلاً د. ياسين كمال</Text>
                <Text style={styles.date}>الأحد، 26 أفريل 2026</Text>
              </View>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar} />
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <MetricCard icon={<Calendar size={18} color="#fff" />} label="مواعيد اليوم" value="12" />
              <MetricCard icon={<Users size={18} color="#fff" />} label="إجمالي المرضى" value="1.2k" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>أجندة اليوم</Text>

        <View style={styles.agenda}>
          <AgendaItem
            time="09:00"
            patient="أحمد محمد"
            type="كشف جديد"
            status="قيد الانتظار"
            active
          />
          <AgendaItem
            time="09:30"
            patient="سارة كمال"
            type="متابعة"
            status="قادم"
          />
          <AgendaItem
            time="10:00"
            patient="عمر فاروق"
            type="استشارة"
            status="قادم"
          />
        </View>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate(Routes.DoctorApptsScreen)}
        >
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>إدارة المواعيد</Text>
            <Text style={styles.actionSub}>تأكيد، إلغاء أو تغيير المواعيد</Text>
          </View>
          <View style={styles.actionIcon}>
            <Calendar size={24} color="#394fd0" />
          </View>
        </TouchableOpacity>
      </ScrollView>

    </View>
  );
};

const MetricCard = ({ icon, label, value }) => (
  <View style={styles.metric}>
    <View style={styles.metricIcon}>{icon}</View>
    <View>
      <Text style={styles.metricVal}>{value}</Text>
      <Text style={styles.metricLab}>{label}</Text>
    </View>
  </View>
);

const AgendaItem = ({ time, patient, type, status, active = false }) => (
  <View style={[styles.agendaItem, active && styles.agendaActive]}>
    <View style={styles.agendaTime}>
      <Text style={[styles.timeText, active && styles.textWhite]}>{time}</Text>
    </View>
    <View style={styles.agendaInfo}>
      <Text style={[styles.patientName, active && styles.textWhite]}>{patient}</Text>
      <Text style={[styles.visitType, active && styles.textWhiteOp]}>{type}</Text>
    </View>
    <View style={[styles.statusBadge, active && styles.badgeWhite]}>
      <Text style={[styles.statusText, active && styles.textVio]}>{status}</Text>
    </View>
  </View>
);



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerContent: { paddingHorizontal: 20, paddingTop: 10 },
  profileRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 24 },
  avatarWrap: { width: 56, height: 56, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 3 },
  avatar: { flex: 1, borderRadius: 17, backgroundColor: '#fff' },
  profileInfo: { flex: 1, paddingRight: 12 },
  greeting: { fontSize: 18, fontWeight: '900', color: '#fff', textAlign: 'right' },
  date: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'right', marginTop: 2 },
  metricsGrid: { flexDirection: 'row-reverse', gap: 12 },
  metric: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 12, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  metricIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  metricVal: { fontSize: 18, fontWeight: '900', color: '#fff' },
  metricLab: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
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
  actionCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  actionIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#eef1ff', alignItems: 'center', justifyContent: 'center' },
  actionInfo: { flex: 1, paddingRight: 16 },
  actionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', textAlign: 'right' },
  actionSub: { fontSize: 12, color: '#71869b', textAlign: 'right' },

});

export default DoctorHomeScreen;
