const API_URL = process.env.NIGHTHAWK_ADMIN_API_URL || 'https://your-admin-dashboard-url.com/api';
const API_KEY = process.env.NIGHTHAWK_ADMIN_API_KEY;

// Helper function for making API requests
async function makeApiRequest(endpoint, method = 'GET', data = null) {
  const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  };
  
  const options = {
    method,
    headers
  };
  
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Export functions for different API calls
export async function submitTeamApplication(applicationData) {
  return makeApiRequest('team-applications', 'POST', applicationData);
}

export async function submitPermissionRequest(requestData) {
  return makeApiRequest('permission-requests', 'POST', requestData);
}

export async function submitCrimeReport(reportData) {
  return makeApiRequest('crime-reports', 'POST', reportData);
}
