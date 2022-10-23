window.onload = function () {
    try {
        openFormAddEmployee();
        closeFormAddEmployee();
        clickSubmitForm();
        showBtnDelete();
        closeArlertDialog(".m-employee-danger");
        closeArlertDialog(".m-employee-success");
        loadData();
    } catch (error) {
        console.log(error);
    }
}

//#region Các hàm liên quan đến đóng mở form thêm, sửa nhân viên

/**
 * Hàm mở form thêm mới nhân viên
 * Author: LQTrung (16/10/22)
 */
function openFormAddEmployee() {
    try {
        $(".js-open").each(function () {
            $(this).click(function () {
                $(".loading-data").show();
                setTimeout(function () {
                    $(".loading-data").hide();
                    $(".m-popup").addClass("display-f");
                    $("#employeeID").focus();
                }, 500)
            });
        })
    } catch (error) {
        console.log(error);
    }
}

/**
 * Hàm đóng form thêm mới nhân viên
 * Author: LQTrung (16/10/22)
 */
function closeFormAddEmployee() {
    try {
        $(".js-close-form").each(function () {
            $(this).click(function () {
                $(".m-popup").removeClass("display-f");
            })
        })
    } catch (error) {
        console.log(error);
    }

}
//#endregion

//#region Các hàm xử lý checkbox trong table
/**
 * Hàm chọn tất cả các dòng trong table bằng cách click vào checkbox trên th của table
 * @param {string} source 
 */
function chooseAll(source) {
    checkboxes = document.getElementsByName('choose');
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = source.checked;
    }
}
/**
 * Hàm hiển thị nút xóa khi click vào ô checkbox trong table
 * Author: LQTrung (21/10/22)
 */
function showBtnDelete() {
    // Khi click vào ô checkbox chọn tất cả các dòng
    var btnDelete = document.getElementById("btn-delete");
    var chooseAll = document.getElementById("choose-all");
    var count = 0;
    chooseAll.addEventListener("change", function () {
        if (this.checked) {
            btnDelete.removeAttribute("disabled");
            count = checkboxes.length;
            console.log(count);
        }
        else {
            btnDelete.setAttribute("disabled", "");
            count = 0;
            console.log(count);
        }
    })
    // Khi click vào các ô checkbox ở mỗi dòng
    var checkboxes = document.querySelectorAll("input[type=checkbox][name=choose]");
    console.log(checkboxes.length)
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                btnDelete.removeAttribute("disabled");
                count++;
                console.log(count);
            } else if (!this.checked) {
                count--;
                console.log(count);
            }
            if (count == checkboxes.length)
                chooseAll.setAttribute("checked", "true");
            else if (count < checkboxes.length)
                chooseAll.removeAttribute("checked");
            if (count == 0) {
                chooseAll.removeAttribute("checked");
                btnDelete.setAttribute("disabled", "");

            }
        })
    });
}
//#endregion

//#region Các hàm hiển thị, ẩn dialog lỗi, thông báo thành công, thất bại

/**
 * Hàm hiển thị thông báo lỗi dưới ô input khi nhập sai định dạng dữ liệu
 * @param {css selector} selector element được chọn
 * @param {string} message thông báo lỗi
 */
function showMessageError(selector, message) {
    selector.classList.add("m-input-form-error");
    var err = selector.nextElementSibling;
    err.style.display = "block";
    err.innerHTML = message;

}
/**
 * Hàm xóa thông báo lỗi khi dữ liệu nhập đúng
 * @param {css selector} selector element được chọn
 */
