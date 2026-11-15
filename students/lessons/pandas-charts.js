(function(){
const course=window.COURSES.find(c=>c.id==='pandas');
const p=html=>({type:'p',html}),h=text=>({type:'h',text}),code=(code,output)=>({type:'code',language:'python',code,output}),task=(title,prompt,hint,solution)=>({type:'exercise',title,prompt,hint,solution}),table=(headers,rows)=>({type:'table',headers,rows}),tip=(label,html)=>({type:'callout',label,html});
course.lessons.push({
  id:'plots',title:'Графики: какую форму выбрать',level:'Практика',lead:'Гистограмма, boxplot, scatter, столбцы, линия и тепловая карта показывают разные свойства данных.',blocks:[
    h('Начни с вопроса, а не с команды plot'),p('График нужен, чтобы ответить на конкретный вопрос: как распределены баллы, связаны ли две величины, отличаются ли районы, меняется ли показатель со временем. Один и тот же набор данных можно нарисовать по-разному, но некоторые графики скрывают важное. Например, линия между городами на карте создаёт ложное впечатление временного порядка.'),
    table(['Вопрос','График','На что смотреть'],[
      ['Как распределена одна числовая величина?','Гистограмма','Форма, асимметрия, пики, крайние значения.'],
      ['Есть ли необычные значения и как различаются группы?','Boxplot','Медиана, квартили, размах и точки за «усами».'],
      ['Связаны ли два числовых признака?','Диаграмма рассеяния','Направление, кривизна, группы, выбросы.'],
      ['Как сравнить значения категорий?','Столбцы','Высота и размер выборки для каждой категории.'],
      ['Как меняется показатель по времени?','Линия','Тренд, сезонность, пропуски, резкие изменения.'],
      ['Как выглядят многие попарные связи?','Тепловая карта','Сильные и слабые корреляции, но не причинность.']
    ]),
    {type:'interactive',kind:'plot-gallery'},
    h('Один числовой столбец: hist и box'),p('Гистограмма делит шкалу на интервалы и считает число наблюдений в каждом. Если интервалы слишком широкие, исчезнут важные детали; если слишком узкие, появится шум. Boxplot показывает медиану и центральную половину данных, но сам по себе хуже раскрывает форму распределения. Для анализа рейтинга полезно показать оба.'),
    code('import pandas as pd\nimport matplotlib.pyplot as plt\nroutes = pd.read_csv("students/datasets/02_night_routes.csv")\nroutes["route_rating"].plot.hist(bins=20, edgecolor="white")\nplt.xlabel("Рейтинг маршрута")\nplt.ylabel("Число маршрутов")\nplt.title("Распределение рейтинга")\nplt.tight_layout()\nplt.show()','bins — число интервалов. Для boxplot: routes.boxplot(column="route_rating", by="district").'),
    h('Два числовых столбца: scatter'),p('Диаграмма рассеяния показывает каждую строку точкой. Если точки приблизительно вытянуты вверх, связь положительная; если вниз — отрицательная. Отдельные точки вдали могут сильно влиять на корреляцию и регрессию. Раскрась точки по району, если подозреваешь разные подгруппы. Корреляция измеряет линейную связь и может быть близка к нулю при криволинейном рисунке.'),
    code('ax = routes.plot.scatter(x="wayfinding_score", y="route_rating",\n                         alpha=0.5, figsize=(7,4))\nax.set_xlabel("Качество навигации")\nax.set_ylabel("Рейтинг")\nax.set_title("Связь навигации и рейтинга")\nplt.tight_layout()\nplt.show()','Точки — маршруты; рисунок помогает заметить группы и выбросы.'),
    h('Категории, время и корреляции'),p('Для районов сначала посчитай статистику, затем построй столбцы: <code>groupby(...).mean().plot.bar()</code>. Для временных рядов сначала отсортируй даты и агрегируй по нужному периоду, затем <code>plot.line()</code>. Тепловую карту корреляций можно построить через <code>plt.imshow</code>, но подпиши обе оси и шкалу. Диагональ такой карты всегда равна 1 и не сообщает ничего нового.'),
    code('mean_by_district = routes.groupby("district")["route_rating"].mean()\nmean_by_district.plot.bar(rot=25, ylabel="Средний рейтинг")\nplt.tight_layout()\nplt.show()\n\nnumeric = routes[["wayfinding_score","landmarks_n","night_cost","route_rating"]]\ncorr = numeric.corr()\nfig, ax = plt.subplots()\nim = ax.imshow(corr, vmin=-1, vmax=1, cmap="coolwarm")\nax.set_xticks(range(len(corr)), corr.columns, rotation=45, ha="right")\nax.set_yticks(range(len(corr)), corr.columns)\nfig.colorbar(im, ax=ax, label="Корреляция")\nplt.tight_layout()\nplt.show()','Столбцы сравнивают районы; цвет матрицы показывает коэффициент корреляции.'),
    tip('Честный график','Подпиши единицы измерения, размер выборки и смысл осей. На столбчатом графике с обрезанной осью различия могут казаться гораздо больше, чем есть. Корреляция и красивый тренд сами по себе не доказывают причинность.'),
    task('Выбери график','Как показать: а) разброс арендной цены; б) связь часов подготовки и балла; в) средний рейтинг по районам?','Для одной числовой величины, пары числовых и категорий нужны разные формы.','а) hist или boxplot; б) scatter; в) bar после groupby.'),
    task('Уточни картину','На scatter рейтинга и качества навигации видны два облака точек по районам. Что сделаешь до выводов о единой связи?','Подумай о цвете и группах.','Раскрась или раздели точки по районам, посчитай связь внутри районов и проверь, не создаёт ли общий тренд состав групп.')
  ]
});
course.lessons.push({
  id:'time-series',title:'Сортировка, ранги и окна',level:'Продвинутый',lead:'shift, diff, rolling, rank и nlargest помогают сравнивать строки и изучать изменения во времени.',blocks:[
    h('Порядок строк должен иметь смысл'),p('Для временных данных сначала преобразуй дату через <code>pd.to_datetime</code> и отсортируй строки. Только после этого «предыдущая запись» действительно означает вчера или прошлый месяц. <code>shift(1)</code> переносит значения на одну строку вниз, <code>diff()</code> считает разность с предыдущей строкой.'),
    code('daily = pd.DataFrame({\n    "date": pd.to_datetime(["2026-11-01","2026-11-02","2026-11-03"]),\n    "visitors": [100,125,115]\n}).sort_values("date")\ndaily["previous"] = daily["visitors"].shift(1)\ndaily["change"] = daily["visitors"].diff()\nprint(daily)','Изменения: NaN, +25, −10. У первой строки нет предшественника.'),
    h('Скользящее среднее'),p('<code>rolling(3).mean()</code> для каждой строки усредняет её и две предыдущие строки. Оно сглаживает случайные колебания, но не предсказывает будущее. Первые две строки по умолчанию дают NaN, потому что окно ещё не заполнено; <code>min_periods=1</code> разрешает неполные окна.'),
    code('daily["mean_3"] = daily["visitors"].rolling(3, min_periods=1).mean()\nprint(daily[["date","visitors","mean_3"]])','100; 112,5; 113,33.'),
    p('Для нескольких городов сначала раздели данные на группы: <code>df.groupby("city_id")["price"].shift(1)</code> не смешает предыдущую цену одного города с ценой другого. При расчёте rolling внутри групп проверь индекс результата и порядок дат.'),
    h('Ранг, топ и корреляция'),p('<code>rank(ascending=False)</code> присваивает место каждому значению; при одинаковых значениях способ разрешения ничьих задаётся параметром <code>method</code>. <code>nlargest(5, "score")</code> быстро выбирает пять максимальных строк. <code>corr()</code> по умолчанию считает корреляцию Пирсона для числовых столбцов; для ранговой монотонной связи можно указать <code>method="spearman"</code>.'),
    code('top = routes.nlargest(5, "route_rating")\nroutes["rating_rank"] = routes["route_rating"].rank(ascending=False, method="min")\nr = routes[["wayfinding_score","route_rating"]].corr(method="spearman")\nprint(top[["route_id","route_rating"]])\nprint(r)','Проверь, как связаны качество навигации и рейтинг без предположения строго линейной формы.'),
    task('До и после','У тебя дневные посещения [100,125,115]. Что дадут <code>shift(1)</code> и <code>diff()</code>?','В первой строке предшественника нет.','shift(1): [NaN,100,125]; diff(): [NaN,25,−10].'),
    task('Окно по группам','Есть ежедневный рейтинг двух районов. Почему опасно делать <code>rolling(7)</code> по всей таблице после простой сортировки по дате?','Окно может захватить строки разных районов.','Оно смешает разные группы. Сначала сортируй внутри районов и считай окна по каждому району отдельно.')
  ]
});
course.lessons.push({
  id:'method-map',title:'Карта методов pandas',level:'Справочник',lead:'Быстрый ориентир по часто используемым методам: что возвращают и в какой ситуации выбирать.',blocks:[
    h('Не нужно запоминать всё подряд'),p('У pandas очень много методов. Для задач ДАНО важнее понимать формы данных: что является одной строкой, что является группой, когда число строк сокращается и когда сохраняется. Затем нужный метод легко найти по вопросу. Эта карта покрывает основные операции анализа, но не претендует на полный API библиотеки.'),
    table(['Вопрос','Методы','Что проверить'],[
      ['Как загрузить и осмотреть файл?','<code>read_csv</code>, <code>head</code>, <code>tail</code>, <code>sample</code>, <code>shape</code>, <code>info</code>, <code>dtypes</code>','Разделитель, типы, размер, пропуски.'],
      ['Какие строки и столбцы взять?','<code>loc</code>, <code>iloc</code>, <code>query</code>, <code>isin</code>, <code>between</code>','Имена против позиций; скобки в масках.'],
      ['Как описать числа?','<code>describe</code>, <code>mean</code>, <code>median</code>, <code>std</code>, <code>var</code>, <code>quantile</code>, <code>corr</code>','Что измеряем и сколько непустых строк.'],
      ['Как описать категории?','<code>value_counts</code>, <code>nunique</code>, <code>unique</code>, <code>crosstab</code>','Количество или доля?'],
      ['Как исправить качество?','<code>isna</code>, <code>dropna</code>, <code>fillna</code>, <code>duplicated</code>, <code>drop_duplicates</code>, <code>astype</code>, <code>to_numeric</code>','Причина пропусков и дублей.'],
      ['Как поменять таблицу?','<code>rename</code>, <code>assign</code>, <code>drop</code>, <code>sort_values</code>, <code>reset_index</code>, <code>set_index</code>','Новый объект или изменение старого?'],
      ['Как получить итог по группам?','<code>groupby</code>, <code>agg</code>, <code>size</code>, <code>count</code>, <code>filter</code>','Одна строка на группу или отбор групп?'],
      ['Как вернуть групповой итог в строки?','<code>transform</code>, <code>rank</code>','Совпадает ли индекс с исходной таблицей?'],
      ['Как объединить файлы?','<code>merge</code>, <code>join</code>, <code>concat</code>','Ключ, дубли ключа, размер после соединения.'],
      ['Как изменить форму?','<code>pivot</code>, <code>pivot_table</code>, <code>melt</code>','Есть ли повторные пары ключей?'],
      ['Как работать с текстом и временем?','<code>str.strip</code>, <code>str.contains</code>, <code>to_datetime</code>, <code>dt.month</code>, <code>resample</code>','Тип столбца и порядок времени.'],
      ['Как изучить последовательность?','<code>shift</code>, <code>diff</code>, <code>rolling</code>, <code>pct_change</code>','Что считается предыдущим наблюдением?'],
      ['Как показать и сохранить?','<code>plot</code>, <code>hist</code>, <code>boxplot</code>, <code>to_csv</code>','Подписи осей, единицы, индекс в CSV.']
    ]),
    h('Мини-конвейер анализа'),p('Типичный путь: загрузить → проверить типы и пропуски → выбрать строки → агрегировать или добавить групповой признак → построить график → сформулировать вывод → сохранить результат. Не пытайся писать длинную цепочку сразу: после каждого шага выведи <code>shape</code> или <code>head()</code>, чтобы заметить ошибку рано.'),
    code('import pandas as pd\nroutes = pd.read_csv("students/datasets/02_night_routes.csv")\nprint(routes.shape, routes.isna().sum())\nclean = routes.dropna(subset=["route_rating", "night_cost"]).copy()\nclean["district_mean"] = clean.groupby("district")["route_rating"].transform("mean")\nreport = clean.groupby("district").agg(\n    routes=("route_id","size"), mean_rating=("route_rating","mean")\n).reset_index()\nprint(report)\nreport.to_csv("district_report.csv", index=False)','Проверки после загрузки, очистка, transform, agg и экспорт.'),
    tip('Документация','Если сигнатура метода неочевидна, проверь <a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">официальную документацию pandas</a>. Особенно полезны страницы по <a href="https://pandas.pydata.org/docs/user_guide/groupby.html" target="_blank" rel="noopener">groupby</a> и <a href="https://pandas.pydata.org/docs/user_guide/visualization.html" target="_blank" rel="noopener">графикам</a>.'),
    task('Выбери метод','Нужно: а) среднее по районам; б) среднее района в каждой исходной строке; в) оставить районы с 30+ маршрутами. Назови метод для каждого.','Три формы результата: сводка, прежняя длина, отбор целых групп.','а) groupby().agg/mean(); б) groupby().transform("mean"); в) groupby().filter(...).'),
    task('Собери конвейер','Из night_routes.csv получи по районам число маршрутов и средний рейтинг; сохрани без технического индекса.','Загрузка → группировка → reset_index → to_csv.','<code>df=pd.read_csv(...); out=df.groupby("district").agg(n=("route_id","size"),mean=("route_rating","mean")).reset_index(); out.to_csv("report.csv",index=False)</code>.')
  ]
});
course.subtitle='Большой практический справочник: от чтения CSV до groupby, agg, transform, сводных таблиц, дат, соединения файлов и выбора графика.';
})();
