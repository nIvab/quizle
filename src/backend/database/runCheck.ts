import { timeValues } from "../quiz/timeValues";
import { getDatabaseTimePeriodCount } from "./databaseHandler";
import { setupQuiz } from "../quiz/generateQuiz";

export const runCheck = async () => {
  /**
   * checks to see if records have been saved to the mongodb suitably for
   */
  console.log("run check called");
  Object.entries(timeValues).forEach(async ([key]) => {
    // loop through each of the time values and if acceptable then generate quiz for that time value

    const count: number | null = await getDatabaseTimePeriodCount(`${key}`);
    console.log(`just checkiing, count: ${count}, bools: ${count === 0}`);

    if (count === 0) {
      console.log(`ok setting up quiz for key: ${key}`);
      setupQuiz(`${key}`);
    } else {
      console.log(`database already populated for key: ${key}, count ${count}`);
    }
  });
  console.log("got to the end");
};
