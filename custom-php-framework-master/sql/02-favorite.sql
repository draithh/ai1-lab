create table favorite
(
    id      integer not null
        constraint favorite_pk
            primary key autoincrement,
    post_id integer not null
        constraint favorite_post_id_fk
            references post
);