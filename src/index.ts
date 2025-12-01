const groupCode: string = "ПД-41";
const studentsCount: number = 5;
const isEveningGroup: boolean = false;

const studentNames: string[] = [
    "Olena",
    "Mark",
    "Dmytro",
    "Kateryna",
    "Ihor"
];

const studentGrades: number[] = [95, 88, 76, 100, 82];

/**
 * Обчислює середній бал.
 */
function calculateAverageGrade(grades: number[]): number {
    if (grades.length === 0) {
        return 0;
    }
    let sum: number = 0;
    for (let i: number = 0; i < grades.length; i++) {
        sum += grades[i];
    }
    const avg: number = sum / grades.length;
    return Math.round(avg * 10) / 10;
}

/**
 * Створює короткий текстовий звіт.
 */
function createGroupSummary(
    code: string,
    totalStudents: number,
    avgGrade: number,
    evening: boolean
): string {
    const typeLabel: string = evening ? "вечірня група" : "денна група";
    return `Група ${code} (${typeLabel}) налічує ${totalStudents} студентів, середній бал — ${avgGrade}.`;
}

const average: number = calculateAverageGrade(studentGrades);
const summary: string = createGroupSummary(
    groupCode,
    studentsCount,
    average,
    isEveningGroup
);

console.log("Студенти:", studentNames.join(", "));
console.log(summary);
