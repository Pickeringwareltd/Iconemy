/*
Theme Name: 
Version: 
Author: 
Author URI: 
Description: 
*/
/*	IE 10 Fix*/

(function ($) {
	'use strict';
	
	jQuery(document).ready(function () {

        //Sticky menu add class
        $(window).scroll(function() {    
            var scroll = $(window).scrollTop();

            if (scroll >= 160) {
                $(".header").addClass("sticky");
            } else {
                $(".header").removeClass("sticky");
            }
        });



        //Smooth Scroll To Anchor
        $(document).on('click', 'a[href^="#"]', function (event) {
            var top;
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 100
            }, 1000);
            event.preventDefault();
        });



        //Active Menu Item on Page Scroll            
        var sections = $('section')
          , nav = $('header')
          , nav_height = nav.outerHeight();
         
        $(window).on('scroll', function () {
          var cur_pos = $(this).scrollTop();
         
          sections.each(function() {
            var top = $(this).offset().top - nav_height,
                bottom = top + $(this).outerHeight();
         
            if (cur_pos >= top && cur_pos <= bottom) {
              nav.find('a').removeClass('active');
              sections.removeClass('active');
         
              $(this).addClass('active');
              nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
            }
          });
        });



		    // Slider Carousel
		    $('.slider_carousel').owlCarousel({
            items: 1,
            loop: true,
            center: true,
            margin: 0,
            autoplay: true,
            autoplayTimeout: 9000,
            responsiveClass: true,
            dots: true,
            nav: true,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            responsive: {
                0: {
                    items: 1,
                    nav: false
                },
                600: {
                    items: 1
                },
                1000: {
                    items: 1
                }
            }

        })
        

		    // Testimonial Carousel
		    $('.testimonial_carousel').owlCarousel({
            items: 1,
            loop: true,
            margin: 0,
            autoplay: false,
            dots: true,
            nav: false,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            center: true,
            responsiveClass: true,
        })


        // Popup Video
        $('.fancybox-media').fancybox({
          openEffect  : 'none',
          closeEffect : 'none',
          helpers : {
            media : {}
          }
        });
        
        var $portfolio;
        $portfolio = $('.masonry-items');
        $portfolio.imagesLoaded(function () {
            $portfolio.isotope({
                itemSelector: 'li',
                layoutMode: 'masonry'
            });
        });

        var $portfolio_selectors;
        $portfolio_selectors = $('.portfolio-filter > li');
        $portfolio_selectors.on('click', function () {
            $portfolio_selectors.removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $portfolio.isotope({filter: selector});
            return false;
        });

 	});
	
})(jQuery);
