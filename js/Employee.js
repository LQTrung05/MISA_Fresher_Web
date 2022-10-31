window.onload = function () {
    openCloseFormEmployee();
    handerCheckbox();
    loadData();
    deleteEmployee();
    editEmployee();
    closeArlertDialog(".m-employee-danger");
    closeArlertDialog(".m-employee-success");
    btnSaveOnClick();
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
    $(".btn-add-epl").click(function () {
        //Cờ đánh dấu thực hiện thêm mới nhân viên
        formMode = "insert";
        $(".popup-title-name").html("Thêm mới nhân viên");
        $(".loading-data").show();
        setTimeout(function () {
            $(".loading-data").hide();
            $(".m-popup").addClass("display-f");
            $("#employeeCode").focus();
        }, 500)
        validateForm();
    });
    // Đóng form thêm, sửa nhân viên
    $(".js-close-form").each(function () {
        $(this).click(function () {
            $(".m-popup").removeClass("display-f");
            resetForm();
        })
    })

}
/**
 * Xử lý các sự kiện liên quan đến checkbox
 * Author: LQTrung (20/10/2022)
 */
function handerCheckbox() {
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

}

//#region Các hàm kiểm tra dữ liệu nhập vào

/**
 * Hàm hiển thị thông báo lỗi dưới ô input khi nhập sai định dạng dữ liệu
 * @param {css selector} selector element được chọn
 * @param {string} message thông báo lỗi
 */
function showMessageError(selector, message) {
    $(selector).addClass("m-input-form-error");
    $(selector).next().show();
    $(selector).next().html(message);
}
/**
 * Hàm xóa thông báo lỗi khi dữ liệu nhập đúng
 * @param {css selector} selector element được chọn
 */
function hiddenMessageError(selector) {
    $(selector).removeClass("m-input-form-error");
    $(selector).next().hide();
}
/**
 * Hàm đóng dialog
 * @param {css selector} selector element bị đóng khi kích nút
 */
function closeArlertDialog(selector) {
    $(".js-close-dialog").each(function () {
        $(this).click(function () {
            $(selector).removeClass("display-b");
        })
    })

}
//#endregion

//#region Các hàm validate dữ liệu khi thêm mới hoặc sửa thông tin nhân viên

/**
 * Hàm validate dữ liệu nhập vào
 * Author: LQTrung (20/10/2022)
 */
function validateForm() {
    if (validateEmployeeCode && validateEmployeeName && validateDepartment &&
        validateDateOfBirth && validateEmail && validateIdentityNumber && validateIdentityDate)
        return true;
    else
        return false;
}
// các biến toàn cục để validate dữ liệu nhập vào form
var validateEmployeeCode = true;
var validateEmployeeName = true;
var validateDepartment = true;
var validateDateOfBirth = true;
var validateEmail = true;
var validateIdentityNumber = true;
var validateIdentityDate = true;


//Validate mã nhân viên nhập vào bằng sự kiện blur 
$("#employeeCode").blur(function () {
    let valueOfEmployeeCode = $("#employeeCode");
    let regex = /^[a-zA-Z]+[0-9]+$/;
    if (!(valueOfEmployeeCode.val())) {
        showMessageError(valueOfEmployeeCode, "Không để trống mã");
        validateEmployeeCode = false;
    }
    else if (!(regex.test(valueOfEmployeeCode.val().toLowerCase()))) {
        showMessageError(valueOfEmployeeCode, "Mã phải kết thúc là 1 số");
        validateEmployeeCode = false;
    } else {
        hiddenMessageError(valueOfEmployeeCode);
        validateEmployeeCode = true;
    }
})

//Validate tên nhân viên không được để trống
$("#employeeName").blur(function () {
    let value = $("#employeeName");
    if (!(value.val())) {
        showMessageError(value, "Không để trống tên");
        validateEmployeeName = false;
    }
    else {
        hiddenMessageError(value);
        validateEmployeeName = true;
    }
})

//Validate tên đơn vị không được để trống
$("#departmentName").blur(function () {
    let value = $("#departmentName");
    console.log(value.val());
    if (!(value.val())) {
        value.addClass("m-input-form-error");
        $(".err-department-not-null").html("Không để trống đơn vị");
        $(".err-department-not-null").show();
        validateDepartment = false;
    } else {
        value.removeClass("m-input-form-error");
        $(".err-department-not-null").hide();
        validateDepartment = true;
    }
})

