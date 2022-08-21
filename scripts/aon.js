/* Copyright (C) 2021, by Quzzar
  This code is licensed under MIT license (see LICENSE for details)
*/

const REGEX_BOLD_BONUS = /(\<b\>(\w+)\<\/b\>) ((\+|\-|\−)\d+)/g;
// Groups: 0-match, 1-htmlLabel, 2-label, 3-bonus, 4-sign

LoadLoop();

function LoadLoop(){

  processGeneralText();

  setTimeout(LoadLoop, 1500);// 1.5 seconds
}

function processGeneralText(filter){

  $('span:not(.TSExtensionAttacksModified)').each(function() {

    let textHTML = $(this).html();

    textHTML = textHTML.replace(REGEX_BONUS, function(match, startSpace, label, bonus, sign, endSpace) {
      return startSpace+linkGenerator(bonus.trim(), true, label+' '+bonus, label)+endSpace;
    });

    textHTML = textHTML.replace(REGEX_DAMAGE, function(match, startSpace, diceText, diceNum, diceType, bonus, bonusLast, afterWord, afterWordOnly, endSpace) {
      return startSpace+linkGenerator(match.substring(startSpace.length), false, '', '', 'aon');
    });

    $(this).html(textHTML);
//    console.log('span')
    for (i = 0; i < $(this)[0].children.length; i++) {
      console.log($(this)[0].children[i])
      if ($(this)[0].children[i].className == 'talespireLink') {
//        console.log('found one!')
//        console.log($(this)[0].children[i].value)
        const buttonValue = $(this)[0].children[i].value
        $(this)[0].children[i].addEventListener('click', function(){Roll(buttonValue, 'From AoN'); });
      }
    }

//    const a = $(this).getElementsByClassName('talespireLink')
//    for (i=0; i < a.length; i++) {
//      console.log(a[i]);
//      console.log(a[i].innerHTML);
//      a[i].addEventListener('click', function(){console.log('clicked')})
//    }

//    $('talespireLink').each(function(){
//      console.log('talespireLink')
//      console.log($(this))
//      console.log($(this)[0])
//      console.log($(this)[0].children[0])
//      console.log($(this).innerHTML)
//      console.log($(this)[0].innerHTML)
//      console.log($(this)[0].children[0].innerHTML)
//      $(this).addEventListener('click', function(){Roll($(this)[0].children[0].value, charName); });
//    })
    $(this).addClass('TSExtensionAttacksModified');

  });

  $('.main:not(.TSExtensionAttacksModified)').each(function() {
    
    let textHTML = $(this).html();

    textHTML = textHTML.replace(REGEX_BOLD_BONUS, function(match, htmlLabel, label, bonus, sign) {
      return linkGenerator(bonus.trim(), true, label+' '+bonus, label, 'aon');
    });

    $(this).html(textHTML);
//    console.log('main')
//    for (i = 0; i < $(this)[0].children[5].children.length; i++) {
//      console.log($(this)[0].children[5].children[i])
//      if ($(this)[0].children[5].children[i].className == 'talespireLink') {
//        console.log('found one!')
//        console.log($(this)[0].children[5].children[i].value)
//        const buttonValue = $(this)[0].children[5].children[i].value
//        $(this)[0].children[5].children[i].addEventListener('click', function(){Roll(buttonValue, 'From AoN'); });
//      }
//    }
    $(this).addClass('TSExtensionAttacksModified');

  });

  const a = document.getElementsByClassName('talespireLink')
  for (i=0; i < a.length; i++) {
    if (a[i].getAttribute('listener') !== 'true') {
      console.log(a[i]);
      console.log(a[i].innerHTML);
      console.log(a[i].value);
      const wonderersButton = a[i]
//      a[i].addEventListener('click', function(){console.log('clicked')})
      wonderersButton.addEventListener('click', function(){
        console.log('clicked');
        Roll(wonderersButton.value, 'From AoN')})
      wonderersButton.setAttribute('listener', 'true')
    }
  }
}