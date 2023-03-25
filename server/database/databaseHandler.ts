import { GeneratedQuizQuestion, QuizQuestion } from "../../types/QuizQuestion";
import mongoose, {
  Collection,
  Db,
  MongoClient,
  ServerApiVersion,
  Document,
} from "mongodb";
import { getDateFromTimePeriod } from "../quiz/timeValues";
import { time } from "console";

type MongoObjs = {
  client: MongoClient;
  db: Db;
};

const getMongoObjs = async (): Promise<MongoObjs> => {
  /**
   * Connects to the mongodb server and gets the appropriate database
   */
  const uri: string = import.meta.env.VITE_MONGO_CONNECTION_URI as string;
  const db_name: string = import.meta.env.VITE_MONGO_DB as string;
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
  if (quiz.length === 0) {
    console.log("Err writeQuizToMongo(): no questions for quiz");
    return;
  }
  const { client, db } = await getMongoObjs();
  const collection: Collection<Document> = db.collection(
    `quizzes-${timePeriod}`
  );
  const now: string = new Date(Date.now()).toISOString();
  try {
    const quizAsJson: Document = { timeCreated: now, quiz: quiz };
    console.log(`writing quiz to mongo`, quizAsJson);
    await collection.insertOne(quizAsJson);
    client.close();
  } catch (error) {
    console.error(error);
  }
};

export const isDatabasePopulatedWithinTimeFrame = async (
  timePeriod: string
): Promise<boolean | null> => {
  /**
   * Checks to see if the mongo db database has been updated within the expected time period
   */
  const acceptableInput: string[] = ["day", "week", "month", "year"];
  if (acceptableInput.includes(timePeriod) === false) {
    return null;
  }
  const { client, db } = await getMongoObjs();
  const collection: Collection<Document> = db.collection(
    `quizzes-${timePeriod}`
  );
  const yesterday: Date | null = getDateFromTimePeriod(timePeriod);
  const now = Date.now();
  const query = {
    timeCreated: {
      $gte: yesterday,
      $lte: now,
    },
  };
  const count = await collection.countDocuments(query);
  client.close();
  return count > 0;
};
