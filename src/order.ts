import { OrderStatus } from "./types";

let currentOrderStatus: OrderStatus = "pending";

// Get the current order status
export function getOrderStatus(): OrderStatus {
  return currentOrderStatus;
}

// Update the order status using exhaustive checks
export function updateOrderStatus(newStatus: OrderStatus): boolean {
  switch (newStatus) {
    case "pending":
    case "confirmed":
    case "preparing":
    case "delivered":
    case "cancelled":
      currentOrderStatus = newStatus;
      return true;
    default:
      // Exhaustiveness check
      const _exhaustiveCheck: never = newStatus;
      return _exhaustiveCheck;
  }
}