function hiddenMessageError(selector) {
    selector.classList.remove("m-input-form-error");
    var err = selector.nextElementSibling;
    err.style.display = "none";
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
 * Author: LQTrung (20/10/22)
 */
function validateForm() {
    if (
        validateInputRequired() &&
        validateEmail() &&
        dataMustIsNumberString("identityNumber", "Số CMND phải là một dãy 12 chữ số", 12) &&
        dataMustIsNumberString("bankAccount", "Số tài khoản phải là một dãy các chữ số",) &&
        validateDateTime("#dateOB", "Ngày sinh") &&
        validateDateTime("#identityDate", "Ngày cấp")
    )
        return true;
    else return false;
}
/**
 * Hàm validate các trường bắt buộc phải nhập
 * Author: LQTrung (20/10/22)
 */
function validateInputRequired() {
    try {
        //Các thông tin bắt buộc nhập
        // Khi blur ra input có dữ liệu thì bỏ border màu đỏ đi
        $(".required").each(function () {
            $(this).blur(function () {
                if (!($(this).val() === ""))
                    $(this).removeClass('m-input-form-error');
            });
        })
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
 *  Author: LQTrung (20/10/22)
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
 * Hàm validate dữ liệu nhập vào bắt buộc phài là 1 dãy số
 * @param {css selector} selector elemement được chọn để validate
 * @param {string} message thông báo lỗi
 * @param {number} lengNS độ dài dãy số hợp lệ 
 * Author: LQTrung (21/10/22)
 */
function dataMustIsNumberString(selector, message, lengNS) {
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
 * Hàm validate element kiểu datetime
 * @param {css selector} selector element được cần validate
 * @param {string} message thông báo lỗi 
 * @returns true nếu không lỗi, false nếu có lỗi
 */
function validateDateTime(selector, message) {
    try {
        // var dateOB = document.getElementById(selector);
        // var valueDOB = new Date(dateOB.value);
        // var today = new Date();
        // var day = valueDOB.getDate();
        // var month = (valueDOB.getMonth() + 1);
        // var year = valueDOB.getFullYear();
        // if (year > today.getFullYear()) {
        //     showMessageError(dateOB, message + " không thể lớn hơn ngày hiện tại")
        //     return false;
        // }
        // else if (month > (today.getMonth() + 1)) {
        //     showMessageError(dateOB, message + " không thể lớn hơn ngày hiện tại")
        //     return false;
        // }
        // else if (day > today.getDate()) {
        //     showMessageError(dateOB, message + " không thể lớn hơn ngày hiện tại")
        //     return false;
        // }
        // else {
        //     hiddenMessageError(dateOB);
        //     return true;
        // }

        let dob = $(selector).val();
        //Nếu ngày sinh có giá trị thì convert về dạng dd/mm/yy
        if (dob) {
            dob = new Date(dob);
            return true;
        }
        if (dob > new Date()) {
            showMessageError(selector, message + " không thể lớn hơn ngày hiện tại")
            return false;
        }
        return true;

    } catch (error) {
        console.log(error);
    }

}

//#endregion

//#region Thêm mới nhân viên

/**
* Hàm thực hiện thêm nhân viên
* Author: LQTrung (20/10/22)
*/
function btnSaveOnClick() {
    try {
        // alert("thêm ");
        //Validate dữ liệu
        var isValid = validateForm();
        if (isValid) {
            let employeeid = $("#employeeID").val();
            let employeename = $("#employeeName").val();
            let dateofbirth = $("#dateOB").val();
            let gender = null;
            let male = $("#rdMale");
            let female = $("#rdFemale");
            let other = $("#rdOther");
            if (male[0].checked == true)
                gender = 0;
            if (female[0].checked == true)
                gender = 1;
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
                EmployeeCode: employeeid,
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

            //Gọi api thực hiện cất dữ liệu
            $(".loading-data").show();
            $.ajax({
                type: 'POST',
                url: 'https://amis.manhnv.net/api/v1/Employees',
                data: JSON.stringify(employee),
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {
                    $(".loading-data").hide();
                    $('.m-popup').removeClass("display-f");
                    // $(".m-popup").removeClass("display-f");
                    $('.m-popup input:not([name="Gender"])').val('');
                    // Load lại dữ liệu trên table
                    self.loadData();
                    // Hiển thị dialog thêm thành công
                    $('.m-employee-success .m-content-message').text('Thêm nhân viên thành công');
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
            //Kiểm tra kết quả, thông báo
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Hàm lắng nghe sự kiện click vào nút "Cất và Thêm mới"
 * Author: LQTrung (20/10/22)
 */
function clickSubmitForm() {
    try {
        $("#btnAddEmployee").click(btnSaveOnClick);
    } catch (error) {
        console.log(error);
    }
}


//#endregion

/**
 * Hàm hiển thị popup thông tin chi tiết nhân viên được chọn trên 1 dòng của table 
 * Author: LQTrung (16/10/22)
*/
function dblClickTrTable() {
    $(".m-table").on("dblclick", "tr", function () {

        // console.log(this);
        // Lấy ra đối tượng tương ứng với dòng được chọn
        let epl = $(this).data("entity");
        console.log(epl);
        $("#employeeID").val(epl.EmployeeCode);
        $("#employeeName").val(epl.EmployeeName);
        $("#dateOB").val();
        $("#departmentID").val(epl.DepartmentId);
        $("#departmentName").val(epl.DepartmentName);
        $("#position").val(epl.EmployeePosition);
        $("#identityNumber").val(epl.IdentityNumber);
        $("#identityDate").val(epl.IdentityDate);
        $("#identityPlace").val(epl.IdentityPlace);
        $("#address").val(eol.Address);
        $("#telephoneNumber").val(epl.TelephoneNumber);
        $("#phoneNumber").val(epl.PhoneNumber);
        $("#emailEmployee").val(epl.Email);
        $("#bankAccount").val(epl.BankAccountNumber);
        $("#bankName").val(epl.BankName);
        $("#bankBranch").val(epl.BankBranchName);

        $(".m-popup").addClass("display-f");

    })
}



//#region Binding dữ liệu ra table
function loadData() {
    try {
        $("table#listEmployees body").empty();
        $(".loading-data").show();
        $.ajax({
            url: 'https://amis.manhnv.net/api/v1/Employees',
            method: "GET",
            data: null,//Tham số đầu vào cho API
            dataType: 'json', // Kiểu dữ liệ cả tham số mà mình truyền lên, vd khi thêm mới 1 nhân viên, thì data: employee, còn datatype chính là kiểu dữ liệu của employee đó
            // async: false,
            // contentType: 'application/json',
            success: function (response) {
                // dataTable = response;
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

                    //Build chuỗi HTML
                    var col = $(`<tr ondblclick="dblClickTrTable()">
                    <td class="text-align-center ">
                        <input type="checkbox" name="choose">
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
                                <button class="js-open">Sửa</button>
                            </div>
                            <div class="function-col__menu m-ml-8">
                                <button>
                                    <div class="m-icon-16 m-icon-arrow-down-blue ">
                                    </div>
                                </button>
                                <div class="child-multi-choices">
                                    <div class="replication  m-chil-dd">Nhân bản</div>
                                    <div class="delete m-chil-dd">Xóa</div>
                                    <div class="pause m-chil-dd">Ngưng sử dụng</div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>`);
                // col.data =("entity", employee);
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
//#endregion

//#region Xử lý dropdown đơn vị
// 1. Mở và đóng dropdown chọn đơn vị
$('.dropdownlist__button').click(function () {
    if ($('.dropdownlist__data').hasClass('m-open')) {
        $('.dropdownlist__data').removeClass('m-open').hide();
    } else {
        $('.dropdownlist__data').addClass('m-open').show();
    }
});
// 3. Người dùng chọn đơn vị
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




// Ngăn không cho load lại trang ngay sau khi click nút
document.getElementById("btnAddEmployee").addEventListener("click", function (e) {
    e.preventDefault();
})

/**
 * Hàm dừng tabIndex 
 * @param {event} event
 * Author: LQTrung (16/10/22)
 */
 function stopTabIndex(event) {
    try {
        event.preventDefault();

    } catch (error) {
        console.log(error);
    }
}