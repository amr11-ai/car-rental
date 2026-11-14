/* myFunctions.js : الملف الوحيد لكل التوابع (JavaScript + jQuery) */

/* ---------- الخروج من الموقع ---------- */
function exitSite() {
  if (confirm("هل تريد الخروج من الموقع؟")) {
    window.location.href = "about:blank";
  }
}

/* ---------- توابع مساعدة ---------- */

/* هل المحرف رقم؟ */
function isDigit(ch) {
  return ch >= "0" && ch <= "9";
}

/* هل كل محارف النص أرقام؟ */
function allDigits(text) {
  var i;
  for (i = 0; i < text.length; i++) {
    if (!isDigit(text.charAt(i))) {
      return false;
    }
  }
  return true;
}

/* هل المحرف حرف عربي؟ */
function isArabicLetter(ch) {
  return ch >= "\u0621" && ch <= "\u064A";
}

/* ---------- توابع التحقق ---------- */

/* الاسم: أحرف عربية ومسافات فقط (يقبل الفراغ) */
function checkName(name) {
  var i;
  var ch;
  if (name === "") {
    return "";
  }
  for (i = 0; i < name.length; i++) {
    ch = name.charAt(i);
    if (ch !== " " && !isArabicLetter(ch)) {
      return "الاسم يجب أن يحتوي أحرفاً عربية فقط";
    }
  }
  return "";
}

/* الرقم الوطني: إلزامي، 11 رقماً، أول رقمين بين 01 و14 */
function checkNationalId(id) {
  if (id === "") {
    return "الرقم الوطني إلزامي";
  }
  if (id.length !== 11 || !allDigits(id)) {
    return "الرقم الوطني يجب أن يتكون من 11 رقماً";
  }
  var province = parseInt(id.substring(0, 2), 10);
  if (province < 1 || province > 14) {
    return "أول رقمين يجب أن يكونا بين 01 و14";
  }
  return "";
}

/* الموبايل: Syriatel (093, 098, 099) و MTN (094, 095, 096) - يقبل الفراغ */
function checkMobile(mobile) {
  var prefixes = ["093", "098", "099", "094", "095", "096"];
  var found = false;
  var i;
  if (mobile === "") {
    return "";
  }
  if (mobile.length === 10 && allDigits(mobile)) {
    for (i = 0; i < prefixes.length; i++) {
      if (mobile.substring(0, 3) === prefixes[i]) {
        found = true;
      }
    }
  }
  if (!found) {
    return "رقم غير مطابق لشبكتي Syriatel أو MTN (مثال: 0933123456)";
  }
  return "";
}

/* البريد الإلكتروني: يقبل الفراغ */
function checkEmail(email) {
  if (email === "") {
    return "";
  }
  var at = email.indexOf("@");
  var dot = email.lastIndexOf(".");
  if (email.indexOf(" ") !== -1 || at < 1 || at !== email.lastIndexOf("@") ||
      dot < at + 2 || dot === email.length - 1) {
    return "البريد الإلكتروني غير صحيح";
  }
  return "";
}

/* ---------- توابع التاريخ (بدون كائن Date) ---------- */

/* هل السنة كبيسة؟ */
function isLeapYear(y) {
  if (y % 400 === 0) {
    return true;
  }
  if (y % 100 === 0) {
    return false;
  }
  return y % 4 === 0;
}

/* عدد أيام الشهر */
function daysInMonth(y, m) {
  if (m === 2) {
    if (isLeapYear(y)) {
      return 29;
    }
    return 28;
  }
  if (m === 4 || m === 6 || m === 9 || m === 11) {
    return 30;
  }
  return 31;
}

/* رقم اليوم: عدد الأيام منذ بداية السنة 1 (لحساب الفرق بين تاريخين) */
function dayNumber(y, m, d) {
  var total = 0;
  var i;
  for (i = 1; i < y; i++) {
    if (isLeapYear(i)) {
      total = total + 366;
    } else {
      total = total + 365;
    }
  }
  for (i = 1; i < m; i++) {
    total = total + daysInMonth(y, i);
  }
  return total + d;
}

