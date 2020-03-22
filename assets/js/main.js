var html = $('html');

$(function () {
  darkMode();
  whiteLogo();
  carousel();
  gallery();
  comment();
  author();
  loadInstagram();
  offCanvas();
  copyright();
  social();
});

function darkMode() {
  $('.toggle-track').on('click', function() {
    if (html.hasClass('dark-mode')) {
      html.removeClass('dark-mode');
      localStorage.setItem('dark_mode', false);
    } else {
      html.addClass('dark-mode');
      localStorage.setItem('dark_mode', true);
    }
  });
}

function whiteLogo() {
  if (themeOptions.white_logo != '') {
    var whiteImage = '<img class="logo-image white" src="' + themeOptions.white_logo + '">';
    $('.logo').append(whiteImage);
  }
}

function carousel() {
  var carousel = $('.carousel');
  var postImage = carousel.find('.post-image');
  var imageHeight, nav;

  function moveNav() {
    imageHeight = postImage.height();
    if (!nav) {
      nav = carousel.find('.owl-prev, .owl-next');
    }
    nav.css({
      top: (imageHeight / 2) + 'px',
      opacity: 1,
    });
  }

  carousel.owlCarousel({
    dots: false,
    margin: 20,
    nav: true,
    navText: ['<i class="icon icon-chevron-left"></i>', '<i class="icon icon-chevron-right"></i>'],
    onInitialized: function () {
      moveNav();
    },
    onResized: function () {
      moveNav();
    },
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },
    },
  });
}

function gallery() {
  var images = document.querySelectorAll('.kg-gallery-image img');
  images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });
}

function comment() {
  if (themeOptions.disqus_shortname == '') {
    $('.comment-container').remove();
  }
}

function author() {
  $('.author-name').on('click', function () {
    $(this).next('.author-social').toggleClass('enabled');
  });
}

function loadInstagram() {
  'use strict';
  var photos;
  var feed = $('.instagram-feed');
  var storageKey = 'alto_instagram';

  if (themeOptions.instagram_token != '') {
    if ( localStorage.getItem(storageKey) !== null && (Math.floor(Date.now() / 1000) - JSON.parse(localStorage.getItem(storageKey)).timestamp) < 300) {
			photos = JSON.parse(localStorage.getItem(storageKey)).photos;
			outputInstagram(photos, feed);
		} else {
      $.ajax({
        url: 'https://graph.instagram.com/me/media/',
        type: 'GET',
        data: {access_token: themeOptions.instagram_token, limit: 6, fields: 'media_url, permalink, username'},
        success: function (result) {
          photos = result.data;
		    	var cache = {
		    		photos: photos,
		    		timestamp: Math.floor(Date.now() / 1000)
		    	};
		    	localStorage.setItem(storageKey, JSON.stringify(cache));
		    	outputInstagram(photos, feed);
        }
      } );
		}
  } else {
    feed.remove();
  }
}

function outputInstagram(photos, feed) {
  'use strict';
  var photo;
	var output = '';

	for (var index in photos) {
		photo = photos[index];
    output += '<div class="instagram-feed-item u-hover-item u-placeholder square">' +
      '<a href="' + photo.permalink + '" target="_blank" rel="noopener noreferrer">' +
        '<img class="lazyload u-object-fit" data-src="' + photo.media_url + '" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">' +
      '</a>' +
    '</div>';
  }

  if (photos.length > 0) {
    output += '<a class="instagram-feed-username" href="https://www.instagram.com/' + photos[0].username + '" target="_blank" rel="noopener noreferrer"><i class="instagram-feed-icon icon icon-instagram"></i> ' + photos[0].username + '</a>';
  }
  
  feed.html(output);
}

function offCanvas() {
  var burger = jQuery('.burger');
  var canvasClose = jQuery('.canvas-close');

  jQuery('.nav-list').slicknav({
    label: '',
    prependTo: '.mobile-menu',
  });

  burger.on('click', function() {
    html.toggleClass('canvas-opened');
    html.addClass('canvas-visible');
    dimmer('open', 'medium');
  });

  canvasClose.on('click', function() {
    if (html.hasClass('canvas-opened')) {
      html.removeClass('canvas-opened');
      dimmer('close', 'medium');
    }
  });

  jQuery('.dimmer').on('click', function() {
    if (html.hasClass('canvas-opened')) {
      html.removeClass('canvas-opened');
      dimmer('close', 'medium');
    }
  });

  jQuery(document).keyup(function(e) {
    if (e.keyCode == 27 && html.hasClass('canvas-opened')) {
      html.removeClass('canvas-opened');
      dimmer('close', 'medium');
    }
  });
}

function copyright() {
  if (themeOptions.copyright != '') {
    $('.copyright').html(themeOptions.copyright);
  }
}

function social() {
  var data = {
    facebook: {name: 'Facebook', icon: 'facebook'},
    twitter: {name: 'Twitter', icon: 'twitter'},
    instagram: {name: 'Instagram', icon: 'instagram'},
    dribbble: {name: 'Dribbble', icon: 'dribbble'},
    behance: {name: 'Behance', icon: 'behance'},
    github: {name: 'GitHub', icon: 'github-circle'},
    linkedin: {name: 'LinkedIn', icon: 'linkedin'},
    vk: {name: 'VK', icon: 'vk'},
    rss: {name: 'RSS', icon: 'rss'},
  };
  var links = themeOptions.social_links;
  var output = '';

  for (var key in links) {
		if (links[key] != '') {
			output += '<a class="footer-social-item" href="' + links[key] + '" target="_blank"><i class="icon icon-' + data[key]['icon'] + '"></i></a>';
		}
  }
  
  $('.footer-social').html(output);
}

function dimmer(action, speed) {
  'use strict';

  var dimmer = jQuery('.dimmer');

  switch (action) {
    case 'open':
      dimmer.fadeIn(speed);
      break;
    case 'close':
      dimmer.fadeOut(speed);
      break;
  }
}