export type DayOfWeek =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday";

export type TimeSlot =
    | "8:30-10:00"
    | "10:15-11:45"
    | "12:15-13:45"
    | "14:00-15:30"
    | "15:45-17:15";

export type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

export type Professor = {
    id: number;
    name: string;
    department: string;
};

export type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

export type Course = {
    id: number;
    name: string;
    type: CourseType;
};

export type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

export type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// "База" в пам'яті
const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
const schedule: Lesson[] = [];
const lessonIdList: number[] = [];

let professorIdCounter: number = 1;
let courseIdCounter: number = 1;
let lessonIdCounter: number = 1;

// --- Додавання сутностей ---

export function addProfessor(prof: Omit<Professor, "id">): Professor {
    const created: Professor = {
        ...prof,
        id: professorIdCounter++
    };
    professors.push(created);
    return created;
}

export function addClassroom(room: Classroom): void {
    const exists: boolean = classrooms.some(
        (c: Classroom): boolean => c.number === room.number
    );
    if (!exists) {
        classrooms.push(room);
    }
}

export function addCourse(course: Omit<Course, "id">): Course {
    const created: Course = {
        ...course,
        id: courseIdCounter++
    };
    courses.push(created);
    return created;
}

// --- Конфлікти ---

export function validateLesson(lesson: Lesson): ScheduleConflict | null {
    for (let i: number = 0; i < schedule.length; i++) {
        const current: Lesson = schedule[i];

        const sameTime: boolean =
            current.dayOfWeek === lesson.dayOfWeek &&
            current.timeSlot === lesson.timeSlot;

        if (sameTime && current.professorId === lesson.professorId) {
            return {
                type: "ProfessorConflict",
                lessonDetails: current
            };
        }

        if (sameTime && current.classroomNumber === lesson.classroomNumber) {
            return {
                type: "ClassroomConflict",
                lessonDetails: current
            };
        }
    }

    return null;
}

export function addLesson(lesson: Lesson): boolean {
    const conflict: ScheduleConflict | null = validateLesson(lesson);
    if (conflict !== null) {
        console.warn("Конфлікт розкладу:", conflict.type);
        return false;
    }

    schedule.push(lesson);
    lessonIdList.push(lessonIdCounter++);
    return true;
}

// --- Пошук та фільтрація ---

export function findAvailableClassrooms(
    timeSlot: TimeSlot,
    dayOfWeek: DayOfWeek
): string[] {
    const busyNumbers: string[] = [];

    for (let i: number = 0; i < schedule.length; i++) {
        const lesson: Lesson = schedule[i];
        if (
            lesson.dayOfWeek === dayOfWeek &&
            lesson.timeSlot === timeSlot
        ) {
            busyNumbers.push(lesson.classroomNumber);
        }
    }

    const free: string[] = [];

    for (let i: number = 0; i < classrooms.length; i++) {
        const room: Classroom = classrooms[i];
        if (busyNumbers.indexOf(room.number) === -1) {
            free.push(room.number);
        }
    }

    return free;
}

export function getProfessorSchedule(
    professorId: number
): Lesson[] {
    const result: Lesson[] = [];
    for (let i: number = 0; i < schedule.length; i++) {
        if (schedule[i].professorId === professorId) {
            result.push(schedule[i]);
        }
    }
    return result;
}

// --- Аналіз ---

const allDays: DayOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

const allSlots: TimeSlot[] = [
    "8:30-10:00",
    "10:15-11:45",
    "12:15-13:45",
    "14:00-15:30",
    "15:45-17:15"
];

export function getClassroomUtilization(
    classroomNumber: string
): number {
    const total: number = allDays.length * allSlots.length;
    if (total === 0) return 0;

    let used: number = 0;
    for (let i: number = 0; i < schedule.length; i++) {
        if (schedule[i].classroomNumber === classroomNumber) {
            used++;
        }
    }

    const percent: number = (used / total) * 100;
    return Math.round(percent * 10) / 10;
}

export function getMostPopularCourseType(): CourseType {
    const counts: { [k in CourseType]: number } = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };

    for (let i: number = 0; i < schedule.length; i++) {
        const lesson: Lesson = schedule[i];
        const course: Course | undefined = courses.find(
            (c: Course): boolean => c.id === lesson.courseId
        );
        if (!course) continue;
        counts[course.type] = counts[course.type] + 1;
    }

    let popular: CourseType = "Lecture";
    let maxCount: number = counts[popular];

    const variants: CourseType[] = ["Lecture", "Seminar", "Lab", "Practice"];
    for (let i: number = 0; i < variants.length; i++) {
        const t: CourseType = variants[i];
        if (counts[t] > maxCount) {
            popular = t;
            maxCount = counts[t];
        }
    }

    return popular;
}

// --- Модифікація ---

export function reassignClassroom(
    lessonId: number,
    newClassroomNumber: string
): boolean {
    const index: number = lessonId - 1;
    if (index < 0 || index >= schedule.length) {
        console.warn("Неправильний lessonId:", lessonId);
        return false;
    }

    const original: Lesson = schedule[index];
    const updated: Lesson = {
        ...original,
        classroomNumber: newClassroomNumber
    };

    const conflict: ScheduleConflict | null = validateLesson(updated);
    if (conflict !== null) {
        console.warn("Неможливо змінити аудиторію:", conflict.type);
        return false;
    }

    schedule[index] = updated;
    return true;
}

export function cancelLesson(lessonId: number): void {
    const index: number = lessonId - 1;
    if (index < 0 || index >= schedule.length) {
        console.warn("Неправильний lessonId при відміні:", lessonId);
        return;
    }
    schedule.splice(index, 1);
    lessonIdList.splice(index, 1);
}

// --- Приклад використання ---

addClassroom({ number: "201", capacity: 40, hasProjector: true });
const p = addProfessor({ name: "Nadiia Bondar", department: "Math" });
const c = addCourse({ name: "Discrete Math", type: "Lecture" });
addLesson({
  courseId: c.id,
  professorId: p.id,
  classroomNumber: "201",
  dayOfWeek: "Monday",
  timeSlot: "8:30-10:00"
});
console.log(getProfessorSchedule(p.id));
