# 🔥 Firebase Emulator - Temiz Başlangıç Rehberi

## ✅ Yapılan Değişiklikler

Uygulama artık şu logic ile çalışıyor:

### **Auth + Firestore Sync Kontrolü**
1. ✅ **Auth'da kullanıcı var** + **Firestore'da user document var** + **onboardingCompleted: true**
   → Dashboard'a yönlendir
   
2. ✅ **Auth'da kullanıcı var** + **Firestore'da user document YOK**
   → Auth'dan logout yap + Onboarding'e yönlendir
   
3. ✅ **Auth'da kullanıcı var** + **Firestore'da user document var** + **onboardingCompleted: false**
   → Onboarding'e yönlendir
   
4. ✅ **Auth'da kullanıcı yok**
   → Anonymous user oluştur + Onboarding'e yönlendir

---

## 🚀 Temiz Başlangıç İçin Adımlar

### **Yöntem 1: Emulator UI Üzerinden** (Önerilen)

1. Tarayıcıda Firebase Emulator UI'yi açın:
   ```
   http://localhost:4000
   ```

2. **Authentication** sekmesine gidin → Tüm kullanıcıları silin

3. **Firestore** sekmesine gidin → `users` collection'ını ve tüm dökümanları silin

4. Uygulamayı yeniden başlatın → Onboarding flow başlayacak ✅

---

### **Yöntem 2: Emulator'ı Yeniden Başlatma**

Terminal'de:

```powershell
# Emulator'ı durdur (Ctrl+C)

# Temiz başlat (import olmadan)
firebase emulators:start --only auth,functions,firestore
```

---

### **Yöntem 3: Uygulama İçinden (Dev Mode)**

1. Uygulamada Dashboard ekranındayken **profil butonuna 5 kez** hızlıca tıklayın
2. Açılan Dev Menüsünden **"Çıkış Yap & Onboarding'e Dön"** seçin
3. Uygulama Onboarding'e yönlenecek ✅

---

### **Yöntem 4: Android Emulator Storage Temizleme**

```
Settings → Apps → CaloriesApp → Clear Storage
```

---

## 🧪 Test Senaryoları

### **Senaryo 1: Temiz Emulator'de İlk Başlatma**
```
1. Emulator'ı temiz başlat
2. Uygulamayı başlat
3. ✅ Beklenen: Anonymous user oluşturulacak → Onboarding başlayacak
```

### **Senaryo 2: Onboarding Tamamla**
```
1. Onboarding flow'unu tamamla
2. ✅ Beklenen: Firestore'a user document yazılacak → Dashboard açılacak
```

### **Senaryo 3: Firestore Data Sil (Auth Aktif)**
```
1. Emulator UI'den Firestore'daki user document'i sil
2. Auth'daki user'ı bırak (silme)
3. Uygulamayı yeniden başlat
4. ✅ Beklenen: Auth'dan logout olacak → Onboarding başlayacak
```

### **Senaryo 4: Auth Data Sil (Firestore Aktif)**
```
1. Emulator UI'den Auth'daki user'ı sil
2. Firestore'daki document'i bırak
3. Uygulamayı yeniden başlat
4. ✅ Beklenen: Yeni anonymous user → Onboarding başlayacak
```

---

## 📋 Değiştirilen Dosyalar

### 1. **src/context/user-context.tsx**
- `loadUserData()`: Firestore'da document yoksa auth'dan logout yapar

### 2. **src/app/_layout.tsx**
- Routing logic: Firestore document yoksa logout + onboarding'e yönlendir

### 3. **src/app/dashboard/index.tsx**
- Dashboard access verification: Firestore document yoksa logout + redirect
- Dev menüsü eklendi (profil butonuna 5 kez tıklayarak açılır)

---

## 🎯 Özet

Artık **Firebase Auth Emulator ve Firestore Emulator senkronize çalışıyor**:
- Auth'da kullanıcı var ama Firestore'da data yok → Logout + Onboarding
- İki taraf da dolu → Dashboard
- İkisi de boş → Yeni kullanıcı + Onboarding

**Emulator'ü temiz tutmak için:** Firestore + Auth data'sını birlikte temizleyin veya emulator'ı `--clear-all` ile başlatın.

