/** @format */

export class CachingService<T> {

    private cache: {
        [key: string]: {
            cachedDateMS: number
            data: T
        } | undefined
    }
    private ttl: number | 'infinite'

    /**
     * 
     * @param ttl cache time to live in ms
     */
    public constructor(ttl: number | 'infinite') {
        this.cache = {}
        this.ttl = ttl
    }

    public set(key: string, data: T): void {
        this.cache[key] = {
            cachedDateMS: new Date().getTime(),
            data
        }
    }
    /**
     * 
     * @param key 
     * @returns cached data if not expired
     */
    public get(key: string): T | undefined {
        const maybeCache = this.cache[key]
        if (!maybeCache) return undefined

        if (this.ttl === 'infinite') {
            return maybeCache.data
        }

        const expiryDateMS = this.ttl + maybeCache.cachedDateMS
        const nowMS = new Date().getTime()
        
        if (expiryDateMS < nowMS) {
            return maybeCache.data
        }
        return undefined
    }
}
