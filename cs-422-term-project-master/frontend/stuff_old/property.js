function Property() {

    var apiUrl = 'http://localhost:5000';

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


    var displayProperties = function () {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function (data) {
            let jsondata = data.properties;
            for (let i = 0; i < jsondata.length; i++) {
                insertProperty(jsondata[i], true);
            }
            console.log("List all properties - Success");
        };

        var onFailure = function () {
            console.error("List all properties - Failed");
        };

        let requestURL = "/api/properties?order_by=rating";
        console.log(requestURL);
        makeGetRequest(requestURL, onSuccess, onFailure);
    };


    /**
     * Insert reviews into reviews container in UI
     * @param  {Object}  property       property JSON
     * @param  {boolean} beginning   if true, insert property at the beginning of the list of properties
     * @return {None}
     */
    var insertProperty = function (property, beginning) {
        
    };


    /**
     * Start the app by displaying the list of the professors and attaching event handlers.
     * @return {None}
     */
    var start = function () {
        // initialize variables
    };


    return {
        start: start
    };
}