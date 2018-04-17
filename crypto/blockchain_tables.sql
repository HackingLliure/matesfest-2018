.open blockchain.sqlite3

create table "transactions" (
	"timestamp" integer not null, 
	"from" text not null, 
	"to" text not null, 
	"amount" real not null, 
	"signature" text not null, 
	"block_id" integer not null,
	primary key ("timestamp", "signature")
);

create table "blocks" (
	"id" text not null,
	"timestamp" integer not null,
	"hash" text not null,
	"proof" text not null, 
	"parent_block" text,
	primary key ("id")
);
