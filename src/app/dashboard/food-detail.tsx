/**
 * CaloriTrack - Food Detail Screen
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages
 */

import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useUser } from '@/context/user-context';
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_CONFIG } from '@/constants/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface FoodAnalysisData {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  ingredients?: string[];
  tags?: string[];
  portion?: string;
  timestamp?: Date;
  imageBase64?: string;
  imageUri?: string;
}

const FoodDetailScreen = () => {
  const { user } = useUser();
  const params = useLocalSearchParams();

  // Parse the food data from params
  const [foodData, setFoodData] = useState<FoodAnalysisData | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editedIngredients, setEditedIngredients] = useState<string[]>([]);
  const [editedPortion, setEditedPortion] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newIngredient, setNewIngredient] = useState('');

  useEffect(() => {
    try {
      const data = params.foodData ? JSON.parse(params.foodData as string) : null;
      if (data) {
        setFoodData(data);
        setEditedName(data.name || '');
        setEditedTags(data.tags || []);
        setEditedIngredients(data.ingredients || []);
        setEditedPortion(data.portion || '1 porsiyon');
      }
    } catch (error) {
      console.error('Error parsing food data:', error);
      Alert.alert('Hata', 'Yemek verileri yüklenemedi');
      router.back();
    }
  }, [params.foodData]);

  const addTag = () => {
    if (newTag.trim() && !editedTags.includes(newTag.trim())) {
      setEditedTags([...editedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const addIngredient = () => {
    if (newIngredient.trim() && !editedIngredients.includes(newIngredient.trim())) {
      setEditedIngredients([...editedIngredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setEditedIngredients(editedIngredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const saveFoodToDatabase = async () => {
    if (!user || !foodData) return;

    setIsSaving(true);
    try {
      const mealData = {
        id: firestore().collection(FIREBASE_CONFIG.collections.users).doc(user.uid)
          .collection('meals').doc().id,
        name: editedName,
        calories: foodData.calories,
        nutrition: {
          protein: foodData.protein,
          carbohydrates: foodData.carbohydrates,
          fats: foodData.fats,
          fiber: foodData.fiber,
          sugar: foodData.sugar,
          sodium: foodData.sodium,
        },
        portion: editedPortion,
        tags: editedTags,
        ingredients: editedIngredients,
        type: getMealType(),
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        timestamp: firestore.FieldValue.serverTimestamp(),
        approved: true,
        source: 'camera_analysis',
      };

      await firestore()
        .collection(FIREBASE_CONFIG.collections.users)
        .doc(user.uid)
        .collection('meals')
        .doc(mealData.id)
        .set(mealData);

      Alert.alert(
        'Başarılı',
        'Yemek başarıyla kaydedildi!',
        [
          {
            text: 'Tamam',
            onPress: () => router.push('/dashboard'),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving food:', error);
      Alert.alert('Hata', 'Yemek kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const getMealType = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Kahvaltı';
    if (hour >= 12 && hour < 17) return 'Öğle Yemeği';
    if (hour >= 17 && hour < 22) return 'Akşam Yemeği';
    return 'Atıştırmalık';
  };

  const rejectFood = () => {
    Alert.alert(
      'Emin misiniz?',
      'Bu yemek analizi iptal edilecek',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Evet, İptal Et',
          style: 'destructive',
          onPress: () => router.push('/dashboard'),
        },
      ]
    );
  };

  if (!foodData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yemek Detayı</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Food Image */}
          <View style={styles.imageContainer}>
            {foodData.imageUri ? (
              <Image source={{ uri: foodData.imageUri }} style={styles.foodImage} />
            ) : foodData.imageBase64 ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${foodData.imageBase64}` }}
                style={styles.foodImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="restaurant" size={48} color={COLORS.primary} />
                <Text style={styles.imageText}>Yemek Fotoğrafı</Text>
              </View>
            )}
          </View>

          {/* Food Name Edit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yemek Adı</Text>
            <TextInput
              style={styles.textInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Yemek adını girin..."
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>

          {/* Portion Edit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Porsiyon</Text>
            <TextInput
              style={styles.textInput}
              value={editedPortion}
              onChangeText={setEditedPortion}
              placeholder="Porsiyon miktarı..."
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>

          {/* Nutrition Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Besin Değerleri</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{foodData.calories}</Text>
                <Text style={styles.nutritionLabel}>Kalori</Text>
              </View>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{foodData.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{foodData.carbohydrates}g</Text>
                <Text style={styles.nutritionLabel}>Karbonhidrat</Text>
              </View>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{foodData.fats}g</Text>
                <Text style={styles.nutritionLabel}>Yağ</Text>
              </View>
            </View>
          </View>

          {/* Tags Edit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Etiketler</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                value={newTag}
                onChangeText={setNewTag}
                placeholder="Etiket ekle..."
                placeholderTextColor={COLORS.textTertiary}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity onPress={addTag} style={styles.addTagButton}>
                <Ionicons name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
              {editedTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => removeTag(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <Ionicons name="close" size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ingredients Edit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İçerikler</Text>
            <View style={styles.ingredientInputContainer}>
              <TextInput
                style={styles.ingredientInput}
                value={newIngredient}
                onChangeText={setNewIngredient}
                placeholder="İçerik ekle..."
                placeholderTextColor={COLORS.textTertiary}
                onSubmitEditing={addIngredient}
              />
              <TouchableOpacity onPress={addIngredient} style={styles.addIngredientButton}>
                <Ionicons name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.ingredientsContainer}>
              {editedIngredients.map((ingredient, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.ingredientTag}
                  onPress={() => removeIngredient(ingredient)}
                >
                  <Text style={styles.ingredientTagText}>{ingredient}</Text>
                  <Ionicons name="close" size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={rejectFood}
              disabled={isSaving}
            >
              <Text style={styles.rejectButtonText}>Yemeği Reddet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={saveFoodToDatabase}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.approveButtonText}>Yemeği Onayla</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING[3],
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[4],
    paddingBottom: SPACING[3],
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.textPrimary,
    marginRight: 40, // Balance the back button
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING[4],
    paddingBottom: SPACING[8],
  },
  imageContainer: {
    marginBottom: SPACING[6],
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.xl,
  },
  imageText: {
    marginTop: SPACING[2],
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING[6],
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[3],
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.textPrimary,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING[3],
  },
  nutritionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING[4],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nutritionValue: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.primary,
    marginBottom: SPACING[1],
  },
  nutritionLabel: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: SPACING[2],
    marginBottom: SPACING[3],
  },
  tagInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.textPrimary,
  },
  addTagButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING[2],
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[2],
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING[1],
  },
  tagText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.primary,
  },
  ingredientInputContainer: {
    flexDirection: 'row',
    gap: SPACING[2],
    marginBottom: SPACING[3],
  },
  ingredientInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.textPrimary,
  },
  addIngredientButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING[2],
  },
  ingredientTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[2],
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING[1],
  },
  ingredientTagText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.success,
  },
  actionSection: {
    gap: SPACING[3],
    marginTop: SPACING[4],
  },
  actionButton: {
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING[4],
    alignItems: 'center',
    ...SHADOWS.md,
  },
  rejectButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  approveButton: {
    backgroundColor: COLORS.primary,
  },
  rejectButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: COLORS.textPrimary,
  },
  approveButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: '#FFFFFF',
  },
});

export default FoodDetailScreen;