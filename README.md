# Sickle Safe - Productivity & Emergency Response App

A React Native app built with Expo for Sickle Cell Warriors and their Caregivers, combining daily wellness management with crisis response features.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (for Android emulator)
- Expo Go app on your physical device (optional)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS Simulator (Mac only)
npm run ios

# Run on Android Emulator
npm run android
```

---

## 📁 Project Structure

```
sickle-safe/
├── app/
│   ├── (onboarding)/          # Onboarding flow screens
│   │   ├── welcome.tsx        # First screen with hero image
│   │   ├── community.tsx      # Community showcase
│   │   ├── role-selection.tsx # Warrior/Helper/Volunteer choice
│   │   ├── warrior/           # Warrior-specific onboarding
│   │   │   ├── productivity.tsx
│   │   │   ├── safety-net.tsx
│   │   │   └── red-alert.tsx
│   │   └── helper/            # Helper-specific onboarding
│   │       ├── real-time-alerts.tsx
│   │       └── actionable-support.tsx
│   │
│   ├── (warrior)/             # Warrior main app (Tab Navigator)
│   │   ├── _layout.tsx        # Tab bar configuration
│   │   ├── index.tsx          # Dashboard (Home)
│   │   ├── log.tsx            # Wellness Log [PLACEHOLDER]
│   │   ├── add.tsx            # Quick Add [PLACEHOLDER]
│   │   ├── community.tsx      # Community [PLACEHOLDER]
│   │   └── profile.tsx        # Profile/Settings [PLACEHOLDER]
│   │
│   ├── medical-id.tsx         # Medical ID Card (Offline-capable)
│   ├── _layout.tsx            # Root layout (expo-router)
│   └── index.tsx              # Root redirect
│
├── components/                # Reusable components [TO BE CREATED]
├── constants/                 # Theme colors, API endpoints [TO BE CREATED]
├── hooks/                     # Custom React hooks [TO BE CREATED]
├── services/                  # API, Location, Notifications [TO BE CREATED]
├── types/                     # TypeScript type definitions [TO BE CREATED]
├── global.css                 # NativeWind global styles
├── tailwind.config.js         # Tailwind/NativeWind config
└── package.json               # Dependencies

```

---

## ✅ Completed Screens (Converted from HTML)

### Onboarding Flow
- ✅ Welcome Screen (with hero image)
- ✅ Community Showcase (profile collage)
- ✅ Role Selection (Warrior/Helper/Volunteer)
- ✅ Warrior Onboarding (3 screens)
  - Productivity First
  - Safety Net
  - Red Alert
- ✅ Helper Onboarding (2 screens)
  - Real-Time Alerts
  - Actionable Support

### Main App
- ✅ Warrior Dashboard (Crisis Alert, Wellness, Care Plan)
- ✅ Medical ID Card (with QR code, offline-ready)

---

## 🚧 Screens Still Needed

### Critical (Blocking MVP)
- ⚠️ **Authentication Flow** (Login/Signup)
- ⚠️ **Connect to Warrior** (Helper onboarding final step)
- ⚠️ **Crisis Mode Dashboard** (Active crisis UI)
- ⚠️ **Crisis Resolution Modal** (End crisis workflow)

### High Priority
- 🔴 Delegation List (Task management for Warriors)
- 🔴 Helper Status View (Task feed during crisis)
- 🔴 New Task Creation (3 variants in original HTML)
- 🔴 Task Details & Scheduling (Calendar/time picker)
- 🔴 Task Category View (Filtered by emergency/medical/household)
- 🔴 Medical ID Setup Flow (Multi-step form)
- 🔴 Messaging/Chat (Circle communication)

### Medium Priority
- 🟡 Wellness Log/History
- 🟡 Settings/Profile
- 🟡 Community/Forum
- 🟡 Hospital/Pharmacy Finder (Map integration)
- 🟡 Medication List
- 🟡 Crisis History Log

---

## 🎨 Design System

### Colors (Tailwind/NativeWind)
```javascript
primary:  #8B5CF6  // Violet 600 (Main CTA, links)
danger:   #EF4444  // Red 500 (Crisis alerts, critical tasks)
success:  #10B981  // Emerald 500 (Completed tasks, positive states)
warning:  #F59E0B  // Amber 500 (Urgent tasks, notifications)
```

### Icons
- **Library**: `lucide-react-native` (replaces Material Icons)
- **Usage**: `<Heart size={24} color="#ef4444" />`

### Typography
- **Font**: System default (SF Pro on iOS, Roboto on Android)
- **Scale**: Tailwind defaults (text-sm, text-base, text-lg, etc.)

### Border Radius
- Default: `12px` (rounded-xl)
- Cards: `16px` (rounded-2xl)
- Modals: `24px` (rounded-3xl)

---

## 🔧 Tech Stack

### Core
- **Framework**: React Native 0.76 + Expo SDK 52
- **Routing**: expo-router v4 (file-based)
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)

### Native Features (Implemented)
- ✅ `expo-haptics` - Crisis button feedback
- ✅ `expo-status-bar` - Auto-styled status bar
- ✅ `expo-linear-gradient` - Background gradients
- ✅ `react-native-qrcode-svg` - Offline Medical ID QR codes

### Native Features (To Implement)
- ⏳ `expo-notifications` - Push alerts
- ⏳ `expo-location` + `expo-task-manager` - Background location
- ⏳ `expo-local-authentication` - Biometric unlock
- ⏳ `@react-native-async-storage/async-storage` - Offline data
- ⏳ `@react-native-community/netinfo` - Connectivity detection

---

## 🏗️ Architecture Notes

### Navigation Structure
```
Root (_layout.tsx)
├── (onboarding)      [Stack] → Hidden after completion
├── (auth)            [Stack] → Login/Signup
├── (warrior)         [Tabs]  → Main app for Warriors
│   ├── index         → Dashboard
│   ├── log           → Wellness tracking
│   ├── add           → Quick actions
│   ├── community     → Forum/chat
│   └── profile       → Settings
├── (helper)          [Stack] → Main app for Helpers
├── medical-id        [Modal] → Emergency screen
└── tasks/[id]        [Stack] → Task details
```

### Data Flow (Recommended)
```
State Management:
  - Zustand or Redux Toolkit (global state)
  - TanStack Query (server state + offline sync)
  - AsyncStorage (persistence)

