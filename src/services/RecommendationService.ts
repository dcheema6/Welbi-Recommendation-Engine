/** @format */

import { CachingService } from './CachingService';
import { DataService } from './DataService';

const MAX_RECOMMENDATIONS = 3
const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000
const RECOMMENDATIONS_CACHE_KEY_PREFIX = 'RECOMMENDATIONS_CACHE_KEY'

const RecomendationsCacheService = new CachingService<Program[]>(ONE_WEEK_IN_MS)
const DataServiceInstance = DataService.getInstance()

/**
 * @param program 
 * @param uniqueResidentIds 
 * @returns attendee ids present in given program that are abestr from given residentIds
 */
function getNewAttendeeIdsFromProgram(program: Program, residentIds: string[]): string[] {
    const programAttendeeIds = program.attendees.map(obj => obj.userId)
    return programAttendeeIds.filter((id) => !residentIds.includes(id))
}

/**
 * Recommends programs that maximizes number of unique participating residents with a time span
 * Resonably assumed constraints:
 * * same cadidate CANNOT be in multiple programs at same time
 * * multiple programs CAN be run at same time
 * * programs attendees field includes the ids of only residents who want to attend that program
 * Reason to only recommend within a timespan is let the client figure out: what's the best period to maximize engagement is
 * 
 * Algorithm that truly maximizes the output is one that:
 * * figures out all the possible combinations of given programs
 * * and compares chooses the combination with maximum output
 * But this would be very inefficient, Hence we use a ranking system that is more efficient
 * 
 * @param limit 
 * @param skip 
 * @returns list of programs recommended to run in given time span
 */
function createRecomendations(startDate: Date, endDate: Date): Program[] {
    const programs = DataServiceInstance.getSortedPrograms()

    // filter out programs outside of given timespan
    let programsToChooseFrom = programs.filter(p => p.start.getTime() >= startDate.getTime() && p.end.getTime() <= endDate.getTime())
    if (!programsToChooseFrom.length) return []

    const firstProgram = programsToChooseFrom[0]

    // add program with highest number of addentees to recommendations, explanation:
    // programsToChooseFrom is sorted in desc order by number of attendees
    const recommendations: Program[] = [firstProgram]
    const uniqueAttendeeIds: string[] = firstProgram.attendees.map(obj => obj.userId)
    // remove recommended program from list to choose from
    programsToChooseFrom.splice(0, 1)

    // find and next progam in list that maximizes the number of unique attendees
    while (recommendations.length < MAX_RECOMMENDATIONS && recommendations.length < programsToChooseFrom.length) {

        const programsWithScores = programsToChooseFrom.map(program => ({ program, newAttendeeIds: getNewAttendeeIdsFromProgram(program, uniqueAttendeeIds) }))
        const nextRecommendation = programsWithScores.sort((pA, pB) => pB.newAttendeeIds.length - pA.newAttendeeIds.length )[0]

        recommendations.push(nextRecommendation.program)
        uniqueAttendeeIds.push(...nextRecommendation.newAttendeeIds)
        // remove recommended program from list to choose from
        programsToChooseFrom = programsToChooseFrom.filter(p => p.id !== nextRecommendation.program.id)
    }

    return recommendations
}

function getAllRecommendations(startDate: Date, endDate: Date): Program[] {
    const cacheKey = `${RECOMMENDATIONS_CACHE_KEY_PREFIX}_${startDate}_${endDate}`
    const cachedRecommendations = RecomendationsCacheService.get(cacheKey)
    if (cachedRecommendations) return cachedRecommendations

    const recommendations = createRecomendations(startDate, endDate)
    RecomendationsCacheService.set(cacheKey, recommendations)

    return recommendations
}

/**
 * @param startDate programs starting after Date
 * @param endDate programs ending before Date
 * @returns list of programs recommended to run in given time span
 */
export function getRecomendations(params: { startDate: string; endDate: string; }) {
    const startTimeMS = new Date(params.startDate)
    const endTimeMS = new Date(params.endDate)
    const recommendations = getAllRecommendations(startTimeMS, endTimeMS)
    // if (params.skip >= recommendations.length) return []

    // const sliceStartIndex = params.skip
    // let sliceEndIndex = params.skip + params.limit
    // if (sliceEndIndex > recommendations.length) sliceEndIndex = recommendations.length
    return recommendations.map(r => ({
        ...r,
        start: r.start.toISOString(),
        end: r.end.toISOString()
    }))
}
