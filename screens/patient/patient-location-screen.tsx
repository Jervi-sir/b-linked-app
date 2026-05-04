import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, MapPin, Navigation, Search } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';


const { width, height } = Dimensions.get('window');

const PatientLocationScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Map Placeholder */}
      <LinearGradient colors={['#d5ebff', '#f5fbff']} style={styles.map}>
        {/* Fake Road 1 */}
        <View style={[styles.road, styles.r1]} />
        <View style={[styles.road, styles.r2]} />
        <View style={[styles.road, styles.r3]} />

        {/* Fake Pins */}
        <MapMarker top="40%" left="26%" title="د. كمال" />
        <MapMarker top="28%" left="58%" title="مركز الشفاء" />
        <MapMarker top="58%" left="68%" title="مخبر التحاليل" />

        {/* User Location */}
        <View style={[styles.userLoc, { top: '50%', left: '45%' }]}>
          <View style={styles.userPulse} />
          <View style={styles.userDot} />
        </View>
      </LinearGradient>

      {/* Floating Header */}
      <SafeAreaView style={styles.floatingHeader}>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={22} color="#17324a" />
          </TouchableOpacity>
          <Text style={styles.searchText}>البحث في الخريطة...</Text>
          <Search size={18} color="#8aa0b4" />
        </View>
      </SafeAreaView>

      {/* Bottom Card */}
      <View style={styles.bottomCardWrap}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>مركز الشفاء الطبي</Text>
              <Text style={styles.cardSub}>وهران، بير الجير (2.4 كم)</Text>
            </View>
            <View style={styles.cardIcon}>
              <MapPin size={24} color="#1565c0" />
            </View>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.dirBtn}>
              <Navigation size={18} color="#fff" />
              <Text style={styles.dirBtnText}>فتح في خرائط Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => navigation.navigate(Routes.PatientCenterScreen)}
            >
              <Text style={styles.detailsBtnText}>التفاصيل</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const MapMarker = ({ top, left, title }) => (
  <View style={[styles.markerWrap, { top, left }]}>
    <View style={styles.pin}>
      <View style={styles.pinInner} />
    </View>
    <View style={styles.pinLabel}>
      <Text style={styles.pinLabelText}>{title}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  map: { flex: 1, position: 'relative' },
  road: { position: 'absolute', height: 8, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 999 },
  r1: { width: '120%', left: '-10%', top: '44%', transform: [{ rotate: '11deg' }] },
  r2: { width: '110%', left: '-6%', top: '66%', transform: [{ rotate: '-8deg' }] },
  r3: { width: '95%', left: '4%', top: '23%', transform: [{ rotate: '-16deg' }] },
  markerWrap: { position: 'absolute', alignItems: 'center' },
  pin: { width: 22, height: 22, backgroundColor: '#1565c0', borderRadius: 11, borderBottomRightRadius: 0, transform: [{ rotate: '-45deg' }], alignItems: 'center', justifyContent: 'center' },
  pinInner: { width: 8, height: 8, backgroundColor: '#fff', borderRadius: 4 },
  pinLabel: { marginTop: 4, backgroundColor: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  pinLabelText: { fontSize: 8, fontWeight: '700', color: '#17324a' },
  userLoc: { position: 'absolute', width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  userDot: { width: 12, height: 12, backgroundColor: '#4285F4', borderRadius: 6, borderWidth: 2, borderColor: '#fff' },
  userPulse: { position: 'absolute', width: 24, height: 24, backgroundColor: 'rgba(66, 133, 244, 0.2)', borderRadius: 12 },
  floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 16 },
  searchBar: { height: 50, backgroundColor: '#fff', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  backBtn: { padding: 4, marginRight: 8 },
  searchText: { flex: 1, color: '#8aa0b4', fontSize: 13, textAlign: 'right', marginRight: 10 },
  bottomCardWrap: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8, borderWidth: 1, borderColor: '#dbe6f0' },
  cardHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 16 },
  cardIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#eaf4ff', alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1, paddingRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#17324a', textAlign: 'right' },
  cardSub: { fontSize: 12, color: '#71869b', textAlign: 'right' },
  cardActions: { flexDirection: 'row-reverse', gap: 10 },
  dirBtn: { flex: 1, backgroundColor: '#1565c0', height: 48, borderRadius: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  dirBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  detailsBtn: { width: 80, height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#dbe6f0', alignItems: 'center', justifyContent: 'center' },
  detailsBtnText: { fontSize: 12, fontWeight: '700', color: '#1565c0' },
});

export default PatientLocationScreen;
