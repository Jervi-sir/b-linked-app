import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';

const PatientSearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchWrap}>
          <View style={styles.inputContainer}>
            <Search size={18} color="#8aa0b4" />
            <TextInput
              placeholder="ابحث عن طبيب، تخصص أو مركز..."
              style={styles.input}
              placeholderTextColor="#8aa0b4"
              textAlign="right"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التخصصات الشائعة</Text>
          <View style={styles.chipGrid}>
            <CategoryChip label="طب عام" />
            <CategoryChip label="طب الأطفال" active />
            <CategoryChip label="طب الأسنان" />
            <CategoryChip label="العيون" />
            <CategoryChip label="الجلدية" />
            <CategoryChip label="العظام" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>عمليات البحث الأخيرة</Text>
          <RecentItem label="طبيب قلب في وهران" />
          <RecentItem label="مركز تحاليل دم" />
          <RecentItem label="د. أمين بن صالح" />
        </View>

        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => navigation.navigate(Routes.PatientResultsScreen)}
        >
          <Text style={styles.searchBtnText}>إظهار النتائج</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const CategoryChip = ({ label, active = false }) => (
  <TouchableOpacity style={[styles.chip, active && styles.chipActive]}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const RecentItem = ({ label }) => (
  <View style={styles.recentItem}>
    <TouchableOpacity style={styles.recentRemove}>
      <X size={14} color="#8498ab" />
    </TouchableOpacity>
    <Text style={styles.recentText}>{label}</Text>
    <ClockIcon />
  </View>
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
  backBtn: { marginLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'right' },
  scrollContent: { padding: 16 },
  searchWrap: { marginBottom: 24 },
  inputContainer: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, height: 56, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0' },
  input: { flex: 1, fontSize: 14, color: '#17324a', marginRight: 10 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', marginBottom: 16, textAlign: 'right' },
  chipGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: '#dbe6f0' },
  chipActive: { backgroundColor: '#1565c0', borderColor: '#1565c0' },
  chipText: { fontSize: 13, color: '#5a7288', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  recentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#dbe6f0' },
  recentText: { flex: 1, fontSize: 14, color: '#17324a', textAlign: 'right', marginRight: 12 },
  recentIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#eaf4ff', alignItems: 'center', justifyContent: 'center' },
  recentRemove: { padding: 4 },
  searchBtn: { backgroundColor: '#1565c0', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  searchBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientSearchScreen;
