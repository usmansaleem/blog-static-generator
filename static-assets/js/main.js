var pageCount=1;
var blogCount=0;
$(document).ready(function() {
    $.ajax({
        url: "/rest/blog/blogMeta"
    }).then(function(data) {
       $('.blogMeta-pageCount').append(data.pageCount);
       $('.blogMeta-blogCount').append(data.blogCount);
       pageCallback(1);

       $('#pagination').materializePagination({
        align: 'center',
        lastPage:  data.pageCount,
        firstPage:  1,
        urlParameter: 'page',
        useUrlParameter: false,
        onClickCallback: pageCallback
    }); 
    });
});

function pageCallback(requestedPage) {
    $.ajax({
        url: "/rest/blog/blogItems/" + requestedPage
    }).then(function(data) {
        var cardHtml = "";
        $.each(data, function(index, element) {
            var blogItem = '<div class="card">' + 
            '   <div class="card-content">' +
            '     <span class="card-title">' + element.title + '</span>' +
            '     <p>' + element.description + '</p>' +
            '   </div>' +
            '   <div class="card-action">' +
            '     <a class="waves-effect waves-light btn blue-grey darken-1" href="/view/blog/' + element.urlFriendlyId + '">Read More</a>' +
            '   </div>' +
            ' </div>';
            console.log(blogItem);
            cardHtml += blogItem;
        });

        $('#cards-div').html(cardHtml);
    });
};
