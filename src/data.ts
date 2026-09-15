import { FoodItem } from "./types";

export const foodItems: FoodItem[] = [
  { id: 1, name: "Margherita Pizza", category: "pizza", price: 299, isAvailable: true },
  { id: 2, name: "Farmhouse Pizza", category: "pizza", price: 399, isAvailable: true },
  { id: 3, name: "Veg Burger", category: "burger", price: 199, isAvailable: true },
  { id: 4, name: "Chicken Burger", category: "burger", price: 249, isAvailable: false },
  { id: 5, name: "Cold Coffee", category: "drink", price: 150, isAvailable: true },
  { id: 6, name: "Coke", category: "drink", price: 60, isAvailable: true },
  { id: 7, name: "Chocolate Lava Cake", category: "dessert", price: 120, isAvailable: true },
  { id: 8, name: "Vanilla Ice Cream", category: "dessert", price: 90, isAvailable: true }
];
