# 🚀 Quick Setup Guide - Run Sickle Safe on Simulator

Follow these steps to get the app running on iOS Simulator or Android Emulator.

---

## ✅ Prerequisites

### Required (Choose One Platform):

**For iOS (Mac only):**
- macOS with Xcode installed
- iOS Simulator (comes with Xcode)

**For Android:**
- Android Studio installed
- Android Emulator configured

### Required for Both:
- Node.js 18+ (check with `node --version`)
- npm or yarn

---

## 📝 Step-by-Step Instructions

### Step 1: Open Terminal

```bash
# Navigate to the project directory
cd "/Users/paulbridges/sicklesafe app"
```

### Step 2: Install Dependencies

```bash
# Install all packages (this will take 2-5 minutes)
npm install
```

**Expected output:**
```
added 1234 packages in 3m
```

If you see warnings about peer dependencies, that's normal - ignore them.

### Step 3: Start Expo Development Server

```bash
npm start
```

**You should see:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

### Step 4: Launch the Simulator

#### Option A: iOS Simulator (Mac only)

**In the terminal where Expo is running, press:**
```
i
```

**What happens:**
1. iOS Simulator will open automatically
2. Expo Go app will install
3. Your Sickle Safe app will load
4. You'll see the Welcome screen!

**First time only:** The simulator may take 30-60 seconds to boot up.

#### Option B: Android Emulator

**First, make sure an Android emulator is running:**
1. Open Android Studio
2. Click "Device Manager" (phone icon on the right)
3. Click ▶️ next to any device (e.g., "Pixel 5")
4. Wait for emulator to boot

**Then in the Expo terminal, press:**
```
a
```

**What happens:**
1. Expo Go installs on the emulator
2. Your app loads automatically
3. You'll see the Welcome screen!

---

## 🎯 What You Should See

### Screen 1: Welcome
- Hero image background
- "Sickle Safe" logo at top
- "Welcome to Sickle Safe" heading
- Blue "Begin" button at bottom

### Test the Flow:
1. Tap "Begin" → Community Showcase screen
2. Tap "Get Started" → Role Selection screen
3. Select "The Warrior" → Tap "Continue"
4. You'll go through 3 onboarding screens
5. Final screen: Dashboard with Crisis Alert button

---

## 🐛 Troubleshooting

### Problem: "Command not found: expo"

**Solution:**
```bash
npm install -g expo-cli
```

Then try `npm start` again.

---

### Problem: "Metro bundler failed to start"

**Solution 1 - Clear cache:**
```bash
npx expo start -c
```

**Solution 2 - Reset everything:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

---

### Problem: iOS Simulator shows "Unable to connect"

**Solution:**
```bash
# Make sure you're in the project directory
cd "/Users/paulbridges/sicklesafe app"

# Kill any running Metro bundlers
killall node

# Start fresh
npm start
# Then press 'i'
```

---

### Problem: "Invariant Violation: requireNativeComponent: RNSVGSvgView"

**Solution:**
```bash
# Install missing SVG library
npm install react-native-svg

# Restart
npm start
```

---

### Problem: Simulator is slow/frozen

**Solution for iOS:**
1. Simulator menu → Hardware → Erase All Content and Settings
2. Quit Simulator
3. Run `npm start` and press `i` again

**Solution for Android:**
1. Close emulator
2. Android Studio → Device Manager → Wipe Data (trash icon)
3. Start emulator again
4. Run `npm start` and press `a` again

---

### Problem: Tailwind styles not working

**Check these files exist:**
1. `global.css` - Should have 3 lines
2. `tailwind.config.js` - Should have color definitions
3. `babel.config.js` - Should have `"nativewind/babel"`

**Then:**
```bash
npx expo start -c
```

---

## 🔍 Verify Installation

Run this command to check your setup:

```bash
npx expo-doctor
```

This will diagnose common issues and suggest fixes.

---

## 📱 Test Features

Once the app is running, try these:

### ✅ Navigation
- Tap "Begin" → Should go to Community screen
- Tap "Get Started" → Should go to Role Selection
- Select "The Warrior" → Onboarding flow starts

### ✅ Medical ID
- From Dashboard, navigate to Medical ID (you'll need to add a button or manually navigate)
- QR code should display
- Try enabling Airplane Mode → QR code should still work (offline mode)

### ✅ Haptics (iOS only)
- Tap and hold the Crisis Alert button
- You should feel a vibration

---

## 🎨 Hot Reloading

Any changes you make to `.tsx` files will **automatically reload** in the simulator!

Try it:
1. Open `app/(onboarding)/welcome.tsx`
2. Change line 32: `"Welcome to Sickle Safe"` → `"Welcome to My App"`
3. Save the file
4. The simulator updates instantly!

---

## 📞 Still Having Issues?

### Check the Expo logs:
Look at the terminal where you ran `npm start` - errors will appear there.

### Common error messages:

**"Unable to resolve module"**
→ Missing dependency. Run `npm install [package-name]`

**"Invariant Violation"**
→ Cache issue. Run `npx expo start -c`

**"Metro bundler error"**
→ Kill all node processes: `killall node`, then `npm start`

---

## 🎉 Success Checklist

- [ ] `npm install` completed without errors
- [ ] `npm start` shows QR code and options
- [ ] Simulator/Emulator launched
- [ ] Welcome screen visible
- [ ] Can tap "Begin" and navigate
- [ ] Role Selection works
- [ ] Dashboard loads

---

## 📚 Next Steps

Once the app is running:

1. **Explore the onboarding flow** (Welcome → Community → Role → Dashboard)
2. **Read IMPLEMENTATION_NOTES.md** for missing features to build
3. **Test on a physical device** (scan QR code with Expo Go app)
4. **Start building missing screens** (Connect to Warrior, Crisis Mode, etc.)

---

## 🔧 Useful Commands

```bash
# Start development server
npm start

# Start with cache cleared
npx expo start -c

# iOS only
npm run ios

# Android only
npm run android

# Check for issues
npx expo-doctor

# Update all Expo packages
npx expo install --fix
```

---

**Ready to code?** The app should now be running on your simulator! 🎊
