import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Stethoscope, Building2 } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';

const UserSelectorScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0d3f6a', '#1f88e5']} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.logoWrap}>
              <Text style={styles.logoEmoji}>🏥</Text>
            </View>
            <Text style={styles.title}>اختر المسار</Text>
            <Text style={styles.subtitle}>مريض أو طبيب أو مركز / مخبر</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        <SelectorCard
          title="دخول المرضى"
          subtitle="احجز موعدك بسهولة مع أفضل الأطباء"
          icon={<User size={28} color="#1565c0" />}
          onPress={() => navigation.navigate(Routes.PatientNavigation)}
          color="#1565c0"
        />

        <SelectorCard
          title="دخول الأطباء"
          subtitle="إدارة مواعيدك ومرضاك باحترافية"
          icon={<Stethoscope size={28} color="#394fd0" />}
          onPress={() => navigation.navigate(Routes.DoctorLoginScreen)}
          color="#394fd0"
          isVio
        />

        <SelectorCard
          title="المركز / المخبر"
          subtitle="لوحة تحكم شاملة للمراكز والمخابر"
          icon={<Building2 size={28} color="#0c7058" />}
          onPress={() => navigation.navigate(Routes.CenterLoginScreen)}
          color="#0c7058"
          isTeal
        />
      </View>
    </View>
  );
};

const SelectorCard = ({ title, subtitle, icon, onPress, color, isVio = false, isTeal = false }) => (
  <TouchableOpacity
    style={[
      styles.card,
      isVio && styles.cardVio,
      isTeal && styles.cardTeal
    ]}
    onPress={onPress}
  >
    <View style={styles.cardInfo}>
      <Text style={[styles.cardTitle, { color }]}>{title}</Text>
      <Text style={styles.cardSub}>{subtitle}</Text>
    </View>
    <View style={[styles.iconWrap, { backgroundColor: color + '15' }]}>
      {icon}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  header: { paddingBottom: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerContent: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'center' },
  logoWrap: { width: 80, height: 80, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoEmoji: { fontSize: 40 },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  content: { padding: 20, gap: 16, marginTop: -20 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, borderColor: '#dbe6f0', shadowColor: '#1565c0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardVio: { shadowColor: '#394fd0' },
  cardTeal: { shadowColor: '#0c7058' },
  iconWrap: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1, paddingRight: 16 },
  cardTitle: { fontSize: 18, fontWeight: '900', textAlign: 'right', marginBottom: 4 },
  cardSub: { fontSize: 12, color: '#71869b', textAlign: 'right' },
});

export default UserSelectorScreen;
