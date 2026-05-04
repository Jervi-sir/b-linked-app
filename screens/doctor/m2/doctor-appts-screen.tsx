import React, { useEffect, useState } from 'react';
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
import { Calendar, Check, ChevronLeft, Clock, X } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { api } from '@/utils/auth';

type TabKey = 'pending' | 'confirmed' | 'previous';

type TabItem = {
  key: TabKey;
  label: string;
  count: number;
};

type AppointmentItem = {
  id: number;
  reference: string;
  patient_name: string;
  date: string | null;
  time: string | null;
  visit_type: string;
  status: string;
  status_key: string;
  proposed_date: string | null;
  proposed_time: string | null;
  has_pending_proposal: boolean;
  can_confirm: boolean;
  can_reject: boolean;
  can_suggest_new_time: boolean;
};

type AppointmentsResponse = {
  tabs: TabItem[];
  appointments: AppointmentItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    next_page: number | null;
  };
};

type RequestItemProps = {
  appointment: AppointmentItem;
  isUpdating: boolean;
  isSuggesting: boolean;
  onConfirm: () => void;
  onReject: () => void;
  onSuggest: (proposedDate: string, proposedTime: string) => void;
};

const DoctorApptsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [suggestingId, setSuggestingId] = useState<number | null>(null);

  const loadAppointments = async (tab: TabKey, page = 1) => {
    const { data } = await api.get<AppointmentsResponse>('/doctor/appointments', {
      params: { tab, page },
    });

    setTabs(data.tabs);
    setAppointments(current => (page === 1 ? data.appointments : [...current, ...data.appointments]));
    setNextPage(data.pagination.next_page);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        await loadAppointments(activeTab);
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل المواعيد');
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
      await loadAppointments(tab);
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل المواعيد');
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
      await loadAppointments(activeTab, nextPage);
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل المزيد من المواعيد');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: 'confirmed' | 'rejected') => {
    try {
      setUpdatingId(appointmentId);
      await api.patch(`/doctor/appointments/${appointmentId}`, { status });
      await loadAppointments(activeTab);
    } catch {
      Alert.alert('خطأ', status === 'confirmed' ? 'تعذر تأكيد الموعد' : 'تعذر رفض الموعد');
    } finally {
      setUpdatingId(null);
    }
  };

  const suggestNewTime = async (appointmentId: number, proposedDate: string, proposedTime: string) => {
    try {
      setSuggestingId(appointmentId);
      await api.post(`/doctor/appointments/${appointmentId}/suggest-time`, {
        proposed_date: proposedDate,
        proposed_time: proposedTime,
      });
      await loadAppointments(activeTab);
      Alert.alert('تم', 'تم إرسال الموعد المقترح للمريض');
    } catch (error) {
      Alert.alert('خطأ', error instanceof Error ? error.message : 'تعذر إرسال الموعد المقترح');
    } finally {
      setSuggestingId(null);
    }
  };

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
              <Text style={styles.headerTitle}>إدارة المواعيد</Text>
              <Text style={styles.headerSub}>متابعة طلبات الحجز والحالات الحالية</Text>
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
          <ActivityIndicator size="large" color="#394fd0" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.list}>
            {appointments.map(appointment => (
              <RequestItem
                key={appointment.id}
                appointment={appointment}
                isUpdating={updatingId === appointment.id}
                isSuggesting={suggestingId === appointment.id}
                onConfirm={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                onReject={() => updateAppointmentStatus(appointment.id, 'rejected')}
                onSuggest={(proposedDate, proposedTime) => suggestNewTime(appointment.id, proposedDate, proposedTime)}
              />
            ))}
          </View>

          {appointments.length === 0 ? <Text style={styles.emptyText}>لا توجد مواعيد في هذا القسم حالياً</Text> : null}

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

const RequestItem = ({ appointment, isUpdating, isSuggesting, onConfirm, onReject, onSuggest }: RequestItemProps) => {
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');

  const handleSuggest = () => {
    if (!proposedDate.trim() || !proposedTime.trim()) {
      Alert.alert('بيانات غير مكتملة', 'يرجى إدخال التاريخ والوقت المقترحين');
      return;
    }

    onSuggest(proposedDate.trim(), proposedTime.trim());
  };

  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{appointment.patient_name}</Text>
          <Text style={styles.visitType}>{appointment.visit_type}</Text>
        </View>
        <View style={styles.avatar} />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Calendar size={14} color="#71869b" />
          <Text style={styles.metaText}>{appointment.date ?? '-'}</Text>
        </View>
        <View style={styles.meta}>
          <Clock size={14} color="#71869b" />
          <Text style={styles.metaText}>{appointment.time ?? '-'}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.statusPill}>{appointment.status}</Text>
        </View>
      </View>

      {appointment.has_pending_proposal ? (
        <View style={styles.proposalCard}>
          <Text style={styles.proposalTitle}>موعد مقترح للمريض</Text>
          <Text style={styles.proposalText}>{`${appointment.proposed_date ?? '-'} - ${appointment.proposed_time ?? '-'}`}</Text>
        </View>
      ) : null}

      {appointment.can_suggest_new_time ? (
        <View style={styles.suggestWrap}>
          <Text style={styles.suggestTitle}>اقتراح موعد جديد</Text>
          <View style={styles.suggestRow}>
            <TextInput
              style={styles.suggestInput}
              placeholder="14:30"
              value={proposedTime}
              onChangeText={setProposedTime}
              textAlign="center"
            />
            <TextInput
              style={styles.suggestInput}
              placeholder="2026-05-10"
              value={proposedDate}
              onChangeText={setProposedDate}
              textAlign="center"
            />
          </View>
          <TouchableOpacity style={[styles.suggestBtn, isSuggesting && styles.actionDisabled]} onPress={handleSuggest} disabled={isSuggesting}>
            <Text style={styles.suggestBtnText}>{isSuggesting ? 'جارٍ الإرسال...' : 'إرسال الموعد المقترح'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {appointment.can_confirm || appointment.can_reject ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.acceptBtn, isUpdating && styles.actionDisabled]}
            onPress={onConfirm}
            disabled={isUpdating || !appointment.can_confirm}
          >
            <Check size={18} color="#fff" />
            <Text style={styles.btnText}>{isUpdating ? 'جارٍ التحديث...' : 'قبول'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rejectBtn, isUpdating && styles.actionDisabled]}
            onPress={onReject}
            disabled={isUpdating || !appointment.can_reject}
          >
            <X size={18} color="#c8403b" />
            <Text style={styles.rejectText}>رفض</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
  tabs: { flexDirection: 'row-reverse', padding: 16, gap: 10 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe6f0' },
  tabActive: { backgroundColor: '#394fd0', borderColor: '#394fd0' },
  tabText: { fontSize: 13, color: '#5a7288', fontWeight: '700' },
  tabTextActive: { color: '#fff' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  list: { gap: 16 },
  item: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#394fd0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  itemHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#eef1ff' },
  patientInfo: { flex: 1, paddingRight: 12 },
  patientName: { fontSize: 16, fontWeight: '800', color: '#17324a', textAlign: 'right' },
  visitType: { fontSize: 12, color: '#71869b', textAlign: 'right' },
  metaRow: { flexDirection: 'row-reverse', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f4f8', flexWrap: 'wrap' },
  meta: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#5a7288' },
  statusPill: { fontSize: 11, color: '#394fd0', backgroundColor: '#eef1ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  proposalCard: { backgroundColor: '#f7f9ff', borderRadius: 16, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#dce4ff' },
  proposalTitle: { fontSize: 12, fontWeight: '800', color: '#394fd0', textAlign: 'right', marginBottom: 4 },
  proposalText: { fontSize: 12, color: '#4b6075', textAlign: 'right' },
  suggestWrap: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4ebf5', borderRadius: 16, padding: 12, marginBottom: 14 },
  suggestTitle: { fontSize: 13, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 10 },
  suggestRow: { flexDirection: 'row-reverse', gap: 10, marginBottom: 10 },
  suggestInput: { flex: 1, backgroundColor: '#fbfdff', borderRadius: 12, minHeight: 46, borderWidth: 1, borderColor: '#dbe6f0', fontSize: 13, color: '#17324a' },
  suggestBtn: { backgroundColor: '#eef1ff', borderRadius: 12, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  suggestBtnText: { color: '#394fd0', fontSize: 13, fontWeight: '800' },
  actions: { flexDirection: 'row-reverse', gap: 10 },
  acceptBtn: { flex: 1, backgroundColor: '#12916d', height: 48, borderRadius: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  rejectBtn: { flex: 1, backgroundColor: '#fff', height: 48, borderRadius: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#c8403b' },
  actionDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  rejectText: { color: '#c8403b', fontSize: 14, fontWeight: '800' },
  emptyText: { color: '#71869b', fontSize: 13, textAlign: 'center', marginTop: 24 },
  loadMoreBtn: { backgroundColor: '#394fd0', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  loadMoreBtnDisabled: { opacity: 0.7 },
  loadMoreText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});

export default DoctorApptsScreen;
