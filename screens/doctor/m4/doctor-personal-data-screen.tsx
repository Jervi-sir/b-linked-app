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

type SpecialityOption = {
  id: number;
  label: string;
};

type ProfileResponse = {
  profile: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    specialty_id: number | null;
    license_number: string | null;
    years_experience: string | null;
    phone_public: string | null;
    bio: string | null;
    address: string | null;
    city: string | null;
    is_available: boolean;
  };
  specialities: SpecialityOption[];
};

const DoctorPersonalDataScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const fetchMe = useAuthStore(state => state.fetchMe);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [specialities, setSpecialities] = useState<SpecialityOption[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialtyId, setSpecialtyId] = useState<number | null>(null);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [phonePublic, setPhonePublic] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const { data } = await api.get<ProfileResponse>('/doctor/profile');

        if (!isMounted) {
          return;
        }

        setSpecialities(data.specialities);
        setFullName(data.profile.full_name ?? '');
        setEmail(data.profile.email ?? '');
        setPhone(data.profile.phone ?? '');
        setSpecialtyId(data.profile.specialty_id ?? null);
        setLicenseNumber(data.profile.license_number ?? '');
        setYearsExperience(data.profile.years_experience ?? '');
        setPhonePublic(data.profile.phone_public ?? '');
        setBio(data.profile.bio ?? '');
        setAddress(data.profile.address ?? '');
        setCity(data.profile.city ?? '');
        setIsAvailable(data.profile.is_available ?? true);
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل البيانات الشخصية');
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.patch('/doctor/profile', {
        full_name: fullName,
        email: email || null,
        phone: phone || null,
        specialty_id: specialtyId,
        license_number: licenseNumber || null,
        years_experience: yearsExperience || null,
        phone_public: phonePublic || null,
        bio: bio || null,
        address: address || null,
        city: city || null,
        is_available: isAvailable,
      });
      await fetchMe();
      Alert.alert('تم', 'تم حفظ البيانات الشخصية');
    } catch (error) {
      Alert.alert('خطأ', error instanceof Error ? error.message : 'تعذر حفظ البيانات');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedSpeciality = specialities.find(item => item.id === specialtyId)?.label ?? 'اختر التخصص';

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
              <Text style={styles.headerTitle}>البيانات الشخصية</Text>
              <Text style={styles.headerSub}>تحديث معلومات الملف المهني</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#394fd0" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Field label="الاسم الكامل" value={fullName} onChangeText={setFullName} />
            <Field label="البريد الإلكتروني" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Field label="الهاتف" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

            <Text style={styles.label}>التخصص</Text>
            <View style={styles.optionsWrap}>
              {specialities.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.optionChip, specialtyId === item.id && styles.optionChipActive]}
                  onPress={() => setSpecialtyId(item.id)}
                >
                  <Text style={[styles.optionText, specialtyId === item.id && styles.optionTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.selectedText}>{selectedSpeciality}</Text>

            <Field label="رقم الترخيص" value={licenseNumber} onChangeText={setLicenseNumber} />
            <Field label="سنوات الخبرة" value={yearsExperience} onChangeText={setYearsExperience} />
            <Field label="هاتف العيادة" value={phonePublic} onChangeText={setPhonePublic} keyboardType="phone-pad" />
            <Field label="المدينة" value={city} onChangeText={setCity} />
            <Field label="العنوان" value={address} onChangeText={setAddress} multiline />
            <Field label="نبذة" value={bio} onChangeText={setBio} multiline />

            <View style={styles.availabilityRow}>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: '#dbe6f0', true: '#9db0ff' }}
                thumbColor={isAvailable ? '#394fd0' : '#fff'}
              />
              <Text style={styles.availabilityText}>متاح للحجوزات</Text>
            </View>

            <TouchableOpacity style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} onPress={handleSave} disabled={isSaving}>
              <Text style={styles.saveText}>{isSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  multiline?: boolean;
};

const Field = ({ label, value, onChangeText, keyboardType = 'default', multiline = false }: FieldProps) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      textAlign="right"
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
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#dbe6f0' },
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#17324a', marginBottom: 8, textAlign: 'right' },
  input: { backgroundColor: '#fbfdff', borderRadius: 14, paddingHorizontal: 14, minHeight: 52, borderWidth: 1, borderColor: '#dbe6f0', fontSize: 14, color: '#17324a' },
  inputMultiline: { minHeight: 92, paddingTop: 14 },
  optionsWrap: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  optionChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe6f0' },
  optionChipActive: { backgroundColor: '#394fd0', borderColor: '#394fd0' },
  optionText: { color: '#4b6075', fontSize: 12, fontWeight: '700' },
  optionTextActive: { color: '#fff' },
  selectedText: { marginTop: 10, marginBottom: 16, textAlign: 'right', color: '#71869b', fontSize: 12 },
  availabilityRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, backgroundColor: '#fbfdff', borderRadius: 14, borderWidth: 1, borderColor: '#dbe6f0', paddingHorizontal: 14, paddingVertical: 10 },
  availabilityText: { fontSize: 14, fontWeight: '700', color: '#17324a' },
  saveBtn: { backgroundColor: '#394fd0', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  saveBtnDisabled: { opacity: 0.7 },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

export default DoctorPersonalDataScreen;
