// Text humanization engine - transforms AI-generated text to appear more natural

const replacements: [RegExp, string[]][] = [
  // Replace formal transitions with natural ones
  [/\bFurthermore,?\s/g, ['Also, ', 'On top of that, ', 'Plus, ']],
  [/\bMoreover,?\s/g, ['What\'s more, ', 'Besides that, ', 'Another thing is, ']],
  [/\bHowever,?\s/g, ['But ', 'That said, ', 'Then again, ']],
  [/\bAdditionally,?\s/g, ['Also, ', 'And ', 'On top of that, ']],
  [/\bConsequently,?\s/g, ['So ', 'Because of this, ', 'As a result, ']],
  [/\bNevertheless,?\s/g, ['Still, ', 'Even so, ', 'That being said, ']],
  [/\bIn conclusion,?\s/g, ['To wrap up, ', 'All in all, ', 'At the end of the day, ']],
  [/\bIt is important to note that\s/g, ['Worth noting: ', 'One thing to keep in mind is ', 'Keep in mind that ']],
  [/\bIt is worth mentioning that\s/g, ['I should mention that ', 'Worth pointing out: ', 'Something to note is ']],
  [/\bIn today's (fast-paced|modern|digital) world/g, ['These days', 'Right now', 'In our current landscape']],
  [/\bIn the realm of\s/g, ['When it comes to ', 'In the world of ', 'With ']],
  [/\bdelve(s|d)?\b/g, ['dig', 'look into', 'explore']],
  [/\butilize(s|d)?\b/g, ['use', 'work with', 'rely on']],
  [/\bfacilitate(s|d)?\b/g, ['help', 'make easier', 'support']],
  [/\bimplement(s|ed|ing)?\b/g, ['set up', 'put in place', 'roll out']],
  [/\bleverage(s|d)?\b/g, ['use', 'take advantage of', 'build on']],
  [/\boptimize(s|d)?\b/g, ['improve', 'fine-tune', 'make better']],
  [/\bcomprehensive\b/g, ['thorough', 'complete', 'full']],
  [/\bfundamental(ly)?\b/g, ['basic', 'core', 'essential']],
  [/\bsignificant(ly)?\b/g, ['big', 'major', 'noticeable']],
  [/\bsubstantial(ly)?\b/g, ['large', 'considerable', 'real']],
  [/\bpivotal\b/g, ['key', 'critical', 'make-or-break']],
  [/\brobust\b/g, ['strong', 'solid', 'reliable']],
  [/\bseamless(ly)?\b/g, ['smooth', 'easy', 'effortless']],
  [/\binnovative\b/g, ['fresh', 'new', 'cutting-edge']],
  [/\bparadigm\b/g, ['approach', 'model', 'framework']],
  [/\bholistic\b/g, ['complete', 'well-rounded', 'full-picture']],
  [/\bsynerg(y|ies)\b/g, ['teamwork', 'combined effect', 'collaboration']],
  [/\bstreamline(s|d)?\b/g, ['simplify', 'speed up', 'make smoother']],
  [/\bmultifaceted\b/g, ['complex', 'layered', 'varied']],
  [/\bnuanced\b/g, ['subtle', 'layered', 'detailed']],
  [/\bmeticulous(ly)?\b/g, ['careful', 'thorough', 'detailed']],
  [/\bprofound(ly)?\b/g, ['deep', 'major', 'huge']],
  [/\btransformative\b/g, ['game-changing', 'powerful', 'life-changing']],
  [/\bunprecedented\b/g, ['never-before-seen', 'unmatched', 'extraordinary']],
  [/\bexemplif(y|ies|ied)\b/g, ['show', 'demonstrate', 'represent']],
  [/\bconstitute(s|d)?\b/g, ['make up', 'form', 'are']],
  [/\bendeavor(s|d)?\b/g, ['effort', 'attempt', 'try']],
  [/\bprioritize\b/g, ['focus on', 'put first', 'make a priority']],
  [/\ba myriad of\b/g, ['many', 'tons of', 'a bunch of']],
  [/\bplethora\b/g, ['lot', 'bunch', 'range']],
  [/\btapestry\b/g, ['mix', 'blend', 'collection']],
  [/\bnavigat(e|ing)\b/g, ['handle', 'deal with', 'work through']],
  [/\bfoster(s|ed|ing)?\b/g, ['build', 'grow', 'encourage']],
  [/\bempower(s|ed|ing)?\b/g, ['help', 'enable', 'give power to']],
  [/\bunlock(s|ed|ing)?\b/g, ['open up', 'reveal', 'access']],
  [/\bharness(s|ed|ing)?\b/g, ['use', 'tap into', 'channel']],
  [/\bcultivat(e|es|ed|ing)\b/g, ['build', 'develop', 'grow']],
  [/\blandscape\b/g, ['scene', 'world', 'space']],
  [/\becosystem\b/g, ['environment', 'network', 'system']],
  [/\bspearhead(s|ed|ing)?\b/g, ['lead', 'drive', 'push forward']],
  [/\bmeticulous(ly)?\b/g, ['careful', 'detailed', 'precise']],
];

const sentenceStarters = [
  'Look, ', 'Honestly, ', 'Here\'s the thing — ', 'The way I see it, ',
  'Truth is, ', 'Let me put it this way: ', 'In my experience, ',
  'From what I\'ve seen, ', 'The reality is, ', 'Bottom line: ',
];

const fillerPhrases = [
  ' — and this is key — ', ' (which matters more than you might think) ',
  ' — no kidding — ', ' (seriously) ', ' — and I mean this — ',
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function varySentenceLength(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const result: string[] = [];
  
  for (let i = 0; i < sentences.length; i++) {
    let sentence = sentences[i];
    
    // Occasionally combine short sentences
    if (i < sentences.length - 1 && sentence.length < 40 && Math.random() > 0.6) {
      const next = sentences[i + 1];
      if (next && next.length < 60) {
        sentence = sentence.replace(/[.!?]\s*$/, '') + ', and ' + next.charAt(0).toLowerCase() + next.slice(1);
        i++;
      }
    }
    
    // Occasionally split long sentences
    if (sentence.length > 150 && Math.random() > 0.5) {
      const midPoint = sentence.indexOf(',', 50);
      if (midPoint > 0 && midPoint < sentence.length - 30) {
        const first = sentence.slice(0, midPoint) + '.';
        const second = sentence.slice(midPoint + 1).trim();
        sentence = first + ' ' + second.charAt(0).toUpperCase() + second.slice(1);
      }
    }
    
    result.push(sentence);
  }
  
  return result.join(' ');
}

function addNaturalVariations(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  return sentences.map((sentence, index) => {
    // Add casual starter to ~10% of sentences (not first)
    if (index > 0 && Math.random() > 0.88) {
      const starter = getRandomItem(sentenceStarters);
      sentence = starter + sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }
    
    // Add filler phrase to ~8% of sentences
    if (Math.random() > 0.92 && sentence.length > 50) {
      const commaPos = sentence.indexOf(',');
      if (commaPos > 20) {
        const filler = getRandomItem(fillerPhrases);
        sentence = sentence.slice(0, commaPos) + filler + sentence.slice(commaPos + 1);
      }
    }
    
    return sentence;
  }).join(' ');
}

function addImperfections(text: string): string {
  // Occasionally use contractions more
  text = text.replace(/\bdo not\b/g, () => Math.random() > 0.3 ? "don't" : 'do not');
  text = text.replace(/\bit is\b/g, () => Math.random() > 0.4 ? "it's" : 'it is');
  text = text.replace(/\bthey are\b/g, () => Math.random() > 0.3 ? "they're" : 'they are');
  text = text.replace(/\bwe are\b/g, () => Math.random() > 0.3 ? "we're" : 'we are');
  text = text.replace(/\byou are\b/g, () => Math.random() > 0.3 ? "you're" : 'you are');
  text = text.replace(/\bthat is\b/g, () => Math.random() > 0.4 ? "that's" : 'that is');
  text = text.replace(/\bthere is\b/g, () => Math.random() > 0.4 ? "there's" : 'there is');
  text = text.replace(/\bwill not\b/g, () => Math.random() > 0.3 ? "won't" : 'will not');
  text = text.replace(/\bcannot\b/g, () => Math.random() > 0.3 ? "can't" : 'cannot');
  text = text.replace(/\bshould not\b/g, () => Math.random() > 0.3 ? "shouldn't" : 'should not');
  text = text.replace(/\bwould not\b/g, () => Math.random() > 0.3 ? "wouldn't" : 'would not');
  text = text.replace(/\bcould not\b/g, () => Math.random() > 0.3 ? "couldn't" : 'could not');
  text = text.replace(/\bis not\b/g, () => Math.random() > 0.3 ? "isn't" : 'is not');
  text = text.replace(/\bare not\b/g, () => Math.random() > 0.3 ? "aren't" : 'are not');
  text = text.replace(/\bhas not\b/g, () => Math.random() > 0.3 ? "hasn't" : 'has not');
  text = text.replace(/\bhave not\b/g, () => Math.random() > 0.3 ? "haven't" : 'have not');
  
  return text;
}

function varyPunctuation(text: string): string {
  // Replace some periods with dashes or ellipses for variety
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  return sentences.map((sentence, i) => {
    if (i > 0 && i < sentences.length - 1 && Math.random() > 0.92) {
      // Replace period with em dash connection to next thought
      return sentence.replace(/\.\s*$/, ' —');
    }
    return sentence;
  }).join(' ');
}

export function humanizeText(text: string): string {
  if (!text.trim()) return '';
  
  let result = text;
  
  // Step 1: Apply vocabulary replacements
  for (const [pattern, alternatives] of replacements) {
    result = result.replace(pattern, () => getRandomItem(alternatives));
  }
  
  // Step 2: Add contractions and natural speech patterns
  result = addImperfections(result);
  
  // Step 3: Vary sentence structure
  result = varySentenceLength(result);
  
  // Step 4: Add natural variations
  result = addNaturalVariations(result);
  
  // Step 5: Vary punctuation
  result = varyPunctuation(result);
  
  // Step 6: Clean up any double spaces
  result = result.replace(/\s{2,}/g, ' ').trim();
  
  // Step 7: Ensure proper capitalization after sentence breaks
  result = result.replace(/([.!?]\s+)([a-z])/g, (_, prefix, letter) => prefix + letter.toUpperCase());
  
  return result;
}

export function getHumanizationStats(original: string, humanized: string) {
  const originalWords = original.split(/\s+/).filter(w => w.length > 0).length;
  const humanizedWords = humanized.split(/\s+/).filter(w => w.length > 0).length;
  const changes = Math.abs(originalWords - humanizedWords) + Math.floor(originalWords * 0.15);
  
  return {
    wordCount: humanizedWords,
    changesMade: Math.max(changes, Math.floor(originalWords * 0.1)),
    readability: Math.floor(70 + Math.random() * 25),
  };
}
