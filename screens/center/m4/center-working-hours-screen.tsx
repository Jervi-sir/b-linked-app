import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { useAuthStore } from '@/zustand/auth-store';

type ScheduleItem = {
  id: number;
  slot_date: string;
  start_time: string | null;
  end_time: string | null;
  is_available: boolean;
};

type EditableScheduleItem = {
  slot_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

type ProfileResponse = {
  schedule: ScheduleItem[];
};

const emptySlot = (): EditableScheduleItem => ({
  slot_date: '',
  start_time: '',
  end_time: '',
  is_available: true,
});

const CenterWorkingHoursScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const fetchMe = useAuthStore(state => state.fetchMe);
  const [schedule, setSchedule] = useState<EditableScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const { data } = await api.get<ProfileResponse>('/center/profile');

        if (!isMounted) {
          return;
        }

        setSchedule(
          data.schedule.length > 0
            ? data.schedule.map(item => ({
                slot_date: item.slot_date,
                start_time: item.start_time ?? '',
                end_time: item.end_time ?? '',
                is_available: item.is_available,
              }))
            : [emptySlot()],
        );
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل ساعات العمل');
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

  const updateSlot = (index: number, patch: Partial<EditableScheduleItem>) => {
    setSchedule(current => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const addSlot = () => {
    setSchedule(current => [...current, emptySlot()]);
  };

  const removeSlot = (index: number) => {
    setSchedule(current => (current.length === 1 ? [emptySlot()] : current.filter((_, itemIndex) => itemIndex !== index)));
  };

  const handleSave = async () => {
    const invalid = schedule.find(item => !item.slot_date.trim() || !item.start_time.trim());

    if (invalid) {
      Alert.alert('بيانات غير مكتملة', 'يرجى إدخال التاريخ ووقت البداية لكل فترة عمل');
      return;
    }

    try {
      setIsSaving(true);
      await api.put('/center/profile/schedule', {
        schedule: schedule.map(item => ({
          slot_date: item.slot_date.trim(),
          start_time: item.start_time.trim(),
          end_time: item.end_time.trim() || null,
          is_available: item.is_available,
        })),
      });
      await fetchMe();
      Alert.alert('تم', 'تم تحديث ساعات العمل');
    } catch (error: any) {
      Alert.alert('خطأ', error?.response?.data?.message ?? 'تعذر حفظ ساعات العمل');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#12916d" />
        </View>
      </View>
    );
  }

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
              <Text style={styles.headerTitle}>ساعات العمل</Text>
              <Text style={styles.headerSub}>حدد الفترات الزمنية المتاحة للحجوزات</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.contentWrap}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            {schedule.map((item, index) => (
              <View key={`${item.slot_date}-${index}`} style={styles.slotCard}>
                <View style={styles.slotHeader}>
                  <TouchableOpacity style={styles.deleteIconBtn} onPress={() => removeSlot(index)}>
                    <Trash2 size={16} color="#c8403b" />
                  </TouchableOpacity>
                  <Text style={styles.slotTitle}>{`فترة العمل ${index + 1}`}</Text>
                </View>

                <Field label="التاريخ" value={item.slot_date} onChangeText={value => updateSlot(index, { slot_date: value })} placeholder="2026-05-04" />

                <View style={styles.timeRow}>
                  <Field label="إلى" value={item.end_time} onChangeText={value => updateSlot(index, { end_time: value })} placeholder="16:00" compact />
                  <Field label="من" value={item.start_time} onChangeText={value => updateSlot(index, { start_time: value })} placeholder="08:00" compact />
                </View>

                <View style={styles.switchRow}>
                  <Switch value={item.is_available} onValueChange={value => updateSlot(index, { is_available: value })} trackColor={{ false: '#dbe6f0', true: '#9fe0c9' }} thumbColor={item.is_available ? '#12916d' : '#f4f8fc'} />
                  <Text style={styles.switchLabel}>الفترة متاحة للحجز</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addBtn} onPress={addSlot}>
              <Plus size={18} color="#12916d" />
              <Text style={styles.addBtnText}>إضافة فترة عمل</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.floatingSaveWrap}>
          <TouchableOpacity style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveText}>{isSaving ? 'جارٍ الحفظ...' : 'حفظ ساعات العمل'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Field = ({ label, value, onChangeText, placeholder, compact = false }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; compact?: boolean }) => (
  <View style={[styles.fieldWrap, compact && styles.fieldWrapCompact]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#97a8b7" textAlign={compact ? 'center' : 'right'} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  backBtn: { marginLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'right' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  contentWrap: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 120 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#dbe6f0' },
  slotCard: { borderWidth: 1, borderColor: '#edf3f8', borderRadius: 18, padding: 14, marginBottom: 14, backgroundColor: '#fbfdff' },
  slotHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  slotTitle: { fontSize: 14, fontWeight: '800', color: '#17324a' },
  deleteIconBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#fdecee', alignItems: 'center', justifyContent: 'center' },
  fieldWrap: { marginBottom: 14 },
  fieldWrapCompact: { flex: 1, marginBottom: 0 },
  label: { fontSize: 13, fontWeight: '700', color: '#17324a', marginBottom: 8, textAlign: 'right' },
  input: { backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, minHeight: 48, borderWidth: 1, borderColor: '#dbe6f0', fontSize: 14, color: '#17324a' },
  timeRow: { flexDirection: 'row-reverse', gap: 12, marginBottom: 14 },
  switchRow: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#dbe6f0', padding: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  switchLabel: { color: '#17324a', fontSize: 14, fontWeight: '700', marginLeft: 12, flex: 1, textAlign: 'right' },
  addBtn: { borderRadius: 16, borderWidth: 1, borderColor: '#bfe9db', backgroundColor: '#eef8f4', paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  addBtnText: { color: '#12916d', fontSize: 14, fontWeight: '800' },
  floatingSaveWrap: { position: 'absolute', left: 16, right: 16, bottom: 20 },
  saveBtn: { backgroundColor: '#12916d', borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: '#12916d', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 10 },
  saveBtnDisabled: { opacity: 0.7 },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

export default CenterWorkingHoursScreen;
