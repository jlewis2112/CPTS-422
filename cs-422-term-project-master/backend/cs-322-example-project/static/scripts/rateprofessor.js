function RateProfessor() {

    // PRIVATE VARIABLES

    // The backend we'll use for Part 2. For Part 3, you'll replace this 
    // with your backend.
    var apiUrl = 'http://localhost:5000';
    //var apiUrl = 'https://rateprofessor.herokuapp.com';

    var professorlist; // professors container, value set in the "start" method below
    var profTemplateHtml; // a template for creating reviews. Read from index.html
    // in the "start" method

    var reviews; // reviews container, value set in the "start" method below
    var reviewTemplateHtml; // a template for creating reviews. Read from index.html
    // in the "start" method

    var create_review; // create_review form, value set in the "start" method below
    var add_professor; // add_professor form, value set in the "start" method below


    // PRIVATE METHODS

    /**
     * HTTP GET request
     * @param  {string}   url       URL path, e.g. "/api/allprofs"
     * @param  {function} onSuccess   callback method to execute upon request success (200 status)
     * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
     * @return {None}
     */
    var makeGetRequest = function (url, onSuccess, onFailure) {
        $.ajax({
            type: 'GET',
            url: apiUrl + url,
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };

    /**
     * HTTP POST request
     * @param  {string}   url       URL path, e.g. "/api/allprofs"
     * @param  {Object}   data      JSON data to send in request body
     * @param  {function} onSuccess   callback method to execute upon request success (200 status)
     * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
     * @return {None}
     */
    var makePostRequest = function (url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };

    /**
     * Insert professor into professorlist container in UI
     * @param  {Object}  professor       professor JSON
     * @param  {boolean} beginning   if true, insert professor at the beginning of the list of professorlist
     * @return {None}
     */
    var insertProfessor = function (professor, beginning) {
        // Start with the template, make a new DOM element using jQuery
        var newElem = $(profTemplateHtml);
        // Populate the data in the new element
        // Set the "id" attribute 
        newElem.attr('id', professor.id);
        // Now fill in the data that we retrieved from the server
        newElem.find('.name').text(professor.name + " " + professor.lastname);
        // FINISH ME (Task 2): fill-in the rest of the data
        newElem.find('.affiliate').text(professor.title);
        newElem.find('.school').text(professor.school);

        let rating = professor.overall_rating;
        if (rating > 4) {
            newElem.find('.rating_none').attr('class', 'rating_5');
        } else if (rating > 3) {
            newElem.find('.rating_none').attr('class', 'rating_4');
        } else if (rating > 2) {
            newElem.find('.rating_none').attr('class', 'rating_3');
        } else if (rating > 1) {
            newElem.find('.rating_none').attr('class', 'rating_2');
        } else if (rating > 0) {
            newElem.find('.rating_none').attr('class', 'rating_1');
        } else {
            newElem.find('.rating_none').attr('class', 'rating_none');
        }

        if (beginning) {
            professorlist.prepend(newElem);
        } else {
            professorlist.append(newElem);
        }
    };


    /**
     * Get all professors from API and display in alphabetical order by lastname
     * @return {None}
     */
    var displayProfessors = function () {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function (data) {
            /* FINISH ME (Task 2): display all professors from API and display in alphabetical ordered by last name */
            let jsondata = data.professors;
            for (let i = 0; i < jsondata.length; i++) {
                insertProfessor(jsondata[i], true);
            }
            console.log("List all professors - Success");
        };
        var onFailure = function () {
            console.error("List all professors - Failed");
        };
        /* FINISH ME (Task 2): make a GET request to get recent professors */
        let requestURL = "/api/allprofs?order_by=lastname";
        console.log(requestURL);
        makeGetRequest(requestURL, onSuccess, onFailure);
    };


    /**
     * Insert reviews into reviews container in UI
     * @param  {Object}  review       review JSON
     * @param  {boolean} beginning   if true, insert review at the beginning of the list of reviews
     * @return {None}
     */
    var insertReview = function (review, beginning) {
        // Start with the template, make a new DOM element using jQuery
        var newElem = $(reviewTemplateHtml);
        // Populate the data in the new element
        // Set the "id" attribute 
        newElem.attr('id', review.id);
        // Now fill in the data that we retrieved from the server
        // FINISH ME (Task 3): fill-in the rest of the data
        newElem.find(".review_text").text(review.review_text);

        newElem.find("timestamp").text(review.created_at);

        let rating = review.rating;
        if (rating > 4) {
            newElem.find('.rating_none').attr('class', 'rating_5');
        } else if (rating > 3) {
            newElem.find('.rating_none').attr('class', 'rating_4');
        } else if (rating > 2) {
            newElem.find('.rating_none').attr('class', 'rating_3');
        } else if (rating > 1) {
            newElem.find('.rating_none').attr('class', 'rating_2');
        } else if (rating > 0) {
            newElem.find('.rating_none').attr('class', 'rating_1');
        } else {
            newElem.find('.rating_none').attr('class', 'rating_none');
        }

        if (beginning) {
            reviews.prepend(newElem);
        } else {
            reviews.append(newElem);
        }
    };


    /**
     * Get recent reviews from API and display most recent 50 reviews
     * @return {None}
     */
    var displayReviews = function () {
        // Delete everything from .reviews
        reviews.html('');
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function (data) {
            // FINISH ME (Task 3): display reviews with most recent reviews at the beginning
            var jsondata = data.reviews;
            for (var i = 0; i < jsondata.length; i++) {
                insertReview(jsondata[i], true);
            }
            console.log("List all reviews - Success");
        };
        var onFailure = function () {
            // FINISH ME (Task 3): display an alert box to notify that the reviews couldn't be retrieved ;
            // print the error message in the console.
            console.error("List all reviews - Failure");
        };
        // FINISH ME (Task 3): get the id of the selected professor from the header
        let selectedID = $(".selected_prof").attr("id");

        // FINISH ME (Task 3): make a GET request to get reviews for the selected professor
        let requestURL = "/api/getreviews?profID=" + selectedID + "&order_by=created_at&count=20";
        console.log(requestURL);
        makeGetRequest(requestURL, onSuccess, onFailure);
    };

    /**
     * Add event handlers for clicking select.
     * @return {None}
     */
    var attachSelectHandler = function (e) {
        // Attach this handler to the 'click' action for elements with class 'select_prof'
        professorlist.on('click', '.select_btn', function (e) {
            // FINISH ME (Task 4): get the id, name, title, school of the selected professor (whose select button is clicked)      
            e.preventDefault();

            let profId = $(this).parents('article').attr('id'); //FINISH ME
            let name = $(this).parents('article').find('.name').html(); //FINISH ME
            let title = $(this).parents('article').find('.affiliate').html(); //FINISH ME
            let school = $(this).parents('article').find('.school').html(); //FINISH ME

            // FINISH ME (Task 4):  update the selected_prof content in the header with these values.
            $(".selected_prof").attr('id', profId);
            $(".selected_name").html(name);
            $(".selected_title").html(title);
            $(".selected_school").html(school);

            // FINISH ME (Task 4): display the reviews for the selected professor
            displayReviews();

            //activate and show the reviews tab
            $('.nav a[href="#showreview"]').tab('show');
        });
    };

    /**
     * Update the professors rating image based on the current rating.
     * @param  {Object}  prof       professor JSON ; includes updated professor data received from the backend
     * @return {None}
     */
    var updateProfessor = function (prof) {

        // FINISH ME (Task 5):  get the "class" attribute value for the professor rating div (professors id is "prof.id")
        // remember that the rating class value can one of the following: rating_none or rating_1 or rating_2 or rating_3 or rating_4 or rating_5 
        // Hint: get the professor_box element with id 'prof.id'. Get the class attribute for the div inside '.overall_rating'.
        let element = $("#" + prof.prof_id).find("rating_none");

        // FINISH ME (Task 5):  remove the current "class" attribute value for the professor rating 
        element.removeClass("rating_none");

        // FINISH ME (Task 5):  add  the new "class" attribute value for the professor rating 
        element.addClass(prof.rating);
    };

    /**
     * Add event handlers for submitting the create review form.
     * @return {None}
     */
    var attachReviewHandler = function (e) {
        // add a handler for the 'Cancel' button to cancel the review and go back to "FIND YOUR PROFESSOR" (#list) tab
        create_review.on('click', '.cancel_review', function (e) {
            e.preventDefault();
            //activate and show the reviews tab
            $('.nav a[href="#showreview"]').tab('show');
        });

        // FINISH ME (Task 5): add a handler to the 'Post Review' (.submit_review_input) button to
        //                     post the review for the chosen professor
        // The handler for the Post button in the form
        create_review.on('click', '.submit_review_input', function (e) {
            e.preventDefault(); // Tell the browser to skip its default click action

            var review = {}; // Prepare the review object to send to the server
            review.prof_id = $('header .selected_prof').attr('id');
            review.review_text = create_review.find('.review_input').val();
            // FINISH ME (Task 5): collect the rest of the data for the review
            review.rating = create_review.find('.review_rating_input').val();

            var onSuccess = function (data) {
                // FINISH ME (Task 5): update the professor's review rating based on the data received from backend
                // Hint: call updateProfessor
                updateProfessor(data);

                // FINISH ME (Task 5): insert review at the beginning of the reviews container
                // Hint : call InsertReview
                insertReview(review, true);

                //activate and show the reviews tab
                $('.nav a[href="#showreview"]').tab('show');
            };
            var onFailure = function () {
                //FINISH ME (Task 5): display an alert box to notify that the review could not be created ;
                // print the error message in the console.
                console.error("Error: review could not be created.");
            };

            // FINISH ME (Task 5): make a POST request to add the review
            let postURL = "/api/addreview";
            console.log(postURL);
            makePostRequest(postURL, review, onSuccess, onFailure);

        });
    };

    /**
     * Add event handlers for submitting the create review form.
     * @return {None}
     */
    var attachProfessorHandler = function (e) {
        // FINISH ME (Task 6): add a handler for the 'Cancel' button to cancel the review and go back to "FIND YOUR PROFESSOR" (#list) tab
        add_professor.on('click', '.cancel_prof', function (e) {
            //activate and show the #list tab
            $('.nav a[href="#list"]').tab('show');
        });

        // add a handler to the 'Add Professor' (.submit_prof_input) button to
        // create a new professor

        // The handler for the Post button in the form
        add_professor.on('click', '.submit_prof_input', function (e) {
            e.preventDefault(); // Tell the browser to skip its default click action

            var prof = {}; // Prepare the review object to send to the server
            // FINISH ME (Task 6): collect the rest of the data for the professor
            prof.name = $(".name_input").val();
            prof.lastname = $(".lastname_input").val();
            prof.affiliate = $(".title_input").val();
            prof.school = $(".school_input").val();

            var onSuccess = function (data) {
                // FINISH ME (Task 6): insert professor at the beginning of the professorlist container
                // Hint : call insertProfessor
                insertProfessor(prof, true);

                // FINISH ME (Task 6): activate and show the #list tab
                $('.nav a[href="#list"]').tab('show');
            };
            var onFailure = function () {
                //FINISH ME (Task 6): display an alert box to notify that the professor could not be created ;
                // print the error message in the console.
                console.error("Error: professor could not be created.");
            };

            // FINISH ME (Task 4): make a POST request to add the professor
            let postURL = "/api/newprofessor";
            console.log(postURL);
            makePostRequest(postURL, prof, onSuccess, onFailure);

        });

    };

    /**
     * Start the app by displaying the list of the professors and attaching event handlers.
     * @return {None}
     */
    var start = function () {
        //get the professor HTML template
        professorlist = $(".professorlist");
        // Grab the first professor div element, to use as a template
        profTemplateHtml = $(".professorlist .professor_box")[0].outerHTML;
        // Delete everything from .professorlist
        professorlist.html('');
        displayProfessors();

        reviews = $(".reviews");
        // Grab the first review, to use as a template
        reviewTemplateHtml = $(".reviews .review")[0].outerHTML;
        // Delete everything from .reviews
        reviews.html('');

        //get the reference to the <form> element with id "addReviewForm" and store it in create_review valiable.
        // We will use this variable to access "addReviewForm" element in DOM.
        create_review = $("form#addReviewForm");
        attachSelectHandler();
        attachReviewHandler();

        add_professor = $("form#addProfForm");
        attachProfessorHandler();
    };


    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via RateProfessor.key_name, e.g. RateProfessor.start()
    return {
        start: start
    };

}
