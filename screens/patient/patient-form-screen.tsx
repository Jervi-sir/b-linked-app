import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Phone, User } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { Routes } from '@/utils/variables/routes';
import { useAuthStore } from '@/zustand/auth-store';

type BookingService = {
  id: number;
  name: string;
  price: string | number | null;
};

type BookingSlot = {
  id: number;
  service_id?: number;
  service_name?: string;
  date: string | null;
  date_label: string | null;
  time: string | null;
  label: string;
};

type BookingOptionsPayload = {
  bookable: {
    type: 'doctor' | 'center';
    id: number;
    name: string | null;
    subtitle: string;
  };
  services: BookingService[];
  slots: BookingSlot[];
};

type BookingStorePayload = {
  booking: {
    id: number;
    reference: string;
  };
};

const PatientFormScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RouteProp<Record<string, { bookableType?: 'doctor' | 'center'; bookableId?: number }>, string>>();
  const user = useAuthStore(state => state.user);
  const bookableType = route.params?.bookableType;
  const bookableId = route.params?.bookableId;

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [options, setOptions] = useState<BookingOptionsPayload | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async () => {
      if (!bookableType || !bookableId) {
        Alert.alert('خطأ', 'بيانات الحجز غير مكتملة');
        navigation.goBack();
        return;
      }

      try {
        const { data } = await api.get<BookingOptionsPayload>('/patient/bookings/options', {
          params: {
            bookable_type: bookableType,
            bookable_id: bookableId,
          },
        });

        if (!isMounted) {
          return;
        }

        setOptions(data);
        if (data.bookable.type === 'center' && data.services.length > 0) {
          setSelectedServiceId(data.services[0].id);
        }
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل خيارات الحجز');
          navigation.goBack();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, [bookableId, bookableType, navigation]);

  const visibleSlots = useMemo(() => {
    if (!options) {
      return [];
    }

    if (options.bookable.type === 'doctor') {
      return options.slots;
    }

    return options.slots.filter(slot => !selectedServiceId || slot.service_id === selectedServiceId);
  }, [options, selectedServiceId]);

  useEffect(() => {
    setSelectedSlotId(null);
  }, [selectedServiceId]);

  const handleSubmit = async () => {
    if (!bookableType || !bookableId || !selectedSlotId || !fullName.trim() || !phone.trim()) {
      Alert.alert('تنبيه', 'يرجى استكمال بيانات الحجز واختيار موعد متاح');
      return;
    }

    try {
      setIsSubmitting(true);

      const { data } = await api.post<BookingStorePayload>('/patient/bookings', {
        bookable_type: bookableType,
        bookable_id: bookableId,
        full_name: fullName.trim(),
        phone: phone.trim(),
        slot_id: selectedSlotId,
        service_id: bookableType === 'center' ? selectedServiceId : null,
      });

      navigation.replace(Routes.PatientSuccessScreen, {
        reference: data.booking.reference,
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.response?.data?.errors?.slot_id?.[0] || 'تعذر إتمام الحجز';
      Alert.alert('خطأ', message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Text style={styles.headerTitle}>طلب حجز</Text>
              <Text style={styles.headerSub}>{options?.bookable.name ?? 'أدخل بيانات الموعد'}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading || !options ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1565c0" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الجهة المختارة</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryName}>{options.bookable.name}</Text>
              <Text style={styles.summarySub}>{options.bookable.subtitle}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات المريض</Text>
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>الاسم الكامل</Text>
                <View style={styles.inputWrap}>
                  <User size={18} color="#8aa0b4" />
                  <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="أحمد محمد" textAlign="right" />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>رقم الهاتف</Text>
                <View style={styles.inputWrap}>
                  <Phone size={18} color="#8aa0b4" />
                  <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="0555 00 00 00" keyboardType="phone-pad" textAlign="right" />
                </View>
              </View>
            </View>
          </View>

          {options.bookable.type === 'center' ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>اختر الخدمة</Text>
              <View style={styles.chipsWrap}>
                {options.services.map(service => (
                  <TouchableOpacity
                    key={service.id}
                    style={[styles.chip, selectedServiceId === service.id && styles.chipActive]}
                    onPress={() => setSelectedServiceId(service.id)}
                  >
                    <Text style={[styles.chipText, selectedServiceId === service.id && styles.chipTextActive]}>{service.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اختر الموعد</Text>
            <View style={styles.chipsWrap}>
              {visibleSlots.map(slot => (
                <TouchableOpacity
                  key={slot.id}
                  style={[styles.chip, selectedSlotId === slot.id && styles.chipActive]}
                  onPress={() => setSelectedSlotId(slot.id)}
                >
                  <Text style={[styles.chipText, selectedSlotId === slot.id && styles.chipTextActive]}>{slot.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {visibleSlots.length === 0 ? <Text style={styles.emptyText}>لا توجد مواعيد متاحة حالياً</Text> : null}
          </View>

          <TouchableOpacity style={[styles.confirmBtn, isSubmitting && styles.confirmBtnDisabled]} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.confirmBtnText}>{isSubmitting ? 'جارٍ تأكيد الحجز...' : 'تأكيد الحجز'}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  backBtn: { marginLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'right' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 32 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', marginBottom: 12, textAlign: 'right' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#dbe6f0' },
  summaryName: { fontSize: 16, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 4 },
  summarySub: { fontSize: 13, color: '#71869b', textAlign: 'right' },
  form: { gap: 12 },
  field: { gap: 6 },
  label: { fontSize: 12, color: '#71869b', textAlign: 'right', marginRight: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 12, height: 50, borderWidth: 1, borderColor: '#dbe6f0' },
  input: { flex: 1, marginRight: 10, fontSize: 14, color: '#17324a' },
  chipsWrap: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: '#dbe6f0' },
  chipActive: { backgroundColor: '#1565c0', borderColor: '#1565c0' },
  chipText: { fontSize: 13, color: '#17324a', fontWeight: '700' },
  chipTextActive: { color: '#fff' },
  emptyText: { color: '#71869b', fontSize: 13, textAlign: 'right', marginTop: 8 },
  confirmBtn: { backgroundColor: '#1565c0', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  confirmBtnDisabled: { opacity: 0.7 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientFormScreen;
