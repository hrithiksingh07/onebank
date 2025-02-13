$(document).ready(function () {

    console.log("hello");
    $("#Transfer").addClass("active");

    $("#AccountNo").bind("contextmenu", function (e) {
        return false;
    });

    $("#AccountNo").keyup(function () {
        let AccountNo = $(this).val();

        if (AccountNo.length == 12) {

            console.log(AccountNo);

            $.ajax({
                type: "POST",
                url: "code.php",
                data: { AcNo: AccountNo },
                dataType: "json",
                success: function (response) {

                    if (response["Flag"] != "fail") {

                        popFlag = 1;

                        $("#AcError").text("");
                        let Fname = response["Fname"];
                        let Lname = response["Lname"];
                        let AdharNo = response["AdharNo"];
                        let PanNo = response["PanNo"];
                        let MobileNo = response["MobileNo"];
                        let Balance = response["Balance"];
                        let Status = response["Status"];

                        $("#info").attr("hidden", false);
                        $('#AccountNo').addClass("border-right-0");

                        $('#AccountNo').popover({

                            title: 'Account Holder Detail',
                            html: true,
                            container: "body",
                            placement: 'right',
                            content: `<p><strong>First Name: </strong> ${Fname}</p> 
                                    <p><strong>Last Name: </strong>${Lname}</p> 
                                    <p><strong>Mobile Number: </strong>${MobileNo}</p>`
       

                        })
                    }
                    else {
                        $('#AccountNo').popover('hide');
                        $("#AcError").text("Account Number Not Found. Note: Refresh The Page for next account no");

                    }
                }
            });


        }
    });

    $("#info").click(function () {
        $('#AccountNo').popover('toggle')

    });


    $("#Amount").on({
        click: function () {
            $('#AccountNo').popover('hide')
            // $('#AccountNo').popover('toggle')
        },

        keyup: function () {
            let Amount = $(this).val();

            if (Amount > 0) {
                $("#AmountError").text("");

                let AccountNo = $("#AccountNo").val();
            }
            else {
                $("#AmountError").text("Please Enter Minimum 1 rupees");
            }
        }

    });

    $("#Pay").click(function () {

        let Amount = $("#Amount").val();
        let AccountNo = $("#AccountNo").val();
        if (AccountNo != "") {
            $("#AcError").text("");

            if (Amount >0) {
                $("#AmountError").text("");
                swal({
                    title: "Are you sure to Transfer of Amount" + "   " + "₹" + Amount,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {

                    if (willDelete) {

                        $.ajax({
                            type: "POST",
                            url: "code.php",
                            data: { AcState: AccountNo },
                            success: function (response) {

                                let Status = response;
                                console.log(Status)

                                if (Status == "Active") {
                                    $("#AcError").text("");

                                    $.ajax({
                                        type: "POST",
                                        url: "code.php",
                                        data: {
                                            DepositAc: AccountNo,
                                            MainAmount: Amount
                                        },
                                        cache: false,
                                        success: function (response) {
                                            console.log(response);
                                            if (response == "Success") {
                                                swal("Transaction Sucessfully!", {
                                                    icon: "success",
                                                    buttons: [false]
                                                });
                                                setTimeout(function () {

                                                    location.reload();

                                                }, 2000);
                                                console.log(response);
                                            }
                                            else {
                                                swal({
                                                    title: "Transaction Fail !",
                                                    text: response,
                                                    icon: "error",
                                                    buttons: true,
                                                    // value:true
                                                }).then((value) => {
                                                    location.reload();
                                                });

                                            }
                                        }
                                    });
                                }
                                else {
                                    $("#AcError").text("");
                                }
                            }
                        });

                    }

                });
            }
            else {
                $("#AmountError").text("Please Enter Minimum 100 rupees");
            }
        }
        else {
            $("#AcError").text("Account Number Cannot Empty");

        }

    });

});