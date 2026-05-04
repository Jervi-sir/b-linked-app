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
  Building2,
  ClipboardList,
  FlaskConical,
  TrendingUp,
  Home,
  Settings,
  Plus
} from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';

const { width } = Dimensions.get('window');

const CenterHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0c7058', '#12916d']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.profileRow}>
              <View style={styles.profileInfo}>
                <Text style={styles.greeting}>مركز الشفاء الطبي</Text>
                <Text style={styles.status}>نشط حالياً</Text>
              </View>
              <View style={styles.logoWrap}>
                <Building2 size={24} color="#0c7058" />
              </View>
            </View>

            <View style={styles.metricsRow}>
              <MetricCard label="حجوزات اليوم" value="28" icon={<ClipboardList size={20} color="#fff" />} />
              <MetricCard label="الدخل التقريبي" value="45k" icon={<TrendingUp size={20} color="#fff" />} />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity onPress={() => navigation.navigate(Routes.CenterServicesScreen)}>
              <Text style={styles.seeAll}>إدارة</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>الخدمات النشطة</Text>
          </View>

          <View style={styles.servicesList}>
            <ServiceItem name="تحليل دم شامل" price="2500 دج" icon={<FlaskConical size={18} color="#0c7058" />} />
            <ServiceItem name="أشعة X صدر" price="3500 دج" icon={<Plus size={18} color="#0c7058" />} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate(Routes.CenterBookingsScreen)}
        >
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>طلبات الحجز الجديدة</Text>
            <Text style={styles.actionSub}>لديك 5 طلبات بانتظار التأكيد</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>5</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

    </View>
  );
};

const MetricCard = ({ label, value, icon }) => (
  <View style={styles.metric}>
    <View style={styles.metricIconWrap}>{icon}</View>
    <View>
      <Text style={styles.metricVal}>{value}</Text>
      <Text style={styles.metricLab}>{label}</Text>
    </View>
  </View>
);

const ServiceItem = ({ name, price, icon }) => (
  <View style={styles.serviceItem}>
    <Text style={styles.servicePrice}>{price}</Text>
    <View style={styles.serviceInfo}>
      <Text style={styles.serviceName}>{name}</Text>
      <View style={styles.serviceIcon}>{icon}</View>
    </View>
  </View>
);



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerContent: { paddingHorizontal: 20, paddingTop: 10 },
  profileRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 24 },
  logoWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  profileInfo: { flex: 1, paddingRight: 12 },
  greeting: { fontSize: 18, fontWeight: '900', color: '#fff', textAlign: 'right' },
  status: { fontSize: 11, color: '#bfe9db', textAlign: 'right', marginTop: 2 },
  metricsRow: { flexDirection: 'row-reverse', gap: 12 },
  metric: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 12, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  metricIconWrap: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  metricVal: { fontSize: 18, fontWeight: '900', color: '#fff' },
  metricLab: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a' },
  seeAll: { fontSize: 13, color: '#12916d', fontWeight: '700' },
  servicesList: { gap: 12, marginBottom: 24 },
  serviceItem: { backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0' },
  serviceInfo: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  serviceName: { fontSize: 14, fontWeight: '800', color: '#17324a' },
  serviceIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eaf9f4', alignItems: 'center', justifyContent: 'center' },
  servicePrice: { fontSize: 13, fontWeight: '700', color: '#12916d' },
  actionBtn: { backgroundColor: '#fff', borderRadius: 24, padding: 20, flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#12916d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  actionInfo: { flex: 1, paddingRight: 16 },
  actionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', textAlign: 'right' },
  actionSub: { fontSize: 12, color: '#71869b', textAlign: 'right' },
  badge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#c8403b', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '900' },

});

export default CenterHomeScreen;
