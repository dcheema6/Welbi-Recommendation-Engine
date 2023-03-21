/** @format */

type Resident = {
    userId: string;
    name: string;
    gender: string | null;
    birthday: string;
    moveInDate: Date;
    levelOfCare: string | null;
    hobbies: string | null;
    roomNumber: string;
}

type Program = {
    id: string;
    name: string;
    start: Date;
    end: Date;
    mode: string;
    dimensions: string;
    facilitators: string;
    hobbies: string | null;
    levelsOfCare: string;
    attendees: { userId: string }[];
}

type PackagedMockData = {
    residents: Resident[];
    programs: Program[];
}
