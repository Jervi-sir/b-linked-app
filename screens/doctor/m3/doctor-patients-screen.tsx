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
import { Search, ChevronRight, User, Phone, FileText, ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const DoctorPatientsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
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
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PatientItem name="أحمد محمد" lastVisit="20 أفريل 2026" phone="0555 12 34 56" />
        <PatientItem name="سارة كمال" lastVisit="18 أفريل 2026" phone="0661 00 11 22" />
        <PatientItem name="ياسين براهيمي" lastVisit="15 أفريل 2026" phone="0770 99 88 77" />
        <PatientItem name="ليلى خالد" lastVisit="10 أفريل 2026" phone="0550 44 33 22" />
      </ScrollView>
    </View>
  );
};

const PatientItem = ({ name, lastVisit, phone }) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{name}</Text>
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Phone size={12} color="#71869b" />
          <Text style={styles.metaText}>{phone}</Text>
        </View>
        <View style={styles.meta}>
          <FileText size={12} color="#71869b" />
          <Text style={styles.metaText}>آخر زيارة: {lastVisit}</Text>
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
  scrollContent: { padding: 16, gap: 12 },
  item: { backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0' },
  avatarWrap: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#eef1ff', alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1, paddingRight: 16 },
  itemName: { fontSize: 16, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 4 },
  metaRow: { flexDirection: 'column', gap: 4 },
  meta: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 11, color: '#71869b' },
});

export default DoctorPatientsScreen;
