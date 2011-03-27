/*!
 * liScroll 1.1 updated by @davetayls
 * 
 * Examples and documentation at:
 * http://the-taylors.org/blog/2010/03/15/liscroll-jquery-news-ticker-customisation-with-next-previous-play/
 * http://www.gcmingati.net/wordpress/wp-content/lab/jquery/newsticker/jq-liscroll/scrollanimate.html
 * 
 * 2007-2009 Gian Carlo Mingati
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 */
(function($){	

	jQuery.fn.liScroll = function(settings) {
	    
		settings = $.extend({
	        travelocity: 0.05,
	        showControls: false
	    }, settings);
		
	    return this.each(function() {
	        var strip = this,
	        	$strip = $(strip);
	
	        $strip.addClass("liScroll-ticker")
	        $stripItems = $strip.find("li");
			
	        var stripWidth = 0,
				$mask = $strip.wrap("<div class='liScroll-mask'></div>"),
				$tickercontainer = $strip.parent().wrap("<div class='liScroll-container'></div>").parent(),
				paused = false,
				containerWidth = $strip.parent().parent().width(); //a.k.a. 'mask' width
	
	        var currentItemIndex = function() {
	            var index = 0,
					currentLeft = parseInt($strip.css("left")),
					accumulatedWidth = 0;
					
	            if (currentLeft > 0) {
	                return 0;
	            } else {
	                $strip.find("li").each(function(i) {
	                    if (currentLeft == (0 - accumulatedWidth)) {
	                        index = i;
	                        return false;
	                    }
	                    accumulatedWidth += $(this).width();
	                    if (currentLeft > (0 - accumulatedWidth)) {
	                        index = i;
	                        return false;
	                    }
	                    return true;
	                });
	            }
	            return index;
	        };
	        var next = function() {
	            pause();
	            var index = currentItemIndex();
	            if (index >= $stripItems.length - 1) {
	                $strip.css("left", "0px");
	            } else {
	                var $itm = $stripItems.eq(index + 1);
	                $strip.css("left", (0 - $itm.position().left) + "px");
	            }
	        };
	        var pause = function() {
	            $strip.stop();
	            $tickercontainer
	                .removeClass("liScroll-playing")
	                .addClass("liScroll-paused");
	            paused = true;
	        };
	        var previous = function() {
	            pause();
	            var index = currentItemIndex(), 
					$itm = null;
					
	            if (index == 0) {
	                $itm = $stripItems.eq($stripItems.length - 1);
	            } else {
	                $itm = $stripItems.eq(index - 1);
	            }
	            $strip.css("left", (0 - $itm.position().left) + "px");
	        };
	        var play = function() {
	            var offset = $strip.offset(),
					residualSpace = offset.left + stripWidth,
					residualTime = residualSpace / settings.travelocity;
					
	            scrollnews(residualSpace, residualTime);
	            $tickercontainer
	                .addClass("liScroll-playing")
	                .removeClass("liScroll-paused");
	            paused = false;
	        };
	        var togglePlay = function() {
	            if (paused) {
	                play();
	            } else {
	                pause();
	            }
	        };
	
	        if (settings.showControls) {
	            var $prev = $('<div class="liScroll-prev">&lt;</div>')
	                .appendTo($tickercontainer)
	                .click(function() { previous.call(strip); });
	            var $pause = $('<div class="liScroll-play">Pause</div>')
	                .appendTo($tickercontainer)
	                .click(function() { togglePlay.call(strip); });
	            var $next = $('<div class="liScroll-next">&gt;</div>')
	                .appendTo($tickercontainer)
	                .click(function() { next.call(strip); });
	        }
			
			// calculate full width
			$strip.width(10000); // temporary width to prevent inline elements wrapping to initial width of ul
	        $stripItems.each(function(i) {
	            stripWidth += $(this).outerWidth();
	        });
	        $strip.width(stripWidth);
	
	        var totalTravel = stripWidth + containerWidth,
				defTiming = totalTravel / settings.travelocity; // thanks to Scott Waye		
	
	        function scrollnews(spazio, tempo) {
	            $strip.animate(
					{ left: '-=' + spazio }, 
					tempo, 
					"linear", 
					function() { 
						$strip.css("left", containerWidth); 
						scrollnews(totalTravel, defTiming); 
					}
				);
	        }
	        scrollnews(totalTravel, defTiming);
	        $tickercontainer.addClass("liScroll-playing");
	        $strip.hover(pause, play);
	    });
	};

})(jQuery);
