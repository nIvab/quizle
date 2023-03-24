import { GeneratedQuizQuestion, QuizQuestion } from "../../types/QuizQuestion";
import mongoose, {
  Collection,
  Db,
  MongoClient,
  ServerApiVersion,
  Document,
} from "mongodb";

export const writeQuizToMongo = async (quiz: QuizQuestion[]) => {
  if (quiz.length === 0) {
    console.log("no questions for quiz");
    return;
  }
  const uri: string = import.meta.env.VITE_MONGO_CONNECTION_URI as string;
  const client: MongoClient = new MongoClient(uri);
  // Connect to the MongoDB database
  await client.connect();
  //Todo: Make this save to the correct collection depending on the type of timeperiod selected
  const db: Db = client.db("quizle-quizes-dev");
  const collection: Collection<Document> = db.collection("quizzes");
  const now: string = new Date(Date.now()).toISOString();
  try {
    const quizAsJson: Document = { timeRecorded: now, quiz: quiz };
    console.log(`writing quiz to mongo`, quizAsJson);
    await collection.insertOne(quizAsJson);
  } catch (error) {
    console.error(error);
  }
};
