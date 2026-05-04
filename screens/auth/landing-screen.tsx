import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../utils/variables/routes';

const { width } = Dimensions.get('window');

const LandingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [toastVisible, setToastVisible] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const showToast = () => {
    setToastVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setToastVisible(false));
    }, 2000);
  };

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
            {/* Logo */}
            <LinearGradient
              colors={['#d8ebff', '#f8fbff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logo}
            >
              <Text style={styles.logoText}>B</Text>
            </LinearGradient>

            <Text style={styles.title}>B-linked</Text>
            <Text style={styles.subtitle}>
              ربط المريض بالخدمة الصحية المناسبة بسهولة
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Content Section */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>منصة صحية موحدة</Text>
          <Text style={styles.cardText}>
            حجز أطباء، مخابر، ومراكز أشعة مع دعم الموقع وفتح المسار في Google Maps.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>لماذا B-linked؟</Text>
          <Text style={styles.cardText}>
            لأن المريض يحتاج تجربة بسيطة وسريعة، بينما يحتاج الطبيب والمركز إلى لوحة تشغيل واضحة.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(Routes.UserSelectorScreen)}
        >
          <Text style={styles.buttonText}>ابدأ العرض</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Toast Notification */}
      {toastVisible && (
        <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
          <Text style={styles.toastText}>تم تنفيذ الإجراء التجريبي داخل الـ Demo.</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8fc',
  },
  header: {
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d9e8f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0d3f6a',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '80%',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dbe6f0',
    shadowColor: '#1565c0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17324a',
    marginBottom: 8,
    textAlign: 'right',
  },
  cardText: {
    fontSize: 14,
    color: '#71869b',
    lineHeight: 24,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#1565c0',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#1565c0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  toast: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbe6f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  toastText: {
    color: '#5a7288',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LandingScreen;
