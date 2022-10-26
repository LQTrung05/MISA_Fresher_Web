window.onload = function () {
    try {
        openCloseFormEmployee();
        handerCheckbox();
        loadData();
        deleteEmployee();
        editEmployee();
        closeArlertDialog(".m-employee-danger");
        closeArlertDialog(".m-employee-success");
        btnSaveOnClick();
    } catch (error) {
        console.log(error);
    }
}

//Biến cờ chọn chế độ thêm hoặc sửa
var formMode = "";
// Biến chứa  Id của nhân viên được chọn để sửa
var employeeIDForEdit = null;
// Biến chứa tất cả nhân viên khi binding dữ liệu ra table
var employeesArray = "";

/**
 * Hàm đóng, mở form thêm mới, sửa nhân viên
 * Author: LQTrung (16/10/2022)
 */
function openCloseFormEmployee() {
    try {
        $(".btn-add-epl").click(function () {
            //Cờ đánh dấu thực hiện thêm mới nhân viên
            formMode = "insert";
            $(".loading-data").show();
            setTimeout(function () {
                $(".loading-data").hide();
                $(".m-popup").addClass("display-f");
                $("#employeeID").focus();
            }, 500)
        });
        // Đóng form thêm, sửa nhân viên
        $(".js-close-form").each(function () {
            $(this).click(function () {
                $(".m-popup").removeClass("display-f");
            })
        })
    } catch (error) {
        console.log(error);
    }
}
/**
 * Xử lý các sự kiện liên quan đến checkbox
 * Author: LQTrung (20/10/2022)
 */
function handerCheckbox() {
    try {
        //1. Người dùng tích check all
        $(document).on("change", "#choose-all", function () {
            if ($(this).prop("checked")) {
                $('.m-input-checkbox').prop('checked', $(this).prop('checked'));
                $('.m-input-checkbox').parents('tr').addClass('checked');
                $("#btn-delete").removeAttr("disabled");
            }
            else {
                $('.m-input-checkbox').prop('checked', $(this).prop('checked'));
                $('.m-input-checkbox').parents('tr').removeClass('checked');
                $("#btn-delete").attr("disabled", "true");

            }
        });
        // 2. Người dùng tích 1 dòng
        $(document).on('change', '.m-input-checkbox', function () {
            // Làm nổi bật dòng đang tích
            let tr = $(this).parents('tr');
            if ($(this).prop('checked')) {
                tr.addClass('checked');
                $("#btn-delete").removeAttr("disabled");
            } else {
                tr.removeClass('checked');

            }
            var count = 0;
            // Kiểm tra tất cả các checkbox
            $('.m-input-checkbox').each(function () {
                if (!$(this).prop('checked')) {
                    chooseAll = false;
                    count++;
                }
            });
            // Nếu tất cả các dòng bỏ check thì nút xóa bị disable
            if (count === $('.m-input-checkbox').length)
                $("#btn-delete").attr("disabled", "true");

            // Nếu tất cả đều check thì tích chooseAll
            if (chooseAll) {
                $('#choose-all').prop('checked', true);
                $("#btn-delete").removeAttr("disabled");
            }
            // Nếu bỏ tích 1 dòng thì bỏ tích check all
            if (!$(this).prop('checked')) {
                $('#choose-all').prop('checked', false);
            }
            // Nếu bỏ tích tất cả thì ẩn nút xóa

        });
    } catch (error) {
        console.log(error);
    }
}

//#region Các hàm kiểm tra dữ liệu nhập vào

/**
 * Hàm hiển thị thông báo lỗi dưới ô input khi nhập sai định dạng dữ liệu
 * @param {css selector} selector element được chọn
 * @param {string} message thông báo lỗi
 */
function showMessageError(selector, message) {
    try {
        $(selector).addClass("m-input-form-error");
        $(selector).next().show();
        $(selector).next().html(message);
    } catch (error) {
        console.log(error);
    }
}
/**
 * Hàm xóa thông báo lỗi khi dữ liệu nhập đúng
 * @param {css selector} selector element được chọn
 */
function hiddenMessageError(selector) {
    try {
        $(selector).removeClass("m-input-form-error");
        $(selector).next().hide();
    } catch (error) {
        console.log(error);
    }
}
/**
 * Hàm đóng dialog
 * @param {css selector} selector element bị đóng khi kích nút
 */
function closeArlertDialog(selector) {
    try {
        $(".js-close-dialog").each(function () {
            $(this).click(function () {
                $(selector).removeClass("display-b");
            })
        })
    } catch (error) {
        console.log(error)
    }
}
//#endregion

