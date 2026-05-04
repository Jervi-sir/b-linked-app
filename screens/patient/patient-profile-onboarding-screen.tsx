import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { api, AuthUser, PatientProfile } from '@/utils/auth';
import { useAuthStore } from '@/zustand/auth-store';

type ProfileResponse = {
  message: string;
  user: AuthUser;
};

const getMissingFields = (patient?: PatientProfile | null) => {
  const missing: string[] = [];

  if (!patient?.date_of_birth) missing.push('تاريخ الميلاد');
  if (!patient?.gender) missing.push('الجنس');
  if (!patient?.address?.trim()) missing.push('العنوان');
  if (!patient?.city?.trim()) missing.push('المدينة');
  if (!patient?.medical_notes?.trim()) missing.push('الملاحظات الطبية');

  return missing;
};

const PatientProfileOnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const fetchMe = useAuthStore(state => state.fetchMe);
  const patient = user?.patient ?? null;

  const [dateOfBirth, setDateOfBirth] = useState(patient?.date_of_birth ?? '');
  const [gender, setGender] = useState<'male' | 'female' | ''>((patient?.gender as 'male' | 'female' | null) ?? '');
  const [address, setAddress] = useState(patient?.address ?? '');
  const [city, setCity] = useState(patient?.city ?? '');
  const [medicalNotes, setMedicalNotes] = useState(patient?.medical_notes ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const missingFields = useMemo(() => getMissingFields(patient), [patient]);
  const isComplete = user?.profile_complete ?? false;

  const handleSubmit = async () => {
    if (!dateOfBirth.trim() || !gender || !address.trim() || !city.trim() || !medicalNotes.trim()) {
      Alert.alert('تنبيه', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setIsSubmitting(true);

      const { data } = await api.patch<ProfileResponse>('/patient/profile', {
        date_of_birth: dateOfBirth.trim(),
        gender,
        address: address.trim(),
        city: city.trim(),
        medical_notes: medicalNotes.trim(),
      });

      setUser(data.user);
      await fetchMe();
      Alert.alert('تم', data.message, [
        {
          text: 'متابعة',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.response?.data?.errors?.date_of_birth?.[0] || 'تعذر تحديث الملف الشخصي';
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
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>{isComplete ? 'ملفي الشخصي' : 'استكمال الملف الشخصي'}</Text>
              <Text style={styles.headerSub}>هذه البيانات مطلوبة لإكمال حساب المريض</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {!isComplete && missingFields.length > 0 ? (
            <View style={styles.noticeCard}>
              <Text style={styles.noticeTitle}>البيانات الناقصة</Text>
              <Text style={styles.noticeText}>{missingFields.join(' - ')}</Text>
            </View>
          ) : null}

          <View style={styles.formCard}>
            <Field label="تاريخ الميلاد">
              <TextInput
                style={styles.input}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="1998-12-31"
                textAlign="right"
              />
            </Field>

            <Field label="الجنس">
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[styles.genderChip, gender === 'female' && styles.genderChipActive]}
                  onPress={() => setGender('female')}
                >
                  <Text style={[styles.genderChipText, gender === 'female' && styles.genderChipTextActive]}>أنثى</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderChip, gender === 'male' && styles.genderChipActive]}
                  onPress={() => setGender('male')}
                >
                  <Text style={[styles.genderChipText, gender === 'male' && styles.genderChipTextActive]}>ذكر</Text>
                </TouchableOpacity>
              </View>
            </Field>

            <Field label="العنوان">
              <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="حي، شارع، رقم" textAlign="right" />
            </Field>

            <Field label="المدينة">
              <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="الجزائر" textAlign="right" />
            </Field>

            <Field label="الملاحظات الطبية">
              <TextInput
                style={[styles.input, styles.textArea]}
                value={medicalNotes}
                onChangeText={setMedicalNotes}
                placeholder="حساسيات، أمراض مزمنة، ملاحظات مهمة"
                textAlign="right"
                multiline
              />
            </Field>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>{isSubmitting ? 'جارٍ الحفظ...' : 'حفظ واستكمال الملف'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  flex: { flex: 1 },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { marginLeft: 16 },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', textAlign: 'right', marginTop: 4 },
  content: { padding: 16, paddingBottom: 36 },
  noticeCard: { backgroundColor: '#fff7e8', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#ffe0a3', marginBottom: 16 },
  noticeTitle: { fontSize: 15, fontWeight: '900', color: '#8a5600', textAlign: 'right', marginBottom: 6 },
  noticeText: { fontSize: 13, color: '#8a5600', textAlign: 'right', lineHeight: 20 },
  formCard: { backgroundColor: '#fff', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#dbe6f0' },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 8 },
  input: { backgroundColor: '#fbfdff', borderRadius: 14, paddingHorizontal: 14, height: 52, borderWidth: 1, borderColor: '#dbe6f0', fontSize: 14, color: '#17324a' },
  textArea: { minHeight: 112, paddingTop: 14, textAlignVertical: 'top' },
  genderRow: { flexDirection: 'row-reverse', gap: 10 },
  genderChip: { flex: 1, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#dbe6f0', paddingVertical: 14, alignItems: 'center' },
  genderChipActive: { backgroundColor: '#1565c0', borderColor: '#1565c0' },
  genderChipText: { color: '#17324a', fontSize: 14, fontWeight: '800' },
  genderChipTextActive: { color: '#fff' },
  submitButton: { backgroundColor: '#1565c0', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientProfileOnboardingScreen;
