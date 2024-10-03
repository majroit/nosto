import { mount } from '@vue/test-utils';
import CurrencyConverter from '../views/CurrencyConverter.vue';

describe('CurrencyConverter.vue', () => {
  it('renders currency converter', () => {
    const wrapper = mount(CurrencyConverter);
    expect(wrapper.text()).toContain('Currency Converter');
  });
});
