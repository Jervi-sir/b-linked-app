import React, { ReactNode, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, ChevronLeft, ChevronRight, Clock, FlaskConical, MapPin, Phone, Star } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { Routes } from '@/utils/variables/routes';

const { width } = Dimensions.get('window');

type CenterService = {
  id: number;
  name: string;
  price: string | number | null;
  duration_minutes: number | null;
};

type CenterPayload = {
  center: {
    id: number;
    name: string;
    type: string;
    description: string | null;
    rating: string;
    reviews_count: number;
    emergency_label: string;
    distance: string | null;
    address: string | null;
    city: string | null;
    phone: string | null;
    working_hours: string;
    services: CenterService[];
  };
};

type ServiceChipProps = {
  label: string;
};

type InfoRowProps = {
  icon: ReactNode;
  text: string;
};

const PatientCenterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RouteProp<Record<string, { id?: number }>, string>>();
  const centerId = route.params?.id;
  const [center, setCenter] = useState<CenterPayload['center'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCenter = async () => {
      if (!centerId) {
        Alert.alert('خطأ', 'معرف المركز غير متوفر');
        navigation.goBack();
        return;
      }

      try {
        const { data } = await api.get<CenterPayload>(`/patient/centers/${centerId}`);

        if (!isMounted) {
          return;
        }

        setCenter(data.center);
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل بيانات المركز');
          navigation.goBack();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCenter();

    return () => {
      isMounted = false;
    };
  }, [centerId, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {isLoading || !center ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#12916d" />
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient colors={['#0c7058', '#12916d']} style={styles.banner}>
              <SafeAreaView edges={['top']} style={styles.safeHeader}>
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
              <View style={styles.bannerContent}>
                <View style={styles.centerLogo}>
                  <FlaskConical size={32} color="#12916d" />
                </View>
                <Text style={styles.centerName}>{center.name}</Text>
                <Text style={styles.centerType}>{center.type}</Text>
              </View>
            </LinearGradient>

            <View style={styles.content}>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Star size={18} color="#ffb400" fill="#ffb400" />
                  <Text style={styles.statVal}>{center.rating}</Text>
                  <Text style={styles.statLab}>تقييم</Text>
                </View>
                <View style={styles.statBox}>
                  <Activity size={18} color="#12916d" />
                  <Text style={styles.statVal}>{center.emergency_label}</Text>
                  <Text style={styles.statLab}>طوارئ</Text>
                </View>
                <View style={styles.statBox}>
                  <MapPin size={18} color="#12916d" />
                  <Text style={styles.statVal}>{center.distance ?? '-'}</Text>
                  <Text style={styles.statLab}>مسافة</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>الخدمات المتاحة</Text>
                <View style={styles.servicesGrid}>
                  {center.services.map(service => (
                    <ServiceChip key={service.id} label={service.name} />
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>الموقع وساعات العمل</Text>
                <View style={styles.infoCard}>
                  <InfoRow
                    icon={<MapPin size={18} color="#12916d" />}
                    text={[center.city, center.address].filter(Boolean).join(' - ') || 'العنوان غير متوفر'}
                  />
                  <InfoRow icon={<Clock size={18} color="#12916d" />} text={center.working_hours} />
                  <InfoRow icon={<Phone size={18} color="#12916d" />} text={center.phone ?? 'رقم الهاتف غير متوفر'} />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate(Routes.PatientFormScreen, {
                bookableType: 'center',
                bookableId: center.id,
              })}
            >
              <Text style={styles.actionBtnText}>حجز فحص / تحاليل</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const ServiceChip = ({ label }: ServiceChipProps) => (
  <View style={styles.serviceChip}>
    <Text style={styles.serviceText}>{label}</Text>
  </View>
);

const InfoRow = ({ icon, text }: InfoRowProps) => (
  <View style={styles.infoRow}>
    {icon}
    <Text style={styles.infoRowText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  banner: { height: 260, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  navBar: { width: '100%', paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row-reverse' },
  safeHeader: { width: '100%', paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  bannerContent: { alignItems: 'center', marginTop: 10 },
  centerLogo: { width: 70, height: 70, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  centerName: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
  centerType: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  content: { padding: 20, paddingBottom: 100 },
  statsRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 24, marginTop: -50 },
  statBox: { width: (width - 60) / 3, backgroundColor: '#fff', borderRadius: 20, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  statVal: { fontSize: 15, fontWeight: '800', color: '#17324a', marginTop: 4, textAlign: 'center' },
  statLab: { fontSize: 10, color: '#71869b' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', marginBottom: 12, textAlign: 'right' },
  servicesGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  serviceChip: { backgroundColor: '#eaf9f4', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#bfe9db' },
  serviceText: { fontSize: 12, color: '#0c7058', fontWeight: '700' },
  infoCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#dbe6f0' },
  infoRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 },
  infoRowText: { fontSize: 13, color: '#5a7288', marginRight: 10, flex: 1, textAlign: 'right' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#dbe6f0' },
  actionBtn: { backgroundColor: '#12916d', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientCenterScreen;
