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
import { ChevronRight, MapPin, Star, Clock, Phone, Award, ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';


const { width } = Dimensions.get('window');

const PatientDoctorScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient colors={['#0d3f6a', '#1f88e5']} style={styles.profileHeader}>
          <SafeAreaView edges={['top']} style={{ width: "100%", paddingHorizontal: 20 }}>
            <View >
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <View style={styles.profileInfo}>
            <View style={styles.avatarWrap}>
              <LinearGradient colors={['#d8ebff', '#f8fbff']} style={styles.avatar} />
            </View>
            <Text style={styles.name}>د. ياسين كمال</Text>
            <Text style={styles.specialty}>جراحة القلب والشرايين</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statVal}>+10</Text>
                <Text style={styles.statLab}>سنوات خبرة</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statVal}>4.8</Text>
                <Text style={styles.statLab}>تقييم</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statVal}>1.2k</Text>
                <Text style={styles.statLab}>مريض</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>نبذة عن الدكتور</Text>
            <Text style={styles.bio}>
              متخصص في جراحة القلب المفتوح والقسطرة القلبية، خبرة طويلة في المستشفيات الجامعية الكبرى.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات التواصل</Text>
            <View style={styles.infoCard}>
              <InfoRow icon={<MapPin size={18} color="#1565c0" />} text="وهران، حي العقيد لطفي - عمارة النور" />
              <InfoRow icon={<Clock size={18} color="#1565c0" />} text="الأحد - الخميس (09:00 - 17:00)" />
              <InfoRow icon={<Phone size={18} color="#1565c0" />} text="0555 12 34 56" />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الشهادات والخبرات</Text>
            <View style={styles.infoCard}>
              <InfoRow icon={<Award size={18} color="#1565c0" />} text="دكتوراه في الطب - جامعة وهران" />
              <InfoRow icon={<Award size={18} color="#1565c0" />} text="تخصص جراحة قلب - مستشفى باريس" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate(Routes.PatientFormScreen)}
        >
          <Text style={styles.bookBtnText}>حجز موعد الآن</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const InfoRow = ({ icon, text }) => (
  <View style={styles.infoRow}>
    {icon}
    <Text style={styles.infoRowText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  profileHeader: { paddingBottom: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, alignItems: 'center' },
  navBar: { position: 'absolute', top: 30, left: 20, paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  profileInfo: { alignItems: 'center', marginTop: 10 },
  avatarWrap: { width: 100, height: 100, borderRadius: 35, padding: 4, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 16 },
  avatar: { flex: 1, borderRadius: 31 },
  name: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4 },
  specialty: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  statsRow: { flexDirection: 'row-reverse', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20, padding: 16, width: width - 40 },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800', color: '#fff' },
  statLab: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  content: { padding: 20, paddingBottom: 100 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', marginBottom: 12, textAlign: 'right' },
  bio: { fontSize: 14, color: '#71869b', lineHeight: 22, textAlign: 'right' },
  infoCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#dbe6f0' },
  infoRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 },
  infoRowText: { fontSize: 13, color: '#5a7288', marginRight: 10, flex: 1, textAlign: 'right' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#dbe6f0' },
  bookBtn: { backgroundColor: '#1565c0', borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: '#1565c0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientDoctorScreen;
