import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app"; 
import Game from "../src/models/Game"; 

describe("Game API Tests", () => {
  beforeAll(async () => {
    const testURI =
      process.env.MONGO_URI_TEST ||
      "mongodb://localhost:27017/dev-mind-speed-test-db";
    await mongoose.connect(testURI);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Game.deleteMany({});
  });

  describe("POST /game/start", () => {
    it("should create a new game when valid data is provided", async () => {
      const response = await request(app)
        .post("/game/start")
        .send({ name: "TestUser", difficulty: 1 });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("submit_url");
      expect(response.body).toHaveProperty("question");
      expect(response.body).toHaveProperty("time_started");
      expect(response.body.message).toContain("Hello TestUser");
    });

    it("should return 400 if name is missing", async () => {
      const response = await request(app)
        .post("/game/start")
        .send({ difficulty: 1 });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Missing parameters ):");
    });
    
    it("should return 400 if difficulty is missing", async () => {
      const response = await request(app)
        .post("/game/start")
        .send({ name: "TestUser" });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Missing parameters ):");
    });
  });

  describe("POST /game/:game_id/submit", () => {
    it("should submit an answer and return correct response", async () => {
      const startResponse = await request(app)
        .post("/game/start")
        .send({ name: "TestUser", difficulty: 1 });

      const gameId = startResponse.body.submit_url.split("/")[2];
      const submitResponse = await request(app)
        .post(`/game/${gameId}/submit`)
        .send({ answer: 10 }); // Example answer

      expect(submitResponse.statusCode).toBe(200);
      expect(submitResponse.body).toHaveProperty("result");
      expect(submitResponse.body).toHaveProperty("time_taken");
      expect(submitResponse.body).toHaveProperty("current_score");
      expect(submitResponse.body).toHaveProperty("history");
      expect(submitResponse.body).toHaveProperty("question");
    });

    it("should return 400 if game_id is invalid", async () => {
      const response = await request(app)
        .post("/game/12345/submit")
        .send({ answer: 10 });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Invalid game ID ):");
    });

    it("should return 400 if no answer is provided", async () => {
      const startResponse = await request(app)
        .post("/game/start")
        .send({ name: "TestUser", difficulty: 1 });
      const gameId = startResponse.body.submit_url.split("/")[2];

      const response = await request(app)
        .post(`/game/${gameId}/submit`)
        .send({});
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Missing answer");
    });

    it("should return 404 if game is not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .post(`/game/${nonExistentId}/submit`)
        .send({ answer: 10 });
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("Game not found ):");
    });
  });

  describe("GET /game/:game_id/status", () => {
    it("should return the game status for a valid game_id", async () => {
      const startResponse = await request(app)
        .post("/game/start")
        .send({ name: "TestUser", difficulty: 1 });
      const gameId = startResponse.body.submit_url.split("/")[2];

      const statusResponse = await request(app).get(`/game/${gameId}/status`);
      expect(statusResponse.statusCode).toBe(200);
      expect(statusResponse.body).toHaveProperty("name", "TestUser");
      expect(statusResponse.body).toHaveProperty("difficulty", 1);
      expect(statusResponse.body).toHaveProperty("current_score");
      expect(statusResponse.body).toHaveProperty("total_time_spent");
      expect(Array.isArray(statusResponse.body.history)).toBe(true);
    });

    it("should return 400 if game_id is invalid", async () => {
      const response = await request(app).get("/game/12345/status");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Invalid game ID ):");
    });

    it("should return 404 if game is not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const response = await request(app).get(`/game/${nonExistentId}/status`);
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("Game not found ):");
    });
  });
});
