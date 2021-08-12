// $('.sample').click(function() {
//     console.log("test");
//     $(this).addClass('addColor')
//       .siblings().removeClass('addColor')
//   });

// $('.box').hover(function(){
//     $(this).css("background", "blue");
//     $(this).find("a").attr("href", "www.google.com");
// });

import { TriggerColChange } from "./main";

var addclass = 'color';
var $cols = $('.divs').click(function(e) {
    $cols.removeClass(addclass);
    $(this).addClass(addclass);
});

function ShowHideDiv(num) {
    TriggerColChange();
    console.log('num pressed: ' + num);
}