//Validate ngày sinh
$("#dateOB").blur(function () {
    let dob = $("#dateOB").val();
    //Nếu ngày sinh có giá trị thì convert về dạng dd/mm/yy
    if (dob) {
        dob = new Date(dob);
        validateDateOfBirth = true;
    }
    if (dob > new Date()) {
        showMessageError($("#dateOB"), "Ngày sinh không thể lớn hơn ngày hiện tại")
        validateDateOfBirth = false;
    } else {
        hiddenMessageError($("#dateOB"));
        validateDateOfBirth = true;
    }
})
//Validate ngày cấp cccd không được lớn hơn ngày hiện tại
$("#identityDate").blur(function () {
    let dob = $("#identityDate").val();
    //Nếu ngày sinh có giá trị thì convert về dạng dd/mm/yy
    if (dob) {
        dob = new Date(dob);
        validateIdentityDate = true;
    }
    if (dob > new Date()) {
        showMessageError($("#identityDate"), "Ngày cấp không thể lớn hơn ngày hiện tại")
        validateIdentityDate = false;
    } else {
        hiddenMessageError($("#identityDate"));
        validateIdentityDate = true;
    }
})

//validate số cccd phải là 1 dãy 12 chữ số
$("#identityNumber").blur(function () {
    var identityNumber = $("#identityNumber");
    var regexIN = /[0-9]{12}/;
    //Nếu không nhập gì thì bỏ qua
    if (identityNumber.val() == "") {
        hiddenMessageError(identityNumber);
        validateIdentityNumber = true;
    }
    else if (!(regexIN.test(identityNumber.val()))) {
        showMessageError(identityNumber, "Số CMND phải là 1 dãy 12 chữ số");
        validateIdentityNumber = false;
    }
    else {
        hiddenMessageError(identityNumber);
        validateIdentityNumber = true;

    }

})
//Validate email đúng định dạng
$("#emailEmployee").blur(function () {
    var email = $("#emailEmployee");
    var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.val() == "") {
        hiddenMessageError(email);
        validateEmail = true;
    }
    else if (!(regexEmail.test(email.val().toLowerCase()))) {
        showMessageError(email, "Email sai định dạng");
        validateEmail = false;
    }
    else {
        hiddenMessageError(email);
        validateEmail = true;
    }
})
//#endregion

/**
 * Hàm định dạng dữ liệu kiểu ngày tháng để đưa lên date picker
 * @param {datetime} value 
 * @returns Trả vềngày tháng theo dạng yy-mm-dd
 * Author: LQTrung(25/10/2022)
 */
function formatDateData(value) {

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
}
/**
 * Hàm đưa thông tin chi tiết của 1 nhân viên lên popup
 * Author: LQTrung (25/10/2022)
 */
function detailEmployee(epl) {

    $("#employeeCode").val(epl.EmployeeCode);
    $("#employeeName").val(epl.EmployeeName);

    let male = 1;
    let female = 0;

    if (epl.Gender == male)
        $("#rdMale").prop("checked", true);
    else if (epl.Gender == female)
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


}

/**
 * Hàm lấy ra thông tin chi tiết 1 nhân viên để sửa
 * Author: LQTrung (22/10/2022)
 */
function editEmployee() {

    $(".m-table")
        .on("dblclick", "tr", function () {
            $(".popup-title-name").html("Sửa thông tin nhân viên");
            formMode = "edit";
            // Lấy ra đối tượng tương ứng với dòng được chọn
            let epl = $(this).data("entity");
            employeeIDForEdit = epl.EmployeeId;
            console.log(epl);
            detailEmployee(epl);
        })
        .on("click", ".btn-edit-epl", function () {
            formMode = "edit";
            $(".popup-title-name").html("Sửa thông tin nhân viên");
            let epl;
            // Lấy ra đối tượng tương ứng với dòng được chọn
            for (const i of employeesArray) {
                if ($(this).data("id") === i.EmployeeCode)
                    epl = i;
            }
            employeeIDForEdit = epl.EmployeeId;
            detailEmployee(epl);
        })
}

/**
 * Hàm gọi api để xóa nhân viên được chọn
 * @param {object} employee nhân viên được chọn để xóa
 * Author: LQTrung (25/10/2022)
 */
