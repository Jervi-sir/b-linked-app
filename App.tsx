import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { SheetProvider } from "react-native-actions-sheet";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Routes } from '@/utils/variables/routes';
import { BootScreen } from '@/screens/boot-screen';
import LandingScreen from '@/screens/auth/landing-screen';
import UserSelectorScreen from '@/screens/auth/user-selector-screen';
import PatientLoginScreen from '@/screens/patient/patient-login-screen';
import PatientHomeScreen from '@/screens/patient/m1/patient-home-screen';
import DoctorHomeScreen from './screens/doctor/m1/doctor-home-screen';
import DoctorApptsScreen from './screens/doctor/m2/doctor-appts-screen';
import DoctorPatientsScreen from './screens/doctor/m3/doctor-patients-screen';
import DoctorPatientDetailsScreen from './screens/doctor/m3/doctor-patient-details-screen';
import DoctorProfileScreen from './screens/doctor/m4/doctor-profile-screen';
import DoctorPersonalDataScreen from './screens/doctor/m4/doctor-personal-data-screen';
import DoctorWeeklyScheduleScreen from './screens/doctor/m4/doctor-weekly-schedule-screen';
import DoctorProfileOnboardingScreen from './screens/doctor/m4/doctor-profile-onboarding-screen';
import DoctorLoginScreen from './screens/doctor/doctor-login-screen';
import { DoctorNavigation } from './screens/doctor/doctor-navigation';
import { CenterNavigation } from './screens/center/center-navigation';


import CenterLoginScreen from './screens/center/center-login-screen';
import CenterHomeScreen from './screens/center/m1/center-home-screen';
import CenterBookingsScreen from './screens/center/m2/center-bookings-screen';
import CenterServicesScreen from './screens/center/m3/center-services-screen';
import CenterServiceFormScreen from './screens/center/m3/center-service-form-screen';
import CenterServiceDetailsScreen from './screens/center/m3/center-service-details-screen';
import CenterBasicDataScreen from './screens/center/m4/center-basic-data-screen';
import CenterLocationScreen from './screens/center/m4/center-location-screen';
import CenterProfileOnboardingScreen from './screens/center/m4/center-profile-onboarding-screen';
import CenterWorkingHoursScreen from './screens/center/m4/center-working-hours-screen';
import CenterProfileScreen from './screens/center/m4/center-profile-screen';
import PatientSearchScreen from './screens/patient/m2/patient-search-screen';
import PatientBookingsScreen from './screens/patient/m3/patient-bookings-screen';
import PatientCenterScreen from './screens/patient/patient-center-screen';
import PatientConfirmScreen from './screens/patient/patient-confirm-screen';
import PatientEmptyScreen from './screens/patient/m4/patient-empty-screen';
import PatientDoctorScreen from './screens/patient/patient-doctors-creen';
import PatientFormScreen from './screens/patient/patient-form-screen';
import PatientProfileOnboardingScreen from './screens/patient/patient-profile-onboarding-screen';
import PatientLocationScreen from './screens/patient/patient-location-screen';
import PatientOfflineScreen from './screens/patient/patient-offline-screen';
import PatientResultsScreen from './screens/patient/patient-results-screen';
import PatientSuccessScreen from './screens/patient/patient-success-screen';
import PatientTimeScreen from './screens/patient/patient-time-screen';
import { PatientNavigation } from './screens/patient/patient-navigation';


export default function App() {
  const navigationRef = useNavigationContainerRef();
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => {
          const currentRouteName = navigationRef.getCurrentRoute()?.name;
          console.log("📍 Navigated to screen:", currentRouteName);
        }}
      >
        <SheetProvider>
          <AppContent />
        </SheetProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

const Stack = createNativeStackNavigator();

const AppContent = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={Routes.BootScreen}
    >
      {[
        { name: Routes.BootScreen, component: BootScreen, },
        { name: Routes.LandingScreen, component: LandingScreen, },
        { name: Routes.UserSelectorScreen, component: UserSelectorScreen, },

        // Patient
        { name: Routes.PatientLoginScreen, component: PatientLoginScreen, },
        { name: Routes.PatientNavigation, component: PatientNavigation, },
        { name: Routes.PatientHomeScreen, component: PatientHomeScreen, },

        { name: Routes.PatientSearchScreen, component: PatientSearchScreen, },
        { name: Routes.PatientBookingsScreen, component: PatientBookingsScreen },
        { name: Routes.PatientCenterScreen, component: PatientCenterScreen },
        { name: Routes.PatientConfirmScreen, component: PatientConfirmScreen },
        { name: Routes.PatientEmptyScreen, component: PatientEmptyScreen },
        { name: Routes.PatientDoctorScreen, component: PatientDoctorScreen },
        { name: Routes.PatientFormScreen, component: PatientFormScreen },
        { name: Routes.PatientProfileOnboardingScreen, component: PatientProfileOnboardingScreen },
        { name: Routes.PatientLocationScreen, component: PatientLocationScreen },
        { name: Routes.PatientOfflineScreen, component: PatientOfflineScreen },
        { name: Routes.PatientResultsScreen, component: PatientResultsScreen },
        { name: Routes.PatientSuccessScreen, component: PatientSuccessScreen },
        { name: Routes.PatientTimeScreen, component: PatientTimeScreen },


        // Doctor
        { name: Routes.DoctorNavigation, component: DoctorNavigation, },
        { name: Routes.DoctorLoginScreen, component: DoctorLoginScreen, },
        { name: Routes.DoctorHomeScreen, component: DoctorHomeScreen, },
        { name: Routes.DoctorApptsScreen, component: DoctorApptsScreen, },
        { name: Routes.DoctorPatientsScreen, component: DoctorPatientsScreen, },
        { name: Routes.DoctorPatientDetailsScreen, component: DoctorPatientDetailsScreen, },
        { name: Routes.DoctorProfileScreen, component: DoctorProfileScreen, },
        { name: Routes.DoctorPersonalDataScreen, component: DoctorPersonalDataScreen, },
        { name: Routes.DoctorWeeklyScheduleScreen, component: DoctorWeeklyScheduleScreen, },
        { name: Routes.DoctorProfileOnboardingScreen, component: DoctorProfileOnboardingScreen, },


        // Center
        { name: Routes.CenterNavigation, component: CenterNavigation, },
        { name: Routes.CenterLoginScreen, component: CenterLoginScreen, },

        { name: Routes.CenterHomeScreen, component: CenterHomeScreen, },
        { name: Routes.CenterBookingsScreen, component: CenterBookingsScreen, },
        { name: Routes.CenterServicesScreen, component: CenterServicesScreen, },
        { name: Routes.CenterServiceFormScreen, component: CenterServiceFormScreen, },
        { name: Routes.CenterServiceDetailsScreen, component: CenterServiceDetailsScreen, },
        { name: Routes.CenterBasicDataScreen, component: CenterBasicDataScreen, },
        { name: Routes.CenterLocationScreen, component: CenterLocationScreen, },
        { name: Routes.CenterProfileOnboardingScreen, component: CenterProfileOnboardingScreen, },
        { name: Routes.CenterWorkingHoursScreen, component: CenterWorkingHoursScreen, },
        { name: Routes.CenterProfileScreen, component: CenterProfileScreen, },



      ].map((item, index) => (
        <Stack.Screen key={index} name={item.name} component={item.component} />
      ))}
    </Stack.Navigator>
  )
}
