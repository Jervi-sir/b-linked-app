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
import { ChevronRight, Search, MapPin, Star, ChevronLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';


const PatientResultsScreen = () => {
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
              <Text style={styles.headerTitle}>نتائج البحث</Text>
              <Text style={styles.headerSub}>أطباء قلب في وهران</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>تم العثور على 12 نتيجة</Text>
        </View>

        <View style={styles.list}>
          <ResultItem
            name="د. ياسين كمال"
            specialty="جراحة القلب والشرايين"
            location="وهران، حي العقيد لطفي"
            rating="4.8"
            onPress={() => navigation.navigate(Routes.PatientDoctorScreen)}
          />
          <ResultItem
            name="د. سعاد مرابط"
            specialty="طب القلب للأطفال"
            location="وهران، وسط المدينة"
            rating="4.9"
            onPress={() => navigation.navigate(Routes.PatientDoctorScreen)}
          />
          <ResultItem
            name="مركز الشفاء الطبي"
            specialty="مجمع عيادات متخصص"
            location="وهران، بير الجير"
            rating="4.7"
            isCenter
            onPress={() => navigation.navigate(Routes.PatientCenterScreen)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const ResultItem = ({ name, specialty, location, rating, isCenter = false, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemSpecialty}>{specialty}</Text>
      <View style={styles.itemMeta}>
        <MapPin size={12} color="#71869b" />
        <Text style={styles.itemMetaText}>{location}</Text>
      </View>
      <View style={styles.itemFooter}>
        <View style={styles.rating}>
          <Star size={12} color="#ffb400" fill="#ffb400" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
        <Text style={[styles.typeChip, isCenter && styles.typeChipCenter]}>
          {isCenter ? 'مركز طبي' : 'طبيب'}
        </Text>
      </View>
    </View>
    <View style={styles.itemThumb} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerContent: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  backBtn: { marginLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'right' },
  scrollContent: { padding: 16 },
  resultsHeader: { marginBottom: 12 },
  resultsCount: { fontSize: 14, color: '#71869b', textAlign: 'right' },
  list: { gap: 12 },
  item: { backgroundColor: '#fff', borderRadius: 20, padding: 12, flexDirection: 'row-reverse', borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#1565c0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  itemInfo: { flex: 1, paddingRight: 12 },
  itemName: { fontSize: 16, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 2 },
  itemSpecialty: { fontSize: 13, color: '#1565c0', textAlign: 'right', marginBottom: 6 },
  itemMeta: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 8 },
  itemMetaText: { fontSize: 11, color: '#71869b', marginRight: 4 },
  itemFooter: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  rating: { flexDirection: 'row-reverse', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#17324a', marginRight: 4 },
  typeChip: { fontSize: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: '#eaf4ff', color: '#1565c0', fontWeight: '700' },
  typeChipCenter: { backgroundColor: '#eaf9f4', color: '#12916d' },
  itemThumb: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#f8fbff', borderWidth: 1, borderColor: '#dce9f6' },
});

export default PatientResultsScreen;
