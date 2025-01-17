// @flow
import { formatDistance } from "date-fns";

function getUTCDate() {
    const date = new Date();
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds()
        )
    );
}

function humanizeDuration(unixTimestamp: number) {
    return formatDistance(0, unixTimestamp * 1000);
}

export { humanizeDuration, getUTCDate };
