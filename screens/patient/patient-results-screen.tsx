import React, { useEffect, useState } from 'react';
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
import { ChevronLeft, MapPin, Star } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { Routes } from '@/utils/variables/routes';

type SearchResultItem = {
  entity_type: 'doctor' | 'center';
  entity_id: number;
  name: string;
  specialty: string;
  location: string;
  rating: string;
  is_center: boolean;
};

type SearchResultsPayload = {
  results: SearchResultItem[];
  results_meta: {
    query: string;
    speciality_id: number | null;
    total: number;
  };
};

type ResultItemProps = {
  name: string;
  specialty: string;
  location: string;
  rating: string;
  isCenter?: boolean;
  onPress: () => void;
};

const PatientResultsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RouteProp<Record<string, { query?: string; specialityId?: number | null }>, string>>();
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [resultTitle, setResultTitle] = useState('كل النتائج');
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const query = route.params?.query?.trim() ?? '';
  const specialityId = route.params?.specialityId ?? null;

  useEffect(() => {
    let isMounted = true;

    const loadResults = async () => {
      try {
        const { data } = await api.get<SearchResultsPayload>('/patient/search', {
          params: {
            query,
            speciality_id: specialityId,
          },
        });

        if (!isMounted) {
          return;
        }

        setResults(data.results);
        setTotal(data.results_meta.total);
        setResultTitle(data.results_meta.query || 'كل النتائج');
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل نتائج البحث');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadResults();

    return () => {
      isMounted = false;
    };
  }, [query, specialityId]);

  const handleResultPress = (item: SearchResultItem) => {
    if (item.is_center) {
      navigation.navigate(Routes.PatientCenterScreen, { id: item.entity_id });
      return;
    }

    navigation.navigate(Routes.PatientDoctorScreen, { id: item.entity_id });
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
            <View>
              <Text style={styles.headerTitle}>نتائج البحث</Text>
              <Text style={styles.headerSub}>{resultTitle}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1565c0" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>تم العثور على {total} نتيجة</Text>
          </View>

          <View style={styles.list}>
            {results.map(item => (
              <ResultItem
                key={`${item.entity_type}-${item.entity_id}`}
                name={item.name}
                specialty={item.specialty}
                location={item.location}
                rating={item.rating}
                isCenter={item.is_center}
                onPress={() => handleResultPress(item)}
              />
            ))}
          </View>

          {results.length === 0 ? <Text style={styles.emptyText}>لا توجد نتائج مطابقة حالياً</Text> : null}
        </ScrollView>
      )}
    </View>
  );
};

const ResultItem = ({ name, specialty, location, rating, isCenter = false, onPress }: ResultItemProps) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemSpecialty}>{specialty}</Text>
      <View style={styles.itemMeta}>
        <MapPin size={12} color="#71869b" />
        <Text style={styles.itemMetaText}>{location}</Text>
      </View>
      <View style={styles.itemFooter}>
        <View style={styles.rating}>
          <Star size={12} color="#ffb400" fill="#ffb400" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
        <Text style={[styles.typeChip, isCenter && styles.typeChipCenter]}>
          {isCenter ? 'مركز طبي' : 'طبيب'}
        </Text>
      </View>
    </View>
    <View style={styles.itemThumb} />
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
  scrollContent: { padding: 16 },
  resultsHeader: { marginBottom: 12 },
  resultsCount: { fontSize: 14, color: '#71869b', textAlign: 'right' },
  list: { gap: 12 },
  item: { backgroundColor: '#fff', borderRadius: 20, padding: 12, flexDirection: 'row-reverse', borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#1565c0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  itemInfo: { flex: 1, paddingRight: 12 },
  itemName: { fontSize: 16, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 2 },
  itemSpecialty: { fontSize: 13, color: '#1565c0', textAlign: 'right', marginBottom: 6 },
  itemMeta: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 8 },
  itemMetaText: { fontSize: 11, color: '#71869b', marginRight: 4 },
  itemFooter: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  rating: { flexDirection: 'row-reverse', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#17324a', marginRight: 4 },
  typeChip: { fontSize: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: '#eaf4ff', color: '#1565c0', fontWeight: '700' },
  typeChipCenter: { backgroundColor: '#eaf9f4', color: '#12916d' },
  itemThumb: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#f8fbff', borderWidth: 1, borderColor: '#dce9f6' },
  emptyText: { color: '#71869b', fontSize: 13, textAlign: 'center', marginTop: 24 },
});

export default PatientResultsScreen;
