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
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { useAuthStore } from '@/zustand/auth-store';

type ProfileResponse = {
  profile: {
    address: string | null;
    city: string | null;
  };
};

const CenterLocationScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const fetchMe = useAuthStore(state => state.fetchMe);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const { data } = await api.get<ProfileResponse>('/center/profile');

        if (!isMounted) {
          return;
        }

        setCity(data.profile.city ?? '');
        setAddress(data.profile.address ?? '');
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل بيانات الموقع');
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
      await api.patch('/center/profile/location', {
        city: city || null,
        address: address || null,
      });
      await fetchMe();
      Alert.alert('تم', 'تم حفظ بيانات الموقع');
    } catch (error: any) {
      Alert.alert('خطأ', error?.response?.data?.message ?? 'تعذر حفظ بيانات الموقع');
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
              <Text style={styles.headerTitle}>الموقع والخرائط</Text>
              <Text style={styles.headerSub}>تحديث المدينة والعنوان التفصيلي</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.infoBanner}>
            <MapPin size={18} color="#12916d" />
            <Text style={styles.infoBannerText}>لا توجد إحداثيات خرائط في قاعدة البيانات حالياً، لذلك يتم حفظ المدينة والعنوان فقط.</Text>
          </View>

          <Field label="المدينة" value={city} onChangeText={setCity} />
          <Field label="العنوان التفصيلي" value={address} onChangeText={setAddress} multiline />

          <TouchableOpacity style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveText}>{isSaving ? 'جارٍ الحفظ...' : 'حفظ الموقع'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const Field = ({ label, value, onChangeText, multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; multiline?: boolean }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={[styles.input, multiline && styles.inputMultiline]} value={value} onChangeText={onChangeText} multiline={multiline} textAlign="right" />
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
  infoBanner: { backgroundColor: '#eef8f4', borderRadius: 16, padding: 14, flexDirection: 'row-reverse', gap: 10, marginBottom: 16 },
  infoBannerText: { flex: 1, color: '#2f5f52', fontSize: 13, fontWeight: '600', textAlign: 'right' },
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#17324a', marginBottom: 8, textAlign: 'right' },
  input: { backgroundColor: '#fbfdff', borderRadius: 14, paddingHorizontal: 14, minHeight: 52, borderWidth: 1, borderColor: '#dbe6f0', fontSize: 14, color: '#17324a' },
  inputMultiline: { minHeight: 110, paddingTop: 14 },
  saveBtn: { backgroundColor: '#12916d', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  saveBtnDisabled: { opacity: 0.7 },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

export default CenterLocationScreen;
