// Simple test script to verify authentication logic
import { login, register, isAuthenticated, getCurrentUser } from './src/utils/auth.js';
import usersData from './jsondata/users.json' assert { type: 'json' };

// Test login with existing user
console.log('Testing authentication...');

const loginResult = login('admin@cloudcost.com', 'admin123', usersData.users);
console.log('Login result:', loginResult);

if (loginResult.success) {
  console.log('✅ Login successful');
  console.log('Current user:', getCurrentUser());
  console.log('Is authenticated:', isAuthenticated());
} else {
  console.log('❌ Login failed:', loginResult.message);
}

// Test registration
const registerResult = register({
  name: 'Test User',
  email: 'test@example.com',
  password: 'test123',
  department: 'IT'
}, usersData.users);

console.log('Registration result:', registerResult);

if (registerResult.success) {
  console.log('✅ Registration successful');
} else {
  console.log('❌ Registration failed:', registerResult.message);
}

console.log('Test completed.');
