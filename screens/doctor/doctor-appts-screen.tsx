import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, X, Clock, Calendar, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const DoctorApptsScreen = ({ }) => {
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
              <Text style={styles.headerTitle}>إدارة المواعيد</Text>
              <Text style={styles.headerSub}>طلبات الحجز الجديدة</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>الجديدة (3)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>المؤكدة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>السابقة</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <RequestItem
          patient="محمد العيد"
          time="11:30"
          date="27 أفريل"
          type="استشارة أولية"
        />
        <RequestItem
          patient="فاطمة الزهراء"
          time="14:00"
          date="27 أفريل"
          type="متابعة دورية"
        />
        <RequestItem
          patient="عبد القادر"
          time="16:30"
          date="28 أفريل"
          type="كشف مستعجل"
        />
      </ScrollView>
    </View>
  );
};

const RequestItem = ({ patient, time, date, type }) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{patient}</Text>
        <Text style={styles.visitType}>{type}</Text>
      </View>
      <View style={styles.avatar} />
    </View>

    <View style={styles.metaRow}>
      <View style={styles.meta}>
        <Calendar size={14} color="#71869b" />
        <Text style={styles.metaText}>{date}</Text>
      </View>
      <View style={styles.meta}>
        <Clock size={14} color="#71869b" />
        <Text style={styles.metaText}>{time}</Text>
      </View>
    </View>

    <View style={styles.actions}>
      <TouchableOpacity style={styles.acceptBtn}>
        <Check size={18} color="#fff" />
        <Text style={styles.btnText}>قبول</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rejectBtn}>
        <X size={18} color="#c8403b" />
        <Text style={styles.rejectText}>رفض</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  backBtn: { marginLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'right' },
  tabs: { flexDirection: 'row-reverse', padding: 16, gap: 10 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe6f0' },
  tabActive: { backgroundColor: '#394fd0', borderColor: '#394fd0' },
  tabText: { fontSize: 13, color: '#5a7288', fontWeight: '700' },
  tabTextActive: { color: '#fff' },
  scrollContent: { padding: 16, gap: 16 },
  item: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#394fd0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  itemHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#eef1ff' },
  patientInfo: { flex: 1, paddingRight: 12 },
  patientName: { fontSize: 16, fontWeight: '800', color: '#17324a', textAlign: 'right' },
  visitType: { fontSize: 12, color: '#71869b', textAlign: 'right' },
  metaRow: { flexDirection: 'row-reverse', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f4f8' },
  meta: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#5a7288' },
  actions: { flexDirection: 'row-reverse', gap: 10 },
  acceptBtn: { flex: 1, backgroundColor: '#12916d', height: 48, borderRadius: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  rejectBtn: { flex: 1, backgroundColor: '#fff', height: 48, borderRadius: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#c8403b' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  rejectText: { color: '#c8403b', fontSize: 14, fontWeight: '800' },
});

export default DoctorApptsScreen;
