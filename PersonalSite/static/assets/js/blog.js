window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("topBtn").style.display = "block";
    } else {
        document.getElementById("topBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    $('html,body').animate({ scrollTop : 0}, 1000)
}

$(document).ready(function () {
    $('.scroll-link').on('click', function (event) {
        event.preventDefault();

        var sectionID = $(this).attr("href");
        scrollToID(sectionID);
  });
    function scrollToID(id) {
        var targetOffset = $(id).offset().top;
        $('html,body').animate({ scrollTop: targetOffset }, 1000);
    }
});
$(document).ready(function(){
    commentAdder();
    function commentAdder(){
        $('.addComment').click(function(){
            var html = '<form action="/addComment/" method="POST" id="CommentAddForm">'+
                            '<input type="text id="commentName" class="commentElement" placeholder="Name">'+
                            '<input type="text" class="commentElement commentText" id="commentText" placeholder="Add Comment">'+
                            '<button class="btn btn-outline-primary commentElement" id="commentSubmit">Submit</button>'+
                        '</form>';
            var thisEl = $(this);
            var cT = thisEl.closest(".commentForm");
            $(cT).html(html);

            $('#CommentAddForm').on('submit', function(event){
                event.preventDefault();
                var csrftoken = $.cookie('csrftoken');
                function csrfSafeMethod(method) {
                    // these HTTP methods do not require CSRF protection
                    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                }
                $.ajaxSetup({
                    beforeSend: function(xhr, settings) {
                        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                        }
                    }
                });
                $.ajax({
                    url : "/addComment/", // the endpoint
                    type : "POST", // http method
                    data : { name : $(this).children()[0].value, comment: $(this).children()[1].value, post: $(this).parent().attr('id').slice(-1), csrfmiddlewaretoken: csrftoken }, // data sent with the post request

                    // handle a successful response
                    success : function(json) {
                        console.log(json); // log the returned json to the console
                        $(cT).html('<button type="button" class="btn addComment commentElement">Add Comment</button>');
                        commentAdder();
                    },

                    // handle a non-successful response
                    error : function(xhr,errmsg,err) {
                        console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                        $(cT).html('<button type="button" class="btn addComment commentElement">Add Comment</button>');
                        commentAdder();
                    }
                })
            })
        })
    }
})

$(document).ready(function() {
  (function() {
    var showChar = 1000;
    var ellipsestext = "...";

    $(".truncate").each(function() {
      var content = $(this).html();
      if (content.length > showChar) {
        var c = content.substr(0, showChar);
        var h = content;
        var html =
          '<div class="truncate-text" style="display:block">' +
          c +
          '<span class="moreellipses">' +
          ellipsestext +
          '&nbsp;&nbsp;<a href="" class="moreless more">more</a></span></span></div><div class="truncate-text" style="display:none">' +
          h +
          '<a href="" class="moreless less">Less</a></span></div>';

        $(this).html(html);
      }
    });

    $(".moreless").click(function() {
      var thisEl = $(this);
      var cT = thisEl.closest(".truncate-text");
      var tX = ".truncate-text";

      if (thisEl.hasClass("less")) {
        cT.prev(tX).toggle();
        cT.slideToggle();
      } else {
        cT.toggle();
        cT.next(tX).fadeToggle();
      }
      return false;
    });
    /* end iffe */
  })();

  /* end ready */
});