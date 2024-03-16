//INSPIRO Global var
var INSPIRO = {},
  $ = jQuery.noConflict();
(function($) {
  "use strict";
  // Predefined Global Variables
  var $window = $(window),
    $theme_color = "#2250fc",
    //Main
    $body = $("body"),
    $bodyInner = $(".body-inner"),
    $section = $("section"),
    //Header
    $topbar = $("#topbar"),
    $header = $("#header"),
    $headerCurrentClasses = $header.attr("class"),
    //Logo
    headerLogo = $("#logo"),
    //Menu
    $mainMenu = $("#mainMenu"),
    $mainMenuTriggerBtn = $("#mainMenu-trigger a, #mainMenu-trigger button"),
    $pageMenu = $(".page-menu"),
    //Slider
    $slider = $("#slider"),
    $inspiroSlider = $(".inspiro-slider"),
    $carousel = $(".carousel"),
    /*Grid Layout*/
    $gridLayout = $(".grid-layout"),
    $gridFilter = $(".grid-filter"),
    windowWidth = $window.width();
  if ($gridFilter.length > 0) {
    $gridFilter = $gridFilter;
  } else {
    $gridFilter = $(".page-grid-filter");
  }
  //Check if header exist
  if ($header.length > 0) {
    var $headerOffsetTop = $header.offset().top;
  }
  var Events = {
    browser: {
      isMobile: function() {
        if (
          navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
  };
  //Settings
  var Settings = {
    isMobile: Events.browser.isMobile,
    submenuLight: $header.hasClass("submenu-light") == true ? true : false,
    menuIsOpen: false,
    menuOverlayOpened: false
  };
  //Window breakpoints
  $(window).breakpoints({
    breakpoints: [
      {
        name: "xs",
        width: 0
      },
      {
        name: "sm",
        width: 576
      },
      {
        name: "md",
        width: 768
      },
      {
        name: "lg",
        width: 1025
      },
      {
        name: "xl",
        width: 1200
      }
    ]
  });
  var currentBreakpoint = $(window).breakpoints("getBreakpoint");
  $body.addClass("breakpoint-" + currentBreakpoint);
  $(window).bind("breakpoint-change", function(breakpoint) {
    $body.removeClass("breakpoint-" + breakpoint.from);
    $body.addClass("breakpoint-" + breakpoint.to);
  });
  $(window).breakpoints("greaterEqualTo", "lg", function() {
    $body.addClass("b--desktop");
    $body.removeClass("b--responsive");
  });
  $(window).breakpoints("lessThan", "lg", function() {
    $body.removeClass("b--desktop");
    $body.addClass("b--responsive");
  });
  INSPIRO.core = {
    functions: function() {
      INSPIRO.core.scrollTop();
      INSPIRO.core.rtlStatus();
      INSPIRO.core.rtlStatusActivate();
      INSPIRO.core.equalize();
    },
    scrollTop: function() {
      var $scrollTop = $("#scrollTop");
      if ($scrollTop.length > 0) {
        var scrollOffset = $body.attr("data-offset") || 400;
        if ($window.scrollTop() > scrollOffset) {
          if ($body.hasClass("frame")) {
            $scrollTop.css({
              bottom: "46px",
              opacity: 1,
              "z-index": 199
            });
          } else {
            $scrollTop.css({
              bottom: "26px",
              opacity: 1,
              "z-index": 199
            });
          }
        } else {
          $scrollTop.css({
            bottom: "16px",
            opacity: 0
          });
        }
        $scrollTop.off("click").on("click", function() {
          $("body,html")
            .stop(true)
            .animate(
              {
                scrollTop: 0
              },
              1000,
              "easeInOutExpo"
            );
          return false;
        });
      }
    },
    rtlStatus: function() {
      var $rtlStatusCheck = $("html").attr("dir");
      if ($rtlStatusCheck == "rtl") {
        return true;
      }
      return false;
    },
    rtlStatusActivate: function() {
      if (INSPIRO.core.rtlStatus() == true) {
        $("head").append(
          '<link rel="stylesheet" type="text/css" href="css/rtl.css">'
        );
      }
    },
    equalize: function() {
      var $equalize = $(".equalize");
      if ($equalize.length > 0) {
        $equalize.each(function() {
          var elem = $(this),
            selectorItem =
              elem.find(elem.attr("data-equalize-item")) || "> div",
            maxHeight = 0;
          selectorItem.each(function() {
            if ($(this).outerHeight(true) > maxHeight) {
              maxHeight = $(this).outerHeight(true);
            }
          });
          selectorItem.height(maxHeight);
        });
      }
    },
  };
  INSPIRO.header = {
    functions: function() {
INSPIRO.header.logoStatus();
      INSPIRO.header.stickyHeader();
      INSPIRO.header.topBar();
INSPIRO.header.search();
      INSPIRO.header.mainMenu();
      INSPIRO.header.mainMenuOverlay();
      INSPIRO.header.pageMenu();
      INSPIRO.header.sidebarOverlay();
      INSPIRO.header.dotsMenu();
      INSPIRO.header.onepageMenu();
    },
logoStatus: function(status) {
      var headerLogoDefault = headerLogo.find($(".logo-default")),
        headerLogoDark = headerLogo.find($(".logo-dark")),
        headerLogoFixed = headerLogo.find(".logo-fixed"),
        headerLogoResponsive = headerLogo.find(".logo-responsive");

      if ($header.hasClass("header-sticky") && headerLogoFixed.length > 0) {
        headerLogoDefault.css("display", "none");
        headerLogoDark.css("display", "none");
        headerLogoResponsive.css("display", "none");
        headerLogoFixed.css("display", "block");
      } else {
        headerLogoDefault.removeAttr("style");
        headerLogoDark.removeAttr("style");
        headerLogoResponsive.removeAttr("style");
        headerLogoFixed.removeAttr("style");
      }
      $(window).breakpoints("lessThan", "lg", function() {
        if (headerLogoResponsive.length > 0) {
          headerLogoDefault.css("display", "none");
          headerLogoDark.css("display", "none");
          headerLogoFixed.css("display", "none");
          headerLogoResponsive.css("display", "block");
        }
      });
    },
    stickyHeader: function() {
      var elem = $(this),
        shrinkHeader = elem.attr("data-shrink") || 0,
        shrinkHeaderActive = elem.attr("data-sticky-active") || 200,
        scrollOnTop = $window.scrollTop(),
        darkClassRemoved;

      if ($header.hasClass("header-modern")) {
        shrinkHeader = 300;
      }

      $(window).breakpoints("greaterEqualTo", "lg", function() {
        if (!$header.is(".header-disable-fixed")) {
          if (scrollOnTop > $headerOffsetTop + shrinkHeader) {
            $header.addClass("header-sticky");
            if (scrollOnTop > $headerOffsetTop + shrinkHeaderActive) {
              $header.addClass("sticky-active");
              if (Settings.submenuLight) {
                $header.removeClass("dark");
                darkClassRemoved = true;
              }
              INSPIRO.header.logoStatus();
            }
          } else {
            $header.removeClass().addClass($headerCurrentClasses);
            INSPIRO.header.logoStatus();
          }
        }
      });

      $(window).breakpoints("lessThan", "lg", function() {
        if ($header.attr("data-responsive-fixed") == "true") {
          if (scrollOnTop > $headerOffsetTop + shrinkHeader) {
            $header.addClass("header-sticky");
            if (scrollOnTop > $headerOffsetTop + shrinkHeaderActive) {
              $header.addClass("sticky-active");
              if (Settings.submenuLight) {
                $header.removeClass("dark");
                darkClassRemoved = true;
              }
              INSPIRO.header.logoStatus();
            }
          } else {
            $header.removeClass().addClass($headerCurrentClasses);
            INSPIRO.header.logoStatus();
          }
        }
      });
    },
    //chkd
    topBar: function() {
      if ($topbar.length > 0) {
        $("#topbar .topbar-dropdown .topbar-form").each(function(
          index,
          element
        ) {
          if (
            $window.width() - ($(element).width() + $(element).offset().left) <
            0
          ) {
            $(element).addClass("dropdown-invert");
          }
        });
      }
    },
search: function() {
      var $search = $("#search");
      if ($search.length > 0) {
        var searchBtn = $("#btn-search"),
          searchBtnClose = $("#btn-search-close"),
          searchInput = $search.find(".form-control");

        function openSearch() {
          $body.addClass("search-open");
          searchInput.focus();
        }

        function closeSearch() {
          $body.removeClass("search-open");
          searchInput.value = "";
        }
        searchBtn.on("click", function() {
          openSearch();
          return false;
        });
        searchBtnClose.on("click", function() {
          closeSearch();
          return false;
        });
        document.addEventListener("keyup", function(ev) {
          if (ev.keyCode == 27) {
            closeSearch();
          }
        });
      }
    },
    mainMenu: function() {
      if ($mainMenu.length > 0) {
        var $menuItemLinks = $(
            "#mainMenu nav > ul > li.dropdown > a, .dropdown-submenu > a, .dropdown-submenu > span, .page-menu nav > ul > li.dropdown > a"
          ),
          $triggerButton = $("#mainMenu-trigger a, #mainMenu-trigger button"),
          darkClassRemoved,
          processing = false,
          triggerEvent;
        $triggerButton.on("click", function(e) {
          var elem = $(this);
          e.preventDefault();
          $(window).breakpoints("lessThan", "lg", function() {
            var openMenu = function() {
              if (!processing) {
                processing = true;
                Settings.menuIsOpen = true;
                if (Settings.submenuLight) {
                  $header.removeClass("dark");
                  darkClassRemoved = true;
                }
                elem.addClass("toggle-active");
                $body.addClass("mainMenu-open");
                INSPIRO.header.logoStatus();
                $mainMenu.animate(
                  {
                    "min-height": $window.height()
                  },
                  {
                    duration: 500,
                    easing: "easeInOutQuart",
                    start: function() {
                      setTimeout(function() {
                        $mainMenu.addClass("menu-animate");
                      }, 300);
                    },
                    complete: function() {
                      processing = false;
                    }
                  }
                );
              }
            };
            var closeMenu = function() {
              if (!processing) {
                processing = true;
                Settings.menuIsOpen = false;
                INSPIRO.header.logoStatus();
                $mainMenu.animate(
                  {
                    "min-height": 0
                  },
                  {
                    start: function() {
                      $mainMenu.removeClass("menu-animate");
                    },
                    done: function() {
                      $body.removeClass("mainMenu-open");
                      elem.removeClass("toggle-active");
                      if (Settings.submenuLight && darkClassRemoved) {
                        $header.addClass("dark");
                      }
                    },
                    duration: 500,
                    easing: "easeInOutQuart",
                    complete: function() {
                      processing = false;
                    }
                  }
                );
              }
            };
            if (!Settings.menuIsOpen) {
              triggerEvent = openMenu();
            } else {
              triggerEvent = closeMenu();
            }
          });
        });
        $menuItemLinks.on("click", function(e) {
          $(this)
            .parent("li")
            .siblings()
            .removeClass("hover-active");
          $(this)
            .parent("li")
            .toggleClass("hover-active");
          e.stopPropagation();
          e.preventDefault();
        });
        $body.on("click", function(e) {
          $mainMenu.find(".hover-active").removeClass("hover-active");
        });
        /*invert menu fix*/
        $(window).breakpoints("greaterEqualTo", "lg", function() {
          var $menuLastItem = $("nav > ul > li:last-child"),
            $menuLastItemUl = $("nav > ul > li:last-child > ul"),
            $menuLastInvert = $menuLastItemUl.width() - $menuLastItem.width(),
            $menuItems = $("nav > ul > li").find(".dropdown-menu");
          $menuItems.css("display", "block");
          $(".dropdown:not(.mega-menu-item) ul ul").each(function(
            index,
            element
          ) {
            if (
              $window.width() -
                ($(element).width() + $(element).offset().left) <
              0
            ) {
              $(element).addClass("menu-invert");
            }
          });
          if (
            $window.width() -
              ($menuLastItemUl.width() + $menuLastItem.offset().left) <
            0
          ) {
            $menuLastItemUl.addClass("menu-last");
          }
          $menuItems.css("display", "");
        });
      }
    },
    mainMenuOverlay: function() {
    },
    /*Page Menu*/
    pageMenu: function() {
      if ($pageMenu.length > 0) {
        $pageMenu.each(function() {
          $(this)
            .find("#pageMenu-trigger")
            .on("click", function() {
              $pageMenu.toggleClass("page-menu-active");
              $pageMenu.toggleClass("items-visible");
            });
        });
      }
    },
    sidebarOverlay: function() {
      var sidebarOverlay = $("#side-panel");
      if (sidebarOverlay.length > 0) {
        sidebarOverlay.css("opacity", 1);
        $("#close-panel").on("click", function() {
          $body.removeClass("side-panel-active");
          $("#side-panel-trigger").removeClass("toggle-active");
        });
      }


      var $sidepanel = $("#sidepanel"),
      $sidepanelTrigger = $(".panel-trigger"),
      sidepanelProcessing = false,
      sidepanelEvent;

    $sidepanelTrigger.on("click", function(e) {
      e.preventDefault();
      var panelOpen = function() {
        if (!sidepanelProcessing) {
          sidepanelProcessing = true;
          Settings.panelIsOpen = true;
          $sidepanel.addClass("panel-open");
          sidepanelProcessing = false;
        }
      };
      var panelClose = function() {
        if (!sidepanelProcessing) {
          sidepanelProcessing = true;
          Settings.panelIsOpen = false;
          $sidepanel.removeClass("panel-open");
          sidepanelProcessing = false;
        }
      };
      if (!Settings.panelIsOpen) {
        sidepanelEvent = panelOpen();
      } else {
        sidepanelEvent = panelClose();
      }
    });


    },
    dotsMenu: function() {
      var $dotsMenu = $("#dotsMenu"),
        $dotsMenuItems = $dotsMenu.find("ul > li > a");
      if ($dotsMenu.length > 0) {
        $dotsMenuItems.on("click", function() {
          $dotsMenuItems.parent("li").removeClass("current");
          $(this)
            .parent("li")
            .addClass("current");
          return false;
        });
        $dotsMenuItems.parents("li").removeClass("current");
        $dotsMenu
          .find('a[href="#' + INSPIRO.header.currentSection() + '"]')
          .parent("li")
          .addClass("current");
      }
    },
    onepageMenu: function() {
      if ($mainMenu.hasClass("menu-one-page")) {
        var $currentMenuItem = "current";
        $(window).on("scroll", function() {
          var $currentSection = INSPIRO.header.currentSection();
          $mainMenu
            .find("nav > ul > li > a")
            .parents("li")
            .removeClass($currentMenuItem);
          $mainMenu
            .find('nav > ul > li > a[href="#' + $currentSection + '"]')
            .parent("li")
            .addClass($currentMenuItem);
        });
      }
    },
    currentSection: function() {
      var elemCurrent = "body";
      $section.each(function() {
        var elem = $(this),
          elemeId = elem.attr("id");
        if (
          elem.offset().top - $window.height() / 3 < $window.scrollTop() &&
          elem.offset().top + elem.height() - $window.height() / 3 >
            $window.scrollTop()
        ) {
          elemCurrent = elemeId;
        }
      });
      return elemCurrent;
    }
  };
  INSPIRO.slider = {
    functions: function() {
      INSPIRO.slider.inspiroSlider();
      INSPIRO.slider.carousel();
    },
    inspiroSlider: function() {
      if ($inspiroSlider.length > 0) {
        //Check if flickity plugin is loaded
        if (typeof $.fn.flickity === "undefined") {
          INSPIRO.elements.notification(
            "Warning",
            "jQuery flickity slider plugin is missing in plugins.js file.",
            "danger"
          );
          return true;
        }
        var defaultAnimation = "fadeInUp";

        function animate_captions($elem) {
          var $captions = $elem;
          $captions.each(function() {
            var $captionElem = $(this),
              animationDuration = "600ms";
            if ($(this).attr("data-animate-duration")) {
              animationDuration = $(this).attr("data-animate-duration") + "ms";
            }
            $captionElem.css({
              opacity: 0
            });
            $(this).css("animation-duration", animationDuration);
          });
          $captions.each(function(index) {
            var $captionElem = $(this),
              captionDelay =
                $captionElem.attr("data-caption-delay") || index * 350 + 1000,
              captionAnimation =
                $captionElem.attr("data-caption-animate") || defaultAnimation;
            var t = setTimeout(function() {
              $captionElem.css({
                opacity: 1
              });
              $captionElem.addClass(captionAnimation);
            }, captionDelay);
          });
        }

        function hide_captions($elem) {
          var $captions = $elem;
          $captions.each(function(caption) {
            var caption = $(this),
              captionAnimation =
                caption.attr("data-caption-animate") || defaultAnimation;
            caption.removeClass(captionAnimation);
            caption.removeAttr("style");
          });
        }

        function start_kenburn(elem) {
          var currentSlide = elem.find(".slide.is-selected"),
            currentSlideKenburns = currentSlide.hasClass("kenburns");
          if (currentSlideKenburns) {
            setTimeout(function() {
              currentSlide.find(".kenburns-bg").addClass("kenburns-bg-animate");
            }, 1500);
          }
        }

        function stop_kenburn(elem) {
          var notCurrentSlide = elem.find(".slide:not(.is-selected)");
          notCurrentSlide
            .find(".kenburns-bg")
            .removeClass("kenburns-bg-animate");
        }

        function slide_dark(elem) {
          var $sliderClassSlide = elem.find(".slide.is-selected");
          if ($sliderClassSlide.hasClass("slide-dark")) {
            $header.removeClass("dark").addClass("dark-removed");
          } else {
            if (
              !$header.hasClass("sticky-active") &&
              $header.hasClass("dark-removed")
            ) {
              $header.addClass("dark").removeClass("dark-removed");
            }
          }
        }

        function sliderHeight(elem, state) {
          var elem,
            headerHeight = $header.outerHeight(),
            topbarHeight = $topbar.outerHeight() || 0,
            windowHeight = $window.height(),
            sliderCurrentHeight = elem.height(),
            screenHeightExtra = headerHeight + topbarHeight,
            $sliderClassSlide = elem.find(".slide"),
            sliderFullscreen = elem.hasClass("slider-fullscreen"),
            screenRatio = elem.hasClass("slider-halfscreen") ? 1 : 1.2,
            transparentHeader = $header.attr("data-transparent"),
            customHeight = elem.attr("data-height"),
            responsiveHeightXs = elem.attr("data-height-xs"),
            containerFullscreen = elem
              .find(".container")
              .first()
              .outerHeight(),
            contentCrop;
          if (containerFullscreen >= windowHeight) {
            contentCrop = true;
            var sliderMinHeight = containerFullscreen;
            elem.css("min-height", sliderMinHeight + 100);
            $sliderClassSlide.css("min-height", sliderMinHeight + 100);
            elem
              .find(".flickity-viewport")
              .css("min-height", sliderMinHeight + 100);
          }
          sliderElementsHeight("null");

          function sliderElementsHeight(height) {
            if (height == "null") {
              elem.css("height", "");
              $sliderClassSlide.css("height", "");
              elem.find(".flickity-viewport").css("height", "");
            } else {
              elem.css("height", height);
              $sliderClassSlide.css("height", height);
              elem.find(".flickity-viewport").css("height", height);
            }
          }
          if (customHeight) {
            $(window).breakpoints("greaterEqualTo", "lg", function() {
              sliderElementsHeight(customHeight + "px");
            });
          }
        }
        $inspiroSlider.each(function() {
          var elem = $(this);
          //Plugin Options
          elem.options = {
            cellSelector: elem.attr("data-item") || false,
            prevNextButtons: elem.data("arrows") == false ? false : true,
            pageDots: elem.data("dots") == false ? false : true,
            fade: elem.data("fade") == true ? true : false,
            draggable: elem.data("drag") == true ? true : false,
            freeScroll: elem.data("free-scroll") == true ? true : false,
            wrapAround: elem.data("loop") == false ? false : true,
            groupCells: elem.data("group-cells") == true ? true : false,
            autoPlay: elem.attr("data-autoplay") || 7000,
            pauseAutoPlayOnHover:
              elem.data("hoverpause") == true ? true : false,
            adaptiveHeight:
              elem.data("adaptive-height") == false ? false : false,
            asNavFor: elem.attr("data-navigation") || false,
            selectedAttraction: elem.attr("data-attraction") || 0.07,
            friction: elem.attr("data-friction") || 0.9,
            initialIndex: elem.attr("data-initial-index") || 0,
            accessibility: elem.data("accessibility") == true ? true : false,
            setGallerySize: elem.data("gallery-size") == false ? false : false,
            resize: elem.data("resize") == false ? false : false,
            cellAlign: elem.attr("data-align") || "left",
            playWholeVideo:
              elem.attr("data-play-whole-video") == false ? false : true
          };
          //Kenburns effect
          elem.find(".slide").each(function() {
            if ($(this).hasClass("kenburns")) {
              var elemChild = $(this),
                elemChildImage = elemChild
                  .css("background-image")
                  .replace(/.*\s?url\([\'\"]?/, "")
                  .replace(/[\'\"]?\).*/, "");

              if (elemChild.attr("data-bg-image")) {
                elemChildImage = elemChild.attr("data-bg-image");
              }
              elemChild.prepend(
                '<div class="kenburns-bg" style="background-image:url(' +
                  elemChildImage +
                  ')"></div>'
              );
            }
          });
          elem.find(".slide video").each(function() {
            this.pause();
          });
          $(window).breakpoints("lessThan", "lg", function() {
            elem.options.draggable = true;
          });


          if (elem.find(".slide").length <= 1) {
            elem.options.prevNextButtons = false;
            elem.options.pageDots = false;
            elem.options.autoPlay = false;
            elem.options.draggable = false;
          }

        
          if (
            !$.isNumeric(elem.options.autoPlay) &&
            elem.options.autoPlay != false
          ) {
            elem.options.autoPlay = Number(7000);
          }

          var inspiroSliderData = elem.flickity({
            cellSelector: elem.options.cellSelector,
            prevNextButtons: elem.options.prevNextButtons,
            pageDots: elem.options.pageDots,
            fade: elem.options.fade,
            draggable: elem.options.draggable,
            freeScroll: elem.options.freeScroll,
            wrapAround: elem.options.wrapAround,
            groupCells: elem.options.groupCells,
            autoPlay: Number(elem.options.autoPlay),
            pauseAutoPlayOnHover: elem.options.pauseAutoPlayOnHover,
            adaptiveHeight: elem.options.adaptiveHeight,
            asNavFor: elem.options.asNavFor,
            selectedAttraction: Number(elem.options.selectedAttraction),
            friction: elem.options.friction,
            initialIndex: elem.options.initialIndex,
            accessibility: elem.options.accessibility,
            setGallerySize: elem.options.setGallerySize,
            resize: elem.options.resize,
            cellAlign: elem.options.cellAlign,
            rightToLeft: INSPIRO.core.rtlStatus(),
            on: {
              ready: function(index) {
                var $captions = elem.find(
                  ".slide.is-selected .slide-captions > *"
                );
                sliderHeight(elem);
                start_kenburn(elem);
                animate_captions($captions);
                setTimeout(function() {
                  elem.find(".slide video").each(function(i, video) {
                    video.pause();
                    video.currentTime = 0;
                  });
                }, 700);
              }
            }
          });

          var flkty = inspiroSliderData.data("flickity");

          inspiroSliderData.on("change.flickity", function() {
            var $captions = elem.find(".slide.is-selected .slide-captions > *");
            hide_captions($captions);
            setTimeout(function() {
              stop_kenburn(elem);
            }, 500);
            slide_dark(elem);
            start_kenburn(elem);
            animate_captions($captions);
            elem.find(".slide video").each(function(i, video) {
              video.currentTime = 0;
            });
          });

          inspiroSliderData.on("select.flickity", function() {
            INSPIRO.elements.backgroundImage();
            var $captions = elem.find(".slide.is-selected .slide-captions > *");
            sliderHeight(elem);
            start_kenburn(elem);
            animate_captions($captions);
            var video = flkty.selectedElement.querySelector("video");
            if (video) {
              video.play();
              flkty.options.autoPlay = Number(video.duration * 1000);
            } else {
              flkty.options.autoPlay = Number(elem.options.autoPlay);
            }
          });
          inspiroSliderData.on("dragStart.flickity", function() {
            var $captions = elem.find(
              ".slide:not(.is-selected) .slide-captions > *"
            );
            hide_captions($captions);
          });
          $(window).resize(function() {
            sliderHeight(elem);
            elem.flickity("reposition");
          });
        });
      }
    },
    carouselAjax: function() {
      //Check if flickity plugin is loaded
      if (typeof $.fn.flickity === "undefined") {
        INSPIRO.elements.notification(
          "Warning",
          "jQuery flickity plugin is missing in plugins.js file.",
          "danger"
        );
        return true;
      }
      //Plugin Options
      var elem = $(".carousel");
      //Initializing plugin and passing the options

      var $carouselAjax = $(elem).imagesLoaded(function() {
        // init Isotope after all images have loaded
        $carouselAjax.flickity({
          adaptiveHeight: false,
          wrapAround: true,
          cellAlign: "left",
          resize: true
        });
        elem.addClass("carousel-loaded");
      });
    },
    carousel: function(elem) {
      if (elem) {
        $carousel = elem;
      }

      if ($carousel.length > 0) {
        //Check if flickity plugin is loaded
        if (typeof $.fn.flickity === "undefined") {
          INSPIRO.elements.notification(
            "Warning",
            "jQuery flickity plugin is missing in plugins.js file.",
            "danger"
          );
          return true;
        }
        $carousel.each(function() {
          var elem = $(this);
          //Plugin Options
          elem.options = {
            containerWidth: elem.width(),
            items: elem.attr("data-items") || 4,
            itemsLg: elem.attr("data-items-lg"),
            itemsMd: elem.attr("data-items-md"),
            itemsSm: elem.attr("data-items-sm"),
            itemsXs: elem.attr("data-items-xs"),
            margin: elem.attr("data-margin") || 10,
            cellSelector: elem.attr("data-item") || false,
            prevNextButtons: elem.data("arrows") == false ? false : true,
            pageDots: elem.data("dots") == false ? false : true,
            fade: elem.data("fade") == true ? true : false,
            draggable: elem.data("drag") == false ? false : true,
            freeScroll: elem.data("free-scroll") == true ? true : false,
            wrapAround: elem.data("loop") == false ? false : true,
            groupCells: elem.data("group-cells") == true ? true : false,
            autoPlay: elem.attr("data-autoplay") || 5000,
            pauseAutoPlayOnHover:
              elem.data("hover-pause") == false ? false : true,
            asNavFor: elem.attr("data-navigation") || false,
            lazyLoad: elem.data("lazy-load") == true ? true : false,
            initialIndex: elem.attr("data-initial-index") || 0,
            accessibility: elem.data("accessibility") == true ? true : false,
            adaptiveHeight: elem.data("adaptive-height") == true ? true : false,
            autoWidth: elem.data("auto-width") == true ? true : false,
            setGallerySize: elem.data("gallery-size") == false ? false : true,
            resize: elem.data("resize") == false ? false : true,
            cellAlign: elem.attr("data-align") || "left",
            rightToLeft: INSPIRO.core.rtlStatus()
          };

          //Calculate min/max on responsive breakpoints
          elem.options.itemsLg =
            elem.options.itemsLg ||
            Math.min(Number(elem.options.items), Number(4));
          elem.options.itemsMd =
            elem.options.itemsMd ||
            Math.min(Number(elem.options.itemsLg), Number(3));
          elem.options.itemsSm =
            elem.options.itemsSm ||
            Math.min(Number(elem.options.itemsMd), Number(2));
          elem.options.itemsXs =
            elem.options.itemsXs ||
            Math.min(Number(elem.options.itemsSm), Number(1));
          var setResponsiveColumns;

          function getCarouselColumns() {
            switch ($(window).breakpoints("getBreakpoint")) {
              case "xs":
                setResponsiveColumns = Number(elem.options.itemsXs);
                break;
              case "sm":
                setResponsiveColumns = Number(elem.options.itemsSm);
                break;
              case "md":
                setResponsiveColumns = Number(elem.options.itemsMd);
                break;
              case "lg":
                setResponsiveColumns = Number(elem.options.itemsLg);
                break;
              case "xl":
                setResponsiveColumns = Number(elem.options.items);
                break;
            }
          }
          getCarouselColumns();
          var itemWidth;
          elem.find("> *").wrap('<div class="polo-carousel-item">');
          if (elem.hasClass("custom-height")) {
            elem.options.setGallerySize = false;
            INSPIRO.core.customHeight(elem);
            INSPIRO.core.customHeight(elem.find(".polo-carousel-item"));
            var carouselCustomHeightStatus = true;
          }
          if (Number(elem.options.items) !== 1) {
            if (elem.options.autoWidth || carouselCustomHeightStatus) {
              elem.find(".polo-carousel-item").css({
                "padding-right": elem.options.margin + "px"
              });
            } else {
              itemWidth =
                (elem.options.containerWidth + Number(elem.options.margin)) /
                setResponsiveColumns;
              elem.find(".polo-carousel-item").css({
                width: itemWidth,
                "padding-right": elem.options.margin + "px"
              });
            }
          } else {
            elem.find(".polo-carousel-item").css({
              width: "100%",
              "padding-right": "0 !important;"
            });
          }
          if (elem.options.autoWidth || carouselCustomHeightStatus) {
            elem.options.cellAlign = "center";
          }

          if (elem.options.autoPlay == "false") {
            elem.options.autoPlay = false;
          }
          //Initializing plugin and passing the options
          var $carouselElem = $(elem);
          //   .imagesLoaded(function() {
          // init Isotope after all images have loaded
          $carouselElem.flickity({
            cellSelector: elem.options.cellSelector,
            prevNextButtons: elem.options.prevNextButtons,
            pageDots: elem.options.pageDots,
            fade: elem.options.fade,
            draggable: elem.options.draggable,
            freeScroll: elem.options.freeScroll,
            wrapAround: elem.options.wrapAround,
            groupCells: elem.options.groupCells,
            autoPlay: elem.options.autoPlay,
            pauseAutoPlayOnHover: elem.options.pauseAutoPlayOnHover,
            adaptiveHeight: elem.options.adaptiveHeight,
            asNavFor: elem.options.asNavFor,
            initialIndex: elem.options.initialIndex,
            accessibility: elem.options.accessibility,
            setGallerySize: elem.options.setGallerySize,
            resize: elem.options.resize,
            cellAlign: elem.options.cellAlign,
            rightToLeft: elem.options.rightToLeft,
            contain: true
          });
          elem.addClass("carousel-loaded");
          //  });
          if (elem.hasClass("custom-height")) {
            INSPIRO.core.customHeight(elem);
          }
          if (Number(elem.options.items) !== 1) {
            $(window).on("resize", function() {
              setTimeout(function() {
                getCarouselColumns();
                itemWidth =
                  (elem.width() + Number(elem.options.margin)) /
                  setResponsiveColumns;
                if (elem.options.autoWidth || carouselCustomHeightStatus) {
                  elem.find(".polo-carousel-item").css({
                    "padding-right": elem.options.margin + "px"
                  });
                } else {
                  if (!elem.hasClass("custom-height")) {
                    elem.find(".polo-carousel-item").css({
                      width: itemWidth,
                      "padding-right": elem.options.margin + "px"
                    });
                  } else {
                    INSPIRO.core.customHeight(elem.find(".polo-carousel-item"));
                    elem.find(".polo-carousel-item").css({
                      width: itemWidth,
                      "padding-right": elem.options.margin + "px"
                    });
                  }
                }
                elem.find(".flickity-slider").css({
                  "margin-right":
                    -elem.options.margin / setResponsiveColumns + "px"
                });
                elem.flickity("reposition");
              }, 100);
            });
          }
        });
      }
    }
  };
  INSPIRO.elements = {
    functions: function() {
      INSPIRO.elements.buttons();
      INSPIRO.elements.accordion();
      INSPIRO.elements.animations();
      INSPIRO.elements.backgroundImage();
      INSPIRO.elements.counters();
    },
    buttons: function() {
      //Button slide width
      if ($(".btn-slide[data-width]")) {
        $(".btn.btn-slide[data-width]").each(function() {
          var elem = $(this),
            elemWidth = elem.attr("data-width"),
            elemDefaultWidth;
          switch (true) {
            case elem.hasClass("btn-lg"):
              elemDefaultWidth = "60";
              break;
            case elem.hasClass("btn-sm"):
              elemDefaultWidth = "36";
              break;
            case elem.hasClass("btn-xs"):
              elemDefaultWidth = "28";
              break;
            default:
              elemDefaultWidth = "48";
              break;
          }
          elem.hover(
            function() {
              $(this).css("width", elemWidth + "px");
            },
            function() {
              $(this).css("width", elemDefaultWidth + "px");
            }
          );
        });
      }
    },
    accordion: function() {
      var accordionType = "accordion",
        toogleType = "toggle",
        accordionItem = "ac-item",
        itemActive = "ac-active",
        itemTitle = "ac-title",
        itemContent = "ac-content",
        $accs = $("." + accordionItem);
      $accs.length &&
        ($accs.each(function() {
          var $item = $(this);
          $item.hasClass(itemActive)
            ? $item.addClass(itemActive)
            : $item.find("." + itemContent).hide();
        }),
        $("." + itemTitle).on("click", function(e) {
          var $link = $(this),
            $item = $link.parents("." + accordionItem),
            $acc = $item.parents("." + accordionType);
          $item.hasClass(itemActive)
            ? $acc.hasClass(toogleType)
              ? ($item.removeClass(itemActive),
                $link.next("." + itemContent).slideUp())
              : ($acc.find("." + accordionItem).removeClass(itemActive),
                $acc.find("." + itemContent).slideUp())
            : ($acc.hasClass(toogleType) ||
                ($acc.find("." + accordionItem).removeClass(itemActive),
                $acc.find("." + itemContent).slideUp("fast")),
              $item.addClass(itemActive),
              $link.next("." + itemContent).slideToggle("fast")),
            e.preventDefault();
          return false;
        }));
    },
    animations: function() {
      var $animate = $("[data-animate]");
      if ($animate.length > 0) {
        //Check if jQuery Waypoint plugin is loaded
        if (typeof Waypoint === "undefined") {
          INSPIRO.elements.notification(
            "Warning",
            "jQuery Waypoint plugin is missing in plugins.js file.",
            "danger"
          );
          return true;
        }
        $animate.each(function() {
          var elem = $(this);
          elem.addClass("animated");
          //Plugin Options
          elem.options = {
            animation: elem.attr("data-animate") || "fadeIn",
            delay: elem.attr("data-animate-delay") || 200,
            direction: ~elem.attr("data-animate").indexOf("Out")
              ? "back"
              : "forward",
            offsetX: elem.attr("data-animate-offsetX") || 0,
            offsetY: elem.attr("data-animate-offsetY") || -100
          };
          //Initializing jQuery Waypoint plugin and passing the options from data animations attributes
          if (elem.options.direction == "forward") {
            new Waypoint({
              element: elem,
              handler: function() {
                var t = setTimeout(function() {
                  elem.addClass(elem.options.animation + " visible");
                }, elem.options.delay);
                this.destroy();
              },
              offset: "100%"
            });
          } else {
            elem.addClass("visible");
            elem.on("click", function() {
              elem.addClass(elem.options.animation);
              return false;
            });
          }
          //Demo play
          if (elem.parents(".demo-play-animations").length) {
            elem.on("click", function() {
              elem.removeClass(elem.options.animation);
              var t = setTimeout(function() {
                elem.addClass(elem.options.animation);
              }, 50);
              return false;
            });
          }
        });
      }
    },
    backgroundImage: function() {
      var $backgroundImage = $("[data-bg-image]");
      if ($backgroundImage.length > 0) {
        $backgroundImage.each(function() {
          var $elem = $(this),
            elemImageSrc = $elem.attr("data-bg-image");
          $elem.attr("data-lazy-background", elemImageSrc);
          $elem.lazy({
            attribute: "data-lazy-background",
            afterLoad: function(element) {
              $elem.addClass("bg-loaded");
            }
          });
        });
      }
    },
    counters: function() {
      var $counter = $(".counter");
      if ($counter.length > 0) {
        //Check if countTo plugin is loaded
        if (typeof $.fn.countTo === "undefined") {
          INSPIRO.elements.notification(
            "Warning",
            "jQuery countTo plugin is missing in plugins.js file.",
            "danger"
          );
          return true;
        }
        //Initializing countTo plugin
        $counter.each(function() {
          var elem = $(this),
            prefix = elem.find("span").attr("data-prefix") || "",
            suffix = elem.find("span").attr("data-suffix") || "";

          new Waypoint({
            element: elem,
            handler: function() {
              elem.find("span").countTo({
                refreshInterval: 2,
                formatter: function(value, options) {
                  return (
                    String(prefix) +
                    value.toFixed(options.decimals) +
                    String(suffix)
                  );
                }
              });
              this.destroy();
            },
            offset: "104%"
          });
        });
      }
    },
  };
  INSPIRO.widgets = {
    functions: function() {
      INSPIRO.widgets.flickr();
    },
    flickr: function() {
      var $flickr_widget = $(".flickr-widget");
      if ($flickr_widget.length > 0) {
        //Check if jflickrfeed plugin is loaded
        if (typeof $.fn.jflickrfeed === "undefined") {
          INSPIRO.elements.notification(
            "Warning",
            "jQuery jflickrfeed plugin is missing in plugins.js file.",
            "danger"
          );
          return true;
        }
        $flickr_widget.each(function() {
          var elem = $(this);
          elem.options = {
            id: elem.attr("data-flickr-id") || "52617155@N08",
            limit: elem.attr("data-flickr-images") || "9",
            itemTemplate:
              '<a href="{{image}}" title="{{title}}"><img src="{{image_s}}" alt="{{title}}" loading="lazy" /></a>'
          };
          //Initializing jflickrfeed plugin and passing the options
          $flickr_widget.jflickrfeed(
            {
              limit: elem.options.limit,
              qstrings: {
                id: elem.options.id
              },
              itemTemplate: elem.options.itemTemplate
            },
            function() {
              var t = setTimeout(function() {
                elem.addClass("flickr-widget-loaded");
              }, 1000);
              elem.magnificPopup({
                delegate: "a",
                type: "image",
                gallery: {
                  enabled: true
                }
              });

              if (elem.parents(".grid-layout").length > 0) {
                elem.parents(".grid-layout").isotope("layout");
              }
            }
          );
        });
      }
    },
  };
  //Load Functions on document ready
  $(document).ready(function() {
    INSPIRO.core.functions();
    INSPIRO.header.functions();
    INSPIRO.slider.functions();
    INSPIRO.widgets.functions();
    INSPIRO.elements.functions();
  });
  //Recall Functions on window scroll
  $window.on("scroll", function() {
    INSPIRO.header.stickyHeader();
    INSPIRO.core.scrollTop();
    INSPIRO.header.dotsMenu();
  });
  //Recall Functions on window resize
  $window.on("resize", function() {
    INSPIRO.header.logoStatus();
    INSPIRO.header.stickyHeader();
  });
})(jQuery);
