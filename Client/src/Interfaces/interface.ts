export interface Employee {
    name: string;
    rate: number;
}

export interface Project {
    name: string;
}

export interface Activity {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    duration: string;
    employee: Employee;
    project: Project;
}

export interface ActivityList {
    data: Activity[];
    totalOvertimeDuration: string;
    totalOvertimeEarnings: number;
}
