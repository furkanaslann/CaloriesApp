/**
 * CaloriTrack - Recipe Detail Screen
 * Minimal. Cool. Aesthetic.
 * Figma Design: https://www.figma.com/design/V4OjFZYz1hhZdeWSgZyYtu/Calories-Pages?node-id=28-84
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Recipe data type
interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  calories: number;
  time: string;
  rating: number;
  servings: number;
  difficulty: string;
  category: string;
  ingredients: string[];
  instructions: string[];
  protein?: number;
  carbs?: number;
  fats?: number;
}

// Recipe database with new Figma images
const recipeDatabase: Record<string, Recipe> = {
  '1': {
    id: '1',
    name: 'Grillen Tavuk Salata',
    description: 'Yüksek proteinli, düşük kalorili',
    image: 'https://www.figma.com/api/mcp/asset/e07f73e1-480d-4fca-aa88-c05e7882c19c',
    calories: 285,
    time: '25 dk',
    rating: 4.8,
    servings: 2,
    difficulty: 'Kolay',
    category: 'Salata',
    ingredients: [
      '300g tavuk göğsü',
      '1 avokado',
      '200g kiraz domates',
      '100g taze ıspanak',
      '2 yemek kaşığı zeytinyağı',
      '1 limon suyu',
      'Tuz ve karabiber',
    ],
    instructions: [
      'Tavuk göğsünü ızgarada pişirin ve dilimleyin.',
      'Kiraz domatesleri ikiye bölün.',
      'Avokadoyu dilimleyin.',
      'Ispanak yapraklarını servis tabağına yayın.',
      'Tavuk, domates ve avokadoyu ıspanakların üzerine yerleştirin.',
      'Zeytinyağı ve limon suyu ile sos hazırlayın.',
      'Sosu salatanın üzerine dökün ve servis yapın.',
    ],
    protein: 32,
    carbs: 12,
    fats: 14,
  },
  '2': {
    id: '2',
    name: 'Yulaf Ezmesi',
    description: 'Enerjik başlangıç için',
    image: 'https://www.figma.com/api/mcp/asset/f8e76563-3619-46fe-a616-98b64db5b68c',
    calories: 220,
    time: '10 dk',
    rating: 4.6,
    servings: 1,
    difficulty: 'Çok Kolay',
    category: 'Kahvaltı',
    ingredients: [
      '50g yulaf ezmesi',
      '200g süt veya badem sütü',
      '1 yemek kaşığı bal',
      '10g badem',
      '5g tarçın',
      'Yarım muz',
    ],
    instructions: [
      'Yulaf ezmesini süt ile karıştırın.',
      '5 dakika kısık ateşte pişirin.',
      'Bal ve tarçını ekleyin.',
      'Üzerine dilimlenmiş muz ve badem serpin.',
      'Ilık servis yapın.',
    ],
    protein: 8,
    carbs: 35,
    fats: 6,
  },
  '3': {
    id: '3',
    name: 'Protein Smoothie',
    description: 'Antrenman sonrası için',
    image: 'https://www.figma.com/api/mcp/asset/9bf11826-aeb8-4590-95c5-9431548cb1db',
    calories: 180,
    time: '5 dk',
    rating: 4.9,
    servings: 1,
    difficulty: 'Çok Kolay',
    category: 'İçecek',
    ingredients: [
      '1 ölçek protein tozu',
      '200g badem sütü',
      '1 muz',
      '1 yemek kaşığı fıstık ezmesi',
      'Buz',
    ],
    instructions: [
      'Tüm malzemeleri blönder\'e ekleyin.',
      'Pürüzsüz olana kadar karıştırın.',
      'Büyük bir bardağa dökün.',
      'Hemen servis yapın.',
    ],
    protein: 28,
    carbs: 30,
    fats: 8,
  },
  '4': {
    id: '4',
    name: 'Sütlü Tatlı',
    description: 'Düşük kalorili alternatif',
    image: 'https://www.figma.com/api/mcp/asset/59454786-16ae-4656-a53d-f54f342a90de',
    calories: 150,
    time: '20 dk',
    rating: 4.5,
    servings: 4,
    difficulty: 'Orta',
    category: 'Tatlı',
    ingredients: [
      '1 litre süt',
      '3 yemek kaşığı nişasta',
      '1 su bardağı şeker',
      '1 paket vanilya',
      '1 paket kremşanti',
    ],
    instructions: [
      'Nişastayı biraz süt ile açın.',
      'Kalan sütü şekerle kaynatın.',
      'Nişastalı sütü yavaşça ekleyin.',
      'Kıvam alana kadar karıştırarak pişirin.',
      'Vanilyayı ekleyin ve soğumaya bırakın.',
      'Kremşantiyi çırpın ve üzerine ekleyin.',
      'Buzdolabında 2 saat beklettikten sonra servis yapın.',
    ],
    protein: 6,
    carbs: 25,
    fats: 4,
  },
  '5': {
    id: '5',
    name: 'Akdeniz Salata',
    description: 'Taze sebzelerle',
    image: 'https://www.figma.com/api/mcp/asset/8fac0685-dd78-42b9-aea1-2520497a320c',
    calories: 195,
    time: '15 dk',
    rating: 4.8,
    servings: 2,
    difficulty: 'Kolay',
    category: 'Salata',
    ingredients: [
      '200g domates',
      '1 salatalık',
      '100g siyah zeytin',
      '100g beyaz peynir',
      '2 yemek kaşığı zeytinyağı',
      '1 limon suyu',
      '1 demet taze nane',
    ],
    instructions: [
      'Domatesleri ve salatalığı dilimleyin.',
      'Zeytinleri ve beyaz peyniri küpler halinde kesin.',
      'Tüm malzemeleri karıştırın.',
      'Zeytinyağı ve limon suyunu ekleyin.',
      'Taze nane ile süsleyin.',
      'Servis yapın.',
    ],
    protein: 8,
    carbs: 15,
    fats: 12,
  },
  '6': {
    id: '6',
    name: 'Açai Bowl',
    description: 'Antioksidan zengini',
    image: 'https://www.figma.com/api/mcp/asset/f33b5c1b-6fb6-400a-8d67-abd467422bfa',
    calories: 320,
    time: '8 dk',
    rating: 4.7,
    servings: 1,
    difficulty: 'Kolay',
    category: 'Kahvaltı',
    ingredients: [
      '100g açai püresi',
      '1 muz',
      '100g çilek',
      '50g granola',
      '1 yemek kaşığı bal',
      '100g yoğurt',
    ],
    instructions: [
      'Açai püresini yoğurt ile karıştırın.',
      'Muzu ve çilekleri dilimleyin.',
      'Açai karışımını kaseye dökün.',
      'Üzerine meyveleri yerleştirin.',
      'Granola ve bal ile süsleyin.',
      'Hemen servis yapın.',
    ],
    protein: 10,
    carbs: 45,
    fats: 12,
  },
  '7': {
    id: '7',
    name: 'Avokado Tost',
    description: 'Sağlıklı yağ kaynağı',
    image: 'https://www.figma.com/api/mcp/asset/ca1d6c5b-0aef-4b85-ae5a-03917a07166e',
    calories: 340,
    time: '12 dk',
    rating: 4.7,
    servings: 1,
    difficulty: 'Kolay',
    category: 'Kahvaltı',
    ingredients: [
      '2 dilim tam buğday ekmek',
      '1 olgun avokado',
      '2 yumurta',
      '1 limon suyu',
      'Kırmızı biber',
      'Tuz',
    ],
    instructions: [
      'Ekmekleri tosterde kızartın.',
      'Avokadoyu ezin ve limon suyunu ekleyin.',
      'Yumurtaları haşlayın ve dilimleyin.',
      'Ekmeklerin üzerine avokado sürün.',
      'Yumurtaları yerleştirin.',
      'Kırmızı biber ve tuz ile servis yapın.',
    ],
    protein: 12,
    carbs: 28,
    fats: 18,
  },
  '8': {
    id: '8',
    name: 'Quinoa Bowl',
    description: 'Bitkisel protein',
    image: 'https://www.figma.com/api/mcp/asset/7a0a79f8-a6a6-4ebe-a192-09ac8ceff0ad',
    calories: 290,
    time: '18 dk',
    rating: 4.6,
    servings: 2,
    difficulty: 'Orta',
    category: 'Ana Yemek',
    ingredients: [
      '100g quinoa',
      '1 brokoli',
      '1 havuç',
      '100g nohut',
      '2 yemek kaşığı tahin',
      '1 limon suyu',
    ],
    instructions: [
      'Quinoa\'yı haşlayın ve süzün.',
      'Brokoli ve havucu buharda pişirin.',
      'Nohutları haşlayın.',
      'Tahin ve limon suyu ile sos hazırlayın.',
      'Tüm malzemeleri karıştırın.',
      'Sosu üzerine dökün.',
      'Servis yapın.',
    ],
    protein: 14,
    carbs: 40,
    fats: 10,
  },
  '9': {
    id: '9',
    name: 'Somon Grill',
    description: 'Omega-3 zengini',
    image: 'https://www.figma.com/api/mcp/asset/e94820dd-8f78-416e-a9a4-881d47bc084f',
    calories: 380,
    time: '30 dk',
    rating: 4.9,
    servings: 2,
    difficulty: 'Orta',
    category: 'Ana Yemek',
    ingredients: [
      '2 somon fileto',
      '200g asparagus',
      '2 yemek kaşığı zeytinyağı',
      '1 limon',
      '2 diş sarımsak',
      'Taze otlar',
    ],
    instructions: [
      'Somon filetolarını marine edin.',
      'Izgara üzerinde pişirin.',
      'Asparagus\'i zeytinyağı ile soteyin.',
      'Sarımsak ve limon sosu hazırlayın.',
      'Somonun yanında servis yapın.',
      'Taze otlar ile süsleyin.',
    ],
    protein: 35,
    carbs: 8,
    fats: 22,
  },
  '10': {
    id: '10',
    name: 'Meyve Salata',
    description: 'Taze ve ferahlatıcı',
    image: 'https://www.figma.com/api/mcp/asset/0c030c87-d29d-472d-9fe9-7ce3787ecb68',
    calories: 165,
    time: '10 dk',
    rating: 4.7,
    servings: 2,
    difficulty: 'Çok Kolay',
    category: 'Tatlı',
    ingredients: [
      '1 elma',
      '1 armut',
      '100g çilek',
      '50g ceviz',
      '1 yemek kaşığı bal',
      '1 limon suyu',
      'Nane yaprakları',
    ],
    instructions: [
      'Meyveleri yıkayın ve dilimleyin.',
      'Büyük bir kaseye alın.',
      'Cevizleri ekleyin.',
      'Bal ve limon suyu ile harmanlayın.',
      'Nane yaprakları ile süsleyin.',
      'Soğuk servis yapın.',
    ],
    protein: 3,
    carbs: 28,
    fats: 6,
  },
};

const RecipeDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const recipe = recipeDatabase[id as string] || recipeDatabase['1'];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    // Hero Image Section - Figma node 28-84 design
    heroContainer: {
      width: '100%',
      height: height * 0.42,
      position: 'relative',
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    gradientOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    // Header Buttons
    headerButtons: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    headerButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    favoriteButtonActive: {
      backgroundColor: '#EF4444',
    },
    // Content Section
    contentContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 36,
      borderTopRightRadius: 36,
      marginTop: -50,
      paddingTop: 32,
      paddingHorizontal: 24,
    },
    // Category Badge
    categoryBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: '#7C3AED',
      marginBottom: 16,
    },
    categoryBadgeText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    // Title Section
    titleSection: {
      marginBottom: 8,
    },
    recipeTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 8,
      lineHeight: 34,
      letterSpacing: -0.5,
    },
    recipeDescription: {
      fontSize: 15,
      color: '#64748B',
      lineHeight: 22,
    },
    // Meta Info
    metaRow: {
      flexDirection: 'row',
      marginTop: 20,
      marginBottom: 24,
      gap: 24,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    metaText: {
      fontSize: 15,
      fontWeight: '500',
      color: '#64748B',
    },
    metaValue: {
      fontSize: 15,
      fontWeight: '700',
      color: '#1E293B',
    },
    // Nutrition Cards
    nutritionSection: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 16,
      letterSpacing: -0.3,
    },
    nutritionCards: {
      flexDirection: 'row',
      gap: 12,
    },
    nutritionCard: {
      flex: 1,
      backgroundColor: '#F8FAFC',
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    nutritionValue: {
      fontSize: 20,
      fontWeight: '700',
      color: '#7C3AED',
      marginBottom: 4,
    },
    nutritionLabel: {
      fontSize: 12,
      color: '#64748B',
      fontWeight: '500',
    },
    // Ingredients
    ingredientsSection: {
      marginBottom: 28,
    },
    ingredientItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F1F5F9',
    },
    ingredientDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#7C3AED',
      marginRight: 12,
    },
    ingredientText: {
      fontSize: 15,
      color: '#334155',
      flex: 1,
      lineHeight: 22,
    },
    // Instructions
    instructionsSection: {
      marginBottom: 100,
    },
    instructionItem: {
      flexDirection: 'row',
      marginBottom: 16,
      paddingRight: 12,
    },
    instructionNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#7C3AED',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      flexShrink: 0,
    },
    instructionNumberText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    instructionText: {
      fontSize: 15,
      color: '#334155',
      lineHeight: 22,
      flex: 1,
    },
    // Floating Action Button
    fabContainer: {
      position: 'absolute',
      bottom: 28,
      left: 24,
      right: 24,
    },
    fabButton: {
      backgroundColor: '#7C3AED',
      borderRadius: 16,
      paddingVertical: 18,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    fabText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: recipe.image }}
            style={styles.heroImage}
          >
            <View style={styles.gradientOverlay} />
          </ImageBackground>

          {/* Header Buttons */}
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.headerButton, isFavorite && styles.favoriteButtonActive]}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#FFFFFF' : '#EF4444'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{recipe.category}</Text>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.recipeTitle}>{recipe.name}</Text>
            <Text style={styles.recipeDescription}>{recipe.description}</Text>
          </View>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="flame-outline" size={20} color="#EF4444" />
              <Text style={styles.metaValue}>{recipe.calories}</Text>
              <Text style={styles.metaText}> kcal</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color="#7C3AED" />
              <Text style={styles.metaText}>{recipe.time}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={20} color="#10B981" />
              <Text style={styles.metaText}>{recipe.servings} kişilik</Text>
            </View>
          </View>

          {/* Nutrition Cards */}
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Besin Değerleri</Text>
            <View style={styles.nutritionCards}>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{recipe.protein || 25}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{recipe.carbs || 30}g</Text>
                <Text style={styles.nutritionLabel}>Karbonhidrat</Text>
              </View>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{recipe.fats || 12}g</Text>
                <Text style={styles.nutritionLabel}>Yağ</Text>
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.ingredientsSection}>
            <Text style={styles.sectionTitle}>Malzemeler</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientDot} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>Hazırlanışı</Text>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabButton}>
          <Ionicons name="restaurant-outline" size={22} color="#FFFFFF" />
          <Text style={styles.fabText}>Tarifi Başlat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RecipeDetailScreen;
