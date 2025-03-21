// src/services/apiRequest.ts

export async function apiRequest(method: string, endpoint: string, data?: any) {
  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : null,
  });

  if (!response.ok) {
    throw new Error(`Failed to submit request: ${response.statusText}`);
  }

  return await response.json();
}
