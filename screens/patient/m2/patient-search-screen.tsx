import React, { useState } from 'react';
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
import { Search, X } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { Routes } from '@/utils/variables/routes';

type PopularSpeciality = {
  id: number;
  label: string;
  slug: string;
  doctors_count: number;
};

type RecentSearch = {
  id: number;
  label: string;
  city: string | null;
  speciality: {
    id: number;
    label: string;
    slug: string;
  } | null;
  created_at: string | null;
};

type SearchPayload = {
  search_placeholder: string;
  popular_specialities: PopularSpeciality[];
  recent_searches: RecentSearch[];
};

type CategoryChipProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

type RecentItemProps = {
  label: string;
  onPress: () => void;
  onRemove: () => void;
};

const PatientSearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('ابحث عن طبيب، تخصص أو مركز...');
  const [popularSpecialities, setPopularSpecialities] = useState<PopularSpeciality[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [selectedSpecialityId, setSelectedSpecialityId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const trimmedQuery = query.trim();

  const openResults = (nextQuery: string, nextSpecialityId: number | null = null) => {
    navigation.navigate(Routes.PatientResultsScreen, {
      query: nextQuery.trim(),
      specialityId: nextSpecialityId,
    });
  };

  const loadSearchData = async () => {
    try {
      const { data } = await api.get<SearchPayload>('/patient/search');

      setPlaceholder(data.search_placeholder);
      setPopularSpecialities(data.popular_specialities);
      setRecentSearches(data.recent_searches);
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل بيانات البحث');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      loadSearchData();
    }, [])
  );

  const handleSpecialityPress = (speciality: PopularSpeciality) => {
    setSelectedSpecialityId(speciality.id);
    setQuery(speciality.label);
    openResults(speciality.label, speciality.id);
  };

  const handleRecentPress = (recentSearch: RecentSearch) => {
    setQuery(recentSearch.label);
    const nextSpecialityId = recentSearch.speciality?.id ?? null;
    setSelectedSpecialityId(nextSpecialityId);
    openResults(recentSearch.label, nextSpecialityId);
  };

  const handleSearch = () => {
    openResults(trimmedQuery, selectedSpecialityId);
  };

  const handleDeleteHistory = (historyId: number) => {
    Alert.alert('حذف من السجل', 'هل تريد حذف عملية البحث هذه؟', [
      {
        text: 'إلغاء',
        style: 'cancel',
      },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/patient/search/history/${historyId}`);
            setRecentSearches(current => current.filter(item => item.id !== historyId));
          } catch {
            Alert.alert('خطأ', 'تعذر حذف عملية البحث');
          }
        },
      },
    ]);
  };

  const handleClearAllHistory = () => {
    Alert.alert('مسح السجل', 'هل تريد حذف كل عمليات البحث الأخيرة؟', [
      {
        text: 'إلغاء',
        style: 'cancel',
      },
      {
        text: 'مسح الكل',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete('/patient/search/history');
            setRecentSearches([]);
          } catch {
            Alert.alert('خطأ', 'تعذر مسح سجل البحث');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0d3f6a', '#1f88e5']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>البحث</Text>
              <Text style={styles.headerSub}>عن الأطباء والخدمات</Text>
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
          <View style={styles.searchWrap}>
            <View style={styles.inputContainer}>
              {trimmedQuery ? (
                <TouchableOpacity style={styles.inputActionBtn} onPress={handleSearch}>
                  <Text style={styles.inputActionText}>بحث</Text>
                </TouchableOpacity>
              ) : null}
              <Search size={18} color="#8aa0b4" />
              <TextInput
                placeholder={placeholder}
                style={styles.input}
                placeholderTextColor="#8aa0b4"
                textAlign="right"
                value={query}
                onChangeText={setQuery}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>التخصصات الشائعة</Text>
            <View style={styles.chipGrid}>
              {popularSpecialities.map(speciality => (
                <CategoryChip
                  key={speciality.id}
                  label={speciality.label}
                  active={selectedSpecialityId === speciality.id}
                  onPress={() => handleSpecialityPress(speciality)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>عمليات البحث الأخيرة</Text>
              {recentSearches.length > 0 ? (
                <TouchableOpacity onPress={handleClearAllHistory}>
                  <Text style={styles.clearAllText}>مسح الكل</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {recentSearches.map(recentSearch => (
              <RecentItem
                key={recentSearch.id}
                label={recentSearch.label}
                onPress={() => handleRecentPress(recentSearch)}
                onRemove={() => handleDeleteHistory(recentSearch.id)}
              />
            ))}
            {recentSearches.length === 0 ? (
              <Text style={styles.emptyText}>لا توجد عمليات بحث سابقة بعد</Text>
            ) : null}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const CategoryChip = ({ label, active = false, onPress }: CategoryChipProps) => (
  <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const RecentItem = ({ label, onPress, onRemove }: RecentItemProps) => (
  <TouchableOpacity style={styles.recentItem} onPress={onPress}>
    <TouchableOpacity style={styles.recentRemove} onPress={onRemove}>
      <X size={14} color="#8498ab" />
    </TouchableOpacity>
    <Text style={styles.recentText}>{label}</Text>
    <ClockIcon />
  </TouchableOpacity>
);

const ClockIcon = () => (
  <View style={styles.recentIcon}>
    <Search size={14} color="#1565c0" />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, flexDirection: 'row-reverse', alignItems: 'center', paddingTop: 10 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'right' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16 },
  searchWrap: { marginBottom: 24 },
  inputContainer: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, height: 56, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0' },
  inputActionBtn: { marginRight: 10, backgroundColor: '#1565c0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  inputActionText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  input: { flex: 1, fontSize: 14, color: '#17324a', marginRight: 10 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', marginBottom: 16, textAlign: 'right' },
  clearAllText: { color: '#b10e0eff', fontSize: 13, fontWeight: '700' },
  chipGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: '#dbe6f0' },
  chipActive: { backgroundColor: '#1565c0', borderColor: '#1565c0' },
  chipText: { fontSize: 13, color: '#5a7288', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  recentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#dbe6f0' },
  recentText: { flex: 1, fontSize: 14, color: '#17324a', textAlign: 'right', marginRight: 12 },
  recentIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#eaf4ff', alignItems: 'center', justifyContent: 'center' },
  recentRemove: { padding: 4 },
  emptyText: { color: '#71869b', fontSize: 13, textAlign: 'right' },
});

export default PatientSearchScreen;
