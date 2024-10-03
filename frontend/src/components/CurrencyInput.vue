<template>
  <div class="row g-3">
    <div class="col-12">
      <Multiselect
        v-model="sourceCurrency"
        :options="sourceCurrencies"
        label="name"
        :placeholder="sourceCurrencyPlaceholder"
      />
      <span v-if="sourceCurrencyError" class="text-danger">{{ sourceCurrencyError }}</span>
    </div>
    <div class="col-12">
      <Multiselect
        v-model="targetCurrency"
        :options="targetCurrencies"
        label="name"
        :placeholder="targetCurrencyPlaceholder"
      />
      <span v-if="targetCurrencyError" class="text-danger">{{ targetCurrencyError }}</span>
    </div>
    <div class="col-12">
      <input v-model.number="amount" type="number" :placeholder="amountPlaceholder" class="form-control" />
      <span v-if="amountError" class="text-danger">{{ amountError }}</span>
    </div>
    <div class="col-12">
      <button @click="submit" class="btn btn-primary">{{ $t('currency.convert') }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import axios from 'axios';
export default defineComponent({
  components: { Multiselect },
  data() {
    return {
      sourceCurrency: null,
      targetCurrency: null,
      amount: null,
      sourceCurrencies: [],
      targetCurrencies:[],
      sourceCurrencyError: '',
      targetCurrencyError: '',
      amountError: ''
    };
  },
  computed: {
    sourceCurrencyPlaceholder() {
      return this.$t('currency.sourceCurrency');
    },
    targetCurrencyPlaceholder() {
      return this.$t('currency.targetCurrency');
    },
    amountPlaceholder() {
      return this.$t('currency.amount');
    }
  },
  methods: {
    validate() {
      this.sourceCurrencyError = !this.sourceCurrency ? this.$t('currency.invalidInput') : '';
      this.targetCurrencyError = !this.targetCurrency ? this.$t('currency.invalidInput') : '';
      this.amountError = !this.amount || this.amount <= 0 ? this.$t('currency.invalidInput') : '';
      return !this.sourceCurrencyError && !this.targetCurrencyError && !this.amountError;
    },
    submit() {
      if (this.validate()) {
        this.$emit('submit', {
          sourceCurrency: this.sourceCurrency.value,
          targetCurrency: this.targetCurrency.value,
          amount: this.amount
        });
      }
    },
    fetchCurrencies() {
      axios.get('https://swop.cx/rest/currencies', {
            headers: {
                'content-type' : 'application/json',
                'Authorization': `ApiKey a08b0f7aa339eb356c5b6c65ec2ab7e640ad52812acc5bcc08f622074f8d5b01`,
              },
        })
        .then(response => {
          // Map the fetched data to the format needed for the Multiselect component
          const currencies = response.data.map(currency => ({
            value: currency.code,
            name: `${currency.code} - ${currency.name}`
          }));
          this.sourceCurrencies = currencies;
          this.targetCurrencies = currencies;
        })
        .catch(error => {
          console.error('Error fetching currencies:', error);
        });
    }
  },
  watch: {
    sourceCurrency() {
      if (this.sourceCurrency) {
        this.sourceCurrencyError = '';
      }
    },
    targetCurrency() {
      if (this.targetCurrency) {
        this.targetCurrencyError = '';
      }
    },
    amount() {
      if (this.amount && this.amount > 0) {
        this.amountError = '';
      }
    }
  },
  mounted() {
    this.fetchCurrencies();
  }
});
</script>

<style>
/* Add any additional styles here */

</style>
