---
layout: null
---

var BeautifulJekyllJS = {

  bigImgEl : null,
  numImgs : null,

  init : function() {
    checkMode();

    setTimeout(BeautifulJekyllJS.initNavbar, 10);

    // Shorten the navbar after scrolling a little bit down
    $(window).scroll(function() {
        if ($(".navbar").offset().top > 50) {
            $(".navbar").addClass("top-nav-short");
        } else {
            $(".navbar").removeClass("top-nav-short");
        }
    });

    // On mobile, hide the avatar when expanding the navbar menu
    $('#main-navbar').on('show.bs.collapse', function () {
      $(".navbar").addClass("top-nav-expanded");
    });
    $('#main-navbar').on('hidden.bs.collapse', function () {
      $(".navbar").removeClass("top-nav-expanded");
    });

    // show the big header image
    BeautifulJekyllJS.initImgs();

    BeautifulJekyllJS.initSearch();
  },

  initNavbar : function() {
    // Set the navbar-dark/light class based on its background color
    const rgb = $('.navbar').css("background-color").replace(/[^\d,]/g,'').split(",");
    const brightness = Math.round(( // http://www.w3.org/TR/AERT#color-contrast
      parseInt(rgb[0]) * 299 +
      parseInt(rgb[1]) * 587 +
      parseInt(rgb[2]) * 114
    ) / 1000);
    if (brightness <= 125) {
      $(".navbar").removeClass("navbar-light").addClass("navbar-dark");
    } else {
      $(".navbar").removeClass("navbar-dark").addClass("navbar-light");
    }
  },

  initImgs : function() {
    // If the page was large images to randomly select from, choose an image
    if ($("#header-big-imgs").length > 0) {
      BeautifulJekyllJS.bigImgEl = $("#header-big-imgs");
      BeautifulJekyllJS.numImgs = BeautifulJekyllJS.bigImgEl.attr("data-num-img");

      // 2fc73a3a967e97599c9763d05e564189
      // set an initial image
      var imgInfo = BeautifulJekyllJS.getImgInfo();
      var src = imgInfo.src;
      var desc = imgInfo.desc;
      BeautifulJekyllJS.setImg(src, desc);

      // For better UX, prefetch the next image so that it will already be loaded when we want to show it
      var getNextImg = function() {
        var imgInfo = BeautifulJekyllJS.getImgInfo();
        var src = imgInfo.src;
        var desc = imgInfo.desc;

        var prefetchImg = new Image();
        prefetchImg.src = src;
        // if I want to do something once the image is ready: `prefetchImg.onload = function(){}`

        setTimeout(function(){
          var img = $("<div></div>").addClass("big-img-transition").css("background-image", 'url(' + src + ')');
          $(".intro-header.big-img").prepend(img);
          setTimeout(function(){ img.css("opacity", "1"); }, 50);

          // after the animation of fading in the new image is done, prefetch the next one
          //img.one("transitioned webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
          setTimeout(function() {
            BeautifulJekyllJS.setImg(src, desc);
            img.remove();
            getNextImg();
          }, 1000);
          //});
        }, 6000);
      };

      // If there are multiple images, cycle through them
      if (BeautifulJekyllJS.numImgs > 1) {
        getNextImg();
      }
    }
  },

  getImgInfo : function() {
    var randNum = Math.floor((Math.random() * BeautifulJekyllJS.numImgs) + 1);
    var src = BeautifulJekyllJS.bigImgEl.attr("data-img-src-" + randNum);
    var desc = BeautifulJekyllJS.bigImgEl.attr("data-img-desc-" + randNum);

    return {
      src : src,
      desc : desc
    }
  },

  setImg : function(src, desc) {
    $(".intro-header.big-img").css("background-image", 'url(' + src + ')');
    if (typeof desc !== typeof undefined && desc !== false) {
      $(".img-desc").text(desc).show();
    } else {
      $(".img-desc").hide();
    }
  },

  initSearch : function() {
    if (!document.getElementById("beautifuljekyll-search-overlay")) {
      return;
    }

    $("#nav-search-link").click(function(e) {
      e.preventDefault();
      $("#beautifuljekyll-search-overlay").show();
      $("#nav-search-input").focus().select();
      $("body").addClass("overflow-hidden");
    });
    $("#nav-search-exit").click(function(e) {
      e.preventDefault();
      $("#beautifuljekyll-search-overlay").hide();
      $("body").removeClass("overflow-hidden");
    });
    $(document).on('keyup', function(e) {
      if (e.key == "Escape") {
        $("#beautifuljekyll-search-overlay").hide();
        $("body").removeClass("overflow-hidden");
      }
    });
  }
};


const toggleBtn = document.getElementById("dark-mode");
let darkMode;

const enableDarkMode = () => {
  var body = document.body;
	body.classList.toggle("bg-dark");
	body.classList.toggle("text-light");
	body.style.transition = "all 1s";

  changeTextColor("white");

  localStorage.setItem("dark-mode", "enabled");
};

const disableDarkMode = () => {
  var body = document.body;
  body.classList.toggle("bg-dark");
	body.classList.toggle("text-light");
  body.style.transition = "all 1s";
  
  changeTextColor("black");
	
  localStorage.setItem("dark-mode", "disabled");
};

if (darkMode === "enabled") {
  enableDarkMode(); // set state of darkMode on page load
}

toggleBtn.addEventListener("click", (e) => {
  switchMode();
});

const switchMode = () =>  {
  darkMode = localStorage.getItem("dark-mode"); // update darkMode when clicked
  if (darkMode === "disabled" || darkMode === null) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
}

const checkMode = () =>  {
  darkMode = localStorage.getItem("dark-mode"); // update darkMode when clicked
  if (darkMode === "enabled") {
    enableDarkMode();
    toggleBtn.checked = !toggleBtn.checked;
  }
}



function changeTextColor(newColor)
{
    var links = document.querySelectorAll(".post-preview a");
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      link.style.color = newColor;  

      link.addEventListener("mouseover", function() {
        this.style.color = "{{ site.hover-col }}";
      });

      link.addEventListener("mouseout", function() {
        this.style.color = newColor;
      });
    }

    var tags = document.querySelectorAll(".blog-tags span");
    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i];
      tag.style.color = newColor;  
    }

    var tags = document.querySelectorAll(".blog-tags a");
    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i];
      tag.style.color = newColor;  

      tag.addEventListener("mouseover", function() {
        this.style.color = "{{ site.hover-col }}";
      });

      tag.addEventListener("mouseout", function() {
        this.style.color = newColor;
      });
    }
    
}

//clear search input
const searchLink = document.getElementById("nav-search-link");
searchLink.addEventListener("click", function() {
  const searchInput = document.getElementById("nav-search-input");
  searchInput.value = "";
});


document.addEventListener('DOMContentLoaded', BeautifulJekyllJS.init);
