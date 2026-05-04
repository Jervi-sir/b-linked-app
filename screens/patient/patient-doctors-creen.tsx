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
import { Award, ChevronLeft, Clock, MapPin, Phone } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { Routes } from '@/utils/variables/routes';

const { width } = Dimensions.get('window');

type Qualification = {
  id: number;
  label: string;
};

type DoctorPayload = {
  doctor: {
    id: number;
    name: string | null;
    speciality: string;
    years_experience: number | null;
    rating: string;
    reviews_count: number;
    patients_label: string;
    bio: string | null;
    address: string | null;
    city: string | null;
    phone: string | null;
    working_hours: string;
    qualifications: Qualification[];
  };
};

type InfoRowProps = {
  icon: ReactNode;
  text: string;
};

const PatientDoctorScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RouteProp<Record<string, { id?: number }>, string>>();
  const doctorId = route.params?.id;
  const [doctor, setDoctor] = useState<DoctorPayload['doctor'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDoctor = async () => {
      if (!doctorId) {
        Alert.alert('خطأ', 'معرف الطبيب غير متوفر');
        navigation.goBack();
        return;
      }

      try {
        const { data } = await api.get<DoctorPayload>(`/patient/doctors/${doctorId}`);

        if (!isMounted) {
          return;
        }

        setDoctor(data.doctor);
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل بيانات الطبيب');
          navigation.goBack();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDoctor();

    return () => {
      isMounted = false;
    };
  }, [doctorId, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {isLoading || !doctor ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1565c0" />
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient colors={['#0d3f6a', '#1f88e5']} style={styles.profileHeader}>
              <SafeAreaView edges={['top']} style={styles.safeHeader}>
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>

              <View style={styles.profileInfo}>
                <View style={styles.avatarWrap}>
                  <LinearGradient colors={['#d8ebff', '#f8fbff']} style={styles.avatar} />
                </View>
                <Text style={styles.name}>{doctor.name ?? 'طبيب'}</Text>
                <Text style={styles.specialty}>{doctor.speciality}</Text>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statVal}>{doctor.years_experience ? `+${doctor.years_experience}` : '-'}</Text>
                    <Text style={styles.statLab}>سنوات خبرة</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statVal}>{doctor.rating}</Text>
                    <Text style={styles.statLab}>تقييم</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statVal}>{doctor.patients_label}</Text>
                    <Text style={styles.statLab}>مريض</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.content}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>نبذة عن الدكتور</Text>
                <Text style={styles.bio}>{doctor.bio ?? 'لا توجد نبذة متاحة حالياً.'}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>معلومات التواصل</Text>
                <View style={styles.infoCard}>
                  <InfoRow
                    icon={<MapPin size={18} color="#1565c0" />}
                    text={[doctor.city, doctor.address].filter(Boolean).join(' - ') || 'العنوان غير متوفر'}
                  />
                  <InfoRow icon={<Clock size={18} color="#1565c0" />} text={doctor.working_hours} />
                  <InfoRow icon={<Phone size={18} color="#1565c0" />} text={doctor.phone ?? 'رقم الهاتف غير متوفر'} />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>الشهادات والخبرات</Text>
                <View style={styles.infoCard}>
                  {doctor.qualifications.map(qualification => (
                    <InfoRow key={qualification.id} icon={<Award size={18} color="#1565c0" />} text={qualification.label} />
                  ))}
                  {doctor.qualifications.length === 0 ? (
                    <Text style={styles.emptyQualifications}>لا توجد شهادات مضافة حالياً.</Text>
                  ) : null}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => navigation.navigate(Routes.PatientFormScreen, {
                bookableType: 'doctor',
                bookableId: doctor.id,
              })}
            >
              <Text style={styles.bookBtnText}>حجز موعد الآن</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const InfoRow = ({ icon, text }: InfoRowProps) => (
  <View style={styles.infoRow}>
    {icon}
    <Text style={styles.infoRowText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  profileHeader: { paddingBottom: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, alignItems: 'center' },
  safeHeader: { width: '100%', paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  profileInfo: { alignItems: 'center', marginTop: 10 },
  avatarWrap: { width: 100, height: 100, borderRadius: 35, padding: 4, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 16 },
  avatar: { flex: 1, borderRadius: 31 },
  name: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4 },
  specialty: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  statsRow: { flexDirection: 'row-reverse', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20, padding: 16, width: width - 40 },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800', color: '#fff' },
  statLab: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  content: { padding: 20, paddingBottom: 100 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', marginBottom: 12, textAlign: 'right' },
  bio: { fontSize: 14, color: '#71869b', lineHeight: 22, textAlign: 'right' },
  infoCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#dbe6f0' },
  infoRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 },
  infoRowText: { fontSize: 13, color: '#5a7288', marginRight: 10, flex: 1, textAlign: 'right' },
  emptyQualifications: { fontSize: 13, color: '#71869b', textAlign: 'right' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#dbe6f0' },
  bookBtn: { backgroundColor: '#1565c0', borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: '#1565c0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientDoctorScreen;
