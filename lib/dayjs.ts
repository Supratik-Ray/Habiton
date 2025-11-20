import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import minMax from "dayjs/plugin/minMax";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isoWeek);
dayjs.extend(minMax);
dayjs.extend(isBetween);

export default dayjs;
