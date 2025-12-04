import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useGemini } from '@/hooks/use-gemini';
import { FoodAnalysisResult } from '@/services/gemini-service';

const { width: screenWidth } = Dimensions.get('window');

interface GeminiAnalyzerProps {
  onAnalysisComplete: (result: FoodAnalysisResult) => void;
  authToken?: string;
}

const GeminiAnalyzer: React.FC<GeminiAnalyzerProps> = ({
  onAnalysisComplete,
  authToken
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const { loading, error, analyzeFood } = useGemini(authToken);

  // Kamera iznini kontrol et
  const checkCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
    return status === 'granted';
  };

  // Kameradan fotoğraf çek
  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });

      if (photo.base64) {
        setPreviewImage(`data:image/jpeg;base64,${photo.base64}`);
        setShowCamera(false);
      }
    } catch (error) {
      Alert.alert('Hata', 'Fotoğraf çekilemedi');
      console.error('Camera error:', error);
    }
  };

  // Galeriden resim seç
  const pickImage = async () => {
    try {
      // Dosya iznini iste
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Galeriye erişim izni vermeniz gerekmektedir.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Sanal cihazda sorun çıkarmaması için kapat
        quality: 0.7,
        base64: true,
        presentationStyle: 'fullScreen',
        selectionLimit: 1,
      });

      console.log('ImagePicker result:', result);

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Base64 data kontrolü
        if (asset.base64) {
          setPreviewImage(`data:image/jpeg;base64,${asset.base64}`);
          console.log('Base64 image loaded, size:', asset.base64.length);
        } else if (asset.uri) {
          // Eğer base64 gelmezse, URI'yi base64'e çevir
          console.log('Image URI:', asset.uri);

          try {
            // URI'yi base64'e çevir
            const base64 = await FileSystem.readAsStringAsync(asset.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });

            const mimeType = asset.mimeType || 'image/jpeg';
            setPreviewImage(`data:${mimeType};base64,${base64}`);
            console.log('Base64 converted from URI, size:', base64.length);
          } catch (fsError) {
            console.error('FileSystem error:', fsError);
            Alert.alert('Hata', 'Dosya okunamadı. Başka bir resim seçin.');
          }
        }
      }
    } catch (error) {
      Alert.alert('Hata', 'Resim seçilemedi');
      console.error('Image picker error:', error);
    }
  };

  // Analizi yap
  const handleAnalyze = async () => {
    if (!previewImage) return;

    const result = await analyzeFood(previewImage);
    if (result) {
      onAnalysisComplete(result);
      setPreviewImage(null);
    }
  };

  // Kamerayı başlat
  const startCamera = async () => {
    const hasPermission = await checkCameraPermission();
    if (hasPermission) {
      setShowCamera(true);
    } else {
      Alert.alert(
        'İzin Gerekli',
        'Kamerayı kullanmak için izin vermeniz gerekmektedir.',
        [{ text: 'Tamam' }]
      );
    }
  };

  if (showCamera) {
    return (
      <Modal visible={true} animationType="slide" style={styles.modal}>
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            mode="picture"
          />

          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={takePicture}
            >
              <View style={styles.captureButton} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.title}>Yiyecek Analizi</Text>
      <Text style={styles.subtitle}>
        Kamerayla çek veya galeriden seç yapay zeka analizi
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButtonStyle]}
          onPress={startCamera}
          disabled={loading}
        >
          <Ionicons name="camera" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Kamera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.galleryButtonStyle]}
          onPress={pickImage}
          disabled={loading}
        >
          <Ionicons name="images" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Galeri</Text>
        </TouchableOpacity>
      </View>

      {previewImage && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Önizleme</Text>

          <View style={styles.imagePreview}>
            {/* Burada resim gösterilebilir - şu an için placeholder */}
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={50} color="#CBD5E1" />
              <Text style={styles.imagePlaceholderText}>Resim seçildi</Text>
            </View>
          </View>

          <View style={styles.previewActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.analyzeButton]}
              onPress={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="search" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Analiz Et</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButtonStyle]}
              onPress={() => setPreviewImage(null)}
              disabled={loading}
            >
              <Ionicons name="trash" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={styles.loadingText}>Yapay zeka analiz ediyor...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  modal: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cameraButtonStyle: {
    backgroundColor: '#7C3AED',
  },
  galleryButtonStyle: {
    backgroundColor: '#EC4899',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 48,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#7C3AED',
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 8,
  },
  previewContainer: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 14,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  analyzeButton: {
    backgroundColor: '#10B981',
  },
  cancelButtonStyle: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GeminiAnalyzer;