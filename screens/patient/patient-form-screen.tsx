import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, User, Phone, Route, ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';


const { width } = Dimensions.get('window');

const PatientFormScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
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
              <Text style={styles.headerTitle}>طلب حجز</Text>
              <Text style={styles.headerSub}>أدخل بيانات الموعد</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات المريض</Text>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>الاسم الكامل</Text>
              <View style={styles.inputWrap}>
                <User size={18} color="#8aa0b4" />
                <TextInput style={styles.input} placeholder="أحمد محمد" textAlign="right" />
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>رقم الهاتف</Text>
              <View style={styles.inputWrap}>
                <Phone size={18} color="#8aa0b4" />
                <TextInput style={styles.input} placeholder="0555 00 00 00" keyboardType="phone-pad" textAlign="right" />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => navigation.navigate(Routes.PatientTimeScreen)}
        >
          <Text style={styles.confirmBtnText}>اختيار الوقت</Text>
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
  scrollContent: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', marginBottom: 12, textAlign: 'right' },
  form: { gap: 12 },
  field: { gap: 6 },
  label: { fontSize: 12, color: '#71869b', textAlign: 'right', marginRight: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 12, height: 50, borderWidth: 1, borderColor: '#dbe6f0' },
  input: { flex: 1, marginRight: 10, fontSize: 14, color: '#17324a' },
  confirmBtn: { backgroundColor: '#1565c0', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientFormScreen;
