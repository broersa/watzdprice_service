create table shoploadstats (
  slskey serial primary key not null,
  slsshop varchar(255) not null,
  slsstart timestamptz not null,
  slsend timestamptz not null,
  slsadded bigint not null,
  slsupdated bigint not null
);
