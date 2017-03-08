alter table product alter column prokey type bigint;
alter table history alter column hiskey type bigint;
alter table shoploadstats alter column slskey type bigint;

create table searchproducts (
  sprkey bigserial primary key not null,
  sprapikey varchar(255) not null,
  sprquery varchar(255) not null,
  sprtimestamp timestamptz not null default now()
);

create table getproduct (
  gprkey bigserial primary key not null,
  gprapikey varchar(255) not null,
  gprproduct varchar(255) not null,
  gprtimestamp timestamptz not null default now()
);

create table autocomplete (
  acokey bigserial primary key not null,
  acoword varchar(255) not null,
  acoproductcount bigint not null,
  acosearchcount bigint not null
);
