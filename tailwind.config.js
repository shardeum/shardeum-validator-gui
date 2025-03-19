/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        successBg: '#E5FFE8',
        successFg: '#1C7645',
        successBorder: '#B0DDB3',
        subtleBg: '#F3F3F1',
        subtleFg: '#323232',
        severeBg: '#FFF3E7',
        severeFg: '#DB6900',
        severeBorder: '#FFC794',
        attentionBg: '#FFFCE7',
        attentionFg: '#B2A100',
        attentionBorder: '#EAD943',
        dangerBg: '#FFE8E8',
        dangerFg: '#C70000',
        dangerBorder: '#FFBEBE',
        accentFg: '#3042FB',
        accentBg: '#EAECFF',
        greyFg: '#7C7C7B',
        selectedBg: '#E7F3FF',
        selectedFg: '#0070C0',
        selectedBorder: '#A5D3FA',
        readyBg: '#E8FFF9',
        readyFg: '#008562',
        readyBorder: '#A3E5D0',
      },
    },
  },
  daisyui: {
    themes: [
      {
        forest: {
          ...require('daisyui/src/colors/themes')['[data-theme=forest]'],
          primary: '#1d4ed8',
          'primary-focus': '#1d4ed8',
          error: '#ef4444',
          '--bc': '0 11.727% 30.608%',
          'base-100': '#000000',

          '.btn': {
            'text-transform': 'capitalize',
            'border-radius': '0',
          },
          '.btn-primary': {
            color: 'white',
          },
          '.btn-error': {
            color: 'white',
          },
          '.toggle': {
            '--tglbg': '#f3f4f6',
            '--bc': '0 11.727% 30.608%',
          },
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
