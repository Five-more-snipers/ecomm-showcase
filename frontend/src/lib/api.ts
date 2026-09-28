import { Cart, Category, CheckoutRequest, Order, OrderStatus, OrderTracking, Product } from '@/types';
import {
  PRESET_CATEGORIES,
  PRESET_PRODUCTS,
  PRESET_CART_DEFAULT,
  PRESET_ORDER_DEFAULT,
  PRESET_TRACKING_DEFAULT,
} from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorData: any = {};
    try {
      errorData = await res.json();
    } catch {
      errorData = { message: res.statusText };
    }
    const message = errorData.message || errorData.error || `HTTP error ${res.status}`;
    const err = new Error(message);
    (err as any).status = res.status;
    (err as any).details = errorData.details;
    (err as any).errorCode = errorData.error;
    throw err;
  }
  return res.json();
}

// Helper for local offline cart management
function getLocalCart(cartId: string): Cart {
  if (typeof window === 'undefined') return { ...PRESET_CART_DEFAULT, cartId };
  try {
    const raw = localStorage.getItem(`ecomm_cart_${cartId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse local cart', e);
  }
  return { ...PRESET_CART_DEFAULT, cartId };
}

function saveLocalCart(cart: Cart) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`ecomm_cart_${cart.cartId}`, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save local cart', e);
  }
}

// -----------------------------------------------------------------------------
// Category APIs
// -----------------------------------------------------------------------------
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    return await handleResponse<Category[]>(res);
  } catch (err) {
    console.warn('Backend unavailable, using preset categories:', err);
    return PRESET_CATEGORIES;
  }
}

// -----------------------------------------------------------------------------
// Product APIs
// -----------------------------------------------------------------------------
export async function fetchProducts(params?: {
  category?: string;
  search?: string;
  page?: number;
  size?: number;
}): Promise<{ content: Product[]; totalElements: number; totalPages: number }> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.page !== undefined) query.set('page', params.page.toString());
    if (params?.size !== undefined) query.set('size', params.size.toString());

    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, { cache: 'no-store' });
    return await handleResponse<any>(res);
  } catch (err) {
    console.warn('Backend unavailable, using preset products:', err);
    let filtered = [...PRESET_PRODUCTS];
    if (params?.category) {
      filtered = filtered.filter((p) => p.category.slug === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return {
      content: filtered,
      totalElements: filtered.length,
      totalPages: 1,
    };
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/featured`, { cache: 'no-store' });
    return await handleResponse<Product[]>(res);
  } catch (err) {
    console.warn('Backend unavailable, using preset featured products:', err);
    return PRESET_PRODUCTS.filter((p) => p.isFeatured);
  }
}

export async function fetchProduct(id: number): Promise<Product> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { cache: 'no-store' });
    return await handleResponse<Product>(res);
  } catch (err) {
    console.warn('Backend unavailable, using preset product:', err);
    const item = PRESET_PRODUCTS.find((p) => p.id === id);
    if (!item) throw new Error('Product not found');
    return item;
  }
}

// -----------------------------------------------------------------------------
// Cart APIs (With Automatic Preset Demo Seeding)
// -----------------------------------------------------------------------------
export async function fetchCart(cartId: string): Promise<Cart> {
  if (!cartId) return PRESET_CART_DEFAULT;

  try {
    const res = await fetch(`${API_BASE_URL}/cart/${cartId}`, { cache: 'no-store' });
    const cart = await handleResponse<Cart>(res);

    // Auto-seed preset items if brand new empty cart and user hasn't visited before
    if (
      cart.items.length === 0 &&
      typeof window !== 'undefined' &&
      !localStorage.getItem('ecomm_preset_seeded')
    ) {
      localStorage.setItem('ecomm_preset_seeded', 'true');
      return await seedPresetCart(cartId);
    }

    return cart;
  } catch (err) {
    console.warn('Backend cart unavailable, using local preset cart:', err);
    return getLocalCart(cartId);
  }
}

export async function seedPresetCart(cartId: string): Promise<Cart> {
  try {
    // Attempt backend seed with Product 1 ($199.99) and Product 5 ($74.00)
    await addToCart(cartId, 1, 1);
    return await addToCart(cartId, 5, 1);
  } catch (err) {
    console.warn('Failed to seed backend cart, seeding locally:', err);
    const local = { ...PRESET_CART_DEFAULT, cartId };
    saveLocalCart(local);
    return local;
  }
}

export async function addToCart(cartId: string, productId: number, quantity: number = 1): Promise<Cart> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/${cartId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    return await handleResponse<Cart>(res);
  } catch (err) {
    console.warn('Backend unavailable, updating local cart:', err);
    // Offline local fallback
    const cart = getLocalCart(cartId);
    const product = PRESET_PRODUCTS.find((p) => p.id === productId);
    if (!product) throw new Error('Product not found');

    const existingIndex = cart.items.findIndex((i) => i.productId === productId);
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].lineTotal = Number(
        (cart.items[existingIndex].quantity * cart.items[existingIndex].unitPrice).toFixed(2)
      );
    } else {
      cart.items.push({
        id: Date.now(),
        productId: product.id,
        title: product.title,
        sku: product.sku,
        imageUrl: product.imageUrl,
        unitPrice: product.price,
        quantity: quantity,
        lineTotal: Number((product.price * quantity).toFixed(2)),
      });
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.subtotal = Number(cart.items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
    saveLocalCart(cart);
    return cart;
  }
}

