const additional = {
  name: 'additional',
  title: 'Additional',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'shippingAndReturns',
      title: 'Shipping and Returns',
      type: 'localeBlock',
    },
    {
      name: 'termsAndConditions',
      title: 'Terms and Conditions',
      type: 'localeBlock',
    },
    {
      name: 'privacyPolicy',
      title: 'Privacy Policy',
      type: 'localeBlock',
    },
  ],
}

export default additional;