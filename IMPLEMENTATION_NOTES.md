# Implementation Notes for Sickle Safe

This document provides specific implementation guidance for features identified during the architecture review.

---

## 🔴 CRITICAL: Missing Screens to Build Next

### 1. Connect to Overcomer Screen (Helper Onboarding)
**Path**: `app/(onboarding)/helper/connect-overcomer.tsx`

**Purpose**: Final step of Helper onboarding. Allows Helpers to join a Overcomer's Circle of Care.

**Features Needed**:
```typescript
// Two connection methods:

1. QR Code Scanner
   - Use expo-camera or expo-barcode-scanner
   - Scan Overcomer's QR code (generated in Settings)
   - Automatically sends connection request

2. Invite Code Input
   - 6-digit alphanumeric code
   - Input field with auto-advance
   - Validates code against backend

// UI Flow:
Welcome message → Choose method → Scan/Enter code → Loading → Success/Error

// After successful connection:
router.replace('/(helper)'); // Go to Helper main app
```

**Example Code**:
```tsx
import { CameraView } from 'expo-camera';
import { useState } from 'react';

export default function ConnectOvercomerScreen() {
  const [method, setMethod] = useState<'qr' | 'code'>('qr');
  const [hasPermission, setHasPermission] = useState(null);

  const handleQRScan = (data: string) => {
    // Parse QR data: { overcomerId: 'uuid', inviteCode: 'ABC123' }
    // Call API: POST /helpers/connect with overcomerId
    // Show success toast, navigate to helper app
  };

  return (
    // QR scanner UI or 6-digit input field
  );
}
```

---

### 2. Crisis Mode Dashboard (Overcomer)
**Path**: `app/crisis/active.tsx` (Modal presentation)

**Purpose**: Transform the normal Dashboard into a high-urgency crisis UI when alert is triggered.

**Key Differences from Normal Dashboard**:
- ❌ Remove wellness tracking, care plan tasks
- ✅ Show live location sharing toggle
- ✅ Display "Circle Status" (who's been notified, who acknowledged)
- ✅ Emergency contact quick-dial buttons
- ✅ "End Crisis" button (triggers Resolution Modal)
- ✅ Real-time Helper locations on map (if sharing)

**Visual Design**:
```
┌─────────────────────────────────┐
│ 🚨 CRISIS MODE ACTIVE           │ ← Red header
│ Started at 2:35 PM              │
├─────────────────────────────────┤
│ 📍 Location Sharing: ON         │
│ Last updated: 2 min ago         │
├─────────────────────────────────┤
│ Circle Status:                  │
│ ✅ Sarah (Mom) - Acknowledged   │
│ ✅ Mike - En Route (5 min)      │
│ ⏳ Emma - Notified              │
├─────────────────────────────────┤
│ Quick Actions:                  │
│ [📞 Call 911]  [📞 Dr. Chen]    │
├─────────────────────────────────┤
│ [END CRISIS] ← Opens modal      │
└─────────────────────────────────┘
```

**Implementation**:
```typescript
// app/crisis/active.tsx
import { useEffect } from 'react';
import * as Location from 'expo-location';

export default function ActiveCrisisScreen() {
  useEffect(() => {
    // Start background location tracking
    const startLocationTracking = async () => {
      await Location.startLocationUpdatesAsync('crisis-tracking', {
        accuracy: Location.Accuracy.High,
        timeInterval: 30000, // Every 30 seconds
        distanceInterval: 50, // Every 50 meters
      });
    };

    startLocationTracking();

    // Cleanup on unmount or crisis end
    return () => {
      Location.stopLocationUpdatesAsync('crisis-tracking');
    };
  }, []);

  const handleEndCrisis = () => {
    // Show ResolutionModal
    router.push('/crisis/resolution');
  };

  return (
    // Crisis UI
  );
}
```

---

### 3. Crisis Resolution Modal
**Path**: `app/crisis/resolution.tsx` (Modal presentation)

**Purpose**: Collect post-crisis data and close the crisis gracefully.

**Fields**:
1. **Current Pain Level** (1-10 slider)
2. **Did you visit a hospital?** (Yes/No toggle)
   - If Yes: Which hospital? (Dropdown or text input)
3. **Recovery Notes** (Optional textarea)
4. **Duration Summary** (Auto-calculated, read-only)

**Actions**:
- **[Resolve Crisis]** → Notify Circle, save to history, return to Dashboard
- **[Cancel]** → Return to Crisis Dashboard

**Example Code**:
```tsx
import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';

export default function ResolutionModal() {
  const [painLevel, setPainLevel] = useState(5);
  const [hospitalVisit, setHospitalVisit] = useState(false);
  const [notes, setNotes] = useState('');

  const handleResolve = async () => {
    await api.post('/crises/resolve', {
      crisisId: 'current-crisis-id',
      painLevel,
      hospitalVisit,
      notes,
      resolvedAt: new Date().toISOString()
    });

    // Push notification to Circle: "Maya's crisis has resolved. Pain level: 5"
    await notifyCircle({ type: 'crisis_resolved', painLevel });

    // Save to Wellness Log
    await saveWellnessLog({ type: 'crisis_resolution', painLevel, notes });

    router.replace('/(overcomer)'); // Return to normal Dashboard
  };

  return (
    <View>
      <Text>How are you feeling now?</Text>
      {/* Pain level slider */}
      {/* Hospital toggle */}
      {/* Notes textarea */}
      <Pressable onPress={handleResolve}>Resolve Crisis</Pressable>
    </View>
  );
}
```

---

## 🟡 HIGH PRIORITY: Task Management Screens

### Delegation List
**Original HTML**: Screen #9 in your files

**Key Features**:
- Filter by urgency: All / Urgent / Can Wait
- Color-coded task cards (red = urgent, green = flexible)
- "Invite Helpers" button → Share list via SMS/email
- Task assignment: Unassigned / Assigned to Helper
- "Add Task" FAB (floating action button)

**Data Structure**:
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'urgent' | 'routine';
  category: 'emergency' | 'medical' | 'household' | 'pets' | 'wellness';
  visibility: 'private' | 'helpers';
  assignedTo?: string; // Helper ID
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}
```

---

### New Task Creation
**Original HTML**: Screens #13, #16 (Light & Dark variants)

**Fields**:
1. **Task Title** (Text input)
2. **Priority Level** (3 radio buttons: Routine / Urgent / Critical)
3. **Due Date** (Date picker)
4. **Due Time** (Time picker)
5. **Assign To** (Toggle: Private / Helper Network)
6. **Description** (Textarea)
7. **Attachments** (Optional: Medical records, images)

**Native Features**:
```typescript
// Date/Time Pickers
import DateTimePicker from '@react-native-community/datetimepicker';

