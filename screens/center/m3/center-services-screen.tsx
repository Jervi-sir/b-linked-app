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
import { Plus, Edit2, Trash2, FlaskConical, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { Routes } from '@/utils/variables/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const CenterServicesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0c7058', '#12916d']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>إدارة الخدمات</Text>
              <Text style={styles.headerSub}>تعديل القائمة والأسعار</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.addBtn}>
          <Plus size={20} color="#fff" />
          <Text style={styles.addBtnText}>إضافة خدمة جديدة</Text>
        </TouchableOpacity>

        <View style={styles.list}>
          <ServiceManageItem name="تحليل دم شامل" price="2500 دج" />
          <ServiceManageItem name="أشعة X صدر" price="3500 دج" />
          <ServiceManageItem name="تخطيط قلب" price="4000 دج" />
          <ServiceManageItem name="فحص سكري" price="1500 دج" />
        </View>
      </ScrollView>
    </View>
  );
};

const ServiceManageItem = ({ name, price }) => (
  <View style={styles.item}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemPrice}>{price}</Text>
    </View>
    <View style={styles.itemActions}>
      <TouchableOpacity style={styles.iconBtn}>
        <Edit2 size={18} color="#12916d" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.iconBtn, styles.iconBtnRed]}>
        <Trash2 size={18} color="#c8403b" />
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
  scrollContent: { padding: 16 },
  addBtn: { backgroundColor: '#12916d', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  list: { gap: 12 },
  item: { backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0' },
  itemInfo: { flex: 1, paddingRight: 12 },
  itemName: { fontSize: 15, fontWeight: '800', color: '#17324a', textAlign: 'right', marginBottom: 4 },
  itemPrice: { fontSize: 13, fontWeight: '700', color: '#12916d', textAlign: 'right' },
  itemActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#eaf9f4', alignItems: 'center', justifyContent: 'center' },
  iconBtnRed: { backgroundColor: '#fdecee' },
});

export default CenterServicesScreen;