export async function updateCartItem(cartId: string, itemId: number, quantity: number): Promise<Cart> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/${cartId}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    return await handleResponse<Cart>(res);
  } catch (err) {
    console.warn('Backend unavailable, updating item in local cart:', err);
    const cart = getLocalCart(cartId);
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else {
      const item = cart.items.find((i) => i.id === itemId);
      if (item) {
        item.quantity = quantity;
        item.lineTotal = Number((item.unitPrice * quantity).toFixed(2));
      }
    }
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.subtotal = Number(cart.items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
    saveLocalCart(cart);
    return cart;
  }
}

export async function removeCartItem(cartId: string, itemId: number): Promise<Cart> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/${cartId}/items/${itemId}`, {
      method: 'DELETE',
    });
    return await handleResponse<Cart>(res);
  } catch (err) {
    console.warn('Backend unavailable, removing item from local cart:', err);
    const cart = getLocalCart(cartId);
    cart.items = cart.items.filter((i) => i.id !== itemId);
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.subtotal = Number(cart.items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
    saveLocalCart(cart);
    return cart;
  }
}

// -----------------------------------------------------------------------------
// Checkout & Order APIs
// -----------------------------------------------------------------------------
function executeSimulatedCheckout(request: CheckoutRequest): {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  paymentTransactionRef: string;
  message: string;
} {
  const card = request.payment.cardNumber || '';
  const sim = request.payment.simulationMode;

  if (sim === 'FORCE_DECLINE' || card.endsWith('0002')) {
    throw new Error('Transaction declined: Insufficient funds (Simulated test card 0002).');
  }
  if (sim === 'FORCE_TIMEOUT' || card.endsWith('0004')) {
    throw new Error('Payment gateway timeout after 10000ms (Simulated test card 0004).');
  }

  const randomArray = new Uint32Array(2);
  if (typeof crypto !== 'undefined' && crypto?.getRandomValues) {
    crypto.getRandomValues(randomArray);
  } else {
    randomArray[0] = Date.now() % 900000;
    randomArray[1] = (Date.now() + 12345) % 900000;
  }
  const orderNum = `ORD-2026-${100000 + (randomArray[0] % 900000)}`;
  const localCart = getLocalCart(request.cartId);
  const subtotal = localCart.subtotal || 273.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shipping = subtotal >= 100.0 ? 0.0 : 10.0;
  const total = Number((subtotal + tax + shipping).toFixed(2));

  const simulatedOrder: Order = {
    orderId: `order-sim-${Date.now()}`,
    orderNumber: orderNum,
    status: 'PAYMENT_CONFIRMED',
    subtotal,
    tax,
    shipping,
    total,
    customerName: request.customerName,
    customerEmail: request.customerEmail,
    shippingAddress: request.shippingAddress,
    shippingCity: request.shippingCity,
    shippingPostalCode: request.shippingPostalCode,
    paymentMethod: request.payment.paymentMethod,
    paymentStatus: 'COMPLETED',
    transactionRef: `TXN-SIM-${100000 + (randomArray[1] % 900000)}`,
    createdAt: new Date().toISOString(),
    items: localCart.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      title: i.title,
      sku: i.sku,
      imageUrl: i.imageUrl,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      totalPrice: i.lineTotal,
    })),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(`ecomm_order_${orderNum}`, JSON.stringify(simulatedOrder));
    saveLocalCart({ cartId: request.cartId, items: [], totalItems: 0, subtotal: 0 });
  }

  return {
    orderId: simulatedOrder.orderId,
    orderNumber: orderNum,
    status: 'PAYMENT_CONFIRMED',
    total,
    paymentTransactionRef: simulatedOrder.transactionRef!,
    message: 'Simulated checkout completed successfully.',
  };
}

export async function executeCheckout(request: CheckoutRequest): Promise<{
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  paymentTransactionRef: string;
  message: string;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return await handleResponse<any>(res);
  } catch (err: any) {
    if (err.status) throw err;
    console.warn('Backend unavailable, running offline simulated checkout:', err);
    return executeSimulatedCheckout(request);
  }
}

export async function fetchOrder(orderNumber: string): Promise<Order> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}`, { cache: 'no-store' });
    return await handleResponse<Order>(res);
  } catch (err) {
    console.warn('Backend unavailable, loading local order:', err);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`ecomm_order_${orderNumber}`);
      if (stored) return JSON.parse(stored);
    }
    return { ...PRESET_ORDER_DEFAULT, orderNumber };
  }
}

