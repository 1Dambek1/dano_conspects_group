window.COURSES.push({
  id:'pandas',number:'03',title:'pandas',icon:'▦',tint:'#edf0df',
  lead:'Таблица как рабочий инструмент: загрузка CSV, отбор строк, группировка и очистка.',
  subtitle:'Работа с DataFrame на маленьких данных, затем с настоящим CSV.',
  lessons:[
    {id:'frame',title:'DataFrame и чтение CSV',lead:'DataFrame — таблица со строками и именованными столбцами.',blocks:[
      {type:'p',html:'<strong>Series</strong> — один столбец. <strong>DataFrame</strong> — вся таблица. Обычно данные читают из CSV, затем проверяют первые строки, размер таблицы и типы столбцов. <a href="student_scores_80.csv" download>Скачать учебный CSV →</a>'},
      {type:'code',language:'python',code:'import pandas as pd\n\ndf = pd.read_csv("student_scores_80.csv")\nprint(df.head())\nprint(df.shape)\nprint(df.dtypes)',output:'shape: (80, 5) — если используется учебный CSV с 80 строками'},
      {type:'p',html:'CSV содержит текстовые строки. pandas обычно распознаёт числа автоматически, но после загрузки типы нужно проверить: ошибочный тип помешает правильно считать среднее или обучать модель.'},
      {type:'callout',label:'Порядок работы',html:'Сначала <code>head()</code>, <code>shape</code>, <code>dtypes</code>, затем проверка пропусков. Только после этого фильтрация и расчёты.'},
      {type:'example',title:'Как прочитать размер',given:'<code>df.shape</code> вернуло <code>(80, 5)</code>.',find:'Число объектов и столбцов.',steps:['Первое число — количество строк.','Второе число — количество столбцов.'],answer:'80 строк и 5 столбцов.'},
      {type:'exercise',title:'Первые шаги',prompt:'Загрузи CSV и выведи названия столбцов и последние три строки.',hint:'Понадобятся <code>df.columns</code> и <code>df.tail(3)</code>.',solution:'<code>print(df.columns)</code> и <code>print(df.tail(3))</code>.'}
    ]},
    {id:'selection',title:'Столбцы и фильтры',lead:'Из большой таблицы удобно брать только нужные значения.',blocks:[
      {type:'p',html:'<code>df["test_score"]</code> возвращает один столбец. <code>df[["student_id", "test_score"]]</code> — таблицу из двух столбцов. <code>loc</code> выбирает по именам, <code>iloc</code> — по числовым позициям.'},
      {type:'code',language:'python',code:'high = df.loc[df["test_score"] >= 70,\n              ["student_id", "test_score"]]\nprint(high.head())',output:'Только строки с баллом не меньше 70 и два нужных столбца.'},
      {type:'p',html:'Фильтр <code>df["test_score"] >= 70</code> создаёт последовательность True/False. Для двух условий используют <code>&amp;</code> и скобки вокруг каждого сравнения: <code>(условие1) &amp; (условие2)</code>.'},
      {type:'interactive',kind:'pandas-table'},
      {type:'example',title:'Два условия',given:'Нужны ученики с 6 и более часами подготовки и 3 и более пробниками.',find:'Маска для фильтрации.',steps:['Первое условие: df["study_hours"] >= 6.','Второе: df["practice_tests"] >= 3.','Соедини через & и заключи каждое сравнение в скобки.'],answer:'<code>df[(df["study_hours"] >= 6) &amp; (df["practice_tests"] >= 3)]</code>.'},
      {type:'exercise',title:'Выбери строки',prompt:'Оставь строки, где <code>sleep_hours</code> меньше 7 и <code>test_score</code> больше 60.',hint:'Используй две пары скобок и знак <code>&amp;</code>.',solution:'<code>df[(df["sleep_hours"] < 7) &amp; (df["test_score"] > 60)]</code>.'}
    ]},
    {id:'cleaning',title:'Новые столбцы и пропуски',lead:'Проверка качества данных — часть работы, а не формальность.',blocks:[
      {type:'p',html:'<code>df.isna().sum()</code> показывает число пропусков по столбцам. <code>df.duplicated()</code> помогает найти повторяющиеся строки. Не удаляй пропуски автоматически: сначала выясни их смысл.'},
      {type:'code',language:'python',code:'print(df.isna().sum())\nprint(df["student_id"].duplicated().sum())\n\ndf["above_average"] = (\n    df["test_score"] > df["test_score"].mean()\n)',output:'Новый столбец хранит True или False для каждой строки.'},
      {type:'p',html:'<code>sort_values("test_score", ascending=False)</code> ставит наибольшие баллы первыми. По умолчанию метод возвращает новую таблицу, а исходную не меняет.'},
      {type:'example',title:'Топ-3 по баллу',given:'Нужны ID и балл трёх лучших учеников.',find:'Последовательность действий.',steps:['Отсортируй по test_score по убыванию.','Возьми первые три строки через head(3).','Оставь столбцы student_id и test_score.'],answer:'<code>df.sort_values("test_score", ascending=False).head(3)[["student_id", "test_score"]]</code>.'},
      {type:'exercise',title:'Новый признак',prompt:'Добавь столбец <code>score_gap</code>: балл ученика минус средний балл.',hint:'Из столбца можно вычесть одно число.',solution:'<code>df["score_gap"] = df["test_score"] - df["test_score"].mean()</code>.'}
    ]},
    {id:'grouping',title:'Группировка и сохранение',lead:'Группировка отвечает на вопрос «что происходит в каждой категории?»',blocks:[
      {type:'p',html:'<code>groupby</code> делит строки на группы; для каждой можно применить <code>mean</code>, <code>count</code>, <code>sum</code> и другие операции. Сравнение групп показывает связь в данных, но не доказывает её причину.'},
      {type:'code',language:'python',code:'summary = df.groupby("practice_tests")[\n    "test_score"\n].agg(["count", "mean"])\nprint(summary)\n\nsummary.to_csv("summary.csv")',output:'Число учеников и средний балл для каждого числа пробников.'},
      {type:'p',html:'После группировки проверь размер групп: среднее по двум ученикам менее устойчиво, чем по двадцати. Для экспорта обычной таблицы в CSV можно указать <code>index=False</code>, если индекс не нужен.'},
      {type:'example',title:'Сравнение двух групп',given:'Сравнить средний балл тех, кто спит меньше 7 часов, и тех, кто спит не меньше 7.',find:'Группировку по условию.',steps:['Условие df["sleep_hours"] >= 7 делит строки на True и False.','Сгруппируй таблицу по этому условию.','Посчитай среднее test_score.'],answer:'<code>df.groupby(df["sleep_hours"] >= 7)["test_score"].mean()</code>.'},
      {type:'exercise',title:'Число наблюдений',prompt:'Сколько учеников приходится на каждое значение <code>practice_tests</code>?',hint:'Можно использовать <code>value_counts()</code>.',solution:'<code>df["practice_tests"].value_counts().sort_index()</code>.'}
    ]}
  ]
});
