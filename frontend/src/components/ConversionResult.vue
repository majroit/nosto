<template>
    <div v-if="result.convertedNumber !== 0">
      <h2 class="alert alert-success my-5">{{ $t('currency.result') }}: {{ result.convertedNumber }}</h2>
      <p class="text-white">{{ $t('currency.quote') }}: {{ result.quote }}</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { ConversionResultType } from './types/conversionResultType';

  export default defineComponent({
    props: {
      result: {
        type: Object as () => ConversionResultType | null,
        required: true,
      },
    },
  });
  </script>
  