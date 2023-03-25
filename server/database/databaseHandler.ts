import { GeneratedQuizQuestion, QuizQuestion } from "../../types/QuizQuestion";
import mongoose, {
  Collection,
  Db,
  MongoClient,
  ServerApiVersion,
  Document,
} from "mongodb";
import { getDateFromTimePeriod } from "../quiz/timeValues";

type MongoObjs = {
  client: MongoClient;
  db: Db;
};

const getMongoObjs = async (): Promise<MongoObjs> => {
  /**
   * Connects to the mongodb server and gets the appropriate database
   */
  console.log(import.meta.env.VITE_MONGO_DB);
  const uri: string = import.meta.env.VITE_MONGO_CONNECTION_URI as string;
  const db_name: string = "quizle-quizzes";
  console.log(uri);
  const client: MongoClient = new MongoClient(uri);
  // Connect to the MongoDB database
  await client.connect();
  const db: Db = client.db(db_name);
  return {
    client: client,
    db: db,
  };
};

export const writeQuizToMongo = async (
  quiz: QuizQuestion[],
  timePeriod: string
): Promise<void> => {
  /**
   * Takes an array of QuizQuestions, stores it in an object along with a timestamp then
   * writes the resulting object to the relevant MongoDB collection
   */
  console.log(`Writing quiz to mongodb for timePeriod: ${timePeriod} `);
  if (quiz.length === 0) {
    console.log("Err writeQuizToMongo(): no questions for quiz");
    return;
  }
  const { client, db } = await getMongoObjs();
  const collection: Collection<Document> = db.collection(
    `quizzes-${timePeriod}`
  );
  const now = new Date(Date.now());
  try {
    const quizAsJson: Document = { timeCreated: now, quiz: quiz };
    console.log(`writing quiz to mongo`, quizAsJson);
    await collection.insertOne(quizAsJson);
    console.log(`Wrote to quiz for timePeriod : ${timePeriod} `);
    client.close();
  } catch (error) {
    console.error(error);
  }
};

export const getDatabaseTimePeriodCount = async (
  timePeriod: string
): Promise<number | null> => {
  /**
   * Checks to see if the mongo db database has been updated within the expected time period
   */
  console.log(`check called timeperiod: ${timePeriod} `);
  const acceptableInput: string[] = ["day", "week", "month", "year"];
  if (acceptableInput.includes(timePeriod) === false) {
    return null;
  }
  const { client, db } = await getMongoObjs();
  const collection: Collection<Document> = db.collection(
    `quizzes-${timePeriod}`
  );
  const fromTime: Date | null = getDateFromTimePeriod(timePeriod);
  const now = new Date(Date.now());
  const query = {
    timeCreated: {
      $gte: fromTime,
      $lte: now,
    },
  };
  const count = await collection.countDocuments(query);
  client.close();
  console.log(`count for time: ${timePeriod} with count: ${count}`);
  return count;
};