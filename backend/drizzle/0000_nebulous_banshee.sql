CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"question" text NOT NULL,
	"status" text DEFAULT 'PENDING',
	"ai_response" text,
	"error_message" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