function callAPIToDeleteEpl(employee) {

    $('.m-delete-warning .m-content-message').text(`Bạn có thực sự muốn xóa nhân viên có mã <${employee.EmployeeCode}> không?`);
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
                    $('.m-employee-success .m-content-message-success').text('Xóa thành công');
                    $('.m-employee-success').addClass("display-b");
                    setTimeout(() => {
                        $('.m-employee-success').removeClass("display-b");
                    }, 1500);
                },
                error: function () {
                    debugger;
                    console.log(error);
                },
            });
        });


}
/**
 * Hàm thực hiện xóa nhân viên khi kích nút xóa
 * Author: LQTrung (26/10/2022)
 */
function deleteEmployee() {

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




}

/**
 * Hàm lấy thông tin chi tiết của một nhân viên từ form để thực hiện thêm, sửa
 * @returns Thông tin chi tiết lấy từ form
 * Author: LQTrung (23/10/2022)
 */
function getEmployeeFromForm() {

    let employeeCode = $("#employeeCode").val();
    let employeeName = $("#employeeName").val();
    let dateOfBirth = $("#dateOB").val();
    let gender = null;
    let male = $("#rdMale");
    let female = $("#rdFemale");
    let other = $("#rdOther");

    let valueMale = 1;
    let valueFemale = 0;
    let valueOther = 2;
    if (male[0].checked == true)
        gender = valueMale;
    if (female[0].checked == true)
        gender = valueFemale;
    if (other[0].checked == true)
        gender = valueOther;
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
        EmployeeCode: employeeCode,
        EmployeeName: employeeName,
        DateOfBirth: dateOfBirth,
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

}

