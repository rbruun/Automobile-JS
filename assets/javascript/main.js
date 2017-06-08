(function () {

    $(function () {

        // display blank on the screen instead of 'undefined'
        function undef(string) {
            return typeof string === "undefined" ? "" : string;
        }

        //reset all of the form fields back to blank
        function resetFormFields() {
            $("#iyear").val("");
            $("#imake").val("");
            $("#imodel").val("");
            $("#ivin").val("");
            $("#icolor").val("");
            $('input[name=salvage]').filter(':checked').prop("checked", false);
            $("#icylinders").val("");
            $("#itransmission").val("");
            $("#istate").val("");
            $("#icountry").val("");
            $("#ilicnumber").val("");
            $("#recordid").val("");
            loadData();
        };

        // parse the errors out of the response object and display to the user
        function showErrors(xhr) {
            var errObj = JSON.parse(jqXHR.responseText);
            alert(errObj.details);
        }

        // populate the column values of a row
        function loadRow(val) {
            let newRow = "<tr>" +
                "<td><a class='modify' data='" + val.id + "'>Modify<a></td>" +
                "<td>" + val.year + "</td>" +
                "<td>" + val.make + "</td>" +
                "<td>" + val.model + "</td>" +
                "<td>" + undef(val.vin) + "</td>" +
                "<td>" + undef(val.color) + "</td>" +
                "<td>" + undef(val.numberCylinders) + "</td>" +
                "<td>" + undef(val.salvageTitle) + "</td>" +
                "<td>" + undef(val.transmissionType) + "</td>" +
                "<td>" + undef(val.licensedState) + "</td>" +
                "<td>" + undef(val.licensedCountry) + "</td>" +
                "<td>" + undef(val.licenseNumber) + "</td>" +
                "<td><a class='delete' data='" + val.id + "'>Delete<a></td>"
            "</tr>";
            return newRow;
        }

        // get the fields from the form and load them into a JSON object
        function getFormFields() {
            return {
                "year": $("#iyear").val(),
                "make": $("#imake").val(),
                "model": $("#imodel").val(),
                "vin": $("#ivin").val(),
                "color": $("#icolor").val(),
                "numberCylinders": $("#icylinders").val(),
                "salvageTitle": $('input[name=salvage]').filter(':checked').val(),
                "transmissionType": $("#itransmission").val(),
                "licensedState": $("#istate").val(),
                "licensedCountry": $("#icountry").val(),
                "licenseNumber": $("#ilicnumber").val()
            };
        }

        // get all of the current autos from the api and load to the page
        function loadData() {
            $.get("http://localhost:1337/automobile", function (data) {

                // clear out any rows currently displayed on the page
                $("#mainbody").html("");
                // loop through th results from the api and load to a page row
                $.each(data, function (index, val) {
                    $("#mainbody").append(loadRow(val));
                });
            });
        }

        // if the delete button is clicked, call api to remove selected row
        $("#mainbody").on("click", ".delete", function () {

            console.log($(this).attr("data"));
            $.ajax({
                url: 'http://localhost:1337/automobile/' + $(this).attr("data"),
                type: 'DELETE',
                success: function (result) {
                    $("#status").text(status)
                    loadData();
                },
                failure: function (err) {
                    console.log("the record was not deleted " + err);
                }
            });

        });

        // when modify link is clicked, get that row's values from the api and load to the form fields
        $("#mainbody").on("click", ".modify", function () {

            $.get("http://localhost:1337/automobile/" + $(this).attr("data"), function (data) {
                $("#recordid").val(data.id);
                $("#iyear").val(data.year);
                $("#imake").val(data.make);
                $("#imodel").val(data.model);
                $("#ivin").val(data.vin);
                $("#icolor").val(data.color);
                if (data.salvageTitle == "true") {
                    $('input[id=isalvagey]').prop("checked", true);
                } else {
                    $('input[id=isalvagen]').prop("checked", true);
                }
                $("#icylinders").val(data.numberCylinders);
                $("#itransmission").val(data.transmissionType);
                $("#istate").val(data.licensedState);
                $("#icountry").val(data.licensedCountry);
                $("#ilicnumber").val(data.licenseNumber);
            });

        });

        // add a new row or update an existing row
        $("#submit").click(function () {

            // if there is no id value in the form, then assume this is a new auto and do an add
            if ($("#recordid").val() == "") {
console.log("adding new row " + getFormFields());
                $.post("http://localhost:1337/automobile",
                    getFormFields(),
                    function (data, status) {
                        resetFormFields();
                        $("#status").text(status)
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                    $("#status").text(textStatus)
                    // parse the errors out of the response object and display to the user
                    var errObj = JSON.parse(jqXHR.responseText);
                    alert(errObj.details);
                });
            } else {
                // if there is an ID value, then modify the record
console.log("updating row " + getFormFields());
                ajaxResult = $.ajax({
                    type: "PUT",
                    url: "http://localhost:1337/automobile/" + $("#recordid").val(),
                    //contentType: "application/json",
                    data: getFormFields(),
                    success: function (data, status) {
                        resetFormFields();
                        console.log("Data: " + data + "\nStatus: " + status);
                        $("#status").text(status);
                    }
                });
                ajaxResult.fail(function (xhr) {
                    // parse the errors out of the response object to display to the user
                    var errObj = JSON.parse(xhr.responseText);
                    alert(errObj.details);
                })
            }

        });

        loadData();

    });
})();
