(function () {
  const course = window.COURSES.find(c => c.id === 'pandas');
  const p = html => ({type:'p', html});
  const h = text => ({type:'h', text});
  const code = (source, output) => ({type:'code', language:'python', code:source, output});
  const tip = (label, html) => ({type:'callout', label, html});
  const formula = (title, tex, note) => ({type:'formula', title, tex, note});
  const table = (headers, rows) => ({type:'table', headers, rows});
  const ex = (title, given, find, steps, answer) => ({type:'example', title, given, find, steps, answer});
  const task = (title, prompt, hint, solution) => ({type:'exercise', title, prompt, hint, solution});
  const files = '<a href="students/practice/data/survey_september.csv" download>Сентябрь CSV</a> · <a href="students/practice/data/survey_october.csv" download>Октябрь CSV</a> · <a href="students/practice/data/survey_districts.csv" download>Районы CSV</a>';

  course.lessons.push({
    id:'case-pipeline', title:'Как разобрать кейс ДАНО в pandas', level:'Кейсы',
    lead:'От вопроса в условии до проверенной таблицы: сначала определяем единицу наблюдения, затем строим цепочку операций.',
    blocks:[
      h('Не начинай с groupby'),
      p('В кейсе обычно дают несколько файлов и вопрос на естественном языке: «изменилось ли время поездки по районам?». Прежде чем писать код, назови <strong>единицу наблюдения</strong> каждого файла. В нашем учебном кейсе одна строка опроса — ответ одного человека в одной волне; строка справочника — один район. Один и тот же человек может встретиться в сентябре и октябре: это две разные записи, а не дубль.'),
      table(['Файл','Одна строка','Ключ, который нужно проверить'],[
        ['Сентябрь','Ответ респондента в сентябре','<code>respondent_id</code> внутри сентября'],
        ['Октябрь','Ответ респондента в октябре','<code>respondent_id</code> внутри октября'],
        ['Районы','Описание одного района','<code>district_id</code> уникален']
      ]),
      p('Скачай три файла: '+files+'. Данные синтетические. В октябре один точный повтор записи, а несколько кодов районов отсутствуют в справочнике. Это учебные проверки качества, а не повод удалить любые необычные строки.'),
      h('Переведи формулировку задания в план'),
      table(['Фраза в задаче','Что сделать в pandas','Что проверить'],[
        ['«по районам»','<code>groupby("district_id")</code>','Сколько наблюдений в каждом районе'],
        ['«сентябрь и октябрь вместе»','<code>pd.concat(..., axis=0)</code>','Одинаковые имена и типы колонок'],
        ['«названия районов»','<code>merge(..., on="district_id")</code>','Не размножились ли строки'],
        ['«изменение для тех же людей»','<code>pivot</code> по ID и волне','Остались только пары с двумя волнами'],
        ['«доля долгих поездок»','Среднее булева признака','Знаменатель — строки с известным временем']
      ]),
      code(String.raw`from pathlib import Path
import pandas as pd

data = Path(".")  # папка со скачанными CSV
sep = pd.read_csv(data / "survey_september.csv")
oct_ = pd.read_csv(data / "survey_october.csv")
districts = pd.read_csv(data / "survey_districts.csv")

for name, frame in {"sep": sep, "oct": oct_, "districts": districts}.items():
    print(name, frame.shape, frame.columns.tolist())
    print(frame.isna().sum().to_dict())
print("Ключ районов уникален:", districts["district_id"].is_unique)`,'Сначала увидишь 120, 121 и 8 строк; у октября другое имя столбца времени.'),
      tip('Контрольная точка','После каждого изменения таблицы проверяй <code>shape</code>, уникальность ключа, число пропусков и сумму/среднее, если они должны сохраняться. Сохранённый CSV и короткий вывод — результат анализа; одна цепочка методов без проверки им не является.'),
      ex('Что считать дублем?','Респондент R0040 есть в обеих волнах.','Удалять ли одну из этих строк?',['Уточни единицу наблюдения: человек в конкретной волне.','Составной ключ — <code>(respondent_id, wave)</code>.','У R0040 волны разные.'],'Нет. Это две разные записи; для парного сравнения они как раз нужны.'),
      task('Проверка единицы наблюдения','Напиши код, который считает повторы <code>respondent_id</code> отдельно в сентябре и октябре.', 'Используй <code>duplicated().sum()</code> для каждого файла до объединения.', '<code>sep["respondent_id"].duplicated().sum()</code> и <code>oct_["respondent_id"].duplicated().sum()</code>: 0 и 1.')
    ]
  });

  course.lessons.push({
    id:'concat', title:'pd.concat: складываем таблицы без потери смысла', level:'Кейсы',
    lead:'Вертикальное и горизонтальное соединение, разные схемы, индексы, дубли и проверка числа строк.',
    blocks:[
      h('Выбери направление'),
      p('<code>pd.concat([a, b])</code> по умолчанию ставит строки <strong>друг под другом</strong> (<code>axis=0</code>): так складывают месяцы, годы или файлы из регионов. Число строк после операции равно сумме длин исходных таблиц, если ничего не фильтровали. <code>axis=1</code> ставит столбцы <strong>рядом</strong> и совмещает строки по меткам индекса, а не по идентификатору человека. Для таблиц, которые надо сопоставить по ID, обычно нужен <code>merge</code>.'),
      table(['Операция','Где прибавятся данные','Как совпадают записи'],[
        ['<code>pd.concat([a,b], axis=0)</code>','Строки','Столбцы сопоставляются по именам'],
        ['<code>pd.concat([a,b], axis=1)</code>','Столбцы','Строки совмещаются по индексу'],
        ['<code>a.merge(b, on="id")</code>','Новые столбцы и иногда строки','Строки сопоставляются по значению ключа <code>id</code>']
      ]),
      formula('Проверка вертикального concat', String.raw`n_{\text{после}}=n_{\text{сентябрь}}+n_{\text{октябрь}}`, 'До удаления дублей и фильтрации: 120 + 121 = 241 строка.'),
      code(String.raw`a = pd.DataFrame({"id": ["A", "B"], "score": [50, 70]})
b = pd.DataFrame({"id": ["C"], "score": [90]})
both = pd.concat([a, b], ignore_index=True)
print(both)`,'Три строки: A 50, B 70, C 90. Новый индекс 0, 1, 2.'),
      p('Если важно помнить происхождение строки, можно передать <code>keys=["sep", "oct"]</code>. Получится многоуровневый индекс, где внешний уровень — имя волны. Для большинства первых кейсов проще до объединения добавить обычный столбец <code>wave</code> через <code>assign</code>: его легче использовать в фильтрах, группировках и CSV.'),
      code(String.raw`tagged = pd.concat(
    [sep, oct_.rename(columns={"travel_minutes": "travel_min"})],
    keys=["sep", "oct"]
)
print(tagged.index.names)
print(tagged.loc["sep"].shape)`,'Строки остаются разделены метками sep и oct во внешнем уровне индекса.'),
      h('Разные имена столбцов'),
      p('Если один файл содержит <code>travel_min</code>, а другой <code>travel_minutes</code>, обычный <code>concat</code> создаст <em>два</em> столбца и много пропусков. Это не два разных измерения, а одна переменная с разными именами. До объединения приведи их к одному названию и совместимым типам. По умолчанию <code>join="outer"</code> сохраняет объединение имён столбцов; <code>join="inner"</code> оставляет только общие имена и может незаметно выкинуть нужный показатель.'),
      formula('Столбцы при разных схемах', String.raw`C_{\mathrm{outer}}=C_1\cup C_2,\qquad C_{\mathrm{inner}}=C_1\cap C_2`, 'Если имя показателя различается, сначала сделай rename; не решай проблему заменой outer на inner.'),
      code(String.raw`sep = sep.assign(wave="sep")
oct_clean = oct_.rename(columns={"travel_minutes": "travel_min"}).assign(wave="oct")

raw = pd.concat([sep, oct_clean], ignore_index=True, join="outer")
assert len(raw) == len(sep) + len(oct_clean) == 241
assert "travel_minutes" not in raw.columns
print(raw.columns.tolist())
print(raw.groupby("wave").size())`,'До удаления дубля: 241 строка; sep — 120, oct — 121.'),
      h('Индекс и дубликаты — разные вопросы'),
      p('<code>ignore_index=True</code> создаёт новый индекс 0…N−1. Он <strong>не удаляет дубли данных</strong>. Проверяй настоящий составной ключ <code>(respondent_id, wave)</code>. В учебном октябрьском CSV есть один точный повтор строки. Удалять его можно только после проверки, что все поля совпадают и это не новая попытка измерения.'),
      code(String.raw`key = ["respondent_id", "wave"]
repeated = raw.loc[raw.duplicated(key, keep=False)].sort_values(key)
print(repeated[key + ["travel_min"]])
print("Точные повторы:", raw.duplicated().sum())

survey = raw.drop_duplicates().copy()
assert not survey.duplicated(key).any()
assert len(survey) == 240`,'Один точный повтор удалён; итог — 240 ответов по 120 на волну.'),
      h('Когда допустим axis=1'),
      p('Горизонтальный <code>concat</code> подходит, если обе таблицы гарантированно имеют одинаковые индексы наблюдений. После сортировки или фильтрации это часто перестаёт быть верным. <code>reset_index(drop=True)</code> склеит <em>позиции</em> строк, но не докажет, что это один и тот же человек. Для данных с ID безопаснее соединение по ключу.'),
      code(String.raw`left = pd.DataFrame({"id": ["A", "B"], "score": [50, 70]})
right = pd.DataFrame({"id": ["B", "A"], "group": ["X", "Y"]})
wrong = pd.concat([left, right[["group"]]], axis=1)
correct = left.merge(right, on="id", validate="one_to_one")
print(wrong)    # A ошибочно получает X
print(correct)  # A получает Y`,'У concat(axis=1) совпали индексы 0 и 1, но не ID. merge сопоставил значения id.'),
      p('Если файлов много, составь список таблиц и вызови <code>pd.concat</code> один раз. Проверяй схему каждого файла до сборки. Не нужно многократно дописывать строки в цикле: так сложнее отслеживать происхождение и промежуточное число записей.'),
      code(String.raw`from pathlib import Path
paths = sorted(Path(".").glob("survey_*.csv"))
print([path.name for path in paths])
# Здесь в наборе есть также survey_districts.csv.
# Его нельзя складывать с волнами: одна строка справочника — район, не ответ.
wave_paths = [p for p in paths if p.stem in {"survey_september", "survey_october"}]`,'Файлы выбираются по смыслу и единице наблюдения, а не только по совпавшему шаблону имени.'),
      ex('Ошибка тихого склеивания','Слева ID A, B; справа ID B, A. Индексы в обеих таблицах 0, 1.','Что произойдёт при <code>pd.concat([left, right], axis=1)</code>?',['Операция смотрит на индекс 0 и 1.','Индекс 0 слева — A, справа — B.','Имя ID внутри столбца не участвует в сопоставлении.'],'Получатся неверные пары. Используй <code>merge(..., on="id")</code>.'),
      task('Схема двух волн','Объедини сентябрь и октябрь, сохрани столбец <code>wave</code> и проверь 240 строк после удаления точного дубля.', 'Сначала <code>rename</code>, затем <code>assign</code>, <code>concat</code>, <code>drop_duplicates</code>.', '<code>survey = pd.concat([sep.assign(wave="sep"), oct_.rename(columns={"travel_minutes":"travel_min"}).assign(wave="oct")], ignore_index=True).drop_duplicates()</code>; проверь <code>len(survey)==240</code>.'),
      task('Неожиданный NaN','После вертикального concat появились <code>travel_min</code> и <code>travel_minutes</code>. Объясни причину и исправь её.', 'concat сопоставляет имена столбцов точно.', 'Названия в файлах различаются. Переименуй <code>travel_minutes</code> в <code>travel_min</code> до concat; <code>join="inner"</code> здесь плохой обход, потому что удалит весь показатель времени.'),
      tip('Документация','<a href="https://pandas.pydata.org/docs/reference/api/pandas.concat.html" target="_blank" rel="noopener">Официальное описание pd.concat</a>: <code>axis</code>, <code>join</code>, <code>ignore_index</code>, <code>keys</code>.')
    ]
  });

  course.lessons.push({
    id:'merge-audit', title:'merge: ключи, число строк и ловушки', level:'Кейсы',
    lead:'Проверяем связь таблиц до и после merge, находим пропавшие ID и не удваиваем метрики.',
    blocks:[
      h('Сначала сформулируй связь'),
      p('Одна строка опроса относится к одному району; один район встречается во множестве ответов. Это связь <strong>many-to-one</strong>. Поэтому справочник районов должен иметь уникальный <code>district_id</code>, а число строк после <code>left merge</code> должно остаться прежним. Если справа ключ повторяется k раз, одна левая строка с этим ключом превратится в k строк.'),
      formula('Контроль числа строк после left merge', String.raw`n_{\mathrm{joined}}=n_{\mathrm{survey}}\quad\text{при уникальном ключе справа}`, 'Это проверка структуры. Сама по себе она не гарантирует, что все ключи нашлись.'),
      table(['Случай','Ожидаемое число строк для одного ключа слева','Проверка'],[
        ['Справа ключ один раз','1','<code>validate="many_to_one"</code>'],
        ['Справа ключ два раза','2','Ошибка validate или рост строк'],
        ['Справа ключа нет при left merge','1, но поля справа пусты','<code>indicator=True</code>']
      ]),
      code(String.raw`assert districts["district_id"].is_unique
joined = survey.merge(
    districts, on="district_id", how="left",
    validate="many_to_one", indicator=True
)
assert len(joined) == len(survey)
print(joined["_merge"].value_counts())
unmatched = joined.loc[joined["_merge"] == "left_only"]
print(unmatched[["respondent_id", "wave", "district_id"]].head())`,'Часть октябрьских строк имеет district_id=99: справочник не содержит этот код.'),
      p('Не заменяй неизвестный район произвольным знакомым районом. Реши по условию, должен ли он войти в общий итог и можно ли показывать его отдельно как «неизвестно». При группировке <code>groupby("district_name")</code> pandas по умолчанию исключает строки с пропущенным именем; для аудита используй <code>dropna=False</code> или явно создай категорию «неизвестно». Это меняет знаменатель и итоговые показатели.'),
      h('Почему возникает двойной счёт'),
      p('Если к таблице заказов добавить таблицу позиций заказа, один заказ появится по разу на каждую позицию. Тогда <code>sum(paid_rub)</code> по новой таблице завысит выручку. Два безопасных пути: считать метрику на уровне заказов до соединения или сначала свернуть позиции до одной строки на заказ. Всегда назови уровень, на котором находится числитель и знаменатель.'),
      ex('Два товара в одном заказе','Заказ O1 на 1000 ₽; в таблице позиций две строки O1.','Чему равна сумма paid_rub после merge с позициями?',['Одна строка заказа сопоставится с двумя строками позиций.','Значение paid_rub=1000 появится дважды.','Сумма по строкам соединения сложит 1000+1000.'],'Получится ложные 2000 ₽. Истинная выручка 1000 ₽.'),
      task('Аудит районов','Найди число ответов с кодом района, которого нет в справочнике, отдельно по волнам.', 'После <code>indicator=True</code> отфильтруй <code>left_only</code> и сгруппируй по <code>wave</code>.', '<code>joined.loc[joined["_merge"] == "left_only"].groupby("wave").size()</code>. Поясни, почему это не повод выбрасывать строку из общего итога.'),
      tip('Важное исключение','В pandas пустые ключи в обеих таблицах могут сопоставиться друг с другом при <code>merge</code>. Перед соединением проверь <code>isna()</code> в ключевых столбцах. <a href="https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html" target="_blank" rel="noopener">Документация merge</a>.')
    ]
  });

  course.lessons.push({
    id:'case-report', title:'Сводка кейса: agg, transform, доли и пары', level:'Кейсы',
    lead:'Как получить таблицу для вывода, выбрать правильный знаменатель и сравнить одних и тех же людей.',
    blocks:[
      h('Одна строка на группу: agg'),
      p('После <code>groupby(["wave", "district_id"])</code> метод <code>agg</code> возвращает одну строку на сочетание волны и района. <code>size</code> считает все строки, <code>count</code> для <code>travel_min</code> — только непустые времена. Если в данных есть пропуски, эти числа различаются; рядом со средним всегда полезно показывать, сколько измерений вошло в расчёт.'),
      code(String.raw`report = (survey.groupby(["wave", "district_id"], dropna=False)
    .agg(respondents=("respondent_id", "nunique"),
         known_times=("travel_min", "count"),
         mean_min=("travel_min", "mean"),
         median_min=("travel_min", "median"))
    .reset_index())
print(report.head())`,'Каждая строка — одна волна × один район. respondents и known_times могут различаться.'),
      h('Правильный знаменатель для доли'),
      p('Доля поездок дольше 45 минут — число известных времён больше 45, делённое на число <em>известных</em> времён. Если сравнение <code>NaN > 45</code> стало False и его включили в среднее, доля будет занижена. Сначала оставь строки с <code>travel_min.notna()</code>, затем создай булев столбец. Среднее True/False и есть доля.'),
      formula('Доля долгих поездок', String.raw`\widehat p=\frac{\#\{t_i>45\}}{\#\{t_i\ \text{известно}\}}`, 'Числитель и знаменатель относятся к одной и той же группе и волне.'),
      code(String.raw`known = survey.loc[survey["travel_min"].notna()].copy()
known["long_trip"] = known["travel_min"] > 45
shares = (known.groupby("wave")
    .agg(n=("long_trip", "size"), share_long=("long_trip", "mean"))
    .reset_index())
print(shares)`,'share_long лежит от 0 до 1. Умножь на 100 только для записи в процентах.'),
      h('Сводка не равна столбцу каждой строки'),
      p('<code>agg("mean")</code> сократит 240 ответов до групп. <code>transform("mean")</code> вернёт среднее своей группы для каждого ответа, сохранив исходные 240 строк и их индекс. Это удобно для отклонения человека от типичного времени в его волне и районе.'),
      code(String.raw`survey["district_wave_mean"] = (
    survey.groupby(["wave", "district_id"])["travel_min"]
          .transform("mean")
)
survey["gap_min"] = survey["travel_min"] - survey["district_wave_mean"]
assert len(survey) == 240`,'У каждого ответа есть среднее его группы; пропущенное время даёт пропущенное отклонение.'),
      h('Общий срез и сравнение тех же людей — разные вопросы'),
      p('Среднее по всем ответам сентября и октября сравнивает <em>составы выборок</em>. Чтобы сравнить одних и тех же людей, оставь ID, встретившиеся в обеих волнах. После очистки в учебных данных их 90. <code>pivot</code> безопасен только при уникальном ключе <code>(respondent_id, wave)</code>; иначе получишь ошибку и должен разобраться с дублями.'),
      formula('Среднее парное изменение', String.raw`\overline{\Delta}=\frac{1}{m}\sum_{i=1}^{m}(t_{i,\mathrm{oct}}-t_{i,\mathrm{sep}})`, 'm — число людей с двумя известными временами, а не число всех ответов.'),
      code(String.raw`paired = survey.pivot(index="respondent_id", columns="wave", values="travel_min")
paired = paired.dropna(subset=["sep", "oct"])
paired["change_min"] = paired["oct"] - paired["sep"]
print("Число полных пар:", len(paired))
print("Среднее изменение:", paired["change_min"].mean())`,'Полных пар может быть меньше 90 из-за пропусков времени. Отрицательное изменение — поездка стала короче.'),
      p('Разность средних по всем респондентам и среднее индивидуальных разностей отвечают на разные вопросы. Изменение само по себе не доказывает, что его вызвала новая транспортная политика: могли измениться погода, маршруты и состав отвечавших. В выводе укажи размер выборки, пропуски и ограничение причинной интерпретации.'),
      ex('Проценты и процентные пункты','Доля долгих поездок снизилась с 20% до 15%.','Как записать изменение?',['Разность долей: 15% − 20% = −5 процентных пунктов.','Относительное изменение: (15−20)/20 = −25%.','Это разные меры.'],'−5 процентных пунктов, или −25% относительно исходной доли.'),
      task('Две честные оценки','Посчитай среднее время по всем ответам в каждой волне и среднее изменение только для людей с двумя известными временами. Почему ответы могут не совпасть?', 'Для первого — <code>groupby</code>; для второго — <code>pivot</code> и <code>dropna</code>.', '<code>survey.groupby("wave")["travel_min"].mean()</code> и <code>paired["change_min"].mean()</code>. В парной оценке участвует только пересечение людей с двумя известными временами.'),
      task('Итоговая витрина','Собери <code>report</code> по волне и району: число ответов, число известных времён, медиана и доля поездок дольше 45 минут. Сохрани в CSV.', 'Создай <code>long_trip</code> только у строк с известным временем; для сохранения используй <code>reset_index()</code> и <code>to_csv(index=False)</code>.', 'Сначала сделай агрегаты по всем ответам, отдельно долю по известным временам, затем <code>merge</code> по <code>["wave","district_id"]</code> с <code>validate="one_to_one"</code>; проверь число строк и экспортируй.'),
      tip('Маршрут к кейсам','После этой темы открой практикум <a href="#trainer/pandas-case">«pandas: сборка кейса из CSV»</a>. Там 20 коротких заданий на код и одна большая работа по этим трём файлам.')
    ]
  });
})();
