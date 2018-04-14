.open private.sqlite3

create table "accounts" (
	"id" text not null,
	"secret" text not null,
	"public" text not null,
	"private" text not null,
	primary key ("id")
);