// Image Picker (for attachments)
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled) {
    // Upload to server or attach to task
  }
};
```

---

### Task Details & Scheduling
**Original HTML**: Screen #14

**Features**:
- Full task view with edit mode
- Date/time picker modal (calendar + clock UI)
- Checklist support (subtasks)
- Comments/notes thread
- "Remind me" toggle
- "Repeat" options (daily, weekly, monthly)

**Implementation**:
```tsx
// Bottom sheet modal for date/time editing
import BottomSheet from '@gorhom/bottom-sheet';

<BottomSheet snapPoints={['50%', '90%']}>
  <CalendarView />
  <ClockView />
</BottomSheet>
```

---

## 🟢 MEDIUM PRIORITY: Additional Screens

### Wellness Log Screen
**Path**: `app/(overcomer)/log.tsx` (Replace placeholder)

**Features**:
- Daily entries: Pain level, hydration, meds taken, mood
- Calendar view (dot indicators for logged days)
- Trend graphs (pain over time, hydration compliance)
- Export to PDF for doctor visits

**UI Inspiration**: Apple Health app, MyFitnessPal

---

### Settings/Profile Screen
**Path**: `app/(overcomer)/profile.tsx` (Replace placeholder)

**Sections**:
1. **Account**: Name, email, phone, avatar
2. **Circle of Care**: Manage Helpers (add, remove, permissions)
3. **Medical Profile**: Link to Medical ID setup
4. **Notifications**: Push, SMS, email preferences
5. **Privacy**: Location sharing, data export
6. **About**: Version, terms, privacy policy

---

### Hospital Finder (Map Integration)
**Path**: `app/hospitals.tsx`

**Features**:
- expo-location to get current position
- react-native-maps to display nearby hospitals
- Filter by: "ER", "Sickle Cell Specialist", "24/7"
- "Call" and "Navigate" buttons (deep link to Maps app)

**Example**:
```tsx
import MapView, { Marker } from 'react-native-maps';

