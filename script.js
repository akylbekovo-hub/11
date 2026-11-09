
let count = 0;

// Счётчик
function updateCounter() {
    let counter = document.getElementById("counter");

    counter.textContent = count;

    if (count > 0) {
        counter.style.color = "green";
    } else if (count < 0) {
        counter.style.color = "red";
    } else {
        counter.style.color = "gray";
    }
}

function increase() {
    count++;
    updateCounter();
}

function decrease() {
    count--;
    updateCounter();
}

function reset() {
    count = 0;
    updateCounter();
}

// Сравнение двух чисел
function compareNumbers() {
    let a = Number(prompt("Введите первое число:"));
    let b = Number(prompt("Введите второе число:"));

    if (a > b) {
        alert("Первое число больше");
    } else if (b > a) {
        alert("Второе число больше");
    } else {
        alert("Числа равны");
    }
}

// Светофор
function trafficLight() {
    let color = prompt("Введите цвет светофора:");
    color = color ? color.toLowerCase().trim() : "";

    if (color === "красный") {
        alert("Остановись Бейба!");
    } else if (color === "желтый" || color === "жёлтый") {
        alert("Подожди Бейба!");
    } else if (color === "зеленый" || color === "зелёный") {
        alert("Теперь ехай, Бейба!");
    } else {
        alert("Неизвестный цвет");
    }
}


// ФИО
const FIO_REGEX = /^[А-ЯЁӨҮҢ][а-яёөүң]+(?:-[А-ЯЁӨҮҢ][а-яёөүң]+)?(?:\s[А-ЯЁӨҮҢ][а-яёөүң]+(?:-[А-ЯЁӨҮҢ][а-яёөүң]+)?){1,2}$/;

// Телефон Кыргызстан
const PHONE_REGEX = /^\+996[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}$/;

// Email
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const FIELDS = [
    { id: "fio",   regex: FIO_REGEX,   empty: "Введите ФИО",
      wrong: "Формат: Фамилия Имя Отчество (с заглавных букв, кириллицей)" },
    { id: "phone", regex: PHONE_REGEX, empty: "Введите номер телефона",
      wrong: "Формат: +996 XXX XX XX XX" },
    { id: "email", regex: EMAIL_REGEX, empty: "Введите email",
      wrong: "Некорректный email, пример: name@example.com" }
];

function validateField(field) {
    let input = document.getElementById(field.id);
    let error = document.getElementById(field.id + "Error");
    let value = input.value.trim();
    let message = "";

    if (value === "") {
        message = field.empty;
    } else if (!field.regex.test(value)) {
        message = field.wrong;
    }

    error.textContent = message;
    input.classList.toggle("invalid", message !== "");
    input.classList.toggle("valid", message === "");
    return message === "";
}

let contactForm = document.getElementById("contactForm");
if (contactForm) {
    FIELDS.forEach(function (field) {
        document.getElementById(field.id).addEventListener("blur", function () {
            validateField(field);
        });
    });

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let ok = true;
        FIELDS.forEach(function (field) {
            if (!validateField(field)) ok = false;
        });

        let success = document.getElementById("formSuccess");
        if (ok) {
            success.textContent = "Спасибо! Форма заполнена верно.";
            contactForm.reset();
            FIELDS.forEach(function (field) {
                document.getElementById(field.id).classList.remove("valid");
            });
        } else {
            success.textContent = "";
        }
    });
}

