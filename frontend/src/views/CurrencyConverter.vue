<template>
    <div>
      <h1 class="title"> {{ $t('currency.title') }}</h1>
      <CurrencyInput @submit="handleConvert" />
      <ConversionResult :result="conversionResult" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import CurrencyInput from '../components/CurrencyInput.vue';
  import ConversionResult from '../components/ConversionResult.vue';
  import { convertCurrency } from '../api';
  import { conversionResultType } from '../types/conversionResultType';
  
  export default defineComponent({
    components: {
      CurrencyInput,
      ConversionResult,
    },
    setup() {
      const conversionResult = ref<ConversionResultType | null>({convertedNumber: 0, quote: 0});
  
      const handleConvert = async (data: { sourceCurrency: string; targetCurrency: string; amount: number }) => {
        try {
          const result = await convertCurrency(data.sourceCurrency, data.targetCurrency, data.amount);
          conversionResult.value = result;
        } catch (error) {
          console.error('Conversion error:', error);
          conversionResult.value = null; // Reset if error
        }
      };
  
      return { conversionResult, handleConvert };
    },
  });
  </script>
  