/* تحويل نص yyyy-mm-dd إلى رقم يوم، ويعيد 0 إذا كان التاريخ غير صحيح */
function parseDate(text) {
  if (text.length !== 10 || text.charAt(4) !== "-" || text.charAt(7) !== "-") {
    return 0;
  }
  var yearText = text.substring(0, 4);
  var monthText = text.substring(5, 7);
  var dayText = text.substring(8, 10);
  if (!allDigits(yearText) || !allDigits(monthText) || !allDigits(dayText)) {
    return 0;
  }
  var y = parseInt(yearText, 10);
  var m = parseInt(monthText, 10);
  var d = parseInt(dayText, 10);
  if (y < 1 || m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) {
    return 0;
  }
  return dayNumber(y, m, d);
}

/* ---------- عدد السيارات المختارة ---------- */
function countSelected() {
  var count = 0;
  var total = $(".select-box").length;
  var i;
  for (i = 1; i <= total; i++) {
    if ($("#select" + i).prop("checked")) {
      count = count + 1;
    }
  }
  return count;
}

/* ---------- الصفحة جاهزة ---------- */
$(document).ready(function () {

  /* زر الخروج */
  $("#exit-link").click(function (event) {
    event.preventDefault();
    exitSite();
  });

  /* إظهار/إخفاء تفاصيل السيارة: المربع show1 يتحكم بالصف details1 وهكذا */
  $(".details-box").click(function () {
    var number = $(this).attr("id").substring(4);
    $("#details" + number).toggle();
  });

  /* زر متابعة: يظهر النموذج بعد اختيار سيارة */
  $("#continue-btn").click(function () {
    if (countSelected() === 0) {
      alert("الرجاء اختيار سيارة واحدة على الأقل");
      return;
    }
    $("#booking").slideDown();
  });

  /* زر إرسال */
  $("#booking-form").submit(function (event) {
    event.preventDefault();

    var name = $.trim($("#fullname").val());
    var nid = $.trim($("#nid").val());
    var startText = $.trim($("#start-date").val());
    var endText = $.trim($("#end-date").val());
    var mobile = $.trim($("#mobile").val());
    var email = $.trim($("#email").val());

    var errName = checkName(name);
    var errNid = checkNationalId(nid);
    var errMobile = checkMobile(mobile);
    var errEmail = checkEmail(email);
    var errStart = "";
    var errEnd = "";

    var startDay = parseDate(startText);
    var endDay = parseDate(endText);

    if (startText === "") {
      errStart = "تاريخ البداية إلزامي";
    } else if (startDay === 0) {
      errStart = "الصيغة المطلوبة yyyy-mm-dd وتاريخ صحيح";
    }

    if (endText === "") {
      errEnd = "تاريخ النهاية إلزامي";
    } else if (endDay === 0) {
      errEnd = "الصيغة المطلوبة yyyy-mm-dd وتاريخ صحيح";
    } else if (startDay !== 0 && endDay <= startDay) {
      errEnd = "تاريخ النهاية يجب أن يكون لاحقاً لتاريخ البداية";
    }

    $("#err-name").text(errName);
    $("#err-nid").text(errNid);
    $("#err-start").text(errStart);
    $("#err-end").text(errEnd);
    $("#err-mobile").text(errMobile);
    $("#err-email").text(errEmail);

    if (errName !== "" || errNid !== "" || errStart !== "" || errEnd !== "" || errMobile !== "" || errEmail !== "") {
      return;
    }

    if (countSelected() === 0) {
      alert("الرجاء اختيار سيارة واحدة على الأقل");
      return;
    }

    /* عدد أيام التأجير */
    var days = endDay - startDay;

    /* حساب المجموع لكل سيارة مختارة */
    var total = 0;
    var message = "السيارات المختارة وعدد أيام التأجير:\n";
    var carCount = $(".select-box").length;
    var i;
    var model;
    var price;
    var carTotal;

    for (i = 1; i <= carCount; i++) {
      if ($("#select" + i).prop("checked")) {
        model = $("#model" + i).text();
        price = parseInt($("#price" + i).text(), 10);
        carTotal = price * days;
        total = total + carTotal;
        message = message + "- " + model + ": " + days + " يوم × " + price + " = " + carTotal + " ل.س\n";
      }
    }

    /* الخصم 10% إذا زادت المدة عن 7 أيام */
    var discount = 0;
    if (days > 7) {
      discount = total / 10;
    }
    var finalAmount = total - discount;

    message = message + "\nالمجموع: " + total + " ل.س";
    if (discount > 0) {
      message = message + "\nالخصم (10%): " + discount + " ل.س";
    } else {
      message = message + "\nالخصم: لا يوجد (المدة 7 أيام أو أقل)";
    }
    message = message + "\nالمبلغ النهائي: " + finalAmount + " ل.س";

    alert(message);
  });

});
