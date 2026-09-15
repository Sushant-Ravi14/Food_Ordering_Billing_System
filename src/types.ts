// 1. Food Items
export type FoodCategory = "pizza" | "burger" | "drink" | "dessert";

export interface FoodItem {
  id: number;
  name: string;
  category: FoodCategory;
  price: number;
  isAvailable: boolean;
}

// 2. Customer
export type MembershipLevel = "silver" | "gold" | "platinum";

export interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export interface BaseCustomer {
  id: number;
  name: string;
  phone?: string;
  address: Address;
}

export interface Guest extends BaseCustomer {
  type: "guest";
}

export interface Member extends BaseCustomer {
  type: "member";
  membershipId: string;
  discountPercentage: number;
  membershipLevel: MembershipLevel;
}

// Union Type
export type Customer = Guest | Member;

// 3. Cart
export type OrderInformation = {
  quantity: number;
  specialInstruction?: string;
};

// Intersection type
export type CartItem = FoodItem & OrderInformation;

// 4. Order Status
export type OrderStatus = "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";

// 5. Payment
export interface CashPayment {
  method: "cash";
  receivedAmount: number;
}

export interface CardPayment {
  method: "card";
  last4Digits: string;
}

export interface UpiPayment {
  method: "upi";
  transactionId: string;
}

// Union Type
export type Payment = CashPayment | CardPayment | UpiPayment;

// 9. Bill Result (Discriminated Union)
export type BillResult =
  | {
      status: "success";
      orderId: string;
      customer: Customer;
      items: CartItem[];
      subtotal: number;
      membershipDiscount: number;
      additionalDiscount: number;
      tax: number;
      finalAmount: number;
      paymentDetails: Payment;
    }
  | {
      status: "error";
      message: string;
    };
