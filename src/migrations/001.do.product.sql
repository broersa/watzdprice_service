create table product (
  prokey serial primary key not null,
  proid varchar(255) not null,
  proname varchar(255) not null,
  proshop varchar(255) not null,
  probrand varchar(255),
  proean varchar(255),
  procategory varchar(255),
  procreated timestamptz not null,
  prolastupdate timestamptz not null,
  proprice numeric(18,6) not null,
  prodescription varchar(2000),
  prourl varchar(2000),
  proimage varchar(2000),
  constraint sk_product unique (proid)
);

create table history (
  hiskey serial primary key not null,
  hisproduct bigint not null,
  hisupdate timestamptz not null,
  hisprice numeric(18,6) not null,
  constraint sk_history unique (hisproduct, hisupdate),
  constraint fk_history_product foreign key (hisproduct) references product (prokey)
);