/**
* Hàm thực hiện thêm, sửa nhân viên
* Author: LQTrung (20/10/2022)
*/
function btnSaveOnClick() {

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
                        $('.m-employee-success .m-content-message-success').text('Thêm thành công');
                        $('.m-employee-success').addClass("display-b");
                        setTimeout(() => {
                            $('.m-employee-success').removeClass("display-b");
                        }, 1500);
                    },
                    error: function (response) {
                        switch (response.status) {
                            case 400:
                                let dangerMessage = response.responseJSON.userMsg;
                                $('.m-employee-danger .m-content-message').html(dangerMessage);
                                $('.m-employee-danger').addClass("display-b");
                                // showMessageError("#employeeCode", "Mã nhân viên đã tồn tại");
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
                        $('.m-employee-success .m-content-message-success').text('Sửa thành công');
                        $('.m-employee-success').addClass("display-b");
                        setTimeout(() => {
                            $('.m-employee-success').removeClass("display-b");
                        }, 1500);
                    },
                    error: function (response) {
                        $('.m-loading-svg').hide();
                        switch (response.status) {
                            case 500:
                                // let dangerMessage = response.responseJSON.userMsg;
                                // $('.m-employee-danger .m-content-message').html(dangerMessage);
                                // $('.m-employee-danger').addClass("display-b");
                                showMessageError("#employeeCode", "Mã nhân viên đã tồn tại");
                                break;
                            default:
                                console.log(response);
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
                        $('.m-popup input:not([name="Gender"])').val('');
                        loadData();
                        // Hiển thị dialog thêm thành công
                        $('.m-employee-success .m-content-message-success').text('Thêm thành công');
                        $('.m-employee-success').addClass("display-b");
                        setTimeout(() => {
                            $('.m-employee-success').removeClass("display-b");

                        }, 1500);
                        //reset lại form để thêm mới nhân viên mà không cần đóng form
                        resetForm();
                    },
                    error: function (response) {
                        switch (response.status) {
                            case 400:
                                // let dangerMessage = response.responseJSON.userMsg;
                                // $('.m-employee-danger .m-content-message').html(dangerMessage);
                                // $('.m-employee-danger').addClass("display-b");
                                showMessageError("#employeeCode", "Mã nhân viên đã tồn tại");
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
                        $('.m-employee-success .m-content-message-success').text('Sửa thành công');
                        $('.m-employee-success').addClass("display-b");
                        setTimeout(() => {
                            $('.m-employee-success').removeClass("display-b");

                        }, 1500);
                        resetForm();
                        $(".popup-title-name").html("Thêm mới nhân viên");
                        formMode ="insert";

                    },
                    error: function (response) {
                        // $('.m-loading-svg').hide();
                        switch (response.status) {
                            case 500:
                                // let dangerMessage = response.responseJSON.userMsg;
                                // $('.m-employee-danger .m-content-message').html(dangerMessage);
                                // $('.m-employee-danger').addClass("display-b");
                                showMessageError("#employeeCode","Mã nhân viên đã tồn tại");
                                break;
                            default:
                                console.log(response);
                                break;
                        }
                    }
                });
            }
        }
    })

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
                //Duyệt từng đối tượng trong mảng
                for (const employee of response) {
                    //Lấy ra các thông tin muốn hiển thị lên table
                    let employeeCode = employee.EmployeeCode;
                    let employeeName = employee.EmployeeName;
                    let dateOfBirth = employee.DateOfBirth;
                    let gender = employee.GenderName;
                    let departmentName = employee.DepartmentName;
                    let position = employee.EmployeePosition;
                    let identityNumber = employee.IdentityNumber;
                    let bankAccount = employee.BankAccountNumber;
                    let bankName = employee.BankName;
                    let bankBranch = employee.BankBranchName;
                    //Định dạng dữ liệu 
                    //Lấy ra ngày tháng
                    if (dateOfBirth) {
                        dateOfBirth = new Date(dateOfBirth);
                        let date = dateOfBirth.getDate();
                        date = date < 10 ? `0${date}` : date;
                        let month = dateOfBirth.getMonth() + 1;
                        month = month < 10 ? `0${month}` : month;
                        let year = dateOfBirth.getFullYear();
                        dateOfBirth = `${date}/${month}/${year}`;
                    }
                    // ondblclick="dblClickTrTable()"
                    //Build chuỗi HTML
                    var col = $(`<tr>
                    <td class="text-align-center ">
                        <input type="checkbox" name="choose" class="m-input-checkbox" data-id=${employeeCode}>
                    </td>
                    <td class="text-align-left">${employeeCode}</td>
                    <td class="text-align-left">${employeeName}</td>
                    <td class="text-align-left">${gender ? gender : ""}</td>
                    <td class="text-align-left">${dateOfBirth ? dateOfBirth : ""}</td>
                    <td class="text-align-left">${identityNumber ? identityNumber : ""}</td>
                    <td class="text-align-left">${position ? position : ""}</td>
                    <td class="text-align-left">${departmentName ? departmentName : ""} </td>
                    <td class="text-align-left">${bankAccount ? bankAccount : ""}</td>
                    <td class="text-align-left">${bankName ? bankName : ""}</td>
                    <td class="text-align-left">${bankBranch ? bankBranch : ""}</td>
                    <td class="text-align-center show-contexMenu" style="z-index: 2;">
                        <div class="function-col">
                            <div class="function-col__update">
                                <button class="btn-edit-epl" data-id=${employeeCode}>Sửa</button>
                            </div>
                            <div class="function-col__menu m-ml-8">
                                <button>
                                    <div class="m-icon-16 m-icon-arrow-down-blue ">
                                    </div>
                                </button>
                                <div class="child-multi-choices" style="min-width:120px">
                                    <div class="duplication m-chil-dd">Nhân bản</div>
                                    <div class="delete-epl m-chil-dd" data-id=${employeeCode}>Xóa</div>
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
    error: function (response) {
        console.log(response);
    },
});
//#endregion

// Ngăn không cho load lại trang ngay sau khi click nút "cất" và nút "cất và thêm"
$("#btnAddEmployee").on("click", function (e) {
    e.preventDefault();
})
$("#btnAddAndResetEpl").on("click", function (e) {
    e.preventDefault();
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

    $("#employeeCode").focus();
    event.preventDefault();

}
/**
 * Hàm reset form khi đóng form thêm mới nhân viên
 * Author: LQTrung (28/10/2022) 
 */
function resetForm() {
    $("#employeeCode").val("");
    $("#employeeCode").removeClass("m-input-form-error");
    $("#employeeName").val("");
    $("#employeeName").removeClass("m-input-form-error");
    $("#dateOB").val("");
    $("#rdMale")[0].checked = "true";
    $("#departmentID").val("");
    $("#departmentName").val("");
    $("#departmentName").removeClass("m-input-form-error");
    $("#position").val("");
    $("#identityNumber").val("");
    $("#identityNumber").removeClass("m-input-form-error");
    $("#identityDate").val("");
    $("#identityPlace").val("");
    $("#address").val("");
    $("#telephoneNumber").val("");
    $("#phoneNumber").val("");
    $("#emailEmployee").val("");
    $("#bankAccount").val("");
    $("#bankName").val("");
    $("#bankBranch").val("");
    $(".err-message").hide();
    $("m-input-form-error").hide();


}
//Kích biểu tượng refresh để load lại dữ liệu bảng
$(".m-btn-refresh").on("click", loadData);



