// THRIFTY GIFTIES - Anya Craig
// Created October/November 2015

var thriftyGifties = {}; //Global variable

thriftyGifties.row = "<div class='row'><div class='delete'><i class='fa fa-times'></i></div> <input type='text' id='name' class='name-input' placeholder='Recipient name'> <input type='text' id='gift-description' class='gift-input' placeholder='Gift description'> <input type='text' id='price' class='price-input' placeholder='Gift price (pre-tax)'></div><!-- /.row -->";


// ********* MAIN FUNCTIONS TO BE CALLED LATER ********* 


//Allow the user to add five rows
thriftyGifties.addFiveRows = function() {
	for (var i = 0; i < 5; i++) {
		$(".row-holder").append(thriftyGifties.row);
	};
};

//Allow the user to add one row
thriftyGifties.addOneRow = function() {
	$(".row-holder").append(thriftyGifties.row);
};

//The main calculation function, which figures out the total and displays it
thriftyGifties.calculate = function() {

	//Calculate the subtotal, tax amount, and total with tax using the numbers in the visible price inputs
	//Those which are set to display:none are not included
	$('input.price-input:visible').each(function(i,el){
		var price = parseFloat(el.value) || 0;
		thriftyGifties.subtotal += price;
		thriftyGifties.tax = thriftyGifties.subtotal * 0.13;
		thriftyGifties.taxTotal = thriftyGifties.subtotal + thriftyGifties.tax;
	});

	console.log("Your subtotal is " + thriftyGifties.subtotal);

	//Display those numbers in the DOM
	$(".subtotal").text("$" + thriftyGifties.subtotal.toFixed(2));
	$(".tax").text("$" + thriftyGifties.tax.toFixed(2));
	$(".tax-total").text("$" + thriftyGifties.taxTotal.toFixed(2));

	//Calculate the remaining percentage of the gift fund
	var remainingFunds = (thriftyGifties.giftFund - thriftyGifties.taxTotal) / thriftyGifties.giftFund * 100;

	//Use that percentage to change the height and colour of the value bar
	var valueBarHeight = remainingFunds + "%";
	$(".value-bar").css("height", valueBarHeight);
	if (remainingFunds <= 15) {
		$(".value-bar").css("background", "red");
	} else if (remainingFunds <= 50) {
		$(".value-bar").css("background", "gold");
	}

	//Display the amount remaining in text in the value bar
	var remaining = thriftyGifties.giftFund - thriftyGifties.taxTotal;
	$(".remaining").text("$" + remaining.toFixed(2)  + " remaining");
};

//********* END OF MAIN FUNCTIONS *********

//This is the init function, which holds everything we want to run as soon as the DOM is ready
thriftyGifties.init = function() {
	
	thriftyGifties.giftFund = 0;
	thriftyGifties.subtotal = 0;
	thriftyGifties.tax = 0;
	thriftyGifties.taxTotal = 0;
	
	//This listens for a keydown, then checks if the key was the tab key, and
	//that the keydown target was the last-child of a last-child
	//if all that is true, it adds one more row
	$(document).on('keydown',function(e){
		var $tabbedElement = $(e.target);
		if(e.keyCode === 9 
			&& $tabbedElement.is(':last-child')
			&& $tabbedElement.parent().is(':last-child')) {
			thriftyGifties.addOneRow();
			console.log("tabbed!");
		}
	});

	//Add five rows when the "Add rows" button is clicked
	$(".add-rows").on("click", function(){
		thriftyGifties.addFiveRows();
	});
	
	//Get the total gift fund from the input when the form is submitted
	$(".budget-amount").on("submit", function(event){
		event.preventDefault();
		thriftyGifties.giftFund = parseFloat($("#gift-fund").val());
		$(".remaining").text("$" + thriftyGifties.giftFund + " remaining");
		$(".hide-on-submit").hide();
		$(".reveal").show();
	});

	//Update the gift fund when the form is submitted
	$(".update-budget-amount").on("submit", function(event){
		event.preventDefault();
		thriftyGifties.giftFund = parseFloat($(".update-gift-fund").val());
		$(".remaining").text("$" + thriftyGifties.giftFund + " remaining");
		thriftyGifties.subtotal = 0;//Reset subtotal to 0
		thriftyGifties.calculate();
	});

	//Run the calculate function when there's a keyup and a change in the gift list
	$(".gift-list").on("keyup change", 'input#price',function() {
		thriftyGifties.subtotal = 0;//Reset subtotal to 0
		thriftyGifties.calculate();
	});
	
	//Allow the user to delete a row
	//This uses event delegation to account for the rows that might be added after the initial page load
	$(".row-holder").on("click", ".fa-times", function(){
		$(this).closest(".row").hide();
		thriftyGifties.subtotal = 0;//Reset subtotal to 0
		thriftyGifties.calculate();
	});
};


//This is the document-ready function - it just holds our init function and everything inside it
$(function() {
	thriftyGifties.init();
});


//_________ THINGS STILL TO BE ACCOMPLISHED _________

//Allow the user to submit the form with the enter key as well as by pressing the submit button
//Validate whether the prices are actual numbers and alert the user if they are not
//Check for weird punctuation and alert the user if changes need to be made
//Format the prices/numbers with commas
//Allow the user to download a PDF of the gift budget
//Allow the user to print a copy of the gift budget
//Allow the user to tweet or post (FB) about the app
//Alert the user when they have almost depleted their fund
//Allow the user to signal when they're done and congratulate them on their budgeting success
//Add a button to allow the user to start again (refresh the page)