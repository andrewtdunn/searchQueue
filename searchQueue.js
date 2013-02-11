/*

Code Sample - Andrew Dunn 
Feb 11, 2013


Maintains a user queue using HTML5's local storage object. Although the AJAX calls are done with jQuery's Ajax library,
the user queues data manipulation are handled with low-level, native js functions .

Because this was done on spec for a search engine service I've removed the URL for the search data. 

*/



$(document).ready(function(){
 $('img').bind('dragstart', function(event) { event.preventDefault(); });
 printMyList();	

 $('#emptyList').click(function(){
	
	localStorage.clear();
	window.location.reload()
	
 });

// api call (disabled)
 $('#searchForm').submit(function() {
	var title = $('#titleInput').val();
	
	if (title != "")
	{ 
	$.ajax({ 
	    type: 'GET', 'search.com/objects?q=' +  title,  /* NOTE URL has been hidden */
	    data: { get_param: 'value' }, 
	    dataType: 'json',
	    success: function (data) { 
		
			 $('#result').empty();	
	        $.each(data, function(index, element) {
				var newThumb = $('<div class="movieThumb"><h1>' + element.title + '<h1></div>').append('<img src="'+ element.image_url+'"></img>');
				
				$(newThumb).click(function(){
					addItemToMyList(element);
				});
				$('#result').append(newThumb);	
	        });
	    }
	});
	}
  	return false;
 });


// primary data manipulation

function addItemToMyList(element){
	// get Array 
	var myList =  JSON.parse( localStorage.getItem( 'myList' ) );
	
	if (myList)
	{
		myList.titles.unshift(element);
	}
	else
	{
		myList = {};
		myList.titles = [element];
	}
	
	// save array
	localStorage.setItem("myList", JSON.stringify(myList));
	//update view
	printMyList();
}

function moveTitleLeft(element, index)
{
	if(index>0)
	{
		var myList =  JSON.parse( localStorage.getItem( 'myList' ) ).titles;
		var tmp = myList[index-1];
		myList[index-1]=element;
		myList[index]=tmp; 
		// save array
		var updatedList  = {};
		updatedList.titles = myList;
		localStorage.setItem("myList", JSON.stringify(updatedList));
		//update view
		printMyList();
	
	}
}

function moveTitleRight(element, index,length)
{
	
	if(index<length-1)
	{
		var myList =  JSON.parse( localStorage.getItem( 'myList' ) ).titles;
		var tmp = myList[index+1];
		myList[index+1]=element;
		myList[index]=tmp; 
		// save array
		var updatedList  = {};
		updatedList.titles = myList;
		localStorage.setItem("myList", JSON.stringify(updatedList));
		//update view
		printMyList();
	}
	else
	{
		console.log("out of range index="+index+" max="+length);
	}
}

function deleteTitle(index) {
	var myList =  JSON.parse( localStorage.getItem( 'myList' ) ).titles;
	myList.splice(index,1);
	var updatedList  = {};
	updatedList.titles = myList;
	localStorage.setItem("myList", JSON.stringify(updatedList));
	//update view
	printMyList();
}




function printMyList(){
	
	console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
	console.log("my list:");
	var myList =  JSON.parse( localStorage.getItem( 'myList' ) );
	
	
	if (myList)
	{
		$('#myList').empty();
		console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
		for (var index in myList.titles)
		{
			if (index < 10)
			{
				console.log(myList.titles[index].title)
			
				var newThumb = $('<div class="movieThumb"></div>');
				newThumb.append('<div class="left">&larr;</div>');
				newThumb.append('<div class="right">&rarr;</div>');
				newThumb.append('<h1>' + myList.titles[index].title + '</h1>');
				newThumb.append('<img src="'+ 	myList.titles[index].image_url +'"></img><br class="clearBoth" draggable="false"/>');
				newThumb.append('<div class="deleteButton">X</div>');
				
			}
			newThumb.attr("draggable", "False");
			$('#myList').append(newThumb);	
		}
		
		
		var g = document.getElementById('myList');
		for (var i = 0, len = g.children.length; i < len; i++)
		{

		    (function(index){
				var currDiv=g.children[i];
				var leftArrow = currDiv.children[0];
		        leftArrow.onclick = function(){
		              moveTitleLeft(myList.titles[index],index)  ;
		        }    
		    })(i);
		
			(function(index){
				var currDiv=g.children[i];
				var rightArrow = currDiv.children[1];   
				rightArrow.onclick = function(){			          			
					moveTitleRight(myList.titles[index],index,g.children.length)  ;
			    }
		    })(i);
		
			(function(index){
				var currDiv=g.children[i];
				var deteleBtn = currDiv.children[5];   
				deteleBtn.onclick = function(){			          			
					deleteTitle(index);
			    }
		    })(i);

		}
		
			
	}
	else
	{
		var newList = {};
		newList.titles=[];
		localStorage.setItem("myList", JSON.stringify(newList));
	}
	
}

});