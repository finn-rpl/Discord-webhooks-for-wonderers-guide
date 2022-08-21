/* Copyright (C) 2021, by Quzzar
  This code is licensed under MIT license (see LICENSE for details)
*/

const REGEX_DAMAGE = /(^| |\()((\d+)+d(\d+)((\s*[+-]\s*\d+)*))( (B|P|S|bludgeoning|piercing|slashing|acid|cold|electricity|fire|sonic|positive|negative|force|chaotic|evil|good|lawful|mental|poison|persistent|precision)(\b)|)/gi;
// Groups: 0-match, 1-startSpace, 2-diceText, 3-diceNum, 4-diceType, 5-bonus, 6-afterWord, 7-afterWordOnly, 8-endSpace

const REGEX_BONUS = /(^| |\()((?!a\b)\w+) ((\+|\-|\−)\d+)($|(?!-)\W)/g;
// Groups: 0-match, 1-startSpace, 2-label, 3-bonus, 4-sign, 5-endSpace

/**
 * @param {string} diceText
 * @param {boolean} isCheck
 * @param {?string} displayText
 * @param {?string} label
 * @returns {string}
 */
 function linkGenerator(diceText, isCheck, displayText="", label="", user="") {
  diceText = diceText.replace(/–/g, '-');
  displayText = (displayText == '') ? diceText : displayText;
  label = label.replace(/ /g, '%20');

  let dice = '';
  if(isCheck) {
    // d20 Check //

    if(!diceText.startsWith('+') && !diceText.startsWith('-')) { diceText = '+'+diceText; }
    if(label != null && label != ''){
      dice = label + ':1d20'+diceText;
    } else {
      dice = '1d20'+diceText;
    }
  } else {
    // Damage dice //
    // Ex. Converts label:3d8+11 bludgeoning + 2d6 fire -> label(bludgeoning):3d8+11|label(fire):2d6

    const matches = diceText.matchAll(REGEX_DAMAGE);

    for(let match of matches) {
      if(dice != ''){ dice += '|'; }

      let diceLabel = capitalizeWord(match[8]);
      if(diceLabel != null && diceLabel != '') {
        if(label != null && label != ''){
          dice += label+' damage ('+diceLabel+'):';
        } else {
          dice += diceLabel+' damage:';
        }
      } else {
        if(label != null && label != ''){
          dice += label+':';
        }
      }

      dice += match[3]+'d'+match[4]+signNum(evalString(match[5].replace(/ /g, '')));
    }

    if(dice.includes('d100')){
      dice = dice.replace(/d100/g, 'd100+d10');
    }
  }
//  console.log(dice)
//  console.log(displayText)
//  return `<a href="talespire://dice/${dice}" title="Rolls dice in TaleSpire" target="_self" class="talespireLink">${displayText}</a>`;
  return `<button type="button" class="talespireLink" value="${dice}" >${displayText}</button>`;
}


/**
 * @param {string} word
 * @returns {string}
 */
function capitalizeWord(word){
  if(word == null){ return '';}
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * @param {string} str
 * @returns {int}
 */
function evalString(s) { // Evaluates a string of basic math: '5 + 30 - 25.1 + 11'
  if(s == null || s == '') { return 0; }
  return (s.replace(/\s/g, '').match(/[+\-]?([0-9\.]+)/g) || [])
  .reduce(function(sum, value) {
      return parseFloat(sum) + parseFloat(value);
  });
}

/**
 * @param {int} num
 * @returns {string}
 */
function signNum(num){
  if(num == 0) { return ''; }
  if((num+'').startsWith('+')) { return num; }
  return (num < 0) ? ''+num : '+'+num;
}

// What continues is the bs I threw together to roll simple checks n damage rolls

function Roll(rollString, charName="") {

  console.log('roll function begin')
//  console.log(webhook)
//  One day I would like that url to be a thing a user adds
//  console.log(HOOK_LINK)
  console.log(rollString)
  rollString = rollString.split('|')
  for (let i = 0; i < rollString.length; i++) {
//    console.log(rollString[i])
    rollString[i] = rollString[i].split(':')
//    console.log(rollString[i])
    results = DiceRoll(rollString[i][1])
//    console.log(results)
    const sum = results.reduce((partialSum, a) => partialSum + a, 0);
//    console.log(sum)



    chrome.storage.sync.get({
      discordWebhookURL: 'Enter URL'
    }, function(items) {
//      test
      let xhr = new XMLHttpRequest();
      console.log(items.discordWebhookURL)
      xhr.open("POST", items.discordWebhookURL)
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onload = () => console.log(xhr.responseText);

      let data = {
        "username": charName,
        "content": formatRoll(rollString[i].join(': '), results),
      };

      xhr.send(JSON.stringify(data));
      })

  }
}

function DiceRoll(dString) {
//  console.log(dString)
  const components = ['+']
  for(let i=0; i<dString.length;i++) {
    if (dString[i] == "+" || dString[i] == '-') components.push(dString[i]);
  }
//  console.log(components)
  dString = dString.split(/\+|-/)
//  console.log(dString)
  const results = [];
  for (let j = 0; j < dString.length; j++) {
//    console.log(dString[j])
    if (dString[j].includes('d')) {
      dString[j] = dString[j].split('d')
      for (let k = 0; k < dString[j][0]; k++) {
        results.push(components[j] + (1+ Math.floor(Math.random() * dString[j][1])))
      }
    } else {
    results.push(components[j] + dString[j])
    }
  }
  return results
}

function add(accumulator, a) {
  return accumulator + parseInt(a);
}

function formatRoll(rollstriing, results) {
  const sum = results.reduce(add, 0); // with initial value to avoid when the array is empty
  const ssum = results.join(" ")
//  console.log(sum)
  return "Rolling " + rollstriing + '\n(' + ssum.substring(1) + ') = ' + sum
}
