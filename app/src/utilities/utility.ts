import type {GetTotalCountResponseByDay} from "../models/GetTotalCountByDayResponse.ts";


// Iterates through data set - looking for gaps in dates
// Populates data set with 0 count responses where there are gaps
export function enrichDayCountsWithZeroes(dayCounts: GetTotalCountResponseByDay[]): GetTotalCountResponseByDay[] {
    const enrichedCounts = [];
    const uniqueSlugs = [...new Set(dayCounts.map((data) => data.slug))]

    uniqueSlugs.forEach(slug => {
        const counts = dayCounts
            .filter(countData => countData.slug === slug)
            .sort(sortByDate);

        counts.forEach((data, index) => {
            console.log("Adding1 " + data.day);
            enrichedCounts.push(data);

            if (index == counts.length - 1) {
                return;
            }

            const oneDayOfMilliseconds = 24 * 60 * 60 * 1000;
            const currentDay: Date = new Date(data.day.toString());

            let millisecondsUntilNextDay =
                new Date(counts[index + 1].day.toString()).getTime() -
                currentDay.getTime();

            // Item is the next day, so add to data set
            if (millisecondsUntilNextDay <= oneDayOfMilliseconds) {
                return;
            }

            let counter = 1;

            // Fill any gaps in the data set with 0 counts
            while (millisecondsUntilNextDay > oneDayOfMilliseconds) {
                const nextDay: Date = new Date(data.day.toString());
                nextDay.setDate(currentDay.getDate() + counter);
                const prettyDate = nextDay.toISOString().split('T')[0];

                enrichedCounts.push({day: prettyDate, slug: data.slug, target: data.target, count: 0});
                console.log("Adding2 " + prettyDate);
                counter++;
                millisecondsUntilNextDay -= oneDayOfMilliseconds;
            }
        });
    });

    return enrichedCounts;
}

export function sortByDate(a: GetTotalCountResponseByDay, b: GetTotalCountResponseByDay): number {
    return new Date(a.day.toString()).getTime() - new Date(b.day.toString()).getTime();
}
