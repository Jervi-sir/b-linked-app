import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Calendar, Clock, Home, Search, Menu, ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';


const { width } = Dimensions.get('window');

const PatientTimeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [selectedDay, setSelectedDay] = useState('16 أبريل');
  const [selectedTime, setSelectedTime] = useState('09:30');

  const days = ['15 أبريل', '16 أبريل', '17 أبريل', '18 أبريل'];
  const times = ['09:30', '10:00', '11:30', '13:00'];

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
              <Text style={styles.headerTitle}>اختيار الموعد</Text>
              <Text style={styles.headerSub}>أيام وأوقات متاحة</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>الأيام</Text>
          <View style={styles.grid}>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.chip, selectedDay === day && styles.chipActive]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.chipText, selectedDay === day && styles.chipTextActive]}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>الأوقات</Text>
          <View style={styles.grid}>
            {times.map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.chip, selectedTime === time && styles.chipActive]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.chipText, selectedTime === time && styles.chipTextActive]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => navigation.navigate(Routes.PatientConfirmScreen)}
        >
          <Text style={styles.confirmBtnText}>متابعة</Text>
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
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#1565c0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', marginBottom: 16, textAlign: 'right' },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  chip: { width: (width - 92) / 3, paddingVertical: 12, alignItems: 'center', borderRadius: 14, backgroundColor: '#f8fbff', borderWidth: 1, borderColor: '#dbe6f0' },
  chipActive: { backgroundColor: '#1565c0', borderColor: '#1565c0' },
  chipText: { fontSize: 13, color: '#17324a', fontWeight: '700' },
  chipTextActive: { color: '#fff' },
  confirmBtn: { backgroundColor: '#1565c0', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

});

export default PatientTimeScreen;
