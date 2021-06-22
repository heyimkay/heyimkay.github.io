 ///var theButton = document.getElementById("portfolio");

 ///theButton.onclick = function () {
  ///var password = prompt("Please enter the password.");
  ///   if (password==="pugs!2020"){
  ///       window.open("files/Portfolio2020.pdf","_blank");
  ///   } else{
 ///     password = prompt("oops! wrong password");
  ///   }
 ///}


$(function() {
  $(".translate").click(function() {
   $(".translate").removeClass("on");
  $(this).addClass("on");
  });
});

 /// $(function() {
///    $("#language-toggle").click(function(){  
///        $(".text-on").addClass("text-on").removeClass("text-off");
///        $(".text-off").addClass("text-off").removeClass("text-on");
///    });
///  });

 ///$(window).load(function () {
///     $("#top").slideDown();
/// });

var slideUp = {
    distance: '150%',
    origin: 'bottom',
    opacity: null
};

ScrollReveal().reveal('.intro-about', slideUp);
ScrollReveal().reveal('.forfun',slideUp);
ScrollReveal().reveal('.contact',slideUp);

 //   $(window).load(function () {
//        $("#top").show("slide", {
//            direction: "right"
//        }, 300);
//    });
$(document).ready(function(){
        $('section').css('width',$(window).width());
        $(window).resize(function(){
            $('section').css('width',$(window).width());
            /* and in your CSS: section { overflow: hidden; } */
        });
    });
$(function() {
  $('.japanese').hide();
  $('#jp').click(function() {
    $('.english').hide();
    $('.japanese').show();
  });
  $('#en').click(function() {
    $('.english').show();
    $('.japanese').hide();
  });
});