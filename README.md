# Welbi-Recommendation-Engine

### App info
- This application uses express and graphQL to expose an API designed as per specs given for an interview with [Welbi](https://www.welbi.co/)
- API works with a static dataset of "programs" and "residents" and it returns programs that Engages the highest number of residents (ie. the programs maximizes number of unique participating residents within a given time span)

### Explanation of design
Time span was not part of the original specs, but I decided to add timespan as it makes sense optimize (maximizing number of unique participating residents) only within a particular timespan. Otherwise some residents may end up participating only once or never through the timespan of all the listed programs

### Example request body to get program recommedations
(this query will result in the algorithm recommendations from all programs as they will fall under the timespan provided below):
```
{
    "query": "{ recommendations(startDate: \"2000-01-01T00:00:00.000Z\", endDate: \"2030-01-01T00:00:00.000Z\") { id name start end attendees { userId } } }"
}
```
