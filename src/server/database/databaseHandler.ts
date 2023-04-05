import { getDateFromTimePeriod } from "~/backend/quiz/timeValues";
import { QuizQuestion } from "../../types/QuizQuestion";
import { Collection, Db, MongoClient, Document } from "mongodb";

type MongoObjs = {
  client: MongoClient;
  db: Db;
};
const db_name = "quizle-quizzes";

const getMongoObjs = async (): Promise<MongoObjs> => {
  /**
   * Connects to the mongodb server and gets the appropriate database
   */
  const uri: string = process.env.VITE_MONGO_CONNECTION_URI as string;
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
    return;
  }
  const { client, db } = await getMongoObjs();
  const collection: Collection<Document> = db.collection(
    `quizzes-${timePeriod}`
  );
  const now = new Date(Date.now());
  try {
    const quizAsJson: Document = { timeCreated: now, quiz: quiz };
    await collection.insertOne(quizAsJson);
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
  return count;
};

export const readLatestQuizFromDb = async (
  timePeriod: string
): Promise<QuizQuestion[] | null> => {
  const { client, db } = await getMongoObjs();
  try {
    const collection: Collection = db.collection(`quizzes-${timePeriod}`);
    const response = await collection.findOne({}, { sort: { $natural: -1 } });
    if (response) {
      const quiz = response.quiz;
      // console.log(quiz);
      client.close();
      return quiz;
    }
  } catch (error) {
    console.error(error);
  }
  console.log(
    `something went wrong reading the latest quiz - returning null  `
  );
  client.close();
  return null;
};

export const readAllQuizzesFromDb = async (
  timePeriod: string
): Promise<QuizQuestion[] | null> => {
  const { client, db } = await getMongoObjs();
  try {
    const collection: Collection = db.collection(`quizzes-${timePeriod}`);
    const response = await collection.find().toArray();
    if (response) {
      const quizzes: QuizQuestion[] = response.map((res) => {
        return res.quiz as QuizQuestion;
      });
      client.close();
      return quizzes;
    }
  } catch (error) {
    console.error(error);
  }
  console.log(
    `something went wrong reading all the quizzes - returning null  `
  );
  client.close();
  return null;
};
