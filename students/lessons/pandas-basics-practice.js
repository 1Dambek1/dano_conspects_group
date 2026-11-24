(function () {
  const course = window.COURSES.find(c => c.id === 'pandas');
  const p = html => ({type:'p', html});
  const h = text => ({type:'h', text});
  const code = (source, output) => ({type:'code', language:'python', code:source, output});
  const table = (headers, rows) => ({type:'table', headers, rows});
  const tip = (label, html) => ({type:'callout', label, html});
  const task = (title, prompt, hint, solution) => ({type:'exercise', title, prompt, hint, solution});
  const starter = String.raw`import pandas as pd

df = pd.DataFrame({
    "name": ["Аня", "Борис", "Вера", "Глеб", "Дина"],
    "group": ["A", "B", "A", "B", "A"],
    "score": [80, 55, 92, 70, 55],
    "hours": [4, 2, 5, 3, 2],
    "bonus": [5.0, None, 0.0, 10.0, None],
})`;

  course.lessons.push({
    id:'pandas-table-basics', title:'pandas: таблица, строки и столбцы', level:'База',
    lead:'Маленький DataFrame из пяти учеников: что такое строка, столбец, индекс, loc и iloc.',
    blocks:[
      h('Пять строк — пять учеников'),
      p('Начни с таблицы прямо в коде: CSV пока не нужен. Одна строка означает одного ученика; <code>name</code>, <code>group</code>, <code>score</code>, <code>hours</code> и <code>bonus</code> — столбцы. Слева pandas показывает индекс 0–4. Индекс помогает обращаться к строкам, но сам не является номером ученика в жизни.'),
      code(starter + String.raw`

print(df.shape)
print(df["score"].tolist())
print(df.loc[2, "name"])
print(df.iloc[0:2]["name"].tolist())`, '(5, 5)\n[80, 55, 92, 70, 55]\nВера\n[\'Аня\', \'Борис\']'),
      table(['Код','Что вернётся'],[
        ['<code>df["score"]</code>','Один столбец — <code>Series</code>.'],
        ['<code>df[["name", "score"]]</code>','Таблица из двух столбцов — <code>DataFrame</code>.'],
        ['<code>df.loc[2, "name"]</code>','Значение на строке с меткой индекса 2 и в столбце name.'],
        ['<code>df.iloc[0:2]</code>','Первые две строки по позициям: 0 и 1.'],
        ['<code>df.shape</code>','Пара (число строк, число столбцов).']
      ]),
      tip('loc и iloc','На этой маленькой таблице метки индекса совпадают с позициями. После фильтра или сортировки это может измениться: <code>loc</code> смотрит на метку, <code>iloc</code> — на положение строки.'),
      task('1 · один или два столбца','Получить только баллы как Series и отдельно таблицу из имён и баллов.','Один набор квадратных скобок вокруг имени столбца или список имён внутри них.','<code>df["score"]</code> и <code>df[["name", "score"]]</code>.'),
      task('2 · строка Веры','Выведи имя и балл строки с индексом 2.','Используй <code>loc</code> и список двух столбцов.','<code>df.loc[2, ["name", "score"]]</code> → Вера, 92.'),
      task('3 · первые три','Возьми первые три строки по позициям.','Конец среза не включается.','<code>df.iloc[:3]</code>.'),
      task('4 · размер','Выведи число учеников и число столбцов отдельно.','<code>shape</code> — пара чисел.','<code>print(df.shape[0], df.shape[1])</code> → <code>5 5</code>.'),
      task('5 · средний балл','Найди среднее значение <code>score</code> и проверь расчёт вручную.','У Series есть метод <code>mean()</code>.','<code>df["score"].mean()</code> → <code>70.4</code>: сумма 352 делится на 5.')
    ]
  });

  course.lessons.push({
    id:'pandas-filter-search', title:'pandas: фильтры и поиск', level:'База',
    lead:'Один и два условия, поиск по списку и строке, максимум и топ значений.',
    blocks:[
      h('Фильтр отвечает на вопрос «какие строки подходят?»'),
      p('Сравнение <code>df["score"] >= 70</code> даёт пять значений <code>True/False</code>. Передай их в <code>.loc</code>, чтобы оставить нужные строки. Для двух условий используй <code>&amp;</code> («и») или <code>|</code> («или») и заключай каждое сравнение в скобки.'),
      code(starter + String.raw`

selected = df.loc[(df["group"] == "A") & (df["score"] >= 70),
                  ["name", "score"]]
print(selected.to_string(index=False))
best_index = df["score"].idxmax()
print("Лучший:", df.loc[best_index, "name"])`, 'name  score\n Аня     80\nВера     92\nЛучший: Вера'),
      table(['Вопрос','Подходящий код'],[
        ['Балл от 60 до 90 включительно','<code>df.loc[df["score"].between(60, 90)]</code>'],
        ['Имя среди заданных','<code>df.loc[df["name"].isin(["Аня", "Дина"])]</code>'],
        ['Имя начинается на «В»','<code>df.loc[df["name"].str.startswith("В")]</code>'],
        ['Индекс строки с максимумом','<code>df["score"].idxmax()</code>'],
        ['Два наибольших балла','<code>df.nlargest(2, "score")</code>']
      ]),
      tip('Значение или индекс','<code>max()</code> вернёт лучший балл 92. <code>idxmax()</code> вернёт метку строки 2. Чтобы получить имя ученика, используй эту метку с <code>df.loc[... , "name"]</code>.'),
      task('1 · один фильтр','Оставь учеников с баллом не меньше 70. Какие имена останутся?','Передай логический столбец в <code>.loc</code>.','<code>df.loc[df["score"] >= 70, "name"]</code> → Аня, Вера, Глеб.'),
      task('2 · два условия','Оставь учеников группы B, которые учились не меньше 3 часов.','Каждое сравнение возьми в скобки; соедини через <code>&amp;</code>.','<code>df.loc[(df["group"] == "B") &amp; (df["hours"] >= 3)]</code> → Глеб.'),
      task('3 · поиск по списку','Найди строки Ани и Дины по именам.','Применяй <code>.isin([...])</code> к столбцу name.','<code>df.loc[df["name"].isin(["Аня", "Дина"])]</code>.'),
      task('4 · поиск по тексту','Найди ученика, имя которого начинается на «В».','У строкового столбца есть методы через <code>.str</code>.','<code>df.loc[df["name"].str.startswith("В")]</code> → Вера.'),
      task('5 · лучший ученик','Найди имя ученика с наибольшим баллом через <code>idxmax()</code>.','Сначала найди индекс максимума, затем возьми имя через <code>loc</code>.','<code>df.loc[df["score"].idxmax(), "name"]</code> → Вера.'),
      task('6 · два лучших','Получи таблицу из двух строк с наибольшим баллом и только столбцами <code>name</code>, <code>score</code>.','Используй <code>nlargest</code>, затем выбор столбцов.','<code>df.nlargest(2, "score")[["name", "score"]]</code> → Вера 92, Аня 80.')
    ]
  });

  course.lessons.push({
    id:'pandas-add-sort', title:'pandas: новые столбцы, пропуски и сортировка', level:'База',
    lead:'Как дописать расчёт к каждой строке, заполнить пропуски по смыслу и найти лидеров.',
    blocks:[
      h('Операция над столбцом действует на каждую строку'),
      p('Если написать <code>df["score"] + 5</code>, pandas прибавит 5 к каждому баллу. Новый результат можно сохранить в <code>df["new"]</code>. В столбце <code>bonus</code> есть пустые значения; прежде чем считать итоговый балл, в этой учебной задаче считаем отсутствующий бонус равным нулю.'),
      code(starter + String.raw`

print("Нет бонуса:", df["bonus"].isna().sum())
df["total"] = df["score"] + df["bonus"].fillna(0)
df["passed"] = df["total"] >= 70
top = df.sort_values("total", ascending=False).head(3)
print(top[["name", "total"]].to_string(index=False))`, 'Нет бонуса: 2\nname  total\nВера   92.0\n Аня   85.0\nГлеб   80.0'),
      table(['Код','Смысл'],[
        ['<code>df["bonus"].isna()</code>','Проверяем каждую строку: бонус неизвестен или нет.'],
        ['<code>.fillna(0)</code>','В вычислении заменяем пропуск нулём. Исходный bonus остаётся прежним.'],
        ['<code>df["total"] = ...</code>','Добавляем столбец с расчётом для каждого ученика.'],
        ['<code>sort_values(..., ascending=False)</code>','Упорядочиваем от большего итога к меньшему.'],
        ['<code>.head(3)</code>','Берём первые три строки уже отсортированной таблицы.']
      ]),
      tip('Пропуск не всегда ноль','В этом примере «бонус не указан» трактуется как «бонуса нет». В настоящем кейсе пропуск может означать «не измерили». Тогда замена на 0 исказит результат; сначала выясни смысл данных.'),
      task('1 · новый признак','Добавь <code>score_per_hour</code> как балл, делённый на часы подготовки.','Оба столбца числовые; деление выполнится построчно.','<code>df["score_per_hour"] = df["score"] / df["hours"]</code>. У Ани получится 20.'),
      task('2 · порог','Добавь логический столбец <code>strong</code>: итоговый балл не меньше 80.','Используй уже созданный <code>total</code>.','<code>df["strong"] = df["total"] >= 80</code>. True у Ани, Веры и Глеба.'),
      task('3 · пропуски','Посчитай число пропусков отдельно в каждом столбце.','Методы <code>isna()</code> и <code>sum()</code> применяются последовательно.','<code>df.isna().sum()</code>. У bonus — 2, у остальных исходных столбцов — 0.'),
      task('4 · сортировка','Найди двух учеников с наименьшими <code>hours</code> через сортировку.','<code>ascending=True</code> ставит маленькие значения первыми.','<code>df.sort_values("hours").head(2)</code>. Время 2 часа у Бориса и Дины; порядок между равными значениями не важен.'),
      task('5 · новая строка','Создай отдельную строку для Евы: группа B, 77 баллов, 4 часа, бонус 3. Добавь её к исходной таблице.','Собери <code>new = pd.DataFrame({...})</code> и используй вертикальный <code>pd.concat</code>.','<code>new = pd.DataFrame({"name":["Ева"], "group":["B"], "score":[77], "hours":[4], "bonus":[3.0]})</code>; <code>extended = pd.concat([df, new], ignore_index=True)</code>. В <code>extended</code> будет 6 строк.')
    ]
  });

  course.lessons.push({
    id:'pandas-concat-min-axis', title:'pandas: pd.concat и min(axis=1) по шагам', level:'База',
    lead:'Разбираем выражение pd.concat([..., ...], axis=1).min(axis=1) на трёх людях и двух станциях.',
    blocks:[
      h('Что означает вся цепочка'),
      p('Пусть для каждого человека отдельно посчитаны расстояния до левой и правой станции. Нужно выбрать <strong>меньшее из двух для каждого человека</strong>. Сначала <code>pd.concat([left, right], axis=1)</code> ставит два столбца рядом, затем <code>.min(axis=1)</code> проходит по каждой строке поперёк этих столбцов.'),
      code(String.raw`import pandas as pd

left = pd.Series([5, 3, 8], index=["Аня", "Борис", "Вера"], name="left")
right = pd.Series([2, 7, 4], index=["Аня", "Борис", "Вера"], name="right")

distances = pd.concat([left, right], axis=1)
nearest = distances.min(axis=1)

print(distances.to_string())
print("Ближайшее расстояние:")
print(nearest.to_string())`, '       left  right\nАня       5      2\nБорис     3      7\nВера      8      4\nБлижайшее расстояние:\nАня      2\nБорис    3\nВера     4'),
      table(['Часть выражения','Результат','Почему'],[
        ['<code>[left, right]</code>','Список из двух Series','Передаём обе колонки в concat.'],
        ['<code>pd.concat(..., axis=1)</code>','Таблица 3 × 2','Добавляем столбцы рядом; строки совмещаются по именам индекса.'],
        ['<code>.min(axis=1)</code>','Один минимум для каждой из трёх строк','Сравниваем left и right у <em>одного</em> человека.'],
        ['<code>.min(axis=0)</code>','Один минимум для каждого столбца','Это другой вопрос: минимальное расстояние до каждой станции среди всех людей.']
      ]),
      tip('Два axis в одной строке','У <code>concat(axis=1)</code> единица означает «присоединить столбцы». У <code>min(axis=1)</code> — «считать поперёк столбцов в каждой строке». Слова разные, потому что сами операции разные. Сначала посмотри на промежуточную таблицу <code>distances</code>.'),
      p('Здесь имена людей стоят в индексе обеих Series. <code>concat</code> совмещает значения <strong>по метке индекса</strong>, даже если порядок разный. Если индексы не совпадают, появятся пропуски. Для реального задания с жителями можно вообще не вызывать <code>concat</code>, если оба расстояния уже записаны столбцами одного DataFrame: <code>people[["d_left", "d_right"]].min(axis=1)</code>. Такой вариант разобран в <a href="#pandas/dano-code-03">кейсе о зарядных станциях</a>.'),
      h('Та же цепочка на CSV кейса'),
      p('Если расстояния посчитаны как две отдельные Series, используй ровно ту же цепочку. <a href="students/datasets/03_residents.csv" download>Скачать CSV жителей</a>.'),
      code(String.raw`import pandas as pd

people = pd.read_csv("students/datasets/03_residents.csv")
d_left = (((people["x"] - 2)**2 + (people["y"] - 2)**2)**0.5).rename("left")
d_right = (((people["x"] - 8)**2 + (people["y"] - 2)**2)**0.5).rename("right")
people["nearest_s2"] = pd.concat([d_left, d_right], axis=1).min(axis=1)
print(people[["resident_id", "nearest_s2"]].head(2).round(3))`, 'P0001: 5.046\nP0002: 5.451'),
      task('1 · минимум в строке','Для таблицы <code>distances</code> получи ближайшее расстояние каждому человеку одной строкой кода.','Выбирай минимум по двум столбцам внутри строки.','<code>distances.min(axis=1)</code> → Аня 2, Борис 3, Вера 4.'),
      task('2 · минимум в столбце','Найди самое короткое расстояние до левой станции и отдельно до правой станции.','Теперь ось 0: сравниваем людей внутри каждого столбца.','<code>distances.min(axis=0)</code> → left 3, right 2.'),
      task('3 · какая станция ближе','Для каждого человека верни <code>left</code> или <code>right</code> — имя столбца с меньшим расстоянием.','У DataFrame есть <code>idxmin(axis=1)</code>.','<code>distances.idxmin(axis=1)</code> → right, left, right.'),
      task('4 · третья станция','Создай <code>middle</code> с расстояниями <code>[4, 1, 6]</code> и тем же индексом. Объедини все три Series и найди минимум по строкам.','Добавь middle в список для <code>pd.concat</code>.','<code>middle = pd.Series([4, 1, 6], index=left.index, name="middle")</code>; <code>pd.concat([left, right, middle], axis=1).min(axis=1)</code> → 2, 1, 4.'),
      task('5 · разный порядок индекса','У <code>left</code> индекс Аня, Борис; у <code>right</code> — Борис, Аня. Как concat сопоставит строки?','Совмещает по именам индекса, не по позиции.','<code>pd.concat([left, right], axis=1)</code> поставит значения Бориса напротив Бориса, Ани напротив Ани. Проверь результат через <code>print</code>.'),
      task('6 · добавление строк','Есть два DataFrame с одинаковыми столбцами за январь и февраль. Как поставить строки февраля под январём и получить новый индекс 0, 1, 2…?','Для добавления строк нужен <code>axis=0</code>, он же значение по умолчанию.','<code>both = pd.concat([january, february], axis=0, ignore_index=True)</code>. Число строк равно сумме длин исходных таблиц.')
    ]
  });
})();
