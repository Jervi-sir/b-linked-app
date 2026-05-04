import React, { useCallback, useState } from 'react';
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
import { ChevronLeft, Edit2, Trash2 } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { Routes } from '@/utils/variables/routes';

type CenterServiceItem = {
  id: number;
  service_id: number;
  name: string;
  description: string | null;
  price_label: string;
  duration_label: string;
  status_label: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

type ServiceResponse = {
  service: CenterServiceItem;
};

const CenterServiceDetailsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const serviceId = route.params?.id as number;
  const [service, setService] = useState<CenterServiceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadService = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<ServiceResponse>(`/center/services/${serviceId}`);
      setService(data.service);
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل تفاصيل الخدمة');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [navigation, serviceId]);

  useFocusEffect(
    useCallback(() => {
      loadService();
    }, [loadService]),
  );

  const handleDelete = () => {
    if (!service) {
      return;
    }

    Alert.alert('حذف الخدمة', `هل تريد حذف خدمة ${service.name}؟`, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsDeleting(true);
            await api.delete(`/center/services/${service.id}`);
            navigation.goBack();
          } catch {
            Alert.alert('خطأ', 'تعذر حذف الخدمة');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
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
              <Text style={styles.headerTitle}>تفاصيل الخدمة</Text>
              <Text style={styles.headerSub}>عرض كامل لبيانات الخدمة</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading || !service ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#12916d" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.name}>{service.name}</Text>
            <Text style={styles.status}>{service.status_label}</Text>

            <InfoRow label="السعر" value={service.price_label} />
            <InfoRow label="المدة" value={service.duration_label} />
            <InfoRow label="الوصف" value={service.description || 'لا يوجد وصف'} />
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate(Routes.CenterServiceFormScreen, { id: service.id })}>
            <Edit2 size={18} color="#fff" />
            <Text style={styles.editBtnText}>تعديل الخدمة</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.deleteBtn, isDeleting && styles.deleteBtnDisabled]} onPress={handleDelete} disabled={isDeleting}>
            <Trash2 size={18} color="#c8403b" />
            <Text style={styles.deleteBtnText}>{isDeleting ? 'جارٍ الحذف...' : 'حذف الخدمة'}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoValue}>{value}</Text>
    <Text style={styles.infoLabel}>{label}</Text>
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
  scrollContent: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#dbe6f0', marginBottom: 20 },
  name: { fontSize: 20, fontWeight: '900', color: '#17324a', textAlign: 'right', marginBottom: 6 },
  status: { fontSize: 13, fontWeight: '700', color: '#12916d', textAlign: 'right', marginBottom: 20 },
  infoRow: { borderTopWidth: 1, borderTopColor: '#eef4f8', paddingVertical: 14 },
  infoLabel: { fontSize: 12, color: '#71869b', textAlign: 'right', marginTop: 4 },
  infoValue: { fontSize: 15, fontWeight: '800', color: '#17324a', textAlign: 'right' },
  editBtn: { backgroundColor: '#12916d', borderRadius: 16, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginBottom: 12 },
  editBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  deleteBtn: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, borderWidth: 1, borderColor: '#f2c8cc' },
  deleteBtnDisabled: { opacity: 0.7 },
  deleteBtnText: { color: '#c8403b', fontSize: 15, fontWeight: '800' },
});

export default CenterServiceDetailsScreen;
