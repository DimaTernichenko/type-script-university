"use strict";
// ---------- Enum-и ----------
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
var Grade;
(function (Grade) {
    Grade[Grade["Excellent"] = 5] = "Excellent";
    Grade[Grade["Good"] = 4] = "Good";
    Grade[Grade["Satisfactory"] = 3] = "Satisfactory";
    Grade[Grade["Unsatisfactory"] = 2] = "Unsatisfactory";
})(Grade || (Grade = {}));
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
// ---------- Клас UniversityManagementSystem ----------
class UniversityManagementSystem {
    constructor() {
        // зберігаємо все в масивах, а не в Map — це ще один варіант реалізації
        this.students = [];
        this.courses = [];
        this.registrations = [];
        this.grades = [];
        this.nextStudentId = 1;
        this.nextCourseId = 1;
    }
    // ===== Приватні хелпери =====
    findStudent(studentId) {
        return this.students.find((st) => st.id === studentId);
    }
    findCourse(courseId) {
        return this.courses.find((c) => c.id === courseId);
    }
    getRegistrationsForCourse(courseId) {
        return this.registrations.filter((r) => r.courseId === courseId);
    }
    getRegistrationsForStudent(studentId) {
        return this.registrations.filter((r) => r.studentId === studentId);
    }
    isStudentRegisteredForCourse(studentId, courseId) {
        return this.registrations.some((r) => r.studentId === studentId && r.courseId === courseId);
    }
    // ===== Публічні методи згідно із завданням =====
    /**
     * Додає нового студента.
     * id генерується системою автоматично.
     */
    enrollStudent(student) {
        const newStudent = Object.assign(Object.assign({}, student), { id: this.nextStudentId++ });
        this.students.push(newStudent);
        return newStudent;
    }
    /**
     * Додаємо курс (додатковий метод, зручно для тестів).
     */
    addCourse(course) {
        const newCourse = Object.assign(Object.assign({}, course), { id: this.nextCourseId++ });
        this.courses.push(newCourse);
        return newCourse;
    }
    /**
     * Реєстрація студента на курс.
     * Перевірка:
     * - студент і курс існують
     * - студент Active
     * - збігається факультет
     * - не переповнений курс
     * - студент ще не зареєстрований
     */
    registerForCourse(studentId, courseId) {
        const student = this.findStudent(studentId);
        const course = this.findCourse(courseId);
        if (!student) {
            console.error("registerForCourse: студент не знайдений:", studentId);
            return;
        }
        if (!course) {
            console.error("registerForCourse: курс не знайдено:", courseId);
            return;
        }
        if (student.status !== StudentStatus.Active) {
            console.error(`Студент зі статусом ${student.status} не може реєструватися на курс.`);
            return;
        }
        if (student.faculty !== course.faculty) {
            console.error("Факультет студента не відповідає факультету курсу:", student.faculty, course.faculty);
            return;
        }
        const currentCount = this.getRegistrationsForCourse(courseId).length;
        if (currentCount >= course.maxStudents) {
            console.error("Курс уже заповнений.");
            return;
        }
        if (this.isStudentRegisteredForCourse(studentId, courseId)) {
            console.warn("Студент уже зареєстрований на цей курс.");
            return;
        }
        this.registrations.push({ studentId, courseId });
    }
    /**
     * Виставлення оцінки.
     * Перевірка:
     * - існує студент та курс
     * - студент зареєстрований на курс
     */
    setGrade(studentId, courseId, grade) {
        const student = this.findStudent(studentId);
        const course = this.findCourse(courseId);
        if (!student || !course) {
            console.error("setGrade: некоректний studentId або courseId.");
            return;
        }
        if (!this.isStudentRegisteredForCourse(studentId, courseId)) {
            console.error("setGrade: студент не зареєстрований на курс, оцінку виставити не можна.");
            return;
        }
        const record = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };
        // якщо вже є оцінка за цей курс у цьому семестрі — оновлюємо
        const index = this.grades.findIndex((g) => g.studentId === studentId &&
            g.courseId === courseId &&
            g.semester === course.semester);
        if (index !== -1) {
            this.grades[index] = record;
        }
        else {
            this.grades.push(record);
        }
    }
    /**
     * Оновлення статусу студента з базовою валідацією.
     */
    updateStudentStatus(studentId, newStatus) {
        const student = this.findStudent(studentId);
        if (!student) {
            console.error("updateStudentStatus: студент не знайдений:", studentId);
            return;
        }
        const current = student.status;
        // Проста логіка: якщо Graduated або Expelled — назад в Active не повертаємо
        if ((current === StudentStatus.Graduated ||
            current === StudentStatus.Expelled) &&
            newStatus === StudentStatus.Active) {
            console.error("Неможливо повернути студента зі статусу Graduated/Expelled у Active.");
            return;
        }
        student.status = newStatus;
    }
    /**
     * Список студентів за факультетом.
     */
    getStudentsByFaculty(faculty) {
        return this.students.filter((st) => st.faculty === faculty);
    }
    /**
     * Усі оцінки студента.
     */
    getStudentGrades(studentId) {
        return this.grades.filter((g) => g.studentId === studentId);
    }
    /**
     * Курсі певного факультету і семестру,
     * на які ще є вільні місця.
     */
    getAvailableCourses(faculty, semester) {
        return this.courses.filter((course) => {
            if (course.faculty !== faculty || course.semester !== semester) {
                return false;
            }
            const count = this.getRegistrationsForCourse(course.id).length;
            return count < course.maxStudents;
        });
    }
    /**
     * Середній бал студента.
     * Якщо немає оцінок — повертаємо 0.
     */
    calculateAverageGrade(studentId) {
        const records = this.getStudentGrades(studentId);
        if (records.length === 0) {
            return 0;
        }
        const sum = records.reduce((acc, rec) => acc + rec.grade, 0);
        const avg = sum / records.length;
        return Math.round(avg * 100) / 100;
    }
    /**
     * Додатковий метод:
     * список "відмінників" по факультету (середній бал >= 4.5).
     */
    getHonorsStudentsByFaculty(faculty) {
        const studentsOfFaculty = this.getStudentsByFaculty(faculty);
        return studentsOfFaculty.filter((st) => {
            const avg = this.calculateAverageGrade(st.id);
            return avg >= 4.5;
        });
    }
}
// ---------- Приклад використання (можна залишити для тестів або закоментувати) ----------
const umsExample = new UniversityManagementSystem();
// Додаємо кілька курсів
const csAlgorithms = umsExample.addCourse({
    name: "Алгоритми та структури даних",
    type: CourseType.Mandatory,
    credits: 6,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 2
});
const csDatabases = umsExample.addCourse({
    name: "Бази даних",
    type: CourseType.Special,
    credits: 5,
    semester: Semester.Second,
    faculty: Faculty.Computer_Science,
    maxStudents: 3
});
// Додаємо студентів
const s1 = umsExample.enrollStudent({
    fullName: "Андрій Коваленко",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "CS-21"
});
const s2 = umsExample.enrollStudent({
    fullName: "Марія Лисенко",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "CS-21"
});
const s3 = umsExample.enrollStudent({
    fullName: "Олег Петренко",
    faculty: Faculty.Economics,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "EC-11"
});
// Реєстрація на курс
umsExample.registerForCourse(s1.id, csAlgorithms.id);
umsExample.registerForCourse(s2.id, csAlgorithms.id);
// Цей виклик має вивести, що курс вже заповнений
umsExample.registerForCourse(s3.id, csAlgorithms.id);
// Ставимо оцінки
umsExample.setGrade(s1.id, csAlgorithms.id, Grade.Excellent);
umsExample.setGrade(s2.id, csAlgorithms.id, Grade.Good);
// Перевірки
console.log("Середній бал s1:", umsExample.calculateAverageGrade(s1.id));
console.log("Середній бал s2:", umsExample.calculateAverageGrade(s2.id));
console.log("Відмінники CS:", umsExample.getHonorsStudentsByFaculty(Faculty.Computer_Science));
console.log("Доступні CS курси, First:", umsExample.getAvailableCourses(Faculty.Computer_Science, Semester.First));
