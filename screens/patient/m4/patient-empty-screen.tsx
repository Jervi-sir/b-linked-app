import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Inbox, Home } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';


const PatientEmptyScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.content}>
        <View style={styles.iconWrap}>
          <Inbox size={80} color="#dbe6f0" />
        </View>
        <Text style={styles.title}>لا توجد نتائج</Text>
        <Text style={styles.subtitle}>
          عذراً، لم نتمكن من العثور على ما تبحث عنه. حاول تغيير معايير البحث أو الموقع.
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate(Routes.PatientHomeScreen)}
        >
          <Home size={20} color="#fff" />
          <Text style={styles.btnText}>العودة للرئيسية</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconWrap: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#dbe6f0' },
  title: { fontSize: 22, fontWeight: '900', color: '#17324a', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#71869b', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  btn: { backgroundColor: '#1565c0', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 32, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientEmptyScreen;