<MapView
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }}
>
  {hospitals.map(hospital => (
    <Marker
      key={hospital.id}
      coordinate={{ latitude: hospital.lat, longitude: hospital.lng }}
      title={hospital.name}
      description={hospital.distance}
    />
  ))}
</MapView>
```

---

## 🔐 Security & Compliance

### Medical Data Encryption
```typescript
// services/encryption.ts
import * as SecureStore from 'expo-secure-store';

export async function saveMedicalProfile(profile: MedicalProfile) {
  const encrypted = JSON.stringify(profile); // In production, use real encryption
  await SecureStore.setItemAsync('medical_profile', encrypted);
}

export async function loadMedicalProfile(): Promise<MedicalProfile | null> {
  const encrypted = await SecureStore.getItemAsync('medical_profile');
  if (!encrypted) return null;
  return JSON.parse(encrypted);
}
```

### Biometric Lock for Medical ID
```typescript
// app/medical-id.tsx (add to existing screen)
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';

export default function MedicalIDScreen() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Unlock Medical ID',
          fallbackLabel: 'Use Passcode',
        });

        setIsUnlocked(result.success);
      } else {
        setIsUnlocked(true); // No biometrics, show directly
      }
    };

    authenticate();
  }, []);

  if (!isUnlocked) {
    return <LockScreen />; // Show lock icon, "Unlock with Face ID" text
  }

  return (
    // Normal Medical ID UI
  );
}
```

---

## 🌐 Offline Mode Implementation

### 1. Detect Connectivity
```typescript
// hooks/useNetworkStatus.ts
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected && state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  return isOnline;
}
```

### 2. Show Offline Banner
```tsx
// components/OfflineBanner.tsx
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function OfflineBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <View className="bg-amber-500 py-2 px-4">
      <Text className="text-white text-sm font-semibold text-center">
        ⚠️ Offline Mode - Viewing cached data
      </Text>
    </View>
  );
}
```

### 3. Cache Medical ID Data
```typescript
// services/medicalId.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function cacheMedicalID(profile: MedicalProfile) {
  await AsyncStorage.setItem('medical_id_cache', JSON.stringify({
    data: profile,
    cachedAt: new Date().toISOString()
  }));
}

export async function getCachedMedicalID(): Promise<MedicalProfile | null> {
  const cached = await AsyncStorage.getItem('medical_id_cache');
  if (!cached) return null;

  const { data, cachedAt } = JSON.parse(cached);
  console.log('Loaded from cache (synced', new Date(cachedAt).toLocaleString(), ')');
  return data;
}
```

---

## 📱 Push Notifications Setup

### 1. Configure Expo Notifications
```typescript
// services/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Push token:', token);

  // Send token to your backend
  await api.post('/users/push-token', { token });
}
```

### 2. Listen for Notifications
```typescript
// app/_layout.tsx (add to existing root layout)
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

export default function RootLayout() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Notification received while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received!', notification);
      // Show in-app banner or update UI
    });

    // User tapped on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped!', response);
      const data = response.notification.request.content.data;

      if (data.type === 'crisis_alert') {
        router.push('/crisis/active');
      } else if (data.type === 'task_assigned') {
        router.push(`/tasks/${data.taskId}`);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return <Stack />;
}
```

### 3. Send Crisis Alert
```typescript
// services/crisis.ts
export async function triggerCrisisAlert(overcomerId: string, location: Location) {
  // Call backend API to create crisis
  const crisis = await api.post('/crises', {
    overcomerId,
    location,
    triggeredAt: new Date().toISOString()
  });

  // Backend sends push notifications to all Helpers in Circle
  // Notification payload:
  // {
  //   title: "🚨 Crisis Alert: Maya needs help",
  //   body: "Pain level: 8. Tap to view details.",
  //   data: { type: 'crisis_alert', crisisId: crisis.id }
  // }

  return crisis;
}
```

---

## 🗺️ Background Location Tracking

### 1. Define Background Task
```typescript
// tasks/locationTracking.ts
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'crisis-location-tracking';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Location tracking error:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0];

    // Send location to backend
    await fetch('https://api.sicklesafe.com/crises/update-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crisisId: 'current-crisis-id',
        location: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          timestamp: location.timestamp
        }
      })
    });
  }
});
```

### 2. Start Tracking (Crisis Mode Only)
```typescript
// app/crisis/active.tsx
import * as Location from 'expo-location';

