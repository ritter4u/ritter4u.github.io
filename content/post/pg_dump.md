---
layout: post
title: "PG_Dump Dump & restore"
publishdate : 2022-09-22
draft : true
---
``` restore
pg_dump -U user [database] < [sql or dump]
```
``` dump
pg_dump -U user [database] > [dump]
pg_dump --inserts -U user [database] > [sql]
```