//#region Các hàm validate dữ liệu khi thêm mới hoặc sửa thông tin nhân viên

/**
 * Hàm validate dữ liệu nhập vào
 * Author: LQTrung (20/10/2022)
 */
function validateForm() {
    try {
        hideDangerLable();
        if (
            validateInputRequired() &&
            identityNumberMustIsNumberStr("identityNumber", "Số CMND phải là một dãy 12 chữ số", 12) &&
            validateDateTime() &&
            validateEmail() &&
            bankAccMustIsNumberString("bankAccount", "Số tài khoản phải là một dãy chữ số")
        )
            return true;
        else return false;
    } catch (error) {
        console.log(error);
    }

}
/**
 * Hàm hủy bỏ lable cảnh báo nhập sai hoặc thiếu dữ liệu trong form
 * Author: LQTrung (25/10/2022)
 */
function hideDangerLable() {
    $(".m-input-form").each(function () {
        $(this).blur(function () {
            if (!($(this).val() === ""))
                $(this).removeClass('m-input-form-error');
        });
    })
}
/**
 * Hàm validate các thông tin bắt buộc phải nhập
 * @returns trả về true nếu nhập đủ dữ liệu, false nếu nhập thiếu dữ liệu
 */
function validateInputRequired() {
    try {
        let firstElmError = null;
        $('.required').each(function () {
            if (!$(this).val()) {
                $(this).addClass('m-input-form-error');
                if (!firstElmError)
                    firstElmError = $(this);
            } else {
                $(this).removeClass('m-input-form-error');
            }
        });
        if (firstElmError) {
            let dangerMessage = `${firstElmError.parent().find($('.m-input-title-required')).html()} không được bỏ trống.`;
            $('.m-employee-danger .m-content-message').html(dangerMessage);
            $('.m-employee-danger').addClass("display-b");
            return false;
        }

        return true;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Hàm validate Email 
 *  Author: LQTrung (20/10/2022)
 */
function validateEmail() {
    try {
        var email = document.getElementById("emailEmployee");
        var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email.value === "") {
            hiddenMessageError(email);
            return true;
        }
        else if (!(email.value.toLowerCase().match(regexEmail))) {
            showMessageError(email, "Email sai định dạng");
            return false;
        }
        else {
            hiddenMessageError(email);
            return true;
        }
    } catch (error) {
        console.log(error);
    }

}

/**
 * Hàm validate số cmnd bắt buộc phài là 1 dãy số
 * @param {css selector} selector elemement được chọn để validate
 * @param {string} message thông báo lỗi
 * @param {number} lengNS độ dài dãy số hợp lệ 
 * Author: LQTrung (21/10/2022)
 */
function identityNumberMustIsNumberStr(selector, message, lengNS) {
    try {
        var identityNumber = document.getElementById(selector);
        var regexIN = /^[0-9]*$/;
        if (identityNumber.value === "") {
            hiddenMessageError(identityNumber);
            return true;
        }
        else if (!(identityNumber.value.match(regexIN))) {
            showMessageError(identityNumber, message);
            return false;
        }
        else if (identityNumber.value.length != lengNS) {
            showMessageError(identityNumber, message);
            return false;
        }
        else {
            hiddenMessageError(identityNumber);
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Hàm validate dữ liệu nhập vào 1 tài khoản ngân hàng phải là một dãy số
 * @param {css selector} selector element được chọn để validate
 * @param {*} message thông báo lỗi
 * Author: LQTrung (21/10/2022)
 */
function bankAccMustIsNumberString(selector, message) {
    try {
        var identityNumber = document.getElementById(selector);
        var regexIN = /^[0-9]*$/;
        if (identityNumber.value === "") {
            hiddenMessageError(identityNumber);
            return true;
        }
        else if (!(identityNumber.value.match(regexIN))) {
            showMessageError(identityNumber, message);
            return false;
        } else {
            hiddenMessageError(identityNumber);
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Hàm validate element kiểu datetime
 * @returns true nếu không lỗi, false nếu có lỗi
 * Author: LQTrung (20/10/2022)
 */
function validateDateTime() {
    try {
        let date = $("#identityDate").val();
        console.log(date);
        if (date) {
            date = new Date(date);
            console.log("Date sau khi convert" + date);
            console.log("Now" + new Date);
        }
        if (date > new Date()) {
            $("#identityDate").addClass("m-input-form-error");
            $("#identityDate").next().show();
            // return false;
        }
        if (date <= new Date()) {
            console.log("Ngày đúng");
            $("#identityDate").removeClass("m-input-form-error");
            $("#identityDate").next().hide();
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}
//#endregion

/**
 * Hàm định dạng dữ liệu kiểu ngày tháng để đưa lên date picker
 * @param {datetime} value 
 * @returns Trả vềngày tháng theo dạng yy-mm-dd
 * Author: LQTrung(25/10/2022)
 */
function formatDateData(value) {
    try {
        if (value) {
            value = new Date(value);
            let date = value.getDate();
            date = date < 10 ? `0${date}` : date;
            let month = value.getMonth() + 1;
            month = month < 10 ? `0${month}` : month;
            let year = value.getFullYear();
            value = `${year}-${month}-${date}`;
            return value;
        }
    } catch (error) {
        console.log(error);
    }

}
/**
 * Hàm đưa thông tin chi tiết của 1 nhân viên lên popup
 * Author: LQTrung (25/10/2022)
 */
function detailEmployee(epl) {
    try {
        $("#employeeID").val(epl.EmployeeCode);
        $("#employeeName").val(epl.EmployeeName);

        if (epl.Gender == 1)
            $("#rdMale").prop("checked", true);
        else if (epl.Gender == 0)
            $("#rdFemale").prop("checked", true);
        else
            $("#rdOther").prop("checked", true);

        $("#dateOB").val(formatDateData(epl.DateOfBirth));
        $("#departmentID").val(epl.DepartmentId);
        $("#departmentName").val(epl.DepartmentName);
        $("#position").val(epl.EmployeePosition);
        $("#identityNumber").val(epl.IdentityNumber);
        $("#identityDate").val(formatDateData(epl.IdentityDate));
        $("#identityPlace").val(epl.IdentityPlace);
        $("#address").val(epl.Address);
        $("#telephoneNumber").val(epl.TelephoneNumber);
        $("#phoneNumber").val(epl.PhoneNumber);
        $("#emailEmployee").val(epl.Email);
        $("#bankAccount").val(epl.BankAccountNumber);
        $("#bankName").val(epl.BankName);
        $("#bankBranch").val(epl.BankBranchName);

        $(".m-popup").addClass("display-f");
    } catch (error) {
        console.log(error);
    }

}

/**
 * Hàm lấy ra thông tin chi tiết 1 nhân viên để sửa
 * Author: LQTrung (22/10/2022)
 */
function editEmployee() {
    try {
        $(".m-table")
            .on("dblclick", "tr", function () {
                formMode = "edit";
                // Lấy ra đối tượng tương ứng với dòng được chọn
                let epl = $(this).data("entity");
                employeeIDForEdit = epl.EmployeeId;
                detailEmployee(epl);
            })
            .on("click", ".btn-edit-epl", function () {
                formMode = "edit";
                let epl;
                // Lấy ra đối tượng tương ứng với dòng được chọn
                for (const i of employeesArray) {
                    if ($(this).data("id") === i.EmployeeCode)
                        epl = i;
                }
                employeeIDForEdit = epl.EmployeeId;
                detailEmployee(epl);
            })

    } catch (error) {
        console.log(error);
    }
}

/**
 * Hàm gọi api để xóa nhân viên được chọn
 * @param {object} employee nhân viên được chọn để xóa
 * Author: LQTrung (25/10/2022)
 */
function callAPIToDeleteEpl(employee) {
    try {
        $('.m-delete-warning .m-content-message').text(`Bạn có thực sự muốn xóa nhân viên có mã ${employee.EmployeeCode} không?`);
        $('.m-delete-warning').show();

        $('.m-delete-warning')
            // Người dùng chọn không
            .on('click', '.m-close-delete-warning', function () {
                $(this).parents('.m-dialog').hide();
            })
            // Người dùng chọn có
            .on('click', '.m-confirm-delete', function () {
                $('.m-loading-svg').show();
                $(this).parents('.m-dialog').hide();

                $.ajax({
                    type: 'DELETE',
                    url: `https://amis.manhnv.net/api/v1/Employees/${employee.EmployeeId}`,
                    success: function (response) {
                        $('.m-loading-svg').hide();
                        // Load lại dữ liệu
                        self.loadData();
                        // Hiển thị dialog xóa thành công
                        $('.m-employee-success .m-content-message').text('Xóa nhân viên thành công');
                        $('.m-employee-success').addClass("display-b");

                    },
                    error: function () {
                        debugger;
                        console.log(error);
                    },
                });
            });
    } catch (error) {
        console.log(error);
    }

}
/**
 * Hàm thực hiện xóa nhân viên khi kích nút xóa
 * Author: LQTrung (26/10/2022)
 */
function deleteEmployee() {
    try {
        $(".m-table").on("click", ".delete-epl", function () {
            // Lấy ra thông tin nhân viên muốn xóa
            let eplDelete;
            for (const i of employeesArray) {
                if ($(this).data("id") == i.EmployeeCode)
                    eplDelete = i;
            }
            callAPIToDeleteEpl(eplDelete);
        })
        // Hàm xóa nhân viên khi check ở checkbox và xóa hàng loạt

    } catch (error) {
        console.log(error);
    }


}

/**
 * Hàm lấy thông tin chi tiết của một nhân viên từ form để thực hiện thêm, sửa
 * @returns Thông tin chi tiết lấy từ form
 * Author: LQTrung (23/10/2022)
 */
function getEmployeeFromForm() {
    try {
        let employeecode = $("#employeeID").val();
        let employeename = $("#employeeName").val();
        let dateofbirth = $("#dateOB").val();
        let gender = null;
        let male = $("#rdMale");
        let female = $("#rdFemale");
        let other = $("#rdOther");
        if (male[0].checked == true)
            gender = 1;
        if (female[0].checked == true)
            gender = 0;
        if (other[0].checked == true)
            gender = 2;
        let departmentID = $("#departmentID").val();
        let departmentName = $("#departmentName").val();
        let position = $("#position").val();
        let identityNumber = $("#identityNumber").val();
        let identityDate = $("#identityDate").val();
        let identityPlace = $("#identityPlace").val();
        let address = $("#address").val();
        let telephoneNumber = $("#telephoneNumber").val();
        let phoneNumber = $("#phoneNumber").val();
        let emailEmployee = $("#emailEmployee").val();
        let bankAccount = $("#bankAccount").val();
        let bankName = $("#bankName").val();
        let bankBranch = $("#bankBranch").val();
        let employee = {
            EmployeeCode: employeecode,
            EmployeeName: employeename,
            DateOfBirth: dateofbirth,
            Gender: gender,
            DepartmentId: departmentID,
            DepartmentName: departmentName,
            EmployeePosition: position,
            IdentityNumber: identityNumber,
            IdentityDate: identityDate,
            IdentityPlace: identityPlace,
            Address: address,
            TelephoneNumber: telephoneNumber,
            PhoneNumber: phoneNumber,
            Email: emailEmployee,
            BankAccountNumber: bankAccount,
            BankName: bankName,
            BankBranchName: bankBranch
        };
        return employee;
    } catch (error) {
        console.log(error);
    }
}

/**
* Hàm thực hiện thêm, sửa nhân viên
* Author: LQTrung (20/10/2022)
*/
function btnSaveOnClick() {
    try {
        //Kích nút "cất"
        $("#btnAddEmployee").click(function () {
            var isValid = validateForm();
            if (isValid) {
                let employee = getEmployeeFromForm();
                //Gọi api thực hiện thêm mới nhân viên
                if (formMode == "insert") {
                    $.ajax({
                        type: 'POST',
                        url: 'https://amis.manhnv.net/api/v1/Employees',
                        data: JSON.stringify(employee),
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (response) {
                            $('.m-popup').removeClass("display-f");
                            $('.m-popup input:not([name="Gender"])').val('');
                            loadData();
                            // Hiển thị dialog thêm thành công
                            $('.m-employee-success .m-content-message').text('Thêm nhân viên thành công');
                            $('.m-employee-success').addClass("display-b");

                        },
                        error: function (response) {
                            switch (response.status) {
                                case 400:
                                    let dangerMessage = response.responseJSON.userMsg;
                                    $('.m-employee-danger .m-content-message').html(dangerMessage);
                                    $('.m-employee-danger').addClass("display-b");
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                }
                // Gọi api sửa nhân viên
                else if (formMode == "edit") {
                    $.ajax({
                        type: 'PUT',
                        url: `https://amis.manhnv.net/api/v1/Employees/${employeeIDForEdit}`,
                        data: JSON.stringify(employee),
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (response) {
                            $(".loading-data").hide();
                            $('.m-popup').removeClass("display-f");
                            $('.m-popup input:not([name="Gender"])').val('');
                            // Load lại dữ liệu trên table
                            loadData();
                            // Hiển thị dialog sửa thành công
                            $('.m-employee-success .m-content-message').text('Sửa nhân viên thành công');
                            $('.m-employee-success').addClass("display-b");
                        },
                        error: function (response) {
                            // $('.m-loading-svg').hide();
                            switch (response.status) {
                                case 400:
                                    let dangerMessage = response.responseJSON.userMsg;
                                    $('.m-employee-danger .m-content-message').html(dangerMessage);
                                    $('.m-employee-danger').addClass("display-b");
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                }
            }
        });
        //Kích nút "cất và thêm"
        $("#btnAddAndResetEpl").click(function () {
            var isValid = validateForm();
            if (isValid) {
                let employee = getEmployeeFromForm();
                //Gọi api thực hiện thêm mới nhân viên
                if (formMode == "insert") {
                    $.ajax({
                        type: 'POST',
                        url: 'https://amis.manhnv.net/api/v1/Employees',
                        data: JSON.stringify(employee),
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (response) {
                            if (saveAndreset == 1)
                                $('.m-popup').removeClass("display-f");
                            $('.m-popup input:not([name="Gender"])').val('');
                            loadData();
                            // Hiển thị dialog thêm thành công
                            $('.m-employee-success .m-content-message').text('Thêm nhân viên thành công');
                            $('.m-employee-success').addClass("display-b");

                        },
                        error: function (response) {
                            switch (response.status) {
                                case 400:
                                    let dangerMessage = response.responseJSON.userMsg;
                                    $('.m-employee-danger .m-content-message').html(dangerMessage);
                                    $('.m-employee-danger').addClass("display-b");
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                }
                // Gọi api sửa nhân viên
                else if (formMode == "edit") {
                    $.ajax({
                        type: 'PUT',
                        url: `https://amis.manhnv.net/api/v1/Employees/${employeeIDForEdit}`,
                        data: JSON.stringify(employee),
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (response) {
                            $(".loading-data").hide();
                            // $('.m-popup').removeClass("display-f");
                            $('.m-popup input:not([name="Gender"])').val('');
                            // Load lại dữ liệu trên table
                            loadData();
                            // Hiển thị dialog sửa thành công
                            $('.m-employee-success .m-content-message').text('Sửa nhân viên thành công');
                            $('.m-employee-success').addClass("display-b");
                        },
                        error: function (response) {
                            // $('.m-loading-svg').hide();
                            switch (response.status) {
                                case 400:
                                    let dangerMessage = response.responseJSON.userMsg;
                                    $('.m-employee-danger .m-content-message').html(dangerMessage);
                                    $('.m-employee-danger').addClass("display-b");
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
}

/**
 * Hàm hiển thị danh sách nhân viên lên table
 * Author: LQTrung (16/10/2022)
*/
function loadData() {
    try {
        $("table#listEmployees tbody").empty();
        $(".loading-data").show();
        $.ajax({
            url: 'https://amis.manhnv.net/api/v1/Employees',
            method: "GET",
            data: null,//Tham số đầu vào cho API
            dataType: 'json', // Kiểu dữ liệ cả tham số mà mình truyền lên, vd khi thêm mới 1 nhân viên, thì data: employee, còn datatype chính là kiểu dữ liệu của employee đó
            // async: false,
            // contentType: 'application/json',
            success: function (response) {
                employeesArray = response;
                console.log(employeesArray);
                //Duyệt từng đối tượng trong mảng
                for (const employee of response) {
                    //Lấy ra các thông tin muốn hiển thị lên table
                    let employeecode = employee.EmployeeCode;
                    let employeename = employee.EmployeeName;
                    let dateofbirth = employee.DateOfBirth;
                    let gender = employee.GenderName;
                    let departmentName = employee.DepartmentName;
                    let position = employee.EmployeePosition;
                    let identityNumber = employee.IdentityNumber;
                    let bankAccount = employee.BankAccountNumber;
                    let bankName = employee.BankName;
                    let bankBranch = employee.BankBranchName;
                    //Định dạng dữ liệu 
                    //Lấy ra ngày tháng
                    if (dateofbirth) {
                        dateofbirth = new Date(dateofbirth);
                        let date = dateofbirth.getDate();
                        date = date < 10 ? `0${date}` : date;
                        let month = dateofbirth.getMonth() + 1;
                        month = month < 10 ? `0${month}` : month;
                        let year = dateofbirth.getFullYear();
                        dateofbirth = `${date}/${month}/${year}`;
                    }
                    // ondblclick="dblClickTrTable()"
                    //Build chuỗi HTML
                    var col = $(`<tr>
                    <td class="text-align-center ">
                        <input type="checkbox" name="choose" class="m-input-checkbox" data-id=${employeecode}>
                    </td>
                    <td class="text-align-left">${employeecode}</td>
                    <td class="text-align-left">${employeename}</td>
                    <td class="text-align-left">${gender ? gender : ""}</td>
                    <td class="text-align-left">${dateofbirth ? dateofbirth : ""}</td>
                    <td class="text-align-left">${identityNumber ? identityNumber : ""}</td>
                    <td class="text-align-left">${position ? position : ""}</td>
                    <td class="text-align-left">${departmentName ? departmentName : ""} </td>
                    <td class="text-align-left">${bankAccount ? bankAccount : ""}</td>
                    <td class="text-align-left">${bankName ? bankName : ""}</td>
                    <td class="text-align-left">${bankBranch ? bankBranch : ""}</td>
                    <td class="text-align-center show-contexMenu" style="z-index: 2;">
                        <div class="function-col">
                            <div class="function-col__update">
                                <button class="btn-edit-epl" data-id=${employeecode}>Sửa</button>
                            </div>
                            <div class="function-col__menu m-ml-8">
                                <button>
                                    <div class="m-icon-16 m-icon-arrow-down-blue ">
                                    </div>
                                </button>
                                <div class="child-multi-choices" style="min-width:120px">
                                    <div class="duplication m-chil-dd">Nhân bản</div>
                                    <div class="delete-epl m-chil-dd" data-id=${employeecode}>Xóa</div>
                                    <div class="pause m-chil-dd">Ngưng sử dụng</div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>`);
                    col.data("entity", employee);
                    //Append chuỗi vào DOM
                    $("table#listEmployees tbody").append(col);
                }
                $(".loading-data").hide();
            },
            error: function (response) {
                console.log(response);
            }
        });

    } catch (error) {
        console.log(error);
    }
}


//#region Xử lý dropdown đơn vị
// 1. Mở và đóng dropdown chọn đơn vị
$('.dropdownlist__button').click(function () {
    if ($('.dropdownlist__data').hasClass('m-open')) {
        $('.dropdownlist__data').removeClass('m-open').hide();
    } else {
        $('.dropdownlist__data').addClass('m-open').show();
    }
});
// 2. Người dùng chọn đơn vị
$(document).on('click', '.m-menu-items-tr', function () {
    let department = $(this).data('object');
    $('input[name="DepartmentId"]').val(department.DepartmentId);
    $('input[name="DepartmentName"]').val(department.DepartmentName);
    $('.dropdownlist__data').removeClass('m-open').hide();
});

// Gọi API lấy dữ liệu đơn vị
$.ajax({
    type: 'GET',
    url: 'https://amis.manhnv.net/api/v1/Departments',
    success: function (response) {
        const departments = response;
        $('.m-departments-list').empty();
        for (const department of departments) {
            var trHTML = $(`
            <tr class="m-menu-items-tr">
                <td class="m-menu-items-td" style=" text-align: left; width:0px;" ><span>${department.DepartmentCode ? department.DepartmentCode : ''}</span></td>
                <td class="m-menu-items-td" style=" text-align: left"><span>${department.DepartmentName}</span></td>
            </tr>
            `);
            $(trHTML).data('object', department);
            $('.m-departments-list').append(trHTML);
        }
    },
    error: function () {
        debugger;
    },
});
//#endregion

// Ngăn không cho load lại trang ngay sau khi click nút "cất" và nút "cất và thêm"
$("#btnAddEmployee").on("click", function (e) {
    try {
        e.preventDefault();
    } catch (error) {
        console.log(error);
    }
})
$("#btnAddAndResetEpl").on("click", function (e) {
    try {
        e.preventDefault();
    } catch (error) {
        console.log(error);
    }
})

// Click vào dropdown phân trang để chọn số bản ghi hiển thị trên 1 trang
$(".btn-pagination").click(function () {

    if ($(".numbers-record-in-a-page").hasClass("display-b"))
        $(".numbers-record-in-a-page").removeClass("display-b")
    else
        $(".numbers-record-in-a-page").addClass("display-b")
})
/**
 * Hàm dừng tabIndex 
 * @param {event} event
 * Author: LQTrung (16/10/2022)
 */
function stopTabIndex(event) {
    try {
        event.preventDefault();

    } catch (error) {
        console.log(error);
    }
}
//Kích biểu tượng refresh để load lại dữ liệu bảng
$(".m-btn-refresh").on("click", loadData);