API Layer (To Be Built):
  - Axios or Fetch
  - Base URL: process.env.EXPO_PUBLIC_API_URL
  - Endpoints: /auth, /users, /tasks, /crises, /medical-profiles
```

### Offline-First Strategy
1. **Medical ID**: Always cached locally (AsyncStorage)
2. **Tasks**: Queue writes, sync when online (TanStack Query)
3. **Crisis Alerts**: Queue notifications, send when connected
4. **Wellness Logs**: Write locally first, sync later

---

## 🔥 Critical Workflows to Implement

### 1. The "Hand-off" Workflow
**Problem**: When a Helper arrives at a Warrior's location, there's no confirmation mechanism.

**Solution**:
```typescript
// services/location.ts
async function triggerHelperCheckIn(crisisId: string, helperId: string) {
  const location = await Location.getCurrentPositionAsync();
  await api.post(`/crises/${crisisId}/checkin`, {
    helperId,
    location: { lat: location.coords.latitude, lng: location.coords.longitude },
    timestamp: new Date().toISOString()
  });

  // Haptic feedback
  Haptics.notificationAsync(Haptics.NotificationFeedbackStyle.Success);

  // Push notification to Warrior: "Mike has arrived"
  await Notifications.scheduleNotificationAsync({ ... });
}
```

### 2. The "Resolution" Workflow
**Problem**: No clear transition from Crisis Mode → Normal Mode.

**Solution** (User will create this screen):
- Crisis Dashboard with "End Crisis" button
- Modal: Pain level slider (1-10) + recovery notes
- Auto-create Wellness Log entry
- Notify Circle: "Maya's crisis has resolved. Pain level: 3"

### 3. The "Offline" State
**Problem**: Medical ID must work without internet (hospitals have poor Wi-Fi).

**Solution** (Already implemented):
```typescript
// app/medical-id.tsx (lines 20-30)
const medicalData = JSON.stringify({
  name: 'Marcus Johnson',
  dob: '1998-08-14',
  bloodType: 'O+',
  allergies: ['Penicillin (severe)'],
  condition: 'Sickle Cell SS',
  emergencyContact: '+15550123456',
  protocol: 'IV Hydration + Morphine, Avoid Demerol'
});

