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
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '@/utils/auth';

type CatalogItem = {
  id: number;
  name: string;
};

type CenterServiceItem = {
  id: number;
  service_id: number;
  name: string;
  description: string | null;
  price: string | null;
  duration_minutes: number | null;
  is_active: boolean;
};

type ServicesResponse = {
  services_catalog: CatalogItem[];
  services: CenterServiceItem[];
};

type ServiceResponse = {
  service: CenterServiceItem;
};

const CenterServiceFormScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const serviceId = route.params?.id as number | undefined;
  const isEdit = Boolean(serviceId);

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [{ data: listData }, serviceResponse] = await Promise.all([
          api.get<ServicesResponse>('/center/services'),
          isEdit ? api.get<ServiceResponse>(`/center/services/${serviceId}`) : Promise.resolve(null),
        ]);

        if (!isMounted) {
          return;
        }

        setCatalog(listData.services_catalog);

        if (serviceResponse) {
          const current = serviceResponse.data.service;
          setSelectedServiceId(current.service_id);
          setDescription(current.description ?? '');
          setPrice(current.price ?? '');
          setDurationMinutes(current.duration_minutes ? String(current.duration_minutes) : '');
          setIsActive(current.is_active);
        } else if (listData.services_catalog.length > 0) {
          setSelectedServiceId(listData.services_catalog[0].id);
        }
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل بيانات الخدمة');
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
  }, [isEdit, serviceId]);

  const handleSave = async () => {
    if (!selectedServiceId) {
      Alert.alert('تنبيه', 'اختر نوع الخدمة أولاً');
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        service_id: selectedServiceId,
        description: description.trim() || null,
        price: price.trim() || null,
        duration_minutes: durationMinutes.trim() ? Number(durationMinutes) : null,
        is_active: isActive,
      };

      if (isEdit) {
        await api.put(`/center/services/${serviceId}`, payload);
      } else {
        await api.post('/center/services', payload);
      }

      navigation.goBack();
    } catch (error: any) {
      const message = error?.response?.data?.message ?? (isEdit ? 'تعذر تحديث الخدمة' : 'تعذر إضافة الخدمة');
      Alert.alert('خطأ', message);
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
              <Text style={styles.headerTitle}>{isEdit ? 'تعديل الخدمة' : 'إضافة خدمة'}</Text>
              <Text style={styles.headerSub}>تحديث الاسم والوصف والسعر والمدة</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>نوع الخدمة</Text>
        <View style={styles.catalogList}>
          {catalog.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.catalogChip, selectedServiceId === item.id && styles.catalogChipActive]}
              onPress={() => setSelectedServiceId(item.id)}
            >
              <Text style={[styles.catalogChipText, selectedServiceId === item.id && styles.catalogChipTextActive]}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>الوصف</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="وصف مختصر للخدمة"
          placeholderTextColor="#97a8b7"
          multiline
          textAlign="right"
        />

        <Text style={styles.label}>السعر</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="مثال: 2500"
          placeholderTextColor="#97a8b7"
          keyboardType="numeric"
          textAlign="right"
        />

        <Text style={styles.label}>المدة بالدقائق</Text>
        <TextInput
          style={styles.input}
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          placeholder="مثال: 30"
          placeholderTextColor="#97a8b7"
          keyboardType="numeric"
          textAlign="right"
        />

        <View style={styles.switchRow}>
          <Switch value={isActive} onValueChange={setIsActive} trackColor={{ false: '#dbe6f0', true: '#9fe0c9' }} thumbColor={isActive ? '#12916d' : '#f4f8fc'} />
          <Text style={styles.switchLabel}>الخدمة نشطة ومتاحة للحجز</Text>
        </View>

        <TouchableOpacity style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} onPress={handleSave} disabled={isSaving}>
          <Text style={styles.saveBtnText}>{isSaving ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة الخدمة'}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f8fc' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 10, marginTop: 8 },
  catalogList: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  catalogChip: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe6f0', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 14 },
  catalogChipActive: { backgroundColor: '#12916d', borderColor: '#12916d' },
  catalogChipText: { color: '#17324a', fontWeight: '700' },
  catalogChipTextActive: { color: '#fff' },
  input: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#dbe6f0', paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: '#17324a', marginBottom: 12 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  switchRow: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#dbe6f0', padding: 16, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 20 },
  switchLabel: { color: '#17324a', fontSize: 14, fontWeight: '700', marginLeft: 12, flex: 1, textAlign: 'right' },
  saveBtn: { backgroundColor: '#12916d', borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

export default CenterServiceFormScreen;
