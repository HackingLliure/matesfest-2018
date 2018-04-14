.open blockchain.sqlite3

create table "transactions" (
	"timestamp" integer not null, 
	"from" text not null, 
	"to" text not null, 
	"amount" real not null, 
	"signature" text not null, 
	"block_id" text,
	primary key ("timestamp", "signature")
);

create table "blocks" (
	"id" text not null, /* hash of the transactions */
	"timestamp" integer not null,
	primary key ("id")
);