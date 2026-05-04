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
import { Calendar, Clock } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { Routes } from '@/utils/variables/routes';

type BookingItemData = {
  id: number;
  reference: string;
  name: string;
  specialty: string;
  date: string | null;
  time: string | null;
  status: string;
  status_color: string;
  is_center: boolean;
  bookable_type: 'doctor' | 'center';
  bookable_id: number;
};

type BookingsPayload = {
  bookings: BookingItemData[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    next_page: number | null;
  };
};

type BookingItemProps = {
  id: string;
  name: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
  statusColor: string;
  onPress: () => void;
};

const PatientBookingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [bookings, setBookings] = useState<BookingItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(null);

  const loadBookings = async (page = 1) => {
    const { data } = await api.get<BookingsPayload>('/patient/bookings', {
      params: { page },
    });

    setBookings(current => (page === 1 ? data.bookings : [...current, ...data.bookings]));
    setNextPage(data.pagination.next_page);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        if (!isMounted) {
          return;
        }

        await loadBookings();
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل الحجوزات');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBookingPress = (booking: BookingItemData) => {
    if (booking.is_center) {
      navigation.navigate(Routes.PatientCenterScreen, { id: booking.bookable_id });
      return;
    }

    navigation.navigate(Routes.PatientDoctorScreen, { id: booking.bookable_id });
  };

  const handleLoadMore = async () => {
    if (!nextPage || isLoadingMore) {
      return;
    }

    try {
      setIsLoadingMore(true);
      await loadBookings(nextPage);
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل المزيد من الحجوزات');
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0d3f6a', '#1f88e5']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>حجوزاتي</Text>
              <Text style={styles.headerSub}>متابعة حالة المواعيد</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1565c0" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.list}>
            {bookings.map(booking => (
              <BookingItem
                key={booking.id}
                id={booking.reference}
                name={booking.name}
                specialty={booking.specialty}
                date={booking.date ?? '-'}
                time={booking.time ?? '-'}
                status={booking.status}
                statusColor={booking.status_color}
                onPress={() => handleBookingPress(booking)}
              />
            ))}
          </View>

          {bookings.length === 0 ? <Text style={styles.emptyText}>لا توجد حجوزات حالياً</Text> : null}

          {nextPage ? (
            <TouchableOpacity
              style={[styles.loadMoreBtn, isLoadingMore && styles.loadMoreBtnDisabled]}
              onPress={handleLoadMore}
              disabled={isLoadingMore}
            >
              <Text style={styles.loadMoreText}>{isLoadingMore ? 'جارٍ التحميل...' : 'تحميل المزيد'}</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
};

const BookingItem = ({ id, name, specialty, date, time, status, statusColor, onPress }: BookingItemProps) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      <Text style={[styles.status, { color: statusColor, backgroundColor: `${statusColor}15` }]}>{status}</Text>
      <Text style={styles.bookingId}>{id}</Text>
    </View>
    <View style={styles.itemBody}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemSpecialty}>{specialty}</Text>
        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Calendar size={12} color="#71869b" />
            <Text style={styles.metaText}>{date}</Text>
          </View>
          <View style={styles.meta}>
            <Clock size={12} color="#71869b" />
            <Text style={styles.metaText}>{time}</Text>
          </View>
        </View>
      </View>
      <View style={styles.thumb} />
    </View>
    <TouchableOpacity style={styles.detailsBtn} onPress={onPress}>
      <Text style={styles.detailsBtnText}>عرض التفاصيل</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-end' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  list: { gap: 16 },
  item: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#1565c0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  bookingId: { fontSize: 12, fontWeight: '700', color: '#17324a' },
  status: { fontSize: 10, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  itemBody: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 16 },
  itemInfo: { flex: 1, paddingRight: 12 },
  itemName: { fontSize: 16, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 2 },
  itemSpecialty: { fontSize: 13, color: '#1565c0', textAlign: 'right', marginBottom: 8 },
  metaRow: { flexDirection: 'row-reverse', gap: 12 },
  meta: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: '#71869b' },
  thumb: { width: 60, height: 60, borderRadius: 14, backgroundColor: '#f8fbff', borderWidth: 1, borderColor: '#dce9f6' },
  detailsBtn: { borderTopWidth: 1, borderTopColor: '#f0f4f8', paddingTop: 12, alignItems: 'center' },
  detailsBtnText: { fontSize: 13, fontWeight: '800', color: '#1565c0' },
  emptyText: { color: '#71869b', fontSize: 13, textAlign: 'center', marginTop: 24 },
  loadMoreBtn: { backgroundColor: '#1565c0', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  loadMoreBtnDisabled: { opacity: 0.7 },
  loadMoreText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});

export default PatientBookingsScreen;
