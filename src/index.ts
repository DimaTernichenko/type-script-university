// ---------- Enum-и ----------

enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

enum Semester {
    First = "First",
    Second = "Second"
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// ---------- Інтерфейси ----------

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

// Інтерфейс для оцінки (щоб не конфліктувати з enum Grade)
interface GradeRecord {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

// Для реєстрацій
type Registration = {
    studentId: number;
    courseId: number;
};

// ---------- Клас UniversityManagementSystem ----------

class UniversityManagementSystem {
    // зберігаємо все в масивах, а не в Map — це ще один варіант реалізації
    private students: Student[] = [];
    private courses: Course[] = [];
    private registrations: Registration[] = [];
    private grades: GradeRecord[] = [];

    private nextStudentId: number = 1;
    private nextCourseId: number = 1;

    // ===== Приватні хелпери =====

    private findStudent(studentId: number): Student | undefined {
        return this.students.find(
            (st: Student): boolean => st.id === studentId
        );
    }

    private findCourse(courseId: number): Course | undefined {
        return this.courses.find(
            (c: Course): boolean => c.id === courseId
        );
    }

    private getRegistrationsForCourse(courseId: number): Registration[] {
        return this.registrations.filter(
            (r: Registration): boolean => r.courseId === courseId
        );
    }

    private getRegistrationsForStudent(studentId: number): Registration[] {
        return this.registrations.filter(
            (r: Registration): boolean => r.studentId === studentId
        );
    }

    private isStudentRegisteredForCourse(
        studentId: number,
        courseId: number
    ): boolean {
        return this.registrations.some(
            (r: Registration): boolean =>
                r.studentId === studentId && r.courseId === courseId
        );
    }

    // ===== Публічні методи згідно із завданням =====

    /**
     * Додає нового студента.
     * id генерується системою автоматично.
     */
    public enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = {
            ...student,
            id: this.nextStudentId++
        };
        this.students.push(newStudent);
        return newStudent;
    }

    /**
     * Додаємо курс (додатковий метод, зручно для тестів).
     */
    public addCourse(course: Omit<Course, "id">): Course {
        const newCourse: Course = {
            ...course,
            id: this.nextCourseId++
        };
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
    public registerForCourse(studentId: number, courseId: number): void {
        const student: Student | undefined = this.findStudent(studentId);
        const course: Course | undefined = this.findCourse(courseId);

        if (!student) {
            console.error("registerForCourse: студент не знайдений:", studentId);
            return;
        }
        if (!course) {
            console.error("registerForCourse: курс не знайдено:", courseId);
            return;
        }
        if (student.status !== StudentStatus.Active) {
            console.error(
                `Студент зі статусом ${student.status} не може реєструватися на курс.`
            );
            return;
        }
        if (student.faculty !== course.faculty) {
            console.error(
                "Факультет студента не відповідає факультету курсу:",
                student.faculty,
                course.faculty
            );
            return;
        }

        const currentCount: number = this.getRegistrationsForCourse(courseId).length;
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
    public setGrade(
        studentId: number,
        courseId: number,
        grade: Grade
    ): void {
        const student: Student | undefined = this.findStudent(studentId);
        const course: Course | undefined = this.findCourse(courseId);

        if (!student || !course) {
            console.error("setGrade: некоректний studentId або courseId.");
            return;
        }

        if (!this.isStudentRegisteredForCourse(studentId, courseId)) {
            console.error(
                "setGrade: студент не зареєстрований на курс, оцінку виставити не можна."
            );
            return;
        }

        const record: GradeRecord = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };

        // якщо вже є оцінка за цей курс у цьому семестрі — оновлюємо
        const index: number = this.grades.findIndex(
            (g: GradeRecord): boolean =>
                g.studentId === studentId &&
                g.courseId === courseId &&
                g.semester === course.semester
        );

        if (index !== -1) {
            this.grades[index] = record;
        } else {
            this.grades.push(record);
        }
    }

    /**
     * Оновлення статусу студента з базовою валідацією.
     */
    public updateStudentStatus(
        studentId: number,
        newStatus: StudentStatus
    ): void {
        const student: Student | undefined = this.findStudent(studentId);
        if (!student) {
            console.error("updateStudentStatus: студент не знайдений:", studentId);
            return;
        }

        const current: StudentStatus = student.status;

        // Проста логіка: якщо Graduated або Expelled — назад в Active не повертаємо
        if (
            (current === StudentStatus.Graduated ||
                current === StudentStatus.Expelled) &&
            newStatus === StudentStatus.Active
        ) {
            console.error(
                "Неможливо повернути студента зі статусу Graduated/Expelled у Active."
            );
            return;
        }

        student.status = newStatus;
    }

    /**
     * Список студентів за факультетом.
     */
    public getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(
            (st: Student): boolean => st.faculty === faculty
        );
    }

    /**
     * Усі оцінки студента.
     */
    public getStudentGrades(studentId: number): GradeRecord[] {
        return this.grades.filter(
            (g: GradeRecord): boolean => g.studentId === studentId
        );
    }

    /**
     * Курсі певного факультету і семестру,
     * на які ще є вільні місця.
     */
    public getAvailableCourses(
        faculty: Faculty,
        semester: Semester
    ): Course[] {
        return this.courses.filter((course: Course): boolean => {
            if (course.faculty !== faculty || course.semester !== semester) {
                return false;
            }
            const count: number = this.getRegistrationsForCourse(course.id).length;
            return count < course.maxStudents;
        });
    }

    /**
     * Середній бал студента.
     * Якщо немає оцінок — повертаємо 0.
     */
    public calculateAverageGrade(studentId: number): number {
        const records: GradeRecord[] = this.getStudentGrades(studentId);
        if (records.length === 0) {
            return 0;
        }

        const sum: number = records.reduce(
            (acc: number, rec: GradeRecord): number => acc + rec.grade,
            0
        );
        const avg: number = sum / records.length;
        return Math.round(avg * 100) / 100;
    }

    /**
     * Додатковий метод:
     * список "відмінників" по факультету (середній бал >= 4.5).
     */
    public getHonorsStudentsByFaculty(faculty: Faculty): Student[] {
        const studentsOfFaculty: Student[] = this.getStudentsByFaculty(faculty);
        return studentsOfFaculty.filter((st: Student): boolean => {
            const avg: number = this.calculateAverageGrade(st.id);
            return avg >= 4.5;
        });
    }
}

// ---------- Приклад використання (можна залишити для тестів або закоментувати) ----------

const umsExample: UniversityManagementSystem = new UniversityManagementSystem();

// Додаємо кілька курсів
const csAlgorithms: Course = umsExample.addCourse({
    name: "Алгоритми та структури даних",
    type: CourseType.Mandatory,
    credits: 6,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 2
});

const csDatabases: Course = umsExample.addCourse({
    name: "Бази даних",
    type: CourseType.Special,
    credits: 5,
    semester: Semester.Second,
    faculty: Faculty.Computer_Science,
    maxStudents: 3
});

// Додаємо студентів
const s1: Student = umsExample.enrollStudent({
    fullName: "Андрій Коваленко",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "CS-21"
});

const s2: Student = umsExample.enrollStudent({
    fullName: "Марія Лисенко",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "CS-21"
});

const s3: Student = umsExample.enrollStudent({
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
console.log(
    "Відмінники CS:",
    umsExample.getHonorsStudentsByFaculty(Faculty.Computer_Science)
);
console.log(
    "Доступні CS курси, First:",
    umsExample.getAvailableCourses(Faculty.Computer_Science, Semester.First)
);
