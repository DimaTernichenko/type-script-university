// "База" в пам'яті
const professors = [];
const classrooms = [];
const courses = [];
const schedule = [];
const lessonIdList = [];
let professorIdCounter = 1;
let courseIdCounter = 1;
let lessonIdCounter = 1;
// --- Додавання сутностей ---
export function addProfessor(prof) {
    const created = Object.assign(Object.assign({}, prof), { id: professorIdCounter++ });
    professors.push(created);
    return created;
}
export function addClassroom(room) {
    const exists = classrooms.some((c) => c.number === room.number);
    if (!exists) {
        classrooms.push(room);
    }
}
export function addCourse(course) {
    const created = Object.assign(Object.assign({}, course), { id: courseIdCounter++ });
    courses.push(created);
    return created;
}
// --- Конфлікти ---
export function validateLesson(lesson) {
    for (let i = 0; i < schedule.length; i++) {
        const current = schedule[i];
        const sameTime = current.dayOfWeek === lesson.dayOfWeek &&
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
export function addLesson(lesson) {
    const conflict = validateLesson(lesson);
    if (conflict !== null) {
        console.warn("Конфлікт розкладу:", conflict.type);
        return false;
    }
    schedule.push(lesson);
    lessonIdList.push(lessonIdCounter++);
    return true;
}
// --- Пошук та фільтрація ---
export function findAvailableClassrooms(timeSlot, dayOfWeek) {
    const busyNumbers = [];
    for (let i = 0; i < schedule.length; i++) {
        const lesson = schedule[i];
        if (lesson.dayOfWeek === dayOfWeek &&
            lesson.timeSlot === timeSlot) {
            busyNumbers.push(lesson.classroomNumber);
        }
    }
    const free = [];
    for (let i = 0; i < classrooms.length; i++) {
        const room = classrooms[i];
        if (busyNumbers.indexOf(room.number) === -1) {
            free.push(room.number);
        }
    }
    return free;
}
export function getProfessorSchedule(professorId) {
    const result = [];
    for (let i = 0; i < schedule.length; i++) {
        if (schedule[i].professorId === professorId) {
            result.push(schedule[i]);
        }
    }
    return result;
}
// --- Аналіз ---
const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];
const allSlots = [
    "8:30-10:00",
    "10:15-11:45",
    "12:15-13:45",
    "14:00-15:30",
    "15:45-17:15"
];
export function getClassroomUtilization(classroomNumber) {
    const total = allDays.length * allSlots.length;
    if (total === 0)
        return 0;
    let used = 0;
    for (let i = 0; i < schedule.length; i++) {
        if (schedule[i].classroomNumber === classroomNumber) {
            used++;
        }
    }
    const percent = (used / total) * 100;
    return Math.round(percent * 10) / 10;
}
export function getMostPopularCourseType() {
    const counts = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };
    for (let i = 0; i < schedule.length; i++) {
        const lesson = schedule[i];
        const course = courses.find((c) => c.id === lesson.courseId);
        if (!course)
            continue;
        counts[course.type] = counts[course.type] + 1;
    }
    let popular = "Lecture";
    let maxCount = counts[popular];
    const variants = ["Lecture", "Seminar", "Lab", "Practice"];
    for (let i = 0; i < variants.length; i++) {
        const t = variants[i];
        if (counts[t] > maxCount) {
            popular = t;
            maxCount = counts[t];
        }
    }
    return popular;
}
// --- Модифікація ---
export function reassignClassroom(lessonId, newClassroomNumber) {
    const index = lessonId - 1;
    if (index < 0 || index >= schedule.length) {
        console.warn("Неправильний lessonId:", lessonId);
        return false;
    }
    const original = schedule[index];
    const updated = Object.assign(Object.assign({}, original), { classroomNumber: newClassroomNumber });
    const conflict = validateLesson(updated);
    if (conflict !== null) {
        console.warn("Неможливо змінити аудиторію:", conflict.type);
        return false;
    }
    schedule[index] = updated;
    return true;
}
export function cancelLesson(lessonId) {
    const index = lessonId - 1;
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
