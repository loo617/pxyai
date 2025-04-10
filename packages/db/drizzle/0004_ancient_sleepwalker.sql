CREATE TABLE "captchas" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(16) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone
);
