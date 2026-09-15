import { CartItem, FoodItem } from "./types";

let cart: CartItem[] = [];

// Get all items in the cart
export function getCart(): CartItem[] {
  return cart;
}

// Add an item to the cart, or increase quantity if it already exists
export function addToCart(foodItem: FoodItem, quantity: number, specialInstruction?: string): void {
  const existingItemIndex = cart.findIndex((item) => item.id === foodItem.id);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += quantity;
    if (specialInstruction) {
      cart[existingItemIndex].specialInstruction = specialInstruction;
    }
  } else {
    cart.push({
      ...foodItem,
      quantity,
      specialInstruction,
    });
  }
}

// Remove an item from the cart
export function removeFromCart(foodItemId: number): void {
  cart = cart.filter((item) => item.id !== foodItemId);
}

// Update the quantity of a specific cart item
export function updateQuantity(foodItemId: number, newQuantity: number): void {
  if (newQuantity <= 0) {
    removeFromCart(foodItemId);
    return;
  }

  const existingItem = cart.find((item) => item.id === foodItemId);
  if (existingItem) {
    existingItem.quantity = newQuantity;
  }
}

// Calculate the total for a specific item based on quantity
export function calculateItemTotal(cartItem: CartItem): number {
  return cartItem.price * cartItem.quantity;
}

// Clear the cart
export function clearCart(): void {
  cart = [];
}
