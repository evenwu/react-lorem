import corpus from './data/5ch33.json';

const DEFAULT_PROPS = {
  sentence: 3,
  avgWordsPerSentence: 8,
};

// Standard deviation percentage for words and sentences
const SD_PERCENTAGE = 0.25;

const MID_PUNCTUATION = {
  COMMA: '\uff0c',
  SEMICOLON: '\uff1b',
};
const END_PUNCTUATION = {
  PERIOD: '\uff61',
  QUESTION_MARK: '\uff1f',
  EXCLAMATION_MARK: '\uff01',
};

// Try to parse a value and return default value if it could not parsed as number
function parseIntWithDefault(
  value: string | number,
  defaultValue: number,
): number {
  let finalValue = typeof value === 'string' ? parseInt(value, 10) : value;
  if (Number.isNaN(finalValue)) finalValue = defaultValue;
  return finalValue;
}

// Get standard deviation amount by using percentage
function getStandardDeviation(value: number, percentage: number): number {
  return Math.ceil(value * percentage);
}

function randomFromRange(min: number, max: number): number {
  return Math.round(Math.random() * (max - min)) + min;
}

// Get random integers from a range great equal or greater than 1
function randomPositiveFromRange(min: number, max: number): number {
  return Math.max(1, randomFromRange(min, max));
}

// Get a punctuation for middle of the sentence randomly
function midPunctuation(): string {
  const random = Math.random();
  if (random > 0.99) return MID_PUNCTUATION.SEMICOLON;
  return MID_PUNCTUATION.COMMA;
}

function endPunctuation(): string {
  const random = Math.random();
  // 1% probability exclamation mark, 4% probability question mark, 95% probability dot
  if (random > 0.99) return END_PUNCTUATION.EXCLAMATION_MARK;
  if (random > 0.95) return END_PUNCTUATION.QUESTION_MARK;
  return END_PUNCTUATION.PERIOD;
}

function randomizeElements(array: string[], count: number): string[] {
  if (count > array.length) {
    throw new Error(
      'Array size cannot be smaller than expected random numbers count.',
    );
  }
  const result = array.slice(0);

  // Fisher-Yates Shuffle
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.slice(0, count);
}

function join(array: string[], getSeparator: () => string): string {
  return array.reduce(
    (acc, item, index, thisArray) =>
      `${acc}${item}${index < thisArray.length - 1 ? getSeparator() : ''}`,
    '',
  );
}

function createSentence(avgWordsPerSentence: number): string {
  const awps = parseIntWithDefault(
    avgWordsPerSentence,
    DEFAULT_PROPS.avgWordsPerSentence,
  );
  const sd = getStandardDeviation(awps, SD_PERCENTAGE);
  const randomLength = randomPositiveFromRange(awps - sd, awps + sd);

  const words = randomizeElements(corpus, randomLength);
  const sentence = `${join(words, midPunctuation)}${endPunctuation()}`;
  return sentence;
}

function createParagraph(length: number, getSentence: () => string): string {
  return Array.from({ length }, getSentence).join(' ');
}

export interface ZhLoremProps {
  /**
   * @default 3
   */
  sentence: string | number;

  /**
   * @default 8
   */
  avgWordsPerSentence: string | number;
}

export const ZhLorem = (props: ZhLoremProps) => {
  const { sentence, avgWordsPerSentence } = props;
  const paragraphLength = parseIntWithDefault(sentence, DEFAULT_PROPS.sentence);
  const awps = parseIntWithDefault(
    avgWordsPerSentence,
    DEFAULT_PROPS.avgWordsPerSentence,
  );
  const result = createParagraph(paragraphLength, () => createSentence(awps));
  return result;
};
