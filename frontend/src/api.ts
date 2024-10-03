import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Function to get cookie value by name
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';')?.shift(); // Use optional chaining
};

// Function to fetch CSRF token from backend
const fetchCsrfToken = async (): Promise<void> => {
  try {
    const response = await axios.get(`${API_URL}/csrf-token`, {
      withCredentials: true, // Include credentials in the request
    });

    const csrfToken = response.data.csrfToken; // Assuming your API returns { csrfToken: '...' }

    // Set CSRF token in a cookie
    document.cookie = `XSRF-TOKEN=${csrfToken}; path=/;`;
    console.log('CSRF Token set:', csrfToken);

  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

// Function to convert currency
export const convertCurrency = async (sourceCurrency: string, targetCurrency: string, amount: number): Promise<number> => {
  // Ensure CSRF token is fetched before making the request
  const csrfToken = getCookie('XSRF-TOKEN'); // Retrieve the CSRF token from the cookie

  const response = await axios.post(
    `${API_URL}/convert`,
    {
      sourceCurrency,
      targetCurrency,
      amount,
    },
    {
      headers: {
        'X-XSRF-TOKEN': csrfToken || '', // Provide a default empty string if undefined
      },
      withCredentials: true, // Include credentials in the request
    }
  );

  return response.data.convertedAmount;
};

// Call fetchCsrfToken() on initial application load to set the CSRF token
fetchCsrfToken().then(() => {
  console.log('CSRF token fetched and ready for use');
});
