var html = $('html');

$(function () {
  darkMode();
  whiteLogo();
  gallery();
  comment();
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