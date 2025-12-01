// ---- Крок 2: Generic-функції ----
export const findProduct = (products, id) => {
    if (!Array.isArray(products) || !Number.isFinite(id)) {
        return undefined;
    }
    return products.find((item) => item.id === id);
};
export const filterByPrice = (products, maxPrice) => {
    if (!Array.isArray(products) || !Number.isFinite(maxPrice)) {
        return [];
    }
    return products.filter((item) => item.price <= maxPrice && item.price >= 0);
};
export const addToCart = (cart, product, quantity) => {
    if (quantity <= 0 || !product) {
        return cart;
    }
    const copy = cart.map((item) => (Object.assign({}, item)));
    const existingIndex = copy.findIndex((item) => item.product.id === product.id);
    if (existingIndex === -1) {
        copy.push({ product, quantity });
    }
    else {
        copy[existingIndex].quantity += quantity;
    }
    return copy;
};
export const calculateTotal = (cart) => {
    return cart.reduce((sum, item) => {
        if (!item.product.inStock || item.quantity <= 0) {
            return sum;
        }
        return sum + item.product.price * item.quantity;
    }, 0);
};
// ---- Крок 4: Тестові дані ----
const electronics = [
    {
        id: 10,
        name: "Laptop Ultra 15",
        price: 38000,
        inStock: true,
        description: "Легкий ноутбук для навчання та роботи",
        category: "electronics",
        brand: "SkyTech",
        warrantyMonths: 24
    },
    {
        id: 11,
        name: "Bluetooth колонка",
        price: 2200,
        inStock: false,
        description: "Портативна колонка з вологозахистом",
        category: "electronics",
        brand: "SoundBox",
        warrantyMonths: 12
    }
];
const clothing = [
    {
        id: 20,
        name: "Жіноча футболка",
        price: 650,
        inStock: true,
        description: "Базова бавовняна футболка",
        category: "clothing",
        size: "S",
        gender: "women"
    },
    {
        id: 21,
        name: "Спортивні штани",
        price: 1300,
        inStock: true,
        description: "Унісекс модель для тренувань",
        category: "clothing",
        size: "M",
        gender: "unisex"
    }
];
const books = [
    {
        id: 30,
        name: "Clean Architecture",
        price: 950,
        inStock: true,
        description: "Книга про архітектуру ПЗ",
        category: "book",
        author: "Robert C. Martin",
        pages: 432
    }
];
const allProducts = [
    ...electronics,
    ...clothing,
    ...books
];
// Приклади використання
const foundLaptop = findProduct(electronics, 10);
const under1500 = filterByPrice(allProducts, 1500);
let cart = [];
if (foundLaptop) {
    cart = addToCart(cart, foundLaptop, 1);
}
const pants = findProduct(clothing, 21);
if (pants) {
    cart = addToCart(cart, pants, 2);
}
const book = findProduct(books, 30);
if (book) {
    cart = addToCart(cart, book, 1);
}
const total = calculateTotal(cart);
// Для перевірки
console.log("Found laptop:", foundLaptop);
console.log("Products <= 1500:", under1500);
console.log("Cart:", cart);
console.log("Total:", total);
