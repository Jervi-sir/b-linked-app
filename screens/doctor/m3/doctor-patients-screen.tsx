import React, { useEffect, useRef, useState } from 'react';
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
import { FileText, Phone, Search, User, ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { Routes } from '@/utils/variables/routes';

type PatientItemData = {
  id: number;
  name: string;
  phone: string | null;
  last_visit: string | null;
  visits_count: number;
  medical_records_count: number;
};

type PatientsResponse = {
  patients: PatientItemData[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    next_page: number | null;
  };
};

type PatientItemProps = {
  patient: PatientItemData;
  onPress: () => void;
};

const DoctorPatientsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [patients, setPatients] = useState<PatientItemData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPatients = async (query = '', page = 1) => {
    const { data } = await api.get<PatientsResponse>('/doctor/patients', {
      params: { query, page },
    });

    setPatients(current => (page === 1 ? data.patients : [...current, ...data.patients]));
    setNextPage(data.pagination.next_page);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        await loadPatients();
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل المرضى');
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
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (searchQuery === activeQuery) {
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        setActiveQuery(searchQuery);
        await loadPatients(searchQuery, 1);
      } catch {
        Alert.alert('خطأ', 'تعذر البحث عن المرضى');
      } finally {
        setIsLoading(false);
      }
    }, 350);
  }, [searchQuery, activeQuery]);

  const handleLoadMore = async () => {
    if (!nextPage || isLoadingMore) {
      return;
    }

    try {
      setIsLoadingMore(true);
      await loadPatients(activeQuery, nextPage);
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل المزيد من المرضى');
    } finally {
      setIsLoadingMore(false);
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
              <Text style={styles.headerTitle}>سجل المرضى</Text>
              <Text style={styles.headerSub}>متابعة الملفات الصحية</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.searchBarWrap}>
        <View style={styles.searchBar}>
          <Search size={18} color="#8aa0b4" />
          <TextInput
            style={styles.input}
            placeholder="البحث عن مريض..."
            textAlign="right"
            placeholderTextColor="#8aa0b4"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#394fd0" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.list}>
            {patients.map(patient => (
              <PatientItem
                key={patient.id}
                patient={patient}
                onPress={() => navigation.navigate(Routes.DoctorPatientDetailsScreen, { id: patient.id })}
              />
            ))}
          </View>

          {patients.length === 0 ? <Text style={styles.emptyText}>لا يوجد مرضى مطابقون حالياً</Text> : null}

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

const PatientItem = ({ patient, onPress }: PatientItemProps) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{patient.name}</Text>
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Phone size={12} color="#71869b" />
          <Text style={styles.metaText}>{patient.phone ?? 'رقم غير متوفر'}</Text>
        </View>
        <View style={styles.meta}>
          <FileText size={12} color="#71869b" />
          <Text style={styles.metaText}>{`آخر زيارة: ${patient.last_visit ?? 'غير متوفرة'}`}</Text>
        </View>
        <View style={styles.meta}>
          <FileText size={12} color="#71869b" />
          <Text style={styles.metaText}>{`السجلات: ${patient.medical_records_count} | الزيارات: ${patient.visits_count}`}</Text>
        </View>
      </View>
    </View>
    <View style={styles.avatarWrap}>
      <User size={24} color="#394fd0" />
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
  searchBarWrap: { padding: 16, marginTop: -10 },
  searchBar: { backgroundColor: '#fff', borderRadius: 16, height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  input: { flex: 1, marginRight: 10, fontSize: 14, color: '#17324a' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 100 },
  list: { gap: 12 },
  item: { backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0' },
  avatarWrap: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#eef1ff', alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1, paddingRight: 16 },
  itemName: { fontSize: 16, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 4 },
  metaRow: { flexDirection: 'column', gap: 4 },
  meta: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 11, color: '#71869b' },
  emptyText: { color: '#71869b', fontSize: 13, textAlign: 'center', marginTop: 24 },
  loadMoreBtn: { backgroundColor: '#394fd0', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  loadMoreBtnDisabled: { opacity: 0.7 },
  loadMoreText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});

export default DoctorPatientsScreen;
