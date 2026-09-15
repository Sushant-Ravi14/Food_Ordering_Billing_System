import { Guest, Member, Customer, MembershipLevel } from "./types";

let currentCustomer: Customer | null = null;

// Set the current customer
export function setCustomer(customer: Customer): void {
  currentCustomer = customer;
}

// Get the current customer
export function getCustomer(): Customer | null {
  return currentCustomer;
}

// Helper to create a guest
export function createGuest(name: string, phone: string, street: string, city: string, zipCode: string): Guest {
  return {
    type: "guest",
    id: Date.now(), // simple random ID for the scope of this assignment
    name,
    phone: phone || undefined,
    address: { street, city, zipCode }
  };
}

// Helper to create a member
export function createMember(
  name: string,
  phone: string,
  street: string,
  city: string,
  zipCode: string,
  membershipLevel: MembershipLevel
): Member {
  
  let discountPercentage = 0;
  switch (membershipLevel) {
    case "silver": discountPercentage = 5; break;
    case "gold": discountPercentage = 10; break;
    case "platinum": discountPercentage = 15; break;
  }

  return {
    type: "member",
    id: Date.now(),
    name,
    phone: phone || undefined,
    address: { street, city, zipCode },
    membershipId: `MEM-${Math.floor(Math.random() * 10000)}`,
    membershipLevel,
    discountPercentage
  };
}
