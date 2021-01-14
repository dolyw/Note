# MySQL字符不一致导致索引失效

数据库才 2W 条数据

## 1. 查询速度非常慢

示例原语句

```sql
SELECT
	a.id,
	b.id
FROM
	t_example_a a
LEFT JOIN t_example_b b ON a.id = b.id
LIMIT 10
```

在 SQL 语句前面添加 EXPLAIN 关键字，然后执行查询，一个 LEFT JOIN 不走索引

```sql
EXPLAIN SELECT
	a.id,
	b.id
FROM
	t_example_a a
LEFT JOIN t_example_b b ON a.id = b.id
LIMIT 10
```

最后发现是这两个表的关联字段字符集不一致，一个是 utf8，一个是 utf8mb4，统一设置 utf8mb4 就解决了，估计是历史项目没有做好数据库规范吧

```sql
SHOW FULL COLUMNS FROM t_example_a;
SHOW FULL COLUMNS FROM t_example_b;
```

## 2. 统一设置字符集

查询整个库字符集

```sql
SELECT
	*
FROM
	information_schema. TABLES
WHERE
	TABLE_SCHEMA = 'app_sit';
```

生成 SQL

```sql
SELECT
	CONCAT(
		'ALTER TABLE ',
		table_name,
		' CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;'
	)
FROM
	information_schema. TABLES
WHERE
	TABLE_SCHEMA = 'app_sit'
```

执行

```sql
ALTER TABLE t_sys_user CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
-- ...
ALTER TABLE t_sys_role CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

**参考**

* [mysql left join 查询很慢，数据量不大](https://blog.csdn.net/god_is_gril/article/details/85855755)
