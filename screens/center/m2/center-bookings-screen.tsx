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
import { Calendar, Check, ChevronLeft, Clock, User, X } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { api } from '@/utils/auth';

type TabKey = 'new' | 'today' | 'all';

type TabItem = {
  key: TabKey;
  label: string;
  count: number;
};

type BookingItem = {
  id: number;
  reference: string;
  patient_name: string;
  service_name: string;
  date: string | null;
  time: string | null;
  status: string;
  status_key: string;
  can_confirm: boolean;
  can_cancel: boolean;
};

type BookingsResponse = {
  tabs: TabItem[];
  bookings: BookingItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    next_page: number | null;
  };
};

type BookingCardProps = {
  booking: BookingItem;
  isUpdating: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const CenterBookingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('new');
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadBookings = async (tab: TabKey, page = 1) => {
    const { data } = await api.get<BookingsResponse>('/center/bookings', {
      params: { tab, page },
    });

    setTabs(data.tabs);
    setBookings(current => (page === 1 ? data.bookings : [...current, ...data.bookings]));
    setNextPage(data.pagination.next_page);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        await loadBookings(activeTab);
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

  const handleTabPress = async (tab: TabKey) => {
    if (tab === activeTab || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setActiveTab(tab);
      await loadBookings(tab);
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل الحجوزات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextPage || isLoadingMore) {
      return;
    }

    try {
      setIsLoadingMore(true);
      await loadBookings(activeTab, nextPage);
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل المزيد من الحجوزات');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, status: 'confirmed' | 'cancelled') => {
    try {
      setUpdatingId(bookingId);
      await api.patch(`/center/bookings/${bookingId}`, { status });
      await loadBookings(activeTab);
    } catch {
      Alert.alert('خطأ', status === 'confirmed' ? 'تعذر تأكيد الحجز' : 'تعذر إلغاء الحجز');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0c7058', '#12916d']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>إدارة الحجوزات</Text>
              <Text style={styles.headerSub}>متابعة طلبات الفحص والتحاليل</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => handleTabPress(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {`${tab.label} (${tab.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#12916d" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.list}>
            {bookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isUpdating={updatingId === booking.id}
                onConfirm={() => updateBookingStatus(booking.id, 'confirmed')}
                onCancel={() => updateBookingStatus(booking.id, 'cancelled')}
              />
            ))}
          </View>

          {bookings.length === 0 ? <Text style={styles.emptyText}>لا توجد حجوزات في هذا القسم حالياً</Text> : null}

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

const BookingCard = ({ booking, isUpdating, onConfirm, onCancel }: BookingCardProps) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{booking.patient_name}</Text>
        <Text style={styles.serviceName}>{booking.service_name}</Text>
      </View>
      <View style={styles.avatarWrap}>
        <User size={24} color="#0c7058" />
      </View>
    </View>

    <View style={styles.metaRow}>
      <View style={styles.meta}>
        <Calendar size={14} color="#71869b" />
        <Text style={styles.metaText}>{booking.date ?? '-'}</Text>
      </View>
      <View style={styles.meta}>
        <Clock size={14} color="#71869b" />
        <Text style={styles.metaText}>{booking.time ?? '-'}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.statusPill}>{booking.status}</Text>
      </View>
    </View>

    {booking.can_confirm || booking.can_cancel ? (
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.confirmBtn, isUpdating && styles.actionDisabled]}
          onPress={onConfirm}
          disabled={isUpdating || !booking.can_confirm}
        >
          <Check size={18} color="#fff" />
          <Text style={styles.btnText}>{isUpdating ? 'جارٍ التحديث...' : 'تأكيد'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cancelBtn, isUpdating && styles.actionDisabled]}
          onPress={onCancel}
          disabled={isUpdating || !booking.can_cancel}
        >
          <X size={18} color="#c8403b" />
          <Text style={styles.cancelBtnText}>إلغاء</Text>
        </TouchableOpacity>
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  backBtn: { marginLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'right' },
  tabs: { flexDirection: 'row-reverse', padding: 16, gap: 10 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe6f0' },
  tabActive: { backgroundColor: '#12916d', borderColor: '#12916d' },
  tabText: { fontSize: 13, color: '#5a7288', fontWeight: '700' },
  tabTextActive: { color: '#fff' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  list: { gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#12916d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 16 },
  avatarWrap: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#eaf9f4', alignItems: 'center', justifyContent: 'center' },
  patientInfo: { flex: 1, paddingRight: 12 },
  patientName: { fontSize: 16, fontWeight: '800', color: '#17324a', textAlign: 'right' },
  serviceName: { fontSize: 12, color: '#12916d', textAlign: 'right' },
  metaRow: { flexDirection: 'row-reverse', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f4f8', flexWrap: 'wrap' },
  meta: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#5a7288' },
  statusPill: { fontSize: 11, color: '#12916d', backgroundColor: '#eaf9f4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  actions: { flexDirection: 'row-reverse', gap: 10 },
  confirmBtn: { flex: 1, backgroundColor: '#12916d', height: 48, borderRadius: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  cancelBtn: { flex: 1, backgroundColor: '#fff', height: 48, borderRadius: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#c8403b' },
  actionDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  cancelBtnText: { color: '#c8403b', fontSize: 14, fontWeight: '800' },
  emptyText: { color: '#71869b', fontSize: 13, textAlign: 'center', marginTop: 24 },
  loadMoreBtn: { backgroundColor: '#12916d', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  loadMoreBtnDisabled: { opacity: 0.7 },
  loadMoreText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});

export default CenterBookingsScreen;
