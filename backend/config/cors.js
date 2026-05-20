import cors from "cors";

export const corsMiddleware = () => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://online-code-judge-steel.vercel.app"
  ];

  const corsOptions = {
    origin: function (origin, callback) {
      // allow REST tools (Postman) + frontend
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  return [
    cors(corsOptions),
    cors(corsOptions),
  ];
};