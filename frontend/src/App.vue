<template>
  <div id="app">
    <main class="container">
      <CurrencyConverter />
    </main>
    <footer>
      <p>&copy; {{ $t('currency.copyright') }}</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import CurrencyConverter from './views/CurrencyConverter.vue';

export default defineComponent({
  name: 'App',
  components: {
    CurrencyConverter,
  },
  setup() {
    // Function to fetch the CSRF token
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/csrf-token', {
          credentials: 'include', // Ensure cookies are included in the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }

        const data = await response.json();
        // Set the CSRF token in a cookie if necessary
        document.cookie = `XSRF-TOKEN=${data.csrfToken}; path=/;`;

        console.log('CSRF Token:', data.csrfToken); // Debugging
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    // Fetch CSRF token when the component mounts
    onMounted(() => {
      fetchCsrfToken();
    });

    return {};
  },
});
</script>

<style>
/* Global Styles */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background: #201C1F !important;
  color: #333;
}

header {
  background: #201C1F !important;
  color: #F664BE !important;
  text-align: center;
  padding: 1rem;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

footer {
  background: #201C1F !important;
  color: white;
  text-align: center;
  padding: 1rem;
  position: absolute;
  bottom: 0;
  width: 100%;
}

#app {
  text-align: center;
}

.btn-primary {
  background: #F664BE !important;
  border: none !important;
}

.btn-primary:hover {
  background: #201C1F !important;
  color: white;
  border: 1px solid #F664BE !important;
}

.title {
  color: #F664BE !important;
  margin-bottom: 40px;
}

.multiselect__option--highlight {
  background: #201C1F !important;
  outline: none;
  color: white;
}

.multiselect__option--highlight::after {
  background: #201C1F !important;
  outline: none;
  color: white;
}
</style>
