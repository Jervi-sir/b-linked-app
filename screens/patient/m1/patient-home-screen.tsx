import React, { ReactNode, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, FlaskConical, MapPin, Search, Stethoscope } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { api } from '@/utils/auth';
import { Routes } from '@/utils/variables/routes';

const { width } = Dimensions.get('window');

type QuickActionItem = {
  key: string;
  label: string;
  target: string;
};

type Suggestion = {
  entity_type: 'doctor' | 'center';
  entity_id: number;
  title: string;
  subtitle: string;
  action_label: string;
  primary: boolean;
};

type HomeResponse = {
  banner: {
    title: string;
    text: string;
  };
  quick_actions: QuickActionItem[];
  suggestions: Suggestion[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    next_page: number | null;
  };
  meta: {
    patient_name: string | null;
  };
};

type QuickActionProps = {
  icon: ReactNode;
  label: string;
  onPress: () => void;
};

type SuggestionItemProps = {
  name: string;
  specialty: string;
  buttonLabel: string;
  primary?: boolean;
  onPress: () => void;
};

const quickActionIcons: Record<string, ReactNode> = {
  doctors: <Stethoscope size={24} color="#1565c0" />,
  radiology: <Activity size={24} color="#1565c0" />,
  labs: <FlaskConical size={24} color="#1565c0" />,
  nearby: <MapPin size={24} color="#1565c0" />,
};

const defaultBanner = {
  title: 'قريب مني',
  text: 'اعثر على الجهات الأقرب باستخدام موقعك الحالي.',
};

const PatientHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [banner, setBanner] = useState(defaultBanner);
  const [quickActions, setQuickActions] = useState<QuickActionItem[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleQuickActionPress = (target: string) => {
    if (target === 'patient_location') {
      navigation.navigate(Routes.PatientLocationScreen);
      return;
    }

    navigation.navigate(Routes.PatientResultsScreen);
  };

  const handleSuggestionPress = (suggestion: Suggestion) => {
    if (suggestion.entity_type === 'doctor') {
      navigation.navigate(Routes.PatientDoctorScreen);
      return;
    }

    navigation.navigate(Routes.PatientCenterScreen);
  };

  const fetchHome = async (page = 1) => {
    const { data } = await api.get<HomeResponse>('/patient/home', {
      params: { page },
    });

    setBanner(data.banner);
    setQuickActions(data.quick_actions);
    setNextPage(data.pagination.next_page);
    setSuggestions(current => (page === 1 ? data.suggestions : [...current, ...data.suggestions]));
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        await fetchHome();
      } catch {
        if (isMounted) {
          Alert.alert('خطأ', 'تعذر تحميل بيانات الصفحة الرئيسية');
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadMore = async () => {
    if (!nextPage || isLoadingMore) {
      return;
    }

    try {
      setIsLoadingMore(true);
      await fetchHome(nextPage);
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل المزيد من الاقتراحات');
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0d3f6a', '#1f88e5']} style={styles.header}>
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

      {isInitialLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1565c0" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.banner}>
            <View style={styles.bannerInfo}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerText}>{banner.text}</Text>
            </View>
            <LinearGradient colors={['#cae3ff', '#f8fbff']} style={styles.bannerArt} />
          </View>

          <View style={styles.quickGrid}>
            {quickActions.map(action => (
              <QuickAction
                key={action.key}
                icon={quickActionIcons[action.key] ?? <Stethoscope size={24} color="#1565c0" />}
                label={action.label}
                onPress={() => handleQuickActionPress(action.target)}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>اقتراحات</Text>

          <View style={styles.list}>
            {suggestions.map(suggestion => (
              <SuggestionItem
                key={`${suggestion.entity_type}-${suggestion.entity_id}`}
                name={suggestion.title}
                specialty={suggestion.subtitle}
                buttonLabel={suggestion.action_label}
                primary={suggestion.primary}
                onPress={() => handleSuggestionPress(suggestion)}
              />
            ))}
          </View>

          {nextPage ? (
            <TouchableOpacity
              style={[styles.loadMoreBtn, isLoadingMore && styles.loadMoreBtnDisabled]}
              onPress={handleLoadMore}
              disabled={isLoadingMore}
            >
              <Text style={styles.loadMoreText}>
                {isLoadingMore ? 'جارٍ التحميل...' : 'تحميل المزيد'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
};

const QuickAction = ({ icon, label, onPress }: QuickActionProps) => (
  <TouchableOpacity style={styles.qAction} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.qIconWrap}>{icon}</View>
    <Text style={styles.qLabel}>{label}</Text>
  </TouchableOpacity>
);

const SuggestionItem = ({ name, specialty, buttonLabel, primary = false, onPress }: SuggestionItemProps) => (
  <View style={styles.item}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemMeta}>{specialty}</Text>
      <TouchableOpacity style={[styles.itemBtn, !primary && styles.itemBtnOut]} onPress={onPress}>
        <Text style={[styles.itemBtnText, !primary && styles.itemBtnTextOut]}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
    <LinearGradient colors={['#d9ebff', '#f8fbff']} style={styles.itemThumb} />
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
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
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
  loadMoreBtn: {
    backgroundColor: '#1565c0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loadMoreBtnDisabled: {
    opacity: 0.7,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default PatientHomeScreen;
