# Android Emulator Fix 🔧

## Problem
```
CommandError: Failed to get properties for device (emulator-5554)
adb.exe: device offline
```

The emulator is running but ADB (Android Debug Bridge) cannot communicate with it.

---

## Quick Fix - Choose One Method

### Method 1: Restart ADB (Fastest) ⚡

```bash
# Kill and restart ADB server
adb kill-server
adb start-server

# Check if emulator is now online
adb devices
```

Expected output after fix:
```
List of devices attached
emulator-5554   device
```

Then retry:
```bash
npx expo run:android
```

---

### Method 2: Restart Emulator

1. **Close the current emulator** completely
2. **Open Android Studio** or use command line
3. **Start the emulator again**:
   ```bash
   # List available emulators
   emulator -list-avds
   
   # Start an emulator (replace with your AVD name)
   emulator -avd Pixel_5_API_34 &
   ```
4. **Wait for it to fully boot** (until you see the home screen)
5. **Verify connection**:
   ```bash
   adb devices
   ```
6. **Try again**:
   ```bash
   npx expo run:android
   ```

---

### Method 3: Cold Boot Emulator (Most Thorough)

If the above doesn't work:

1. **Open Android Studio**
2. Go to: **Tools** → **Device Manager**
3. Find your emulator in the list
4. Click the **dropdown** (⌄) next to the Play button
5. Select **Cold Boot Now**
6. Wait for emulator to fully start
7. Run:
   ```bash
   adb devices
   npx expo run:android
   ```

---

## Alternative: Use Physical Device

If emulator issues persist, use a physical Android device:

### Setup Physical Device

1. **Enable Developer Options** on your phone:
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times
   
2. **Enable USB Debugging**:
   - Go to **Settings** → **System** → **Developer Options**
   - Enable **USB Debugging**
   
3. **Connect via USB**:
   - Plug phone into computer
   - Allow USB debugging when prompted
   
4. **Verify connection**:
   ```bash
   adb devices
   ```
   
   Should show:
   ```
   List of devices attached
   ABC123XYZ    device
   ```

5. **Run the app**:
   ```bash
   npx expo run:android
   ```

---

## Alternative: Wireless Debugging (Android 11+)

1. **Connect phone and computer to same WiFi**

2. **Enable Wireless Debugging**:
   - Settings → Developer Options → Wireless Debugging → ON
   
3. **Pair device**:
   - In Wireless Debugging, tap **Pair device with pairing code**
   - Note the IP address and pairing code
   
4. **On computer**:
   ```bash
   adb pair <IP>:<PORT>
   # Enter the pairing code when prompted
   
   adb connect <IP>:5555
   ```
   
5. **Verify**:
   ```bash
   adb devices
   ```
   
6. **Run app**:
   ```bash
   npx expo run:android
   ```

---

## If Nothing Works: Nuclear Option

```bash
# 1. Kill all ADB processes
adb kill-server
taskkill /F /IM adb.exe

# 2. Close emulator completely

# 3. Restart ADB
adb start-server

# 4. Start emulator fresh

# 5. Wait 30 seconds for full boot

# 6. Check devices
adb devices

# 7. Try build again
npx expo run:android
```

---

## Troubleshooting Commands

**Check ADB is running:**
```bash
adb devices
```

**Check emulator status:**
```bash
adb -s emulator-5554 shell getprop sys.boot_completed
# Should return "1" when fully booted
```

**Check if app is installed:**
```bash
adb shell pm list packages | findstr caloriesapp
```

**Clear app data (if needed):**
```bash
adb shell pm clear com.techmodern.caloriesapp.android
```

**Uninstall app (for fresh install):**
```bash
adb uninstall com.techmodern.caloriesapp.android
```

---

## Summary

**Quick fix (try this first):**
```bash
adb kill-server
adb start-server
adb devices
npx expo run:android
```

Once the emulator is properly connected, your Firebase-fixed app should build and run successfully! 🚀





