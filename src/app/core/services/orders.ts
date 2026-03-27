export interface CreateOrderCustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CreateOrderShippingAddressPayload {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customer: CreateOrderCustomerPayload;
  shippingAddress: CreateOrderShippingAddressPayload;
  items: CreateOrderItemPayload[];
}

export interface CreateOrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  totals: {
    subtotal: string;
    total: string;
  };
  itemCount: number;
  items: {
    productId: string;
    title: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
  }[];
  createdAt: string;
}
