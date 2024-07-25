// src/utils/type-guards.ts

import { User, Customer } from '@prisma/client';

// Type guards
export function isAdministrator(user: User | Customer): user is User {
  return (user as User).role !== undefined;
}

export function isCustomer(user: User | Customer): user is Customer {
  return (user as Customer).phone_number !== undefined;
}
