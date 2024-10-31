// src/utils/type-guards.ts

import { Customer } from 'src/database/entities/customer.entity';
import { User } from 'src/database/entities/user.entity';

// Type guards
export function isAdministrator(user: User | Customer): user is User {
  return (user as User).role !== undefined;
}

export function isCustomer(user: User | Customer): user is Customer {
  return (user as Customer).phone_number !== undefined;
}
