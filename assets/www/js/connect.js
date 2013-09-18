function newsIndex() {
$.ajax({
    url: 'http://myschool.com.ng/toolbox/mobile-app/news_listing.php',
    dataType: 'JSONp',
    success: function(data, status) {
        $.each(data, function(key, value){
            //handle the data
            //store locally
                   localStorage.setItem('newsIndex', JSON.stringify(data));
                   //grab from local store
                   var newsData = JSON.parse(localStorage.getItem('newsIndex'));
                   // populate template with data
                   var newsIndex = '#NewsIndex' + divId + 'UL';
                   $(newsIndex).children().remove('li');
                   $(newsIndex).append("newsIndex", newsData).appendTo('#NewsIndex');
                   $(newsIndex).listview('refresh');

        });


    },
    error: function() {
        //handle the error
        console.log("Error")
    }
});
}



