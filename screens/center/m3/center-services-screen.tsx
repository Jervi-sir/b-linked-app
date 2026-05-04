import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Edit2, Plus, Trash2 } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';
import { api } from '@/utils/auth';
import { useAuthStore } from '@/zustand/auth-store';

type CenterServiceItem = {
  id: number;
  service_id: number;
  name: string;
  description: string | null;
  price: string | null;
  price_label: string;
  duration_minutes: number | null;
  duration_label: string;
  is_active: boolean;
  status_label: string;
};

type ServicesResponse = {
  services: CenterServiceItem[];
};

const CenterServicesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const fetchMe = useAuthStore(state => state.fetchMe);
  const [services, setServices] = useState<CenterServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadServices = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
    }

    try {
      const { data } = await api.get<ServicesResponse>('/center/services');
      setServices(data.services);
      await fetchMe();
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل خدمات المركز');
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadServices();
    }, [loadServices]),
  );

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const { data } = await api.get<ServicesResponse>('/center/services');
      setServices(data.services);
    } catch {
      Alert.alert('خطأ', 'تعذر تحديث القائمة');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = (service: CenterServiceItem) => {
    Alert.alert('حذف الخدمة', `هل تريد حذف خدمة ${service.name}؟`, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeletingId(service.id);
             await api.delete(`/center/services/${service.id}`);
             setServices(current => current.filter(item => item.id !== service.id));
             await fetchMe();
           } catch {
             Alert.alert('خطأ', 'تعذر حذف الخدمة');
          } finally {
            setDeletingId(null);
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
              <Text style={styles.headerTitle}>إدارة الخدمات</Text>
              <Text style={styles.headerSub}>إضافة وتعديل وعرض خدمات المركز</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#12916d" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#12916d" />}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate(Routes.CenterServiceFormScreen)}>
            <Plus size={20} color="#fff" />
            <Text style={styles.addBtnText}>إضافة خدمة جديدة</Text>
          </TouchableOpacity>

          <View style={styles.list}>
            {services.length > 0 ? (
              services.map(service => (
                <ServiceManageItem
                  key={service.id}
                  service={service}
                  isDeleting={deletingId === service.id}
                  onPress={() => navigation.navigate(Routes.CenterServiceDetailsScreen, { id: service.id })}
                  onEdit={() => navigation.navigate(Routes.CenterServiceFormScreen, { id: service.id })}
                  onDelete={() => handleDelete(service)}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>لا توجد خدمات مضافة حالياً</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const ServiceManageItem = ({
  service,
  isDeleting,
  onPress,
  onEdit,
  onDelete,
}: {
  service: CenterServiceItem;
  isDeleting: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.9}>
    <View style={styles.itemMainRow}>
      <ChevronRight size={18} color="#8aa0b4" />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{service.name}</Text>
        <Text style={styles.itemPrice}>{service.price_label}</Text>
        <Text style={styles.itemMeta}>{`${service.duration_label} • ${service.status_label}`}</Text>
      </View>
    </View>
    <View style={styles.itemActions}>
      <TouchableOpacity style={styles.iconBtn} onPress={onEdit}>
        <Edit2 size={18} color="#12916d" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.iconBtn, styles.iconBtnRed]} onPress={onDelete} disabled={isDeleting}>
        <Trash2 size={18} color="#c8403b" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
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
  addBtn: { backgroundColor: '#12916d', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  list: { gap: 12 },
  item: { backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0' },
  itemMainRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemInfo: { flex: 1, paddingRight: 12 },
  itemName: { fontSize: 15, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 4 },
  itemPrice: { fontSize: 13, fontWeight: '700', color: '#12916d', textAlign: 'right', marginBottom: 4 },
  itemMeta: { fontSize: 12, color: '#71869b', textAlign: 'right' },
  itemActions: { flexDirection: 'row', gap: 8, marginLeft: 12 },
  iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#eaf9f4', alignItems: 'center', justifyContent: 'center' },
  iconBtnRed: { backgroundColor: '#fdecee' },
  emptyText: { color: '#71869b', fontSize: 13, textAlign: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#dbe6f0' },
});

export default CenterServicesScreen;
