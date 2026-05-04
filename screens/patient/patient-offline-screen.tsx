import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WifiOff, RefreshCcw } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/variables/routes';


const PatientOfflineScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.content}>
        <View style={styles.iconWrap}>
          <WifiOff size={80} color="#c8403b" />
        </View>
        <Text style={styles.title}>لا يوجد اتصال</Text>
        <Text style={styles.subtitle}>
          يبدو أنك غير متصل بالإنترنت. يرجى التحقق من اتصالك بالشبكة والمحاولة مرة أخرى.
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate(Routes.PatientHomeScreen)}
        >
          <RefreshCcw size={20} color="#fff" />
          <Text style={styles.btnText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdecee' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconWrap: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#fdecee' },
  title: { fontSize: 22, fontWeight: '900', color: '#c8403b', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#c8403b', opacity: 0.7, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  btn: { backgroundColor: '#c8403b', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 32, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PatientOfflineScreen;
