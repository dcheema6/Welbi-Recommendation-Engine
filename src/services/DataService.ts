/** @format */

import * as fs from 'fs';
import joi from 'joi';
// import { CachingService } from './CachingService';

// const MOCK_DATA_CACHE_KEY = 'MOCK_DATA_CACHE_KEY'

const ResidentSchemaValidator = joi.object<Resident, true, Resident>({
    userId: joi.string().uuid().required(),
    name: joi.string().required(),
    gender: joi.string().allow(null).required(),
    birthday: joi.string().required(),
    moveInDate: joi.date().required(),
    levelOfCare: joi.string().allow(null).required(),
    hobbies: joi.string().allow(null).required(),
    roomNumber: joi.string().required(),
})
const ProgramsSchemaValidator = joi.object<Program, true, Program>({
    id: joi.string().uuid().required(),
    name: joi.string().required(),
    start: joi.date().required(),
    end: joi.date().required(),
    mode: joi.string().required(),
    dimensions: joi.string().required(),
    facilitators: joi.string().required(),
    hobbies: joi.string().allow(null).required(),
    levelsOfCare: joi.string().required(),
    attendees: joi.array().items(joi.object({ userId: joi.string().uuid().required() }))
})

export class DataService {

    private static instance: DataService

    // stores programs sorted by number of attendees in descending order
    private mockData: PackagedMockData
    // private mockDataCache: CachingService<PackagedMockData>

    private constructor() {
        // this.mockDataCache = new CachingService<PackagedMockData>('infinite')
        const data: PackagedMockData = JSON.parse(fs.readFileSync('./assets/mock-data.json', 'utf-8'))

        // validate mock data fits the expected schema
        for (const resident of data.residents) {
            resident.moveInDate = new Date(resident.moveInDate)
            ResidentSchemaValidator.validate(resident)
        }
        for (const program of data.programs) {
            program.start = new Date(program.start)
            program.end = new Date(program.end)
            ProgramsSchemaValidator.validate(program)
        }
        // sort by number of attendees in descending order
        data.programs.sort((pA, pB) => pB.attendees.length - pA.attendees.length)

        this.mockData = data
    }
    public static getInstance(): DataService {
        if (!DataService.instance) {
            DataService.instance = new DataService()
        }
        return DataService.instance
    }
    
    private getParsedMockData(): {
        residents: Resident[];
        programs: Program[];
    } {
        // const maybeCachedData = this.mockDataCache.get(MOCK_DATA_CACHE_KEY)
        // if (maybeCachedData) return maybeCachedData
    
        // const data: PackagedMockData = JSON.parse(fs.readFileSync('../../assets/mock-data.json', 'utf-8'))
        // this.mockDataCache.set(MOCK_DATA_CACHE_KEY, data)
    
        // return data
        return this.mockData
    }
    
    /**
     * @returns list of all residents
     */
    public getResidents(): Resident[] {
        return this.getParsedMockData().residents
    }
    
    /**
     * @returns list of programs sorted by number of attendees in descending order
     */
    public getSortedPrograms(): Program[] {
        return this.getParsedMockData().programs
    }
}
