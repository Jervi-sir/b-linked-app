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

type TypeOption = {
  value: string;
  label: string;
};

type ProfileResponse = {
  profile: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    name: string | null;
    type: string | null;
    license_number: string | null;
    phone_public: string | null;
    description: string | null;
    emergency_24_7: boolean;
  };
  types: TypeOption[];
};

const CenterBasicDataScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const fetchMe = useAuthStore(state => state.fetchMe);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [types, setTypes] = useState<TypeOption[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('medical_center');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phonePublic, setPhonePublic] = useState('');
  const [description, setDescription] = useState('');
  const [emergency247, setEmergency247] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const { data } = await api.get<ProfileResponse>('/center/profile');

        if (!isMounted) {
          return;
        }

        setTypes(data.types);
        setFullName(data.profile.full_name ?? '');
        setEmail(data.profile.email ?? '');
        setPhone(data.profile.phone ?? '');
        setName(data.profile.name ?? '');
        setType(data.profile.type ?? 'medical_center');
        setLicenseNumber(data.profile.license_number ?? '');
        setPhonePublic(data.profile.phone_public ?? '');
        setDescription(data.profile.description ?? '');
        setEmergency247(data.profile.emergency_24_7);
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل البيانات الأساسية');
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
      await api.patch('/center/profile/basic', {
        full_name: fullName,
        email: email || null,
        phone: phone || null,
        name,
        type,
        license_number: licenseNumber || null,
        phone_public: phonePublic || null,
        description: description || null,
        emergency_24_7: emergency247,
      });
      await fetchMe();
      Alert.alert('تم', 'تم حفظ البيانات الأساسية');
    } catch (error: any) {
      Alert.alert('خطأ', error?.response?.data?.message ?? 'تعذر حفظ البيانات');
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
              <Text style={styles.headerTitle}>البيانات الأساسية</Text>
              <Text style={styles.headerSub}>تحديث بيانات المركز الرئيسية</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Field label="اسم المسؤول" value={fullName} onChangeText={setFullName} />
          <Field label="البريد الإلكتروني" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Field label="الهاتف" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Field label="اسم المركز" value={name} onChangeText={setName} />

          <Text style={styles.label}>نوع المركز</Text>
          <View style={styles.optionsWrap}>
            {types.map(item => (
              <TouchableOpacity key={item.value} style={[styles.optionChip, type === item.value && styles.optionChipActive]} onPress={() => setType(item.value)}>
                <Text style={[styles.optionText, type === item.value && styles.optionTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Field label="رقم الترخيص" value={licenseNumber} onChangeText={setLicenseNumber} />
          <Field label="هاتف المركز" value={phonePublic} onChangeText={setPhonePublic} keyboardType="phone-pad" />
          <Field label="وصف المركز" value={description} onChangeText={setDescription} multiline />

          <View style={styles.switchRow}>
            <Switch value={emergency247} onValueChange={setEmergency247} trackColor={{ false: '#dbe6f0', true: '#9fe0c9' }} thumbColor={emergency247 ? '#12916d' : '#f4f8fc'} />
            <Text style={styles.switchLabel}>خدمة طوارئ 24/7</Text>
          </View>

          <TouchableOpacity style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveText}>{isSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const Field = ({ label, value, onChangeText, keyboardType = 'default', multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'default' | 'email-address' | 'phone-pad'; multiline?: boolean }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={[styles.input, multiline && styles.inputMultiline]} value={value} onChangeText={onChangeText} keyboardType={keyboardType} multiline={multiline} textAlign="right" />
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
  optionsWrap: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  optionChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe6f0' },
  optionChipActive: { backgroundColor: '#12916d', borderColor: '#12916d' },
  optionText: { color: '#4b6075', fontSize: 12, fontWeight: '700' },
  optionTextActive: { color: '#fff' },
  switchRow: { backgroundColor: '#fbfdff', borderRadius: 14, borderWidth: 1, borderColor: '#dbe6f0', padding: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  switchLabel: { color: '#17324a', fontSize: 14, fontWeight: '700', marginLeft: 12, flex: 1, textAlign: 'right' },
  saveBtn: { backgroundColor: '#12916d', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  saveBtnDisabled: { opacity: 0.7 },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

export default CenterBasicDataScreen;
