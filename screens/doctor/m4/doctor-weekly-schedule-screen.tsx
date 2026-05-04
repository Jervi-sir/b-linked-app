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
import { ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { useAuthStore } from '@/zustand/auth-store';

type ScheduleItem = {
  id: number;
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
};

type ProfileResponse = {
  schedule: ScheduleItem[];
};

type EditableScheduleItem = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

const dayLabels: Record<number, string> = {
  0: 'الأحد',
  1: 'الإثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
};

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const DoctorWeeklyScheduleScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const fetchMe = useAuthStore(state => state.fetchMe);
  const [schedule, setSchedule] = useState<EditableScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const { data } = await api.get<ProfileResponse>('/doctor/profile');

        if (!isMounted) {
          return;
        }

        const mapped = Array.from({ length: 7 }, (_, day) => {
          const entry = data.schedule.find(item => item.day_of_week === day);

          return {
            day_of_week: day,
            start_time: entry?.start_time ?? '',
            end_time: entry?.end_time ?? '',
            is_active: entry?.is_active ?? false,
          };
        });

        setSchedule(mapped);
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل الجدول الأسبوعي');
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

  const updateDay = (day: number, patch: Partial<EditableScheduleItem>) => {
    setSchedule(current => current.map(item => (item.day_of_week === day ? { ...item, ...patch } : item)));
  };

  const handleSave = async () => {
    const invalidDay = schedule.find(item => {
      if (!item.is_active) {
        return false;
      }

      if (!item.start_time.trim() || !item.end_time.trim()) {
        return true;
      }

      return !timePattern.test(item.start_time.trim()) || !timePattern.test(item.end_time.trim());
    });

    if (invalidDay) {
      Alert.alert(
        'بيانات غير مكتملة',
        `يرجى إدخال وقت بداية ونهاية صحيحين بصيغة HH:mm ليوم ${dayLabels[invalidDay.day_of_week]}`
      );
      return;
    }

    try {
      setIsSaving(true);
      await api.put('/doctor/profile/schedule', {
        schedule: schedule.map(item => ({
          day_of_week: item.day_of_week,
          start_time: item.is_active ? item.start_time.trim() || null : null,
          end_time: item.is_active ? item.end_time.trim() || null : null,
          is_active: item.is_active,
        })),
      });
      await fetchMe();
      Alert.alert('تم', 'تم تحديث الجدول الأسبوعي');
    } catch (error) {
      Alert.alert('خطأ', error instanceof Error ? error.message : 'تعذر حفظ الجدول');
    } finally {
      setIsSaving(false);
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
              <Text style={styles.headerTitle}>تعديل الجدول الأسبوعي</Text>
              <Text style={styles.headerSub}>حدد أيام العمل وساعات الاستقبال</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#394fd0" />
        </View>
      ) : (
        <View style={styles.contentWrap}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              {schedule.map(item => (
                <View key={item.day_of_week} style={styles.dayRow}>
                  <View style={styles.dayHeader}>
                    <Switch
                      value={item.is_active}
                      onValueChange={value => updateDay(item.day_of_week, { is_active: value })}
                      trackColor={{ false: '#dbe6f0', true: '#9db0ff' }}
                      thumbColor={item.is_active ? '#394fd0' : '#fff'}
                    />
                    <Text style={styles.dayTitle}>{dayLabels[item.day_of_week]}</Text>
                  </View>

                  <View style={styles.timeRow}>
                    <TimeField
                      label="إلى"
                      value={item.end_time}
                      onChangeText={value => updateDay(item.day_of_week, { end_time: value })}
                      disabled={!item.is_active}
                    />
                    <TimeField
                      label="من"
                      value={item.start_time}
                      onChangeText={value => updateDay(item.day_of_week, { start_time: value })}
                      disabled={!item.is_active}
                    />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.floatingSaveWrap}>
            <TouchableOpacity style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} onPress={handleSave} disabled={isSaving}>
              <Text style={styles.saveText}>{isSaving ? 'جارٍ الحفظ...' : 'حفظ الجدول'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

type TimeFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  disabled: boolean;
};

const TimeField = ({ label, value, onChangeText, disabled }: TimeFieldProps) => (
  <View style={styles.timeField}>
    <Text style={styles.timeLabel}>{label}</Text>
    <TextInput
      style={[styles.timeInput, disabled && styles.timeInputDisabled]}
      value={value}
      onChangeText={onChangeText}
      editable={!disabled}
      placeholder="08:00"
      textAlign="center"
    />
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
  dayRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f4f8' },
  dayHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  dayTitle: { fontSize: 15, fontWeight: '800', color: '#17324a' },
  timeRow: { flexDirection: 'row-reverse', gap: 12 },
  timeField: { flex: 1 },
  timeLabel: { fontSize: 12, color: '#71869b', textAlign: 'right', marginBottom: 6 },
  timeInput: { backgroundColor: '#fbfdff', borderRadius: 14, minHeight: 48, borderWidth: 1, borderColor: '#dbe6f0', fontSize: 14, color: '#17324a' },
  timeInputDisabled: { opacity: 0.5 },
  floatingSaveWrap: { position: 'absolute', left: 16, right: 16, bottom: 20 },
  saveBtn: { backgroundColor: '#394fd0', borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: '#394fd0', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 },
  saveBtnDisabled: { opacity: 0.7 },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

export default DoctorWeeklyScheduleScreen;
