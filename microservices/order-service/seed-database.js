import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { z } from "zod";
import "dotenv/config";

// ✅ Validate Mongo URI
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

console.log("✅ Using Mongo URI:", process.env.MONGO_URI);

// ✅ Setup MongoDB Client
const client = new MongoClient(process.env.MONGO_URI);

// ✅ Setup Google Generative AI LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash", // The latest library will find this model correctly
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
});

// ✅ Define Schema
const itemSchema = z.object({
  item_id: z.string(),
  item_name: z.string(),
  item_description: z.string(),
  brand: z.string(),
  manufacturer_address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string(),
  }),
  prices: z.object({
    full_price: z.number(),
    sale_price: z.number(),
  }),
  categories: z.array(z.string()),
  user_reviews: z.array(
    z.object({
      review_date: z.string(),
      rating: z.number(),
      comment: z.string(),
    })
  ),
  notes: z.string(),
});

// NEW: Create a schema for an array of items, wrapped in an object
const inventorySchema = z.object({
  items: z.array(itemSchema),
});

// Use this new schema for the parser
const parser = StructuredOutputParser.fromZodSchema(inventorySchema);

// ✅ Setup Database and Collection
async function setupDatabaseAndCollection() {
  const db = client.db("inventory_database");
  const collections = await db.listCollections({ name: "items" }).toArray();
  if (collections.length === 0) {
    await db.createCollection("items");
    console.log("📦 'items' collection created in 'inventory_database'");
  } else {
    console.log("📦 'items' collection already exists");
  }
}

// ✅ Create Vector Search Index
async function createVectorSearchIndex() {
  try {
    const db = client.db("inventory_database");
    const collection = db.collection("items");
    await collection.dropIndexes();

    const vectorSearchIdx = {
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: 768,
            similarity: "cosine",
          },
        ],
      },
    };

    console.log("⚙️ Creating vector search index...");
    await collection.createSearchIndex(vectorSearchIdx);
    console.log("✅ Vector search index created successfully!");
  } catch (error) {
    console.error("❌ Failed to create vector search index:", error);
  }
}

// ✅ Generate Synthetic Data
async function generateSyntheticData() {
  // UPDATED PROMPT: More specific instructions for the AI
  const prompt = `You are a helpful assistant that generates furniture store item data.
Generate 10 furniture store items.
Ensure variety and realistic values for all fields.

${parser.getFormatInstructions()}

IMPORTANT: Respond with ONLY the JSON object and nothing else. Do not include markdown formatting like \`\`\`json.`;

  console.log("🤖 Generating synthetic data...");
  const response = await llm.invoke(prompt);
  
  // Parse the response using the new parser
  const parsedResponse = await parser.parse(response.content);
  
  // Return the array of items
  return parsedResponse.items;
}

// ✅ Create Item Summary
async function createItemSummary(item) {
  const manufacturerDetails = `Made in ${item.manufacturer_address.country}`;
  const categories = item.categories.join(", ");
  const userReviews = item.user_reviews
    .map(
      (review) =>
        `Rated ${review.rating} on ${review.review_date}: ${review.comment}`
    )
    .join(" | ");

  const basicInfo = `${item.item_name} - ${item.item_description} from brand ${item.brand}`;
  const price = `Full price: $${item.prices.full_price}, Sale price: $${item.prices.sale_price}`;

  return `${basicInfo}. Manufacturer: ${manufacturerDetails}. Categories: ${categories}. Reviews: ${userReviews}. Price: ${price}. Notes: ${item.notes}`;
}

// ✅ Seed Database
async function seedDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");

    await setupDatabaseAndCollection();
    await createVectorSearchIndex();

    const db = client.db("inventory_database");
    const collection = db.collection("items");

    console.log("🗑️ Clearing existing data from items collection...");
    await collection.deleteMany({});

    const itemsArray = await generateSyntheticData();
const recordsWithSummaries = await Promise.all(
  itemsArray.map(async (record) => ({
        pageContent: await createItemSummary(record),
        metadata: record,
      }))
    );

    for (const record of recordsWithSummaries) {
      await MongoDBAtlasVectorSearch.fromDocuments(
        [record],
        new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GOOGLE_API_KEY,
          modelName: "text-embedding-004",
        }),
        {
          collection,
          indexName: "vector_index",
          textKey: "embedding_text",
          embeddingKey: "embedding",
        }
      );
      console.log("✅ Processed & saved record:", record.metadata.item_id);
    }

    console.log("🎉 Database seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.close();
  }
}

// ✅ Run
seedDatabase().catch(console.error);
