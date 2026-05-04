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
import {
  Search,
  Stethoscope,
  Activity,
  FlaskConical,
  MapPin,
  Home,
  Calendar,
  Menu,
  ChevronLeft
} from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';

const { width } = Dimensions.get('window');

const PatientHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Section */}
      <LinearGradient
        colors={['#0d3f6a', '#1f88e5']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>B-linked</Text>
              <Text style={styles.headerSub}>الرئيسية</Text>
            </View>

            <TouchableOpacity
              style={styles.searchBar}
              activeOpacity={0.9}
              onPress={() => navigation.navigate(Routes.PatientSearchScreen)}
            >
              <Search size={18} color="#8aa0b4" style={styles.searchIcon} />
              <Text style={styles.searchText}>ابحث عن طبيب، مخبر، أشعة أو خدمة...</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Section */}
        <View style={styles.banner}>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>قريب مني</Text>
            <Text style={styles.bannerText}>اعثر على الجهات الأقرب باستخدام موقعك الحالي.</Text>
          </View>
          <LinearGradient
            colors={['#cae3ff', '#f8fbff']}
            style={styles.bannerArt}
          />
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickGrid}>
          <QuickAction
            icon={<Stethoscope size={24} color="#1565c0" />}
            label="أطباء"
            onPress={() => navigation.navigate(Routes.PatientResultsScreen)}
          />
          <QuickAction
            icon={<Activity size={24} color="#1565c0" />}
            label="أشعة"
            onPress={() => navigation.navigate(Routes.PatientResultsScreen)}
          />
          <QuickAction
            icon={<FlaskConical size={24} color="#1565c0" />}
            label="مخابر"
            onPress={() => navigation.navigate(Routes.PatientResultsScreen)}
          />
          <QuickAction
            icon={<MapPin size={24} color="#1565c0" />}
            label="قريب مني"
            onPress={() => navigation.navigate(Routes.PatientLocationScreen)}
          />
        </View>

        {/* Suggested Section */}
        <Text style={styles.sectionTitle}>اقتراحات</Text>

        <View style={styles.list}>
          <SuggestionItem
            name="د. أمين بن صالح"
            specialty="قلب · تقييم 4.9"
            buttonLabel="عرض الملف"
            primary
            onPress={() => navigation.navigate(Routes.PatientDoctorScreen)}
          />
          <SuggestionItem
            name="مركز الأمل للأشعة"
            specialty="وهران · تصوير طبي"
            buttonLabel="التفاصيل"
            onPress={() => navigation.navigate(Routes.PatientCenterScreen)}
          />
        </View>
      </ScrollView>

    </View>
  );
};

const QuickAction = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.qAction} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.qIconWrap}>{icon}</View>
    <Text style={styles.qLabel}>{label}</Text>
  </TouchableOpacity>
);

const SuggestionItem = ({ name, specialty, buttonLabel, primary = false, onPress }) => (
  <View style={styles.item}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemMeta}>{specialty}</Text>
      <TouchableOpacity
        style={[styles.itemBtn, !primary && styles.itemBtnOut]}
        onPress={onPress}
      >
        <Text style={[styles.itemBtnText, !primary && styles.itemBtnTextOut]}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
    <LinearGradient
      colors={['#d9ebff', '#f8fbff']}
      style={styles.itemThumb}
    />
  </View>
);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8fc',
  },
  header: {
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTop: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'right',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
    marginTop: 2,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchText: {
    color: '#8aa0b4',
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  banner: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dbe6f0',
    shadowColor: '#1565c0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  bannerInfo: {
    flex: 1,
    paddingRight: 12,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#17324a',
    textAlign: 'right',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    color: '#71869b',
    textAlign: 'right',
    lineHeight: 18,
  },
  bannerArt: {
    width: 72,
    height: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbe8f5',
  },
  quickGrid: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  qAction: {
    width: (width - 60) / 4,
    alignItems: 'center',
  },
  qIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#eaf4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dbe6f0',
  },
  qLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#17324a',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#17324a',
    marginBottom: 12,
    textAlign: 'right',
  },
  list: {
    gap: 12,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbe6f0',
    shadowColor: '#1565c0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#17324a',
    textAlign: 'right',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: '#71869b',
    textAlign: 'right',
    marginBottom: 10,
  },
  itemBtn: {
    backgroundColor: '#1565c0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
  },
  itemBtnOut: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1565c0',
  },
  itemBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  itemBtnTextOut: {
    color: '#1565c0',
  },
  itemThumb: {
    width: 82,
    height: 82,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dce9f6',
  },

});

export default PatientHomeScreen;
