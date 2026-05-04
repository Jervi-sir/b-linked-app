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
import { Calendar, Clock, MapPin, ChevronLeft, Search, Home, Menu } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';

const PatientBookingsScreen = ({ }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0d3f6a', '#1f88e5']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>حجوزاتي</Text>
              <Text style={styles.headerSub}>متابعة حالة المواعيد</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.list}>
          <BookingItem
            id="BK-2026-0211"
            name="د. ياسين كمال"
            specialty="جراحة القلب"
            date="26 أفريل 2026"
            time="09:00"
            status="قيد الانتظار"
            statusColor="#ffb400"
          />
          <BookingItem
            id="BK-2026-0105"
            name="مركز الشفاء الطبي"
            specialty="تحاليل دم"
            date="15 أفريل 2026"
            time="10:30"
            status="تم التأكيد"
            statusColor="#12916d"
          />
          <BookingItem
            id="BK-2026-0098"
            name="د. سعاد مرابط"
            specialty="طب الأطفال"
            date="10 أفريل 2026"
            time="14:00"
            status="ملغي"
            statusColor="#c8403b"
          />
        </View>
      </ScrollView>

    </View>
  );
};

const BookingItem = ({ id, name, specialty, date, time, status, statusColor }) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      <Text style={[styles.status, { color: statusColor, backgroundColor: statusColor + '15' }]}>{status}</Text>
      <Text style={styles.bookingId}>{id}</Text>
    </View>
    <View style={styles.itemBody}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemSpecialty}>{specialty}</Text>
        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Calendar size={12} color="#71869b" />
            <Text style={styles.metaText}>{date}</Text>
          </View>
          <View style={styles.meta}>
            <Clock size={12} color="#71869b" />
            <Text style={styles.metaText}>{time}</Text>
          </View>
        </View>
      </View>
      <View style={styles.thumb} />
    </View>
    <TouchableOpacity style={styles.detailsBtn}>
      <Text style={styles.detailsBtnText}>عرض التفاصيل</Text>
    </TouchableOpacity>
  </View>
);



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-end' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  list: { gap: 16 },
  item: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#1565c0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  bookingId: { fontSize: 12, fontWeight: '700', color: '#17324a' },
  status: { fontSize: 10, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  itemBody: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 16 },
  itemInfo: { flex: 1, paddingRight: 12 },
  itemName: { fontSize: 16, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 2 },
  itemSpecialty: { fontSize: 13, color: '#1565c0', textAlign: 'right', marginBottom: 8 },
  metaRow: { flexDirection: 'row-reverse', gap: 12 },
  meta: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: '#71869b' },
  thumb: { width: 60, height: 60, borderRadius: 14, backgroundColor: '#f8fbff', borderWidth: 1, borderColor: '#dce9f6' },
  detailsBtn: { borderTopWidth: 1, borderTopColor: '#f0f4f8', paddingTop: 12, alignItems: 'center' },
  detailsBtnText: { fontSize: 13, fontWeight: '800', color: '#1565c0' },

});

export default PatientBookingsScreen;
