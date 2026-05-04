import React from 'react';
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
import { ChevronRight, MapPin, Star, Clock, Phone, FlaskConical, Activity } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';


const { width } = Dimensions.get('window');

const PatientCenterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner/Image */}
        <LinearGradient colors={['#0c7058', '#12916d']} style={styles.banner}>
          <SafeAreaView edges={['top']}>
            <View style={styles.navBar}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <ChevronRight size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <View style={styles.bannerContent}>
            <View style={styles.centerLogo}>
              <FlaskConical size={32} color="#12916d" />
            </View>
            <Text style={styles.centerName}>مركز الشفاء الطبي</Text>
            <Text style={styles.centerType}>مجمع عيادات وتحاليل طبية</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Star size={18} color="#ffb400" fill="#ffb400" />
              <Text style={styles.statVal}>4.7</Text>
              <Text style={styles.statLab}>تقييم</Text>
            </View>
            <View style={styles.statBox}>
              <Activity size={18} color="#12916d" />
              <Text style={styles.statVal}>24/7</Text>
              <Text style={styles.statLab}>طوارئ</Text>
            </View>
            <View style={styles.statBox}>
              <MapPin size={18} color="#12916d" />
              <Text style={styles.statVal}>2km</Text>
              <Text style={styles.statLab}>مسافة</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الخدمات المتاحة</Text>
            <View style={styles.servicesGrid}>
              <ServiceChip label="تحاليل دم" />
              <ServiceChip label="أشعة X" />
              <ServiceChip label="تخطيط قلب" />
              <ServiceChip label="فحص شامل" />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الموقع وساعات العمل</Text>
            <View style={styles.infoCard}>
              <InfoRow icon={<MapPin size={18} color="#12916d" />} text="وهران، بير الجير - مقابل بلدية بير الجير" />
              <InfoRow icon={<Clock size={18} color="#12916d" />} text="مفتوح على مدار الساعة (قسم الطوارئ)" />
              <InfoRow icon={<Phone size={18} color="#12916d" />} text="041 12 34 56" />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate(Routes.PatientFormScreen)}
        >
          <Text style={styles.actionBtnText}>حجز فحص / تحاليل</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ServiceChip = ({ label }) => (
  <View style={styles.serviceChip}>
    <Text style={styles.serviceText}>{label}</Text>
  </View>
);

const InfoRow = ({ icon, text }) => (
  <View style={styles.infoRow}>
    {icon}
    <Text style={styles.infoRowText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  banner: { height: 260, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  navBar: { width: '100%', paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row-reverse' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  bannerContent: { alignItems: 'center', marginTop: 10 },
  centerLogo: { width: 70, height: 70, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  centerName: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
  centerType: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  content: { padding: 20, paddingBottom: 100 },
  statsRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 24, marginTop: -50 },
  statBox: { width: (width - 60) / 3, backgroundColor: '#fff', borderRadius: 20, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  statVal: { fontSize: 15, fontWeight: '800', color: '#17324a', marginTop: 4 },
  statLab: { fontSize: 10, color: '#71869b' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', marginBottom: 12, textAlign: 'right' },
  servicesGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  serviceChip: { backgroundColor: '#eaf9f4', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#bfe9db' },
  serviceText: { fontSize: 12, color: '#0c7058', fontWeight: '700' },
  infoCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#dbe6f0' },
  infoRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 },
  infoRowText: { fontSize: 13, color: '#5a7288', marginRight: 10, flex: 1, textAlign: 'right' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#dbe6f0' },
  actionBtn: { backgroundColor: '#12916d', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientCenterScreen;
