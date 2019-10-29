# 安装本地IK分词插件

安装本地Elasticsearch的IK分词插件和拼音分词插件

## 安装本地Elasticsearch的IK分词插件

去[https://github.com/medcl/elasticsearch-analysis-ik/releases](https://github.com/medcl/elasticsearch-analysis-ik/releases)下载对应**Elasticsearch**版本的IK分词插件**elasticsearch-analysis-ik-7.3.0.zip**这个文件，打开可以看到如下文件

```bash
commons-codec-1.9.jar
commons-logging-1.2.jar
config/
elasticsearch-analysis-ik-7.2.0.jar
httpclient-4.5.2.jar
httpcore-4.4.4.jar
plugin-descriptor.properties
plugin-security.policy
```

没问题，就解压到你安装的**Elasticsearch**目录的**plugins**目录下，例如我的路径是这样的**D:\Tools\elasticsearch-7.2.0\plugins\elasticsearch-analysis-ik-7.2.0**

重启**Elasticsearch**，可以看到控制台打印日志

```bash
loaded plugin [analysis-ik]
```

测试一下

```json
POST /_analyze
{
  "text":"中华人民共和国国徽",
  "analyzer":"ik_smart"
}
```

返回

```json
{
	"tokens": [
		{
			"token": "中华人民共和国",
			"start_offset": 0,
			"end_offset": 7,
			"type": "CN_WORD",
			"position": 0
		},
		{
			"token": "国徽",
			"start_offset": 7,
			"end_offset": 9,
			"type": "CN_WORD",
			"position": 1
		}
	]
}
```

```json
POST /_analyze
{
  "text":"中华人民共和国国徽",
  "analyzer":"ik_max_word"
}
```

返回

```json
{
	"tokens": [
		{
			"token": "中华人民共和国",
			"start_offset": 0,
			"end_offset": 7,
			"type": "CN_WORD",
			"position": 0
		},
		{
			"token": "中华人民",
			"start_offset": 0,
			"end_offset": 4,
			"type": "CN_WORD",
			"position": 1
		},
		{
			"token": "中华",
			"start_offset": 0,
			"end_offset": 2,
			"type": "CN_WORD",
			"position": 2
		},
		{
			"token": "华人",
			"start_offset": 1,
			"end_offset": 3,
			"type": "CN_WORD",
			"position": 3
		},
		{
			"token": "人民共和国",
			"start_offset": 2,
			"end_offset": 7,
			"type": "CN_WORD",
			"position": 4
		},
		{
			"token": "人民",
			"start_offset": 2,
			"end_offset": 4,
			"type": "CN_WORD",
			"position": 5
		},
		{
			"token": "共和国",
			"start_offset": 4,
			"end_offset": 7,
			"type": "CN_WORD",
			"position": 6
		},
		{
			"token": "共和",
			"start_offset": 4,
			"end_offset": 6,
			"type": "CN_WORD",
			"position": 7
		},
		{
			"token": "国",
			"start_offset": 6,
			"end_offset": 7,
			"type": "CN_CHAR",
			"position": 8
		},
		{
			"token": "国徽",
			"start_offset": 7,
			"end_offset": 9,
			"type": "CN_WORD",
			"position": 9
		}
	]
}
```

IK分词插件就这样安装成功了

## 安装本地Elasticsearch的拼音分词插件

去[https://github.com/medcl/elasticsearch-analysis-pinyin/releases](https://github.com/medcl/elasticsearch-analysis-pinyin/releases)下载对应**Elasticsearch**版本的IK分词插件**elasticsearch-analysis-pinyin-7.2.0.zip**这个文件，打开可以看到如下文件

```bash
elasticsearch-analysis-pinyin-7.2.0.jar
nlp-lang-1.7.jar
plugin-descriptor.properties
```

没问题，就解压到你安装的**Elasticsearch**目录的**plugins**目录下，例如我的路径是这样的**D:\Tools\elasticsearch-7.2.0\plugins\elasticsearch-analysis-pinyin-7.2.0**

重启**Elasticsearch**，可以看到控制台打印日志

```bash
loaded plugin [analysis-pinyin]
```

测试一下

```json
POST /_analyze
{
  "text":"中华人民共和国国徽",
  "analyzer":"pinyin"
}
```

返回

```json
{
	"tokens": [
		{
			"token": "zhong",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 0
		},
		{
			"token": "zhrmghggh",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 0
		},
		{
			"token": "hua",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 1
		},
		{
			"token": "ren",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 2
		},
		{
			"token": "min",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 3
		},
		{
			"token": "gong",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 4
		},
		{
			"token": "he",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 5
		},
		{
			"token": "guo",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 6
		},
		{
			"token": "guo",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 7
		},
		{
			"token": "hui",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 8
		}
	]
}
```

拼音分词插件就这样安装成功了

#### 使用IK和拼音插件(详细使用可以查看Github的文档)

* 创建Index，拼音分词过滤

```json
PUT /book
{
	"settings": {
		"analysis": {
			"analyzer": {
				"pinyin_analyzer": {
					"tokenizer": "my_pinyin"
				}
			},
			"tokenizer": {
				"my_pinyin": {
					"type": "pinyin",
					"keep_separate_first_letter": false,
					"keep_full_pinyin": true,
					"keep_original": true,
					"limit_first_letter_length": 16,
					"lowercase": true,
					"remove_duplicated_term": true
				}
			}
		}
	}
}
```

返回

```json
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "book"
}
```

* 创建Mapping，属性使用过滤，name开启拼音分词，content开启IK分词，describe开启拼音加IK分词

```json
POST /book/_mapping
{
	"properties": {
		"name": {
			"type": "keyword",
			"fields": {
				"pinyin": {
					"type": "text",
					"store": false,
					"term_vector": "with_offsets",
					"analyzer": "pinyin_analyzer",
					"boost": 10
				}
			}
		},
		"content": {
			"type": "text",
			"analyzer": "ik_max_word",
			"search_analyzer": "ik_smart"
		},
		"describe": {
			"type": "text",
			"analyzer": "ik_max_word",
			"search_analyzer": "ik_smart",
			"fields": {
				"pinyin": {
					"type": "text",
					"store": false,
					"term_vector": "with_offsets",
					"analyzer": "pinyin_analyzer",
					"boost": 10
				}
			}
		},
		"id": {
			"type": "long"
		}
	}
}
```

返回

```json
{
    "acknowledged": true
}
```

这样Index以及属性分词就开启了

#### 注：搜索时，先查看被搜索的词被分析成什么样的数据，如果你搜索该词输入没有被分析出的参数时，是查不到的！！！