async function startCrisisLocationTracking() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Location permission is required for crisis mode');
    return;
  }

  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    alert('Background location is needed to track your location during a crisis');
    return;
  }

  await Location.startLocationUpdatesAsync('crisis-location-tracking', {
    accuracy: Location.Accuracy.High,
    timeInterval: 30000, // Every 30 seconds
    distanceInterval: 50, // Every 50 meters
    foregroundService: {
      notificationTitle: 'Crisis Mode Active',
      notificationBody: 'Sharing location with your Circle of Care',
    },
  });
}
```

---

## 📊 Data Models (Full Schemas)

### User
```typescript
interface User {
  id: string;
  role: 'overcomer' | 'helper' | 'volunteer';
  email: string;
  phone: string;
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    avatarUrl?: string;
    timezone: string;
  };
  medicalProfile?: MedicalProfile; // Only for Overcomers
  circle: string[]; // IDs of Helpers
  createdAt: string;
  lastActive: string;
}
```

### Medical Profile
```typescript
interface MedicalProfile {
  userId: string;
  condition: 'Sickle Cell Disease';
  subtype: 'Type SS' | 'Type SC' | 'Type SB+' | 'Type SB0';
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  organDonor: boolean;
  allergies: Array<{
    allergen: string;
    severity: 'mild' | 'moderate' | 'severe';
    reaction: string;
  }>;
  crisisProtocol: {
    preferredTreatment: string[];
    avoidMedications: string[];
    targetSpO2: number;
    notes: string;
  };
  primaryPhysician: {
    name: string;
    specialty: string;
    hospital: string;
    phone: string;
  };
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    isPrimary: boolean;
  }>;
  insurance: {
    provider: string;
    policyNumber: string;
  };
  updatedAt: string;
}
```

### Task
```typescript
interface Task {
  id: string;
  createdBy: string; // Overcomer ID
  title: string;
  description: string;
  priority: 'critical' | 'urgent' | 'routine';
  category: 'emergency' | 'medical' | 'household' | 'pets' | 'wellness';
  visibility: 'private' | 'helpers';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: string;
  assignedTo?: string; // Helper ID
  claimedBy?: string; // Helper ID
  claimedAt?: string;
  completedAt?: string;
  location?: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  attachments: string[]; // URLs
  subtasks: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  triggeredByCrisis: boolean;
  crisisId?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Crisis
```typescript
interface Crisis {
  id: string;
  overcomerId: string;
  triggeredAt: string;
  resolvedAt?: string;
  status: 'active' | 'resolved' | 'false-alarm';
  painLevel: number; // 1-10
  location: {
    coordinates: { lat: number; lng: number };
    address: string;
    sharingEnabled: boolean;
  };
  notifiedContacts: Array<{
    contactId: string;
    notifiedAt: string;
    acknowledgedAt?: string;
    status: 'notified' | 'acknowledged' | 'en-route' | 'arrived';
  }>;
  autoCreatedTasks: string[]; // Task IDs
  resolutionNotes?: string;
  hospitalVisit: boolean;
  hospitalName?: string;
}
```

### Wellness Log
```typescript
interface WellnessLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  entries: {
    painLevel?: number; // 1-10
    hydration?: {
      goal: number;
      actual: number;
      unit: 'glasses' | 'liters';
    };
    medication: Array<{
      name: string;
      dosage: string;
      takenAt: string;
      completed: boolean;
    }>;
    mood?: 'great' | 'good' | 'okay' | 'low' | 'struggling';
    symptoms: string[];
    activities: string[];
    notes?: string;
  };
  createdAt: string;
}
```

---

## 🎯 Next Immediate Steps

1. **Run the app**:
   ```bash
   cd "sickle safe app"
   npm install
   npm start
   ```

2. **Test onboarding flow**:
   - Welcome → Community → Role Selection → Overcomer flow → Dashboard
   - Welcome → Community → Role Selection → Helper flow → (Missing screen)

3. **Build missing screens** (in this order):
   - Connect to Overcomer (Helper onboarding blocker)
   - Crisis Mode Dashboard
   - Crisis Resolution Modal
   - Delegation List
   - New Task Creation

4. **Set up backend** (if not done):
   - Authentication endpoints
   - Task CRUD endpoints
   - Crisis management endpoints
   - Push notification service

---

**Questions? Issues?**
- Check README.md for setup instructions
- Refer to Data Models above for API contract
- Test offline mode by enabling Airplane Mode in simulator
