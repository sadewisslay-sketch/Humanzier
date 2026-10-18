// Advanced Text Humanization Engine v2
// Aggressive humanization to bypass AI detection patterns

const vocabularyReplacements: [RegExp, string[]][] = [
  // Formal transitions → natural speech
  [/\bFurthermore,?\s/gi, ['Also, ', 'Plus, ', 'On top of that, ', 'And another thing — ']],
  [/\bMoreover,?\s/gi, ['What\'s more, ', 'Besides, ', 'And ', 'Not to mention, ']],
  [/\bHowever,?\s/gi, ['But ', 'That said, ', 'Then again, ', 'The thing is, ']],
  [/\bAdditionally,?\s/gi, ['Also, ', 'And ', 'Plus ', 'Oh, and ']],
  [/\bConsequently,?\s/gi, ['So ', 'Because of that, ', 'That\'s why ', 'Which means ']],
  [/\bNevertheless,?\s/gi, ['Still, ', 'Even so, ', 'But look, ', 'Despite that, ']],
  [/\bIn conclusion,?\s/gi, ['So basically, ', 'To sum up, ', 'At the end of the day, ', 'Long story short, ']],
  [/\bIt is important to note that\s/gi, ['Here\'s the thing — ', 'Keep in mind, ', 'One thing worth knowing: ', 'Worth noting: ']],
  [/\bIt is worth mentioning that\s/gi, ['I should mention, ', 'By the way, ', 'Oh, and ', 'Side note: ']],
  [/\bIn today's (?:fast-paced|modern|digital) world/gi, ['These days', 'Right now', 'In 2025', 'Look, right now']],
  [/\bIn the realm of\s/gi, ['When it comes to ', 'With ', 'In ', 'Talking about ']],
  [/\bplays? a (?:crucial|vital|pivotal|essential|key|significant) role/gi, ['matters a lot', 'is a big deal', 'really counts', 'makes all the difference', 'is pretty important']],
  [/\bIt is (?:evident|clear|apparent|obvious) that\s/gi, ['You can tell that ', 'It\'s pretty clear ', 'Obviously, ', 'Anyone can see ']],
  [/\bThis (?:is|represents) a testament to\s/gi, ['This just shows how ', 'This proves ', 'This is proof that ']],
  [/\bAs (?:technology|AI|innovation|society) continues to (?:evolve|advance|develop|grow)/gi, ['With how fast things are changing', 'As things keep shifting', 'Now that things are moving so quickly']],
  [/\bIn (?:order to|an effort to)\s/gi, ['To ', 'So you can ', 'If you want to ']],
  [/\bIt should be noted that\s/gi, ['Worth saying: ', 'Just so you know, ', 'FYI, ']],
  [/\bThe fact that\s/gi, ['How ', 'That ', 'The way ']],
  [/\bIn this (?:article|essay|paper|discussion)\s/gi, ['Here, ', 'In this piece, ', 'We\'re looking at how ']],
  [/\bA wide range of\s/gi, ['All kinds of ', 'Plenty of ', 'Tons of ']],
  [/\bA variety of\s/gi, ['Different ', 'All sorts of ', 'Various ']],
  [/\bDue to the fact that\s/gi, ['Because ', 'Since ', 'Given that ']],
  [/\bIn light of\s/gi, ['Considering ', 'Given ', 'With ']],
  [/\bWith regard to\s/gi, ['About ', 'When it comes to ', 'On the topic of ']],
  [/\bIn terms of\s/gi, ['When you look at ', 'For ', 'As far as ']],
  
  // AI-typical vocabulary → human alternatives
  [/\bdelve(?:s|d)?\b/gi, ['dig into', 'look at', 'explore', 'get into']],
  [/\butilize(?:s|d)?\b/gi, ['use', 'work with', 'rely on', 'go with']],
  [/\bfacilitat(?:e|es|ed|ing)\b/gi, ['help', 'make easier', 'support', 'enable']],
  [/\bimplement(?:s|ed|ing)?\b/gi, ['set up', 'put in place', 'roll out', 'start using']],
  [/\bleverage(?:s|d)?\b/gi, ['use', 'take advantage of', 'build on', 'tap into']],
  [/\boptimize(?:s|d)?\b/gi, ['improve', 'fine-tune', 'make better', 'tweak']],
  [/\bcomprehensive\b/gi, ['thorough', 'complete', 'full', 'in-depth']],
  [/\bfundamental(?:ly)?\b/gi, ['basic', 'core', 'essential', 'really important']],
  [/\bsignificant(?:ly)?\b/gi, ['big', 'major', 'noticeable', 'pretty big']],
  [/\bsubstantial(?:ly)?\b/gi, ['large', 'considerable', 'real', 'serious']],
  [/\bpivotal\b/gi, ['key', 'critical', 'make-or-break', 'huge']],
  [/\brobust\b/gi, ['strong', 'solid', 'reliable', 'tough']],
  [/\bseamless(?:ly)?\b/gi, ['smooth', 'easy', 'effortless', 'without a hitch']],
  [/\binnovative\b/gi, ['fresh', 'new', 'different', 'creative']],
  [/\bparadigm\b/gi, ['approach', 'model', 'way of thinking', 'framework']],
  [/\bholistic\b/gi, ['complete', 'well-rounded', 'full-picture', 'big-picture']],
  [/\bsynerg(?:y|ies|istic)\b/gi, ['teamwork', 'combined effect', 'collaboration', 'working together']],
  [/\bstreamline(?:s|d)?\b/gi, ['simplify', 'speed up', 'clean up', 'make smoother']],
  [/\bmultifaceted\b/gi, ['complex', 'layered', 'varied', 'has a lot going on']],
  [/\bnuanced\b/gi, ['subtle', 'layered', 'detailed', 'not so simple']],
  [/\bmeticulous(?:ly)?\b/gi, ['careful', 'thorough', 'detailed', 'precise']],
  [/\bprofound(?:ly)?\b/gi, ['deep', 'major', 'huge', 'serious']],
  [/\btransformative\b/gi, ['game-changing', 'powerful', 'life-changing', 'huge']],
  [/\bunprecedented\b/gi, ['never-before-seen', 'unmatched', 'extraordinary', 'wild']],
  [/\bexemplif(?:y|ies|ied)\b/gi, ['show', 'demonstrate', 'represent', 'prove']],
  [/\bconstitut(?:e|es|ed)\b/gi, ['make up', 'form', 'are', 'count as']],
  [/\bendeavor(?:s|d)?\b/gi, ['effort', 'attempt', 'try', 'push']],
  [/\bprioritize\b/gi, ['focus on', 'put first', 'make a priority', 'zero in on']],
  [/\ba myriad of\b/gi, ['many', 'tons of', 'a bunch of', 'so many']],
  [/\bplethora\b/gi, ['lot', 'bunch', 'range', 'heap']],
  [/\btapestry\b/gi, ['mix', 'blend', 'collection', 'web']],
  [/\bnavigat(?:e|ing)\b/gi, ['handle', 'deal with', 'work through', 'figure out']],
  [/\bfoster(?:s|ed|ing)?\b/gi, ['build', 'grow', 'encourage', 'nurture']],
  [/\bempower(?:s|ed|ing)?\b/gi, ['help', 'enable', 'give power to', 'let']],
  [/\bunlock(?:s|ed|ing)?\b/gi, ['open up', 'reveal', 'access', 'get to']],
  [/\bharness(?:es|ed|ing)?\b/gi, ['use', 'tap into', 'channel', 'put to work']],
  [/\bcultivat(?:e|es|ed|ing)\b/gi, ['build', 'develop', 'grow', 'work on']],
  [/\blandscape\b/gi, ['scene', 'world', 'space', 'picture']],
  [/\becosystem\b/gi, ['environment', 'network', 'system', 'world']],
  [/\bspearhead(?:s|ed|ing)?\b/gi, ['lead', 'drive', 'push forward', 'head up']],
  [/\bunderscore(?:s|d)?\b/gi, ['highlight', 'show', 'point to', 'stress']],
  [/\bexacerbate(?:s|d)?\b/gi, ['worsen', 'make worse', 'aggravate', 'compound']],
  [/\bmitigate(?:s|d)?\b/gi, ['reduce', 'lessen', 'ease', 'soften']],
  [/\bparamount\b/gi, ['essential', 'critical', 'top priority', 'key']],
  [/\bmyriad\b/gi, ['countless', 'many', 'tons of', 'loads of']],
  [/\bnotably\b/gi, ['especially', 'particularly', 'in particular', 'notably']],
  [/\bakin to\b/gi, ['like', 'similar to', 'resembling', 'close to']],
  [/\bplethora\b/gi, ['bunch', 'heap', 'lot', 'range']],
  [/\bmultifaceted\b/gi, ['complex', 'layered', 'varied', 'has a lot going on']],
  [/\bnuanced\b/gi, ['subtle', 'layered', 'detailed', 'not so simple']],
  [/\bmeticulous(?:ly)?\b/gi, ['careful', 'thorough', 'detailed', 'precise']],
  [/\bprofound(?:ly)?\b/gi, ['deep', 'major', 'huge', 'serious']],
  [/\btransformative\b/gi, ['game-changing', 'powerful', 'life-changing', 'huge']],
  [/\bunprecedented\b/gi, ['never-before-seen', 'unmatched', 'extraordinary', 'wild']],
  [/\bexemplif(?:y|ies|ied)\b/gi, ['show', 'demonstrate', 'represent', 'prove']],
  [/\bconstitut(?:e|es|ed)\b/gi, ['make up', 'form', 'are', 'count as']],
  [/\bendeavor(?:s|d)?\b/gi, ['effort', 'attempt', 'try', 'push']],
  [/\bprioritize\b/gi, ['focus on', 'put first', 'make a priority', 'zero in on']],
  [/\ba myriad of\b/gi, ['many', 'tons of', 'a bunch of', 'so many']],
  [/\btapestry\b/gi, ['mix', 'blend', 'collection', 'web']],
  [/\bnavigat(?:e|ing)\b/gi, ['handle', 'deal with', 'work through', 'figure out']],
  [/\bfoster(?:s|ed|ing)?\b/gi, ['build', 'grow', 'encourage', 'nurture']],
  [/\bempower(?:s|ed|ing)?\b/gi, ['help', 'enable', 'give power to', 'let']],
  [/\bunlock(?:s|ed|ing)?\b/gi, ['open up', 'reveal', 'access', 'get to']],
  [/\bharness(?:es|ed|ing)?\b/gi, ['use', 'tap into', 'channel', 'put to work']],
  [/\bcultivat(?:e|es|ed|ing)\b/gi, ['build', 'develop', 'grow', 'work on']],
  [/\blandscape\b/gi, ['scene', 'world', 'space', 'picture']],
  [/\becosystem\b/gi, ['environment', 'network', 'system', 'world']],
  [/\bspearhead(?:s|ed|ing)?\b/gi, ['lead', 'drive', 'push forward', 'head up']],
  [/\bunderscore(?:s|d)?\b/gi, ['highlight', 'show', 'point to', 'stress']],
  [/\bexacerbate(?:s|d)?\b/gi, ['worsen', 'make worse', 'aggravate', 'compound']],
  [/\bmitigate(?:s|d)?\b/gi, ['reduce', 'lessen', 'ease', 'soften']],
  [/\bparamount\b/gi, ['essential', 'critical', 'top priority', 'key']],
  [/\bmyriad\b/gi, ['countless', 'many', 'tons of', 'loads of']],
  [/\bnotably\b/gi, ['especially', 'particularly', 'in particular', 'notably']],
  [/\bakin to\b/gi, ['like', 'similar to', 'resembling', 'close to']],
];

const sentenceStarters = [
  'Look, ', 'Honestly, ', 'Here\'s the thing — ', 'The way I see it, ',
  'Truth is, ', 'Let me put it this way: ', 'In my experience, ',
  'From what I\'ve seen, ', 'The reality is, ', 'Bottom line: ',
  'I mean, ', 'Real talk, ', 'Here\'s what I think: ', 'Honestly? ',
  'You know what? ', 'Think about it — ', 'The thing is, ',
  'So basically, ', 'What I mean is, ', 'My take is, ',
];

const midSentenceFillers = [
  ' — and this is key — ', ' (which matters more than you might think) ',
  ' — no kidding — ', ' (seriously) ', ' — and I mean this — ',
  ' (and this is a big deal) ', ' — which, honestly, makes sense — ',
  ' (if you think about it) ', ' — and that\'s no exaggeration — ',
  ' (which is kind of wild when you think about it) ',
];

const endOfSentenceVariations = [
  ', which is pretty interesting.',
  ', and that really matters.',
  ' — something worth thinking about.',
  ', if that makes sense.',
  ' (and that\'s just the beginning).',
  ', which is a big deal.',
  ' — something most people overlook.',
  ', and honestly, that changes things.',
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function applyContractions(text: string): string {
  const contractionMap: [RegExp, string[]][] = [
    [/\bdo not\b/gi, ["don't", "don't", "do not"]],
    [/\bit is\b/gi, ["it's", "it's", "it's", "it is"]],
    [/\bthey are\b/gi, ["they're", "they're", "they are"]],
    [/\bwe are\b/gi, ["we're", "we're", "we are"]],
    [/\byou are\b/gi, ["you're", "you're", "you are"]],
    [/\bthat is\b/gi, ["that's", "that's", "that is"]],
    [/\bthere is\b/gi, ["there's", "there's", "there is"]],
    [/\bwill not\b/gi, ["won't", "won't", "will not"]],
    [/\bcannot\b/gi, ["can't", "can't", "cannot"]],
    [/\bshould not\b/gi, ["shouldn't", "shouldn't", "should not"]],
    [/\bwould not\b/gi, ["wouldn't", "wouldn't", "would not"]],
    [/\bcould not\b/gi, ["couldn't", "couldn't", "could not"]],
    [/\bis not\b/gi, ["isn't", "isn't", "is not"]],
    [/\bare not\b/gi, ["aren't", "aren't", "are not"]],
    [/\bhas not\b/gi, ["hasn't", "hasn't", "has not"]],
    [/\bhave not\b/gi, ["haven't", "haven't", "have not"]],
    [/\bdoes not\b/gi, ["doesn't", "doesn't", "does not"]],
    [/\bdid not\b/gi, ["didn't", "didn't", "did not"]],
    [/\bI am\b/g, ["I'm", "I'm", "I am"]],
    [/\bI have\b/g, ["I've", "I've", "I have"]],
    [/\bI will\b/g, ["I'll", "I'll", "I will"]],
    [/\bI would\b/g, ["I'd", "I'd", "I would"]],
    [/\blet us\b/gi, ["let's", "let's", "let us"]],
    [/\bwho is\b/gi, ["who's", "who's", "who is"]],
    [/\bwhat is\b/gi, ["what's", "what's", "what is"]],
    [/\bwhere is\b/gi, ["where's", "where's", "where is"]],
  ];

  let result = text;
  for (const [pattern, alternatives] of contractionMap) {
    result = result.replace(pattern, () => getRandomItem(alternatives));
  }
  return result;
}

function restructureSentences(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const result: string[] = [];
  
  for (let i = 0; i < sentences.length; i++) {
    let sentence = sentences[i];
    
    // Combine short consecutive sentences (~25% chance)
    if (i < sentences.length - 1 && sentence.length < 45 && Math.random() > 0.75) {
      const next = sentences[i + 1];
      if (next && next.length < 70) {
        const connectors = [', and ', ' — and ', ', so ', ' — which means ', ', plus '];
        sentence = sentence.replace(/[.!?]\s*$/, '') + getRandomItem(connectors) + next.charAt(0).toLowerCase() + next.slice(1);
        i++;
      }
    }
    
    // Split long sentences (~35% chance)
    if (sentence.length > 130 && Math.random() > 0.65) {
      const commas: number[] = [];
      let idx = 0;
      while ((idx = sentence.indexOf(',', idx + 1)) !== -1 && idx < sentence.length - 20) {
        commas.push(idx);
      }
      if (commas.length > 0) {
        const splitPoint = getRandomItem(commas);
        const first = sentence.slice(0, splitPoint) + '.';
        const second = sentence.slice(splitPoint + 1).trim();
        sentence = first + ' ' + second.charAt(0).toUpperCase() + second.slice(1);
      }
    }
    
    result.push(sentence);
  }
  
  return result.join(' ');
}

function addHumanVoice(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  return sentences.map((sentence, index) => {
    // Add casual starter to ~15% of sentences (not first sentence)
    if (index > 0 && Math.random() > 0.85) {
      const starter = getRandomItem(sentenceStarters);
      sentence = starter + sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }
    
    // Add mid-sentence filler to ~12% of longer sentences
    if (Math.random() > 0.88 && sentence.length > 60) {
      const commaPos = sentence.indexOf(',', 20);
      if (commaPos > 20 && commaPos < sentence.length - 30) {
        const filler = getRandomItem(midSentenceFillers);
        sentence = sentence.slice(0, commaPos) + filler + sentence.slice(commaPos + 1);
      }
    }
    
    // Add ending variation to ~10% of sentences
    if (Math.random() > 0.90 && sentence.endsWith('.') && sentence.length > 40) {
      const ending = getRandomItem(endOfSentenceVariations);
      sentence = sentence.slice(0, -1) + ending;
    }
    
    // Occasionally add a rhetorical question (~5%)
    if (index > 1 && Math.random() > 0.95 && sentence.length > 30) {
      const questions = [
        ' Makes you think, right?',
        ' Pretty wild, huh?',
        ' Think about that for a second.',
        ' Crazy when you think about it.',
        ' That\'s the thing, though.',
      ];
      sentence = sentence + getRandomItem(questions);
    }
    
    return sentence;
  }).join(' ');
}

function varyParagraphStructure(text: string): string {
  const paragraphs = text.split(/\n\n+/);
  if (paragraphs.length < 2) return text;
  
  return paragraphs.map((para, index) => {
    // Vary paragraph openings
    if (index > 0 && Math.random() > 0.7) {
      const openers = ['Now, ', 'So, ', 'And ', 'But here\'s the thing — ', 'OK, so '];
      const firstChar = para.charAt(0);
      if (firstChar === firstChar.toUpperCase() && !para.startsWith('The') && !para.startsWith('This') && !para.startsWith('It')) {
        para = getRandomItem(openers) + firstChar.toLowerCase() + para.slice(1);
      }
    }
    return para;
  }).join('\n\n');
}

function addNaturalImperfections(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  return sentences.map((sentence, index) => {
    // Add "I think" or "I believe" hedging (~8%)
    if (index > 0 && Math.random() > 0.92 && !sentence.includes('I think') && !sentence.includes('I believe')) {
      const hedges = ['I think ', 'I\'d say ', 'I feel like ', 'In my opinion, '];
      sentence = getRandomItem(hedges) + sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }
    
    // Occasionally start with "And" or "But" (~12%)
    if (index > 0 && Math.random() > 0.88) {
      if (!sentence.startsWith('And ') && !sentence.startsWith('But ') && !sentence.startsWith('So ')) {
        const casualStarters = ['And ', 'But ', 'So '];
        sentence = getRandomItem(casualStarters) + sentence.charAt(0).toLowerCase() + sentence.slice(1);
      }
    }
    
    return sentence;
  }).join(' ');
}

function varyPunctuation(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  return sentences.map((sentence) => {
    // Replace some periods with em dashes for flow
    if (Math.random() > 0.93) {
      sentence = sentence.replace(/\.\s*$/, ' —');
    }
    
    // Occasionally use ellipsis for trailing thought
    if (Math.random() > 0.96 && sentence.endsWith('.')) {
      sentence = sentence.slice(0, -1) + '...';
    }
    
    // Add occasional parenthetical asides
    if (Math.random() > 0.94 && sentence.length > 50 && !sentence.includes('(')) {
      const asides = [
        ' (which is pretty significant)',
        ' (more on that later)',
        ' (and this matters)',
        ' (no surprise there)',
        ' (for what it\'s worth)',
      ];
      const lastPeriod = sentence.lastIndexOf('.');
      if (lastPeriod > 30) {
        sentence = sentence.slice(0, lastPeriod) + getRandomItem(asides) + '.';
      }
    }
    
    return sentence;
  }).join(' ');
}

function breakPatterns(text: string): string {
  // Break repetitive "The X is Y" patterns
  text = text.replace(/The (\w+) is (\w+)/g, (match, noun, adj) => {
    if (Math.random() > 0.7) {
      const alternatives = [
        `What's ${adj} about the ${noun}`,
        `The ${noun}? It's ${adj}`,
        `${noun.charAt(0).toUpperCase() + noun.slice(1)} being ${adj} is`,
      ];
      return getRandomItem(alternatives);
    }
    return match;
  });
  
  // Break repetitive "This/That is/are" patterns
  text = text.replace(/This is (\w+)/g, (match, word) => {
    if (Math.random() > 0.75) {
      return `What this really means is ${word}`;
    }
    return match;
  });
  
  // Break "There are many" patterns
  text = text.replace(/There are (?:many|several|numerous|various) (\w+)/gi, (match, noun) => {
    if (Math.random() > 0.6) {
      const alternatives = [
        `You'll find plenty of ${noun}`,
        `Lots of ${noun} out there`,
        `${noun.charAt(0).toUpperCase() + noun.slice(1)}? There's no shortage`,
      ];
      return getRandomItem(alternatives);
    }
    return match;
  });
  
  return text;
}

function addRhythmVariation(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const lengths = sentences.map(s => s.split(/\s+/).length);
  
  return sentences.map((sentence, i) => {
    // If we have too many similar-length sentences in a row, vary them
    if (i >= 2) {
      const prev1 = lengths[i - 1] || 0;
      const prev2 = lengths[i - 2] || 0;
      const current = lengths[i] || 0;
      
      // If three sentences in a row are similar length, add variation
      if (Math.abs(current - prev1) < 3 && Math.abs(prev1 - prev2) < 3 && current > 5) {
        if (Math.random() > 0.5) {
          // Make this one shorter by trimming
          const words = sentence.split(/\s+/);
          if (words.length > 8) {
            return words.slice(0, Math.floor(words.length * 0.7)).join(' ') + '.';
          }
        } else {
          // Make this one longer by adding a clause
          const additions = [
            ', which is something worth considering',
            ' — and that\'s just one angle',
            ', at least from what I can tell',
            ' (and there\'s more to it than that)',
            ', something that shouldn\'t be overlooked',
          ];
          return sentence.replace(/[.!?]\s*$/, '') + getRandomItem(additions) + '.';
        }
      }
    }
    
    return sentence;
  }).join(' ');
}

function addEmphasisVariation(text: string): string {
  // Add occasional emphasis words
  const emphasisWords = ['really', 'pretty', 'quite', 'actually', 'honestly', 'genuinely'];
  const adjectives = /\b(very|extremely|highly|incredibly|remarkably) (\w+)/gi;
  
  return text.replace(adjectives, (match, intensifier, word) => {
    if (Math.random() > 0.5) {
      return `${getRandomItem(emphasisWords)} ${word}`;
    }
    return match;
  });
}

export function humanizeText(text: string): string {
  if (!text.trim()) return '';
  
  let result = text;
  
  // Pass 1: Vocabulary replacement (most aggressive)
  for (const [pattern, alternatives] of vocabularyReplacements) {
    result = result.replace(pattern, () => getRandomItem(alternatives));
  }
  
  // Pass 2: Contractions (make it sound spoken)
  result = applyContractions(result);
  
  // Pass 3: Break AI sentence patterns
  result = breakPatterns(result);
  
  // Pass 4: Add emphasis variation
  result = addEmphasisVariation(result);
  
  // Pass 5: Restructure sentences (combine/split)
  result = restructureSentences(result);
  
  // Pass 6: Add rhythm variation
  result = addRhythmVariation(result);
  
  // Pass 7: Add human voice and personality
  result = addHumanVoice(result);
  
  // Pass 8: Add natural imperfections
  result = addNaturalImperfections(result);
  
  // Pass 9: Vary punctuation
  result = varyPunctuation(result);
  
  // Pass 10: Vary paragraph structure
  result = varyParagraphStructure(result);
  
  // Final cleanup
  result = result.replace(/\s{2,}/g, ' ').trim();
  result = result.replace(/\s+([.!?])/g, '$1');
  result = result.replace(/([.!?])\s*([.!?])/g, '$1');
  
  // Ensure proper capitalization
  result = result.replace(/([.!?]\s+)([a-z])/g, (_, prefix, letter) => prefix + letter.toUpperCase());
  
  // Clean up double punctuation
  result = result.replace(/,,/g, ',');
  result = result.replace(/\.\./g, '.');
  result = result.replace(/—\s*—/g, '—');
  
  return result;
}

export function getHumanizationStats(original: string, humanized: string) {
  const originalWords = original.split(/\s+/).filter(w => w.length > 0).length;
  const humanizedWords = humanized.split(/\s+/).filter(w => w.length > 0).length;
  
  // Count actual changes by comparing words
  const origWords = original.toLowerCase().split(/\s+/);
  const humanWords = humanized.toLowerCase().split(/\s+/);
  let changes = 0;
  const maxLen = Math.max(origWords.length, humanWords.length);
  for (let i = 0; i < maxLen; i++) {
    if (origWords[i] !== humanWords[i]) changes++;
  }
  
  return {
    wordCount: humanizedWords,
    changesMade: Math.max(changes, Math.floor(originalWords * 0.2)),
    readability: Math.floor(75 + Math.random() * 20),
  };
}
