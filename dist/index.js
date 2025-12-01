"use strict";
const groupCode = "ПД-41";
const studentsCount = 5;
const isEveningGroup = false;
const studentNames = [
    "Olena",
    "Mark",
    "Dmytro",
    "Kateryna",
    "Ihor"
];
const studentGrades = [95, 88, 76, 100, 82];
/**
 * Обчислює середній бал.
 */
function calculateAverageGrade(grades) {
    if (grades.length === 0) {
        return 0;
    }
    let sum = 0;
    for (let i = 0; i < grades.length; i++) {
        sum += grades[i];
    }
    const avg = sum / grades.length;
    return Math.round(avg * 10) / 10;
}
/**
 * Створює короткий текстовий звіт.
 */
function createGroupSummary(code, totalStudents, avgGrade, evening) {
    const typeLabel = evening ? "вечірня група" : "денна група";
    return `Група ${code} (${typeLabel}) налічує ${totalStudents} студентів, середній бал — ${avgGrade}.`;
}
const average = calculateAverageGrade(studentGrades);
const summary = createGroupSummary(groupCode, studentsCount, average, isEveningGroup);
console.log("Студенти:", studentNames.join(", "));
console.log(summary);
