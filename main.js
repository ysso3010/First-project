// تحميل بيانات الطلاب من الـ localStorage إذا كانت موجودة
let students = JSON.parse(localStorage.getItem("students")) || [];

// دالة لتسجيل البيانات
document.getElementById("paymentForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let month = document.getElementById("month").value.trim();
    let paymentStatus = document.getElementById("paymentStatus").value;

    if (!name || !month) {
        alert("يرجى إدخال اسم الطالب والشهر.");
        return;
    }

    // التحقق إذا كان الطالب موجودًا
    let student = students.find(s => s.name.toLowerCase() === name.toLowerCase());

    if (!student) {
        student = {
            name: name,
            payments: {}
        };
        students.push(student);
    }

    // التحقق إذا كان الشهر مدفوعًا بالفعل
    if (student.payments[month] === "paid") {
        alert("تم تسجيل هذا الشهر بالفعل كمدفوع.");
        return;
    }

    // تسجيل حالة الشهر
    student.payments[month] = paymentStatus === "yes" ? "paid" : "unpaid";

    // حفظ البيانات في الـ localStorage
    localStorage.setItem("students", JSON.stringify(students));

    alert("تم تسجيل البيانات بنجاح!");
    displayStudents();
    document.getElementById("paymentForm").reset();
});

// دالة للبحث عن الطالب
function searchStudent() {
    let searchName = document.getElementById("searchName").value.trim();
    let student = students.find(s => s.name.toLowerCase() === searchName.toLowerCase());

    let studentInfo = document.getElementById("studentInfo");
    studentInfo.innerHTML = "";

    if (student) {
        let paidMonths = Object.keys(student.payments).filter(month => student.payments[month] === "paid");
        let unpaidMonths = Object.keys(student.payments).filter(month => student.payments[month] === "unpaid");

        studentInfo.innerHTML = `
            <p>الطالب: ${student.name}</p>
            <p>الشهور المدفوعة: ${paidMonths.join(", ")}</p>
            <p>الشهور غير المدفوعة: ${unpaidMonths.join(", ")}</p>
        `;
    } else {
        studentInfo.innerHTML = "<p>لم يتم العثور على الطالب.</p>";
    }
}

// دالة لعرض الطلاب في الجدول
function displayStudents() {
    let tableBody = document.querySelector("#studentsTable tbody");
    tableBody.innerHTML = "";

    students.forEach(student => {
        let paidMonths = Object.keys(student.payments).filter(month => student.payments[month] === "paid");
        let unpaidMonths = Object.keys(student.payments).filter(month => student.payments[month] === "unpaid");

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${paidMonths.join(", ")}</td>
            <td>${unpaidMonths.join(", ")}</td>
            <td>
                <button onclick="editStudent('${student.name}')">تعديل</button>
                <button onclick="deleteStudent('${student.name}')">حذف</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// دالة لتعديل بيانات الطالب
function editStudent(name) {
    let student = students.find(s => s.name === name);

    if (student) {
        let newMonth = prompt("أدخل الشهر الجديد:");
        let newPaymentStatus = prompt("أدخل حالة الدفع (yes أو no):");

        if (newMonth && newPaymentStatus) {
            student.payments[newMonth.trim()] = newPaymentStatus === "yes" ? "paid" : "unpaid";
            localStorage.setItem("students", JSON.stringify(students));
            alert("تم تعديل البيانات بنجاح!");
            displayStudents();
        }
    } else {
        alert("الطالب غير موجود.");
    }
}

// دالة لحذف الطالب
function deleteStudent(name) {
    let studentIndex = students.findIndex(s => s.name === name);

    if (studentIndex !== -1) {
        students.splice(studentIndex, 1);
        localStorage.setItem("students", JSON.stringify(students));
        alert("تم حذف الطالب بنجاح!");
        displayStudents();
    } else {
        alert("الطالب غير موجود.");
    }
}

// استدعاء الدالة عند تحميل الصفحة
displayStudents();

// تسجيل الـ Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((error) => console.error("Service Worker Registration Failed:", error));
  }