export async function fetchOrderTracking(orderNumber: string): Promise<OrderTracking> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}/tracking`, { cache: 'no-store' });
    return await handleResponse<OrderTracking>(res);
  } catch (err) {
    console.warn('Backend unavailable, returning default tracking:', err);
    return { ...PRESET_TRACKING_DEFAULT, orderNumber };
  }
}

export async function cancelOrder(orderNumber: string): Promise<Order> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}/cancel`, {
      method: 'POST',
    });
    return await handleResponse<Order>(res);
  } catch (err) {
    console.warn('Backend unavailable, cancelling order locally:', err);
    const order = await fetchOrder(orderNumber);
    order.status = 'CANCELLED';
    if (typeof window !== 'undefined') {
      localStorage.setItem(`ecomm_order_${orderNumber}`, JSON.stringify(order));
    }
    return order;
  }
}

export async function advanceOrderStatus(orderNumber: string, status: OrderStatus): Promise<Order> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}/status?status=${status}`, {
      method: 'PATCH',
    });
    return await handleResponse<Order>(res);
  } catch (err) {
    console.warn('Backend unavailable, updating order status locally:', err);
    const order = await fetchOrder(orderNumber);
    order.status = status;
    if (typeof window !== 'undefined') {
      localStorage.setItem(`ecomm_order_${orderNumber}`, JSON.stringify(order));
    }
    return order;
  }
}

// -----------------------------------------------------------------------------
// Back-Office / Admin APIs
// -----------------------------------------------------------------------------
function getLocalStoredOrders(): Order[] {
  const localOrders: Order[] = [PRESET_ORDER_DEFAULT];
  if (typeof window === 'undefined') {
    return localOrders;
  }
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('ecomm_order_')) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.orderNumber && !localOrders.some((o) => o.orderNumber === parsed.orderNumber)) {
            localOrders.unshift(parsed);
          }
        }
      } catch (err) {
        console.warn('Failed to parse cached local order:', err);
      }
    }
  }
  return localOrders;
}

export async function fetchAdminOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/orders`, { cache: 'no-store' });
    const orders = await handleResponse<Order[]>(res);
    return orders?.length ? orders : [PRESET_ORDER_DEFAULT];
  } catch (err) {
    console.warn('Backend unavailable, loading local orders:', err);
    return getLocalStoredOrders();
  }
}

export async function createAdminProduct(data: {
  sku?: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  isFeatured: boolean;
  isActive: boolean;
  stockQuantity: number;
}): Promise<Product> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<Product>(res);
  } catch (err) {
    console.warn('Backend unavailable, creating local preset product:', err);
    const newProduct: Product = {
      id: Date.now(),
      sku: data.sku || `PROD-${Date.now()}`,
      title: data.title,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl || '/images/image_1.webp',
      isFeatured: data.isFeatured,
      isActive: data.isActive,
      category: PRESET_CATEGORIES.find((c) => c.id === data.categoryId) || PRESET_CATEGORIES[0],
      stockAvailable: data.stockQuantity,
    };
    PRESET_PRODUCTS.unshift(newProduct);
    return newProduct;
  }
}

type AdminProductUpdatePayload = {
  sku?: string;
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  categoryId?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  stockQuantity?: number;
};

function updateLocalPresetProduct(id: number, data: AdminProductUpdatePayload): Product {
  const product = PRESET_PRODUCTS.find((p) => p.id === id);
  if (!product) {
    throw new Error('Product not found in local presets');
  }
  if (data.title) product.title = data.title;
  if (data.price !== undefined) product.price = data.price;
  if (data.description !== undefined) product.description = data.description;
  if (data.sku) product.sku = data.sku;
  if (data.isFeatured !== undefined) product.isFeatured = data.isFeatured;
  if (data.isActive !== undefined) product.isActive = data.isActive;
  if (data.stockQuantity !== undefined) product.stockAvailable = data.stockQuantity;
  return product;
}

export async function updateAdminProduct(
  id: number,
  data: AdminProductUpdatePayload
): Promise<Product> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<Product>(res);
  } catch (err) {
    console.warn('Backend unavailable, updating local preset product:', err);
    return updateLocalPresetProduct(id, data);
  }
}

export async function deleteAdminProduct(id: number): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/admin/products/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Backend unavailable, marking local product inactive:', err);
    const p = PRESET_PRODUCTS.find((item) => item.id === id);
    if (p) p.isActive = false;
  }
}

export async function updateAdminInventory(productId: number, quantityAvailable: number): Promise<number> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/inventory/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantityAvailable }),
    });
    const data = await handleResponse<{ productId: number; quantityAvailable: number }>(res);
    return data.quantityAvailable;
  } catch (err) {
    console.warn('Backend unavailable, updating local inventory stock:', err);
    const p = PRESET_PRODUCTS.find((item) => item.id === productId);
    if (p) p.stockAvailable = quantityAvailable;
    return quantityAvailable;
  }
}

