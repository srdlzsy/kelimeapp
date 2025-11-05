Wordly - React Native Expo App

Wordly, React Native ve Expo SDK 53 kullanılarak geliştirilmiş, dil öğrenimini kolaylaştıran bir mobil uygulamadır. Kullanıcılar kelime listelerini görüntüleyebilir, yeni kelimeler ekleyebilir ve kelime quiz’leri ile bilgilerini pekiştirebilirler.

Uygulama, modern animasyonlar ve temiz bir arayüz ile kullanıcı deneyimini ön planda tutar.

📌 Özellikler

Kelime listelerini görüntüleme

Yeni kelime ekleme

Kelime quiz’leri ile pratik yapma

Grammar konularını görüntüleme

Animasyonlu buton ve ekran geçişleri

Modern ve duyarlı UI tasarımı

Expo LinearGradient ve Ionicons desteği

🛠️ Kurulum
1️⃣ Proje Klonlama ve Paket Kurulumu
git clone <repo-url>
cd mvvm-vocabulary-app
npm install

2️⃣ EAS CLI Kurulumu ve Giriş
npm install -g eas-cli
eas login


Not: Expo Go kullanarak geliştirme sürecinde cihazınızda uygulamayı canlı test edebilirsiniz.

3️⃣ Uygulamayı Çalıştırma
expo start


i tuşuna basarak iOS simülatörde,

a tuşuna basarak Android emülatörde uygulamayı çalıştırabilirsiniz.

🖼️ Ekranlar ve Animasyonlar

Home Screen:

Arka planda dekoratif dairesel şekiller

Başlık ve logo animasyonları

Menü butonları için scale animasyonları

Footer ile telif hakkı bilgisi

Menü Butonları:

Kelime Listesi

Yeni Kelime Ekle

Quiz

Grammar Konuları

Tüm animasyonlar Animated API ile yapılmıştır ve Easing, spring, timing kullanılmıştır.

🎨 Teknolojiler

React Native (Expo SDK 53)

Expo LinearGradient

React Native Animated API

Ionicons

EAS Build & Submit

⚡ Uygulama Yapısı

HomeScreen.js: Ana menü ve animasyonlar

WordList.js: Tüm kelimelerin listelendiği ekran

AddWord.js: Yeni kelime ekleme formu

Quiz.js: Kelime quiz’leri

Topics.js: Grammar konuları

Uygulama, modern MVVM mimarisine uygun olarak komponentler ve ekranlar şeklinde yapılandırılmıştır.

📦 Build ve Play Store Yükleme

Öncelikle proje ayarlarını app.json veya app.config.js üzerinden kontrol edin.

EAS ile build alma:

eas build --platform android
eas build --platform ios


APK veya AAB dosyasını Play Store’a yükleyebilirsiniz.

📄 Lisans

© 2025 Tüm Hakları Saklıdır | Serdal Özsoy

