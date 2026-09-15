import { CartItem, Customer, Payment, BillResult } from "./types";
import { calculateItemTotal } from "./cart";

// Calculate Subtotal using reduce
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + calculateItemTotal(item), 0);
}

// Calculate Membership and Additional Discounts
export function calculateDiscount(customer: Customer, subtotal: number): { membershipDiscount: number, additionalDiscount: number } {
  let membershipDiscountPercentage = 0;

  // Narrowing checking type
  if (customer.type === "member") {
    membershipDiscountPercentage = customer.discountPercentage;
  }

  const membershipDiscount = (subtotal * membershipDiscountPercentage) / 100;
  const amountAfterMembershipDiscount = subtotal - membershipDiscount;

  let additionalDiscount = 0;
  if (subtotal > 2000) {
    additionalDiscount = (amountAfterMembershipDiscount * 5) / 100;
  }

  return { membershipDiscount, additionalDiscount };
}

// Calculate 5% GST
export function calculateTax(amountAfterDiscount: number): number {
  return (amountAfterDiscount * 5) / 100;
}

// Calculate Final Amount
export function calculateFinalAmount(subtotal: number, membershipDiscount: number, additionalDiscount: number, tax: number): number {
  return (subtotal - membershipDiscount - additionalDiscount) + tax;
}

// Process Payment using Discriminated Union and exhaustive check concepts (narrowing)
export function processPayment(payment: Payment, finalAmount: number): boolean {
  switch (payment.method) {
    case "cash":
      return payment.receivedAmount >= finalAmount;
    case "card":
      return payment.last4Digits.length === 4;
    case "upi":
      return payment.transactionId.length > 0;
    default:
      // Exhaustiveness check
      const _exhaustiveCheck: never = payment;
      return _exhaustiveCheck;
  }
}

// Generate Bill
export function generateBill(
  orderId: string,
  customer: Customer,
  items: CartItem[],
  payment: Payment
): BillResult {
  if (items.length === 0) {
    return {
      status: "error",
      message: "Cart is empty. Cannot generate bill."
    };
  }

  const subtotal = calculateSubtotal(items);
  const { membershipDiscount, additionalDiscount } = calculateDiscount(customer, subtotal);
  const amountAfterDiscount = subtotal - membershipDiscount - additionalDiscount;
  const tax = calculateTax(amountAfterDiscount);
  const finalAmount = calculateFinalAmount(subtotal, membershipDiscount, additionalDiscount, tax);

  const isPaymentSuccessful = processPayment(payment, finalAmount);
  if (!isPaymentSuccessful) {
    return {
      status: "error",
      message: "Payment failed. Please check payment details."
    };
  }

  return {
    status: "success",
    orderId,
    customer,
    items,
    subtotal,
    membershipDiscount,
    additionalDiscount,
    tax,
    finalAmount,
    paymentDetails: payment
  };
}
