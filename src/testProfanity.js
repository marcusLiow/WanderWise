import { Filter } from 'bad-words';

const filter = new Filter();

const testTexts = [
  'This is a clean review about my wonderful exchange experience',
  'This contains badword that should be filtered',
  'damn this place was amazing',
  'The university is shit',
  'Great food and awesome people'
];

console.log('Testing profanity filter:\n');
testTexts.forEach((text, index) => {
  console.log(`Test ${index + 1}: "${text}"`);
  console.log(`Is profane: ${filter.isProfane(text)}`);
  console.log(`Cleaned: "${filter.clean(text)}"`);
  console.log('---');
});
