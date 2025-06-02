// Simple script to check the user object in localStorage
try {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('User object from localStorage:', user);
  
  if (user) {
    console.log('User ID (_id):', user._id);
    console.log('User ID (id):', user.id);
  }
} catch (e) {
  console.error('Error parsing user from localStorage:', e);
}

export default {}; 