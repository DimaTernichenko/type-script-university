export type BaseProduct = {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
    description?: string;
};

export type Electronics = BaseProduct & {
    category: "electronics";
    brand: string;
    warrantyMonths: number;
};

export type Clothing = BaseProduct & {
    category: "clothing";
    size: "XS" | "S" | "M" | "L" | "XL";
    gender: "men" | "women" | "unisex";
};

export type Book = BaseProduct & {
    category: "book";
    author: string;
    pages: number;
};

// ---- Крок 2: Generic-функції ----

export const findProduct = <T extends BaseProduct>(
    products: T[],
    id: number
): T | undefined => {
    if (!Array.isArray(products) || !Number.isFinite(id)) {
        return undefined;
    }

    return products.find((item: T): boolean => item.id === id);
};

export const filterByPrice = <T extends BaseProduct>(
    products: T[],
    maxPrice: number
): T[] => {
    if (!Array.isArray(products) || !Number.isFinite(maxPrice)) {
        return [];
    }

    return products.filter(
        (item: T): boolean => item.price <= maxPrice && item.price >= 0
    );
};

// ---- Крок 3: Кошик ----

export type CartItem<T> = {
    product: T;
    quantity: number;
};

export const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    if (quantity <= 0 || !product) {
        return cart;
    }

    const copy: CartItem<T>[] = cart.map(
        (item: CartItem<T>): CartItem<T> => ({ ...item })
    );

    const existingIndex: number = copy.findIndex(
        (item: CartItem<T>): boolean => item.product.id === product.id
    );

    if (existingIndex === -1) {
        copy.push({ product, quantity });
    } else {
        copy[existingIndex].quantity += quantity;
    }

    return copy;
};

export const calculateTotal = <T extends BaseProduct>(
    cart: CartItem<T>[]
): number => {
    return cart.reduce((sum: number, item: CartItem<T>): number => {
        if (!item.product.inStock || item.quantity <= 0) {
            return sum;
        }
        return sum + item.product.price * item.quantity;
    }, 0);
};

// ---- Крок 4: Тестові дані ----

const electronics: Electronics[] = [
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

const clothing: Clothing[] = [
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

const books: Book[] = [
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

const allProducts: (Electronics | Clothing | Book)[] = [
    ...electronics,
    ...clothing,
    ...books
];

// Приклади використання
const foundLaptop: Electronics | undefined = findProduct<Electronics>(
    electronics,
    10
);

const under1500: (Electronics | Clothing | Book)[] = filterByPrice<
    Electronics | Clothing | Book
>(allProducts, 1500);

let cart: CartItem<Electronics | Clothing | Book>[] = [];

if (foundLaptop) {
    cart = addToCart(cart, foundLaptop, 1);
}

const pants: Clothing | undefined = findProduct<Clothing>(clothing, 21);
if (pants) {
    cart = addToCart(cart, pants, 2);
}

const book: Book | undefined = findProduct<Book>(books, 30);
if (book) {
    cart = addToCart(cart, book, 1);
}

const total: number = calculateTotal(cart);

// Для перевірки
console.log("Found laptop:", foundLaptop);
console.log("Products <= 1500:", under1500);
console.log("Cart:", cart);
console.log("Total:", total);
