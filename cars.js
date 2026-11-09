
/*
Практическая работа №11 — CRUD
Сайт: Мир автомобилей
Студент: Акылбеков Омор
Группа: IT-124
*/

const carsList = document.getElementById('carsList');
const carDialog = document.getElementById('carDialog');
const carDetails = document.getElementById('carDetails');
const formDialog = document.getElementById('carFormDialog');
const carForm = document.getElementById('carForm');

let allCars = [];

const STORAGE_KEY = 'carsData';

const fields = {
    name: 'carName',
    brand: 'carBrand',
    year: 'carYear',
    body: 'carBody',
    engine: 'carEngine',
    power_hp: 'carPower',
    transmission: 'carTransmission',
    drive: 'carDrive',
    price: 'carPrice',
    image: 'carImage',
    description: 'carDescription'
};

// Форматирование цены
function formatPrice(price) {
    if (price == null || price === '') {
        return 'Не указана';
    }
    return Number(price).toLocaleString('ru-RU') + ' $';
}

// Сохранение изменений в браузере
function saveCars() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allCars));
    renderCars(allCars);
}

// загрузка автомобилей из JSON
async function loadCars() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
            allCars = JSON.parse(saved);
        } else {
            const response = await fetch('cars.json');

            if (!response.ok) {
                throw new Error('Ошибка HTTP: ' + response.status);
            }

            allCars = await response.json();

            if (!Array.isArray(allCars)) {
                throw new Error('Неверный формат JSON');
            }

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(allCars)
            );
        }

        if (!Array.isArray(allCars)) {
            throw new Error('Неверный формат данных');
        }

        renderCars(allCars);

    } catch (error) {
        console.error('Ошибка загрузки:', error);
        carsList.textContent =
            'Не удалось загрузить автомобили. Проверьте cars.json и Live Server.';
    }
}

// READ — отображение списка автомобилей
function renderCars(cars) {
    carsList.replaceChildren();

    if (cars.length === 0) {
        carsList.textContent = 'Автомобилей пока нет.';
        return;
    }

    cars.forEach(car => {
        const card = document.createElement('article');
        card.className = 'car-card';

        const photo = document.createElement('img');
        photo.src = car.image || '';
        photo.alt = car.name;
        photo.loading = 'lazy';

        const title = document.createElement('h3');
        title.textContent = car.name;

        const info = document.createElement('p');
        info.textContent = `${car.year} год · ${car.body}`;

        const price = document.createElement('p');
        price.className = 'car-price';
        price.textContent = `Цена: ${formatPrice(car.price)}`;

        // Кнопка просмотра
        const detailBtn = document.createElement('button');
        detailBtn.type = 'button';
        detailBtn.textContent = 'Подробнее';
        detailBtn.addEventListener('click', () => {
            showDetail(car.id);
        });

        // Кнопка редактирования
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.textContent = 'Изменить';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', () => {
            editCar(car.id);
        });

        // Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = 'Удалить';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            deleteCar(car.id);
        });

        card.append(
            photo,
            title,
            info,
            price,
            detailBtn,
            editBtn,
            deleteBtn
        );

        // Практика №10 — событие mouseenter
        card.addEventListener('mouseenter', () => {
            card.classList.add('car-hover');
        });

        // Практика №10 — событие mouseleave
        card.addEventListener('mouseleave', () => {
            card.classList.remove('car-hover');
        });

        // Практика №10 — событие click
        card.addEventListener('click', event => {
            if (event.target.closest('button')) return;

            card.classList.remove('car-click');
            void card.offsetWidth;
            card.classList.add('car-click');
        });

        // Практика №10 — событие dblclick
        card.addEventListener('dblclick', event => {
            if (event.target.closest('button')) return;

            card.classList.toggle('car-selected');
        });

        carsList.append(card);
    });
}

// READ — просмотр подробной информации
function showDetail(id) {
    const car = allCars.find(item => item.id === id);
    if (!car) return;

    carDetails.replaceChildren();

    const title = document.createElement('h2');
    title.id = 'carDialogTitle';
    title.textContent = car.name;

    const photo = document.createElement('img');
    photo.src = car.image || '';
    photo.alt = car.name;
    photo.className = 'detail-image';

    const description = document.createElement('p');
    description.textContent = car.description || '';

    const details = document.createElement('ul');

    const specs = [
        ['Марка', car.brand],
        ['Год', car.year],
        ['Кузов', car.body],
        ['Двигатель', car.engine],
        ['Мощность', car.power_hp + ' л.с.'],
        ['Коробка', car.transmission],
        ['Привод', car.drive],
        ['Цена', formatPrice(car.price)]
    ];

    specs.forEach(([label, value]) => {
        const item = document.createElement('li');
        item.textContent = `${label}: ${value}`;
        details.append(item);
    });

    carDetails.append(title, photo, description, details);
    carDialog.showModal();
}

// CREATE — открытие формы добавления
document.getElementById('addCarBtn')
    .addEventListener('click', () => {

        carForm.reset();

        document.getElementById('editCarId').value = '';
        document.getElementById('formTitle').textContent =
            'Добавить автомобиль';

        formDialog.showModal();
    });

// UPDATE — открытие формы редактирования
function editCar(id) {
    const car = allCars.find(item => item.id === id);
    if (!car) return;

    document.getElementById('editCarId').value = id;

    document.getElementById('formTitle').textContent =
        'Изменить автомобиль';

    for (const [key, elementId] of Object.entries(fields)) {
        document.getElementById(elementId).value =
            car[key] ?? '';
    }

    formDialog.showModal();
}

// CREATE и UPDATE — сохранение формы
carForm.addEventListener('submit', event => {
    event.preventDefault();

    const editId = document.getElementById('editCarId').value;
    const data = {};

    for (const [key, elementId] of Object.entries(fields)) {
        data[key] = document.getElementById(elementId).value.trim();
    }

    // Преобразуем числа
    data.year = Number(data.year);
    data.power_hp = Number(data.power_hp);
    data.price = Number(data.price);

    if (editId !== '') {
        // UPDATE — изменение существующего автомобиля
        const index = allCars.findIndex(
            car => car.id === Number(editId)
        );

        if (index === -1) return;

        allCars[index] = {
            ...allCars[index],
            ...data
        };

    } else {
        // CREATE — добавление нового автомобиля
        const newId = Math.max(
            0,
            ...allCars.map(car => car.id)
        ) + 1;

        allCars.push({
            id: newId,
            ...data
        });
    }

    saveCars();
    formDialog.close();
});

// DELETE — удаление автомобиля
function deleteCar(id) {
    const car = allCars.find(item => item.id === id);
    if (!car) return;

    const confirmed = confirm(
        `Вы действительно хотите удалить ${car.name}?`
    );

    if (!confirmed) return;

    allCars = allCars.filter(item => item.id !== id);

    saveCars();
}

// Закрытие модального окна Detail
document.getElementById('closeCarDialog')
    .addEventListener('click', () => {
        carDialog.close();
    });

// Закрытие формы CRUD
document.getElementById('closeFormBtn')
    .addEventListener('click', () => {
        formDialog.close();
    });

// Закрытие Detail нажатием на фон
carDialog.addEventListener('click', event => {
    if (event.target === carDialog) {
        carDialog.close();
    }
});

// Закрытие формы нажатием на фон
formDialog.addEventListener('click', event => {
    if (event.target === formDialog) {
        formDialog.close();
    }
});

// Запуск загрузки автомобилей
loadCars();
