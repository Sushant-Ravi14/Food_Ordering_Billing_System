import * as readline from "readline";
import chalk from "chalk";
import { foodItems } from "./data";
import { addToCart, getCart, updateQuantity, removeFromCart, clearCart } from "./cart";
import { setCustomer, getCustomer, createGuest, createMember } from "./customer";
import { generateBill } from "./billing";
import { getOrderStatus, updateOrderStatus } from "./order";
import { Payment } from "./types";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUser(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(chalk.yellow(query), resolve));
}

async function startApp() {
  let isRunning = true;

  while (isRunning) {
    console.log(chalk.cyan("\n================================"));
    console.log(chalk.bold.cyan("      FOOD ORDERING SYSTEM"));
    console.log(chalk.cyan("================================"));

    console.log("1. Create Customer");
    console.log("2. View Food Menu");
    console.log("3. Add Item to Cart");
    console.log("4. View Cart");
    console.log("5. Update Item Quantity");
    console.log("6. Remove Item from Cart");
    console.log("7. Checkout");
    console.log("8. Change Order Status");
    console.log("9. Exit");

    const option = await promptUser("\nSelect an option: ");

    switch (option) {
      case "1":
        await handleCreateCustomer();
        break;
      case "2":
        handleViewFoodMenu();
        break;
      case "3":
        await handleAddToCart();
        break;
      case "4":
        handleViewCart();
        break;
      case "5":
        await handleUpdateQuantity();
        break;
      case "6":
        await handleRemoveItem();
        break;
      case "7":
        await handleCheckout();
        break;
      case "8":
        await handleChangeOrderStatus();
        break;
      case "9":
        console.log(chalk.green("Thank you for using the Food Ordering System!"));
        isRunning = false;
        rl.close();
        break;
      default:
        console.log(chalk.red("Invalid option. Please try again."));
    }
  }
}

async function handleCreateCustomer() {
  const type = await promptUser("Are you a Guest or Member? (guest/member): ");
  const name = await promptUser("Enter your name: ");
  const phone = await promptUser("Enter phone (optional): ");
  const city = await promptUser("Enter city: ");

  if (type.toLowerCase() === "member") {
    const level = await promptUser("Enter membership level (silver/gold/platinum): ");
    if (level === "silver" || level === "gold" || level === "platinum") {
      setCustomer(createMember(name, phone, "Street 1", city, "100001", level));
      console.log(chalk.green("Member created successfully!"));
    } else {
      console.log(chalk.red("Invalid membership level."));
    }
  } else {
    setCustomer(createGuest(name, phone, "Street 1", city, "100001"));
    console.log(chalk.green("Guest created successfully!"));
  }
}

function handleViewFoodMenu() {
  console.log(chalk.bold("\n--- Food Menu ---"));
  foodItems.forEach((item) => {
    const status = item.isAvailable ? chalk.green("Available") : chalk.red("Out of Stock");
    console.log(`${item.id}. ${item.name} [${item.category}] - ₹${item.price} (${status})`);
  });
}

async function handleAddToCart() {
  handleViewFoodMenu();
  const idStr = await promptUser("Enter food item ID to add: ");
  const id = parseInt(idStr, 10);
  const qtyStr = await promptUser("Enter quantity: ");
  const qty = parseInt(qtyStr, 10);

  const item = foodItems.find((i) => i.id === id);
  if (item && item.isAvailable) {
    if (qty > 0) {
      addToCart(item, qty);
      console.log(chalk.green(`${item.name} added to cart!`));
    } else {
      console.log(chalk.red("Quantity must be greater than 0."));
    }
  } else {
    console.log(chalk.red("Item not found or unavailable."));
  }
}

function handleViewCart() {
  const cart = getCart();
  if (cart.length === 0) {
    console.log(chalk.yellow("Your cart is empty."));
    return;
  }

  console.log(chalk.bold("\n--- Your Cart ---"));
  cart.forEach((item) => {
    console.log(`${item.id}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`);
  });
}