// QR code is generated offline (no network needed)
<QRCode value={medicalData} size={80} />
```

**Next Steps**:
- Add AsyncStorage caching for all medical profile data
- Show "Last synced" timestamp
- Display offline banner when disconnected

---

## 📋 Next Steps for Development

### Phase 1: Core Functionality (Week 1-2)
1. ✅ Set up project structure and navigation
2. ✅ Convert onboarding screens to React Native
3. ⏳ **Build Authentication Flow** (Login/Signup)
4. ⏳ **Implement Medical ID Setup** (Multi-step form)
5. ⏳ **Create "Connect to Warrior" screen** (Helper onboarding)

### Phase 2: Task Management (Week 3-4)
1. ⏳ Convert Delegation List screen
2. ⏳ Convert New Task Creation screens
3. ⏳ Convert Task Details & Scheduling
4. ⏳ Implement task CRUD API integration
5. ⏳ Add task filtering and search

### Phase 3: Crisis Features (Week 5-6)
1. ⏳ **Build Crisis Mode Dashboard** (Warrior)
2. ⏳ **Build Helper Status View** (Helper)
3. ⏳ **Implement Crisis Resolution Modal**
4. ⏳ Add background location tracking (Crisis Mode only)
5. ⏳ Implement push notifications (Expo Notifications)

### Phase 4: Wellness & Community (Week 7-8)
1. ⏳ Build Wellness Log screen
2. ⏳ Build Community/Forum screen
3. ⏳ Implement messaging/chat
4. ⏳ Add medication tracking
5. ⏳ Build Settings/Profile screen

### Phase 5: Polish & Testing (Week 9-10)
1. ⏳ Offline mode testing (airplane mode)
2. ⏳ Biometric authentication (Medical ID)
3. ⏳ Haptic feedback refinement
4. ⏳ Accessibility (screen readers, text scaling)
5. ⏳ Beta testing with real users

---

## 🔐 Security Considerations

### Medical Data (HIPAA Compliance)
```typescript
// Encrypt sensitive data before storing locally
import * as Crypto from 'expo-crypto';

async function encryptMedicalData(data: MedicalProfile) {
  const encrypted = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    JSON.stringify(data)
  );
  await AsyncStorage.setItem('medical_profile_encrypted', encrypted);
}
```

### Location Sharing
- **Only during active crisis** (auto-disable after resolution)
- Require explicit permission prompt
- Show persistent notification when tracking

### Biometric Lock
```typescript
import * as LocalAuthentication from 'expo-local-authentication';

async function unlockMedicalID() {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock Medical ID',
    fallbackLabel: 'Use Passcode'
  });

  if (result.success) {
    // Show Medical ID
  }
}
```

---

## 🐛 Known Issues & TODO

### Status Bar Removal
- ✅ All hardcoded status bars (9:41, battery icons) removed
- ✅ Replaced with `<StatusBar />` from expo-status-bar
- ✅ Using `SafeAreaView` for notch/dynamic island handling

### Styling Cleanup
- ⚠️ Some screens use inline `style` props (should convert to className)
- ⚠️ Gradient backgrounds need testing on Android (LinearGradient)
- ⚠️ Shadow styles may differ iOS vs. Android (test both platforms)

### Missing Features
- ⚠️ No error handling UI (network errors, validation)
- ⚠️ No loading states (skeleton screens)
- ⚠️ No empty states (e.g., "No tasks yet")

---

## 📦 Environment Variables

Create a `.env` file in the root:

```env
EXPO_PUBLIC_API_URL=https://api.sicklesafe.com
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
EXPO_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_id
```

Access in code:
```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

---

## 📖 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Lucide React Native Icons](https://lucide.dev/guide/packages/lucide-react-native)
- [React Native Documentation](https://reactnative.dev/)

---

## 👥 Contributors

- **Paul Bridges** - Product Owner
- **Claude (Anthropic)** - Senior React Native Architect

---

## 📝 License

Proprietary - All Rights Reserved

---

## 🆘 Getting Help

If you encounter issues:

1. Check the [Expo Documentation](https://docs.expo.dev/)
2. Run `expo doctor` to diagnose common problems
3. Clear cache: `expo start -c`
4. Reinstall dependencies: `rm -rf node_modules && npm install`

---

**Last Updated**: January 2025
