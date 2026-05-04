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
import { Building2, ClipboardList, FlaskConical, Plus, TrendingUp } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';
import { api } from '@/utils/auth';

type HeaderData = {
  center_name: string;
  status_label: string;
};

type StatItem = {
  key: string;
  label: string;
  value: string;
};

type ServiceItemData = {
  id: number;
  name: string;
  price: string;
  type: string;
};

type PendingBookingsData = {
  count: number;
  title: string;
  subtitle: string;
};

type HomeResponse = {
  header: HeaderData;
  stats: StatItem[];
  services: ServiceItemData[];
  pending_bookings: PendingBookingsData;
};

const defaultHeader: HeaderData = {
  center_name: 'المركز الطبي',
  status_label: '',
};

const defaultPendingBookings: PendingBookingsData = {
  count: 0,
  title: 'طلبات الحجز الجديدة',
  subtitle: 'لا توجد طلبات جديدة حالياً',
};

const metricIcons: Record<string, ReactNode> = {
  today_bookings: <ClipboardList size={20} color="#fff" />,
  estimated_revenue: <TrendingUp size={20} color="#fff" />,
};

const CenterHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [header, setHeader] = useState<HeaderData>(defaultHeader);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [services, setServices] = useState<ServiceItemData[]>([]);
  const [pendingBookings, setPendingBookings] = useState<PendingBookingsData>(defaultPendingBookings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const { data } = await api.get<HomeResponse>('/center/home');

        if (!isMounted) {
          return;
        }

        setHeader(data.header);
        setStats(data.stats);
        setServices(data.services);
        setPendingBookings(data.pending_bookings);
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل الصفحة الرئيسية للمركز');
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

      <LinearGradient colors={['#0c7058', '#12916d']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.profileRow}>
              <View style={styles.profileInfo}>
                <Text style={styles.greeting}>{header.center_name}</Text>
                <Text style={styles.status}>{header.status_label}</Text>
              </View>
              <View style={styles.logoWrap}>
                <Building2 size={24} color="#0c7058" />
              </View>
            </View>

            <View style={styles.metricsRow}>
              {stats.map(stat => (
                <MetricCard key={stat.key} label={stat.label} value={stat.value} icon={metricIcons[stat.key] ?? <ClipboardList size={20} color="#fff" />} />
              ))}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#12916d" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TouchableOpacity onPress={() => navigation.navigate(Routes.CenterServicesScreen)}>
                <Text style={styles.seeAll}>إدارة</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>الخدمات النشطة</Text>
            </View>

            <View style={styles.servicesList}>
              {services.length > 0 ? (
                services.map(service => (
                  <ServiceItem
                    key={service.id}
                    name={service.name}
                    price={service.price}
                    icon={service.type.toLowerCase().includes('تحاليل') || service.type.toLowerCase().includes('lab') ? <FlaskConical size={18} color="#0c7058" /> : <Plus size={18} color="#0c7058" />}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>لا توجد خدمات نشطة حالياً</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate(Routes.CenterBookingsScreen)}
          >
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>{pendingBookings.title}</Text>
              <Text style={styles.actionSub}>{pendingBookings.subtitle}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingBookings.count}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const MetricCard = ({ label, value, icon }: { label: string; value: string; icon: ReactNode }) => (
  <View style={styles.metric}>
    <View style={styles.metricIconWrap}>{icon}</View>
    <View>
      <Text style={styles.metricVal}>{value}</Text>
      <Text style={styles.metricLab}>{label}</Text>
    </View>
  </View>
);

const ServiceItem = ({ name, price, icon }: { name: string; price: string; icon: ReactNode }) => (
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
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  section: { marginBottom: 8 },
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
  badge: { minWidth: 28, height: 28, paddingHorizontal: 6, borderRadius: 14, backgroundColor: '#c8403b', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  emptyText: { color: '#71869b', fontSize: 13, textAlign: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#dbe6f0' },
});

export default CenterHomeScreen;