async function handleUpdateQuantity() {
  handleViewCart();
  const cart = getCart();
  if (cart.length === 0) return;

  const idStr = await promptUser("Enter food item ID to update: ");
  const id = parseInt(idStr, 10);
  const qtyStr = await promptUser("Enter new quantity (0 to remove): ");
  const qty = parseInt(qtyStr, 10);

  updateQuantity(id, qty);
  console.log(chalk.green("Cart updated!"));
}

async function handleRemoveItem() {
  handleViewCart();
  const cart = getCart();
  if (cart.length === 0) return;

  const idStr = await promptUser("Enter food item ID to remove: ");
  const id = parseInt(idStr, 10);
  removeFromCart(id);
  console.log(chalk.green("Item removed!"));
}

async function handleCheckout() {
  const customer = getCustomer();
  if (!customer) {
    console.log(chalk.red("Please create a customer first (Option 1)."));
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    console.log(chalk.red("Cart is empty. Add items before checkout."));
    return;
  }

  console.log("\nSelect Payment Method:");
  console.log("1. Cash");
  console.log("2. Card");
  console.log("3. UPI");
  
  const paymentOption = await promptUser("Choose option: ");
  let payment: Payment;

  if (paymentOption === "1") {
    const amtStr = await promptUser("Enter cash received amount: ");
    payment = { method: "cash", receivedAmount: parseFloat(amtStr) };
  } else if (paymentOption === "2") {
    const digits = await promptUser("Enter last 4 digits of card: ");
    payment = { method: "card", last4Digits: digits };
  } else if (paymentOption === "3") {
    const upi = await promptUser("Enter UPI Transaction ID: ");
    payment = { method: "upi", transactionId: upi };
  } else {
    console.log(chalk.red("Invalid payment method."));
    return;
  }

  const bill = generateBill(`ORD-${Date.now()}`, customer, cart, payment);

  if (bill.status === "error") {
    console.log(chalk.red(`\nCheckout failed: ${bill.message}`));
  } else {
    console.log(chalk.green("\n========================================"));
    console.log(chalk.bold.green("             ORDER SUMMARY"));
    console.log(chalk.green("========================================"));
    console.log(`Order ID: ${bill.orderId}`);
    console.log(`Customer: ${bill.customer.name} (${bill.customer.type})`);
    
    console.log(chalk.cyan("\nItems:"));
    console.log("----------------------------------------");
    bill.items.forEach(item => {
      console.log(`${item.name} \t x${item.quantity} \t ₹${item.price * item.quantity}`);
    });
    console.log("----------------------------------------");
    console.log(`Subtotal: \t\t ₹${bill.subtotal}`);
    console.log(`Membership Discount: \t ₹${bill.membershipDiscount.toFixed(2)}`);
    console.log(`Additional Discount: \t ₹${bill.additionalDiscount.toFixed(2)}`);
    console.log(`GST (5%): \t\t ₹${bill.tax.toFixed(2)}`);
    console.log("----------------------------------------");
    console.log(chalk.bold(`Final Amount: \t\t ₹${bill.finalAmount.toFixed(2)}`));
    console.log(`Payment Method: \t ${bill.paymentDetails.method}`);
    console.log(chalk.green("========================================"));
    console.log(chalk.bold.green("        Thank you for ordering!"));
    console.log(chalk.green("========================================"));
    
    clearCart();
    updateOrderStatus("confirmed");
  }
}

async function handleChangeOrderStatus() {
  console.log(`Current Status: ${chalk.cyan(getOrderStatus())}`);
  console.log("Available statuses: pending, confirmed, preparing, delivered, cancelled");
  
  const newStatus = await promptUser("Enter new status: ");
  const success = updateOrderStatus(newStatus as any);
  
  if (success) {
    console.log(chalk.green(`Order status updated to ${newStatus}`));
  } else {
    console.log(chalk.red("Invalid order status."));
  }
}

// Run the application
startApp();
