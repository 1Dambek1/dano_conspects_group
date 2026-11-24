(function () {
  const course = window.COURSES.find(c => c.id === 'pandas');
  const p = html => ({type:'p',html});
  const h = text => ({type:'h',text});
  const code = (source,output) => ({type:'code',language:'python',code:source,output});
  const table = (headers,rows) => ({type:'table',headers,rows});
  const tip = (label,html) => ({type:'callout',label,html});
  const task = (title,prompt,hint,solution) => ({type:'exercise',title,prompt,hint,solution});

  course.lessons.push({
    id:'pandas-core-recipes',title:'pandas: операции для каждой задачи',level:'База',
    lead:'Что возвращает метод: число, Series или DataFrame; как выбирать строки, искать, добавлять и проверять.',
    blocks:[
      h('Сначала пойми форму ответа'),
      p('Результат может быть одним числом, столбцом Series или таблицей DataFrame. Например, <code>df["score"].mean()</code> даёт число, сравнение <code>df["score"] &gt;= 70</code> — Series из True/False, а <code>df.loc[маска]</code> — таблицу подходящих строк. Зная форму результата, легче выбрать следующий шаг.'),
      code(['import pandas as pd','df = pd.DataFrame({','    "name": ["Аня", "Борис", "Вера", "Глеб"],','    "group": ["A", "B", "A", "B"],','    "score": [80, 55, 92, 70],','    "bonus": [5.0, None, 0.0, 10.0],','})','print(df.shape)','print(df["score"].mean())','print(df.loc[df["score"] >= 70, "name"].tolist())'].join('\n'),'(4, 4); средний балл 74.25; подходят Аня, Вера и Глеб.'),
      table(['Нужен ответ','Код','Форма результата'],[
        ['Сколько строк?','<code>len(df)</code> или <code>df.shape[0]</code>','Одно целое число'],
        ['Средний балл?','<code>df["score"].mean()</code>','Одно число'],
        ['Какие строки подходят?','<code>df.loc[df["score"] &gt;= 70]</code>','DataFrame'],
        ['Имена подходящих?','<code>df.loc[df["score"] &gt;= 70, "name"]</code>','Series'],
        ['Только два столбца?','<code>df[["name", "score"]]</code>','DataFrame с двумя столбцами']
      ]),
      h('Выбор, поиск и сортировка'),
      p('<code>loc</code> выбирает по условию и именам столбцов: <code>df.loc[условие, ["name","score"]]</code>. <code>iloc</code> выбирает по числовым позициям. Составной фильтр пиши как <code>(A) &amp; (B)</code>; для «или» используй <code>|</code>. <code>isin</code>, <code>between</code> и <code>.str.contains</code> тоже дают маски.'),
      code(['high_a = df.loc[(df["group"] == "A") & (df["score"] >= 70), ["name", "score"]]','print(high_a.to_string(index=False))','best = df.loc[df["score"].idxmax()]','print(best["name"], best["score"])','print(df.nlargest(2, "score")["name"].tolist())'].join('\n'),'Аня 80 и Вера 92; лучший балл у Веры; топ-2 — Вера и Аня.'),
      table(['Формулировка','Приём','На что обратить внимание'],[
        ['Одно из нескольких значений','<code>df["group"].isin(["A","B"])</code>','Получится маска'],
        ['От 60 до 90 включительно','<code>df["score"].between(60,90)</code>','Обе границы включены'],
        ['Имя содержит фрагмент','<code>df["name"].str.contains("ер",na=False)</code>','na=False для пропусков'],
        ['Где максимум?','<code>df["score"].idxmax()</code>','Вернётся метка строки, не балл'],
        ['Два лучших','<code>df.nlargest(2,"score")</code>','Вернутся две строки'],
        ['Сколько разных групп?','<code>df["group"].nunique()</code>','Одно число'],
        ['Сколько в каждой группе?','<code>df["group"].value_counts()</code>','Серия частот']
      ]),
      h('Новый столбец и качество данных'),
      p('Арифметика со столбцом выполняется построчно. После <code>df["total"] = ...</code> строк столько же. Пропуски сначала считай через <code>isna().sum()</code>. Замена <code>fillna(0)</code> допустима, только если ноль имеет смысл в задаче. <code>dropna(subset=[...])</code> удалит строки — сравни размер до и после.'),
      code(['print(df.isna().sum().to_dict())','df["total"] = df["score"] + df["bonus"].fillna(0)','df["passed"] = df["total"] >= 70','print(df[["name","total","passed"]].to_string(index=False))','print(df.sort_values("total",ascending=False).head(2)["name"].tolist())'].join('\n'),'В bonus один пропуск. Итоги: 85, 55, 92, 80. Два первых: Вера и Аня.'),
      table(['Ситуация','Метод','Проверка'],[
        ['Переименовать столбец','<code>rename(columns={"old":"new"})</code>','Новые имена'],
        ['Добавить столбец в новой таблице','<code>assign(new=...)</code>','Размер и значения'],
        ['Проверить пропуски','<code>isna().sum()</code>','Число пустых по столбцам'],
        ['Убрать строки с нужным пропуском','<code>dropna(subset=[...])</code>','Размер до и после'],
        ['Найти полные повторы','<code>duplicated().sum()</code>','Показать повторные строки'],
        ['Превратить текст в число','<code>pd.to_numeric(...,errors="coerce")</code>','Новые NaN'],
        ['Отсортировать','<code>sort_values("total",ascending=False)</code>','Большие значения сверху']
      ]),
      tip('Сохраняй результат','<code>sort_values</code>, <code>dropna</code> и <code>rename</code> обычно возвращают новую таблицу. Запиши её в переменную: <code>clean = df.dropna(...)</code>.'),
      task('Фильтр и проверка','Оставь группу B с итогом не меньше 70. Выведи имя, итог и число строк.','Используй две пары скобок и <code>.loc</code>.','<code>selected = df.loc[(df["group"] == "B") &amp; (df["total"] &gt;= 70), ["name","total"]]</code>. Останется Глеб; <code>len(selected)</code> равно 1.')
    ]
  });

  course.lessons.push({
    id:'pandas-group-recipes',title:'pandas: группировки без путаницы',level:'Средний',
    lead:'size, count, agg, transform, доли и сводные таблицы: что происходит с числом строк.',
    blocks:[
      h('Одна строка на группу или прежнее число строк?'),
      p('<code>groupby(...).agg(...)</code> делает компактную сводку: одна строка на группу. <code>groupby(...).transform(...)</code> возвращает значение для каждой исходной строки: так считают отклонение заказа от среднего его ресторана. <code>groupby(...).filter(...)</code> оставляет или убирает целые группы.'),
      table(['Нужно','Код','Форма результата'],[
        ['Число заказов по ресторану','<code>groupby("restaurant_id").size()</code>','По одному числу на ресторан'],
        ['Среднее и медиана','<code>groupby(...).agg(mean=("paid_rub","mean"),med=("paid_rub","median"))</code>','Одна строка на группу'],
        ['Средний чек рядом с каждым заказом','<code>groupby(... )["paid_rub"].transform("mean")</code>','Столько же строк, сколько заказов'],
        ['Оставить группы с 20+ строками','<code>groupby(...).filter(lambda g: len(g) &gt;= 20)</code>','Строки подходящих групп']
      ]),
      h('Пример на заказах'),
      p('Скачай <a href="students/practice/data/orders.csv" download>orders.csv</a>. Одна строка — заказ. Сначала отберём доставленные, затем построим сводку по ресторанам. <code>size</code> считает строки, а <code>count</code> — непустые значения выбранного столбца.'),
      code(['import pandas as pd','orders = pd.read_csv("students/practice/data/orders.csv")','delivered = orders.loc[orders["status"] == "delivered"].copy()','report = (delivered.groupby("restaurant_id")','          .agg(orders_n=("order_id","size"),','               revenue=("paid_rub","sum"),','               mean_check=("paid_rub","mean"),','               known_ratings=("rating","count"))','          .reset_index())','print(len(delivered),len(report),report["orders_n"].sum())'].join('\n'),'1239 доставленных заказов; 32 ресторана; сумма orders_n равна 1239.'),
      p('Проверь сумму размеров групп: <code>report["orders_n"].sum() == len(delivered)</code>. Проверь и деньги: <code>report["revenue"].sum() == delivered["paid_rub"].sum()</code>. Если не сходится, вернись к фильтру или проверь пропуски.'),
      code(['delivered["restaurant_mean"] = delivered.groupby("restaurant_id")["paid_rub"].transform("mean")','delivered["gap"] = delivered["paid_rub"] - delivered["restaurant_mean"]','print(len(delivered),delivered["restaurant_mean"].isna().sum())'].join('\n'),'Строк по-прежнему 1239; пропусков среднего ресторана нет.'),
      table(['Вопрос','Приём'],[
        ['Доля категории среди строк','<code>value_counts(normalize=True)</code>'],
        ['Доля отмен по оплате','<code>groupby("payment_method")["is_cancelled"].mean()</code>'],
        ['Частоты двух категорий','<code>pd.crosstab(df["payment_method"],df["status"])</code>'],
        ['Средний чек в сетке ресторан × статус','<code>pivot_table(index="restaurant_id",columns="status",values="paid_rub",aggfunc="mean")</code>'],
        ['Место заказа по цене внутри ресторана','<code>groupby("restaurant_id")["paid_rub"].rank(ascending=False)</code>'],
        ['Строка максимума группы','<code>groupby("restaurant_id")["paid_rub"].idxmax()</code>']
      ]),
      tip('Доля и знаменатель','Среднее из True/False равно доле True. Знаменатель — строки текущей таблицы, поэтому всегда называй фильтр и размер подвыборки.'),
      task('Доля отмен','Посчитай долю отмен по способу оплаты; рядом выведи число заказов.','Создай булев столбец is_cancelled и сделай agg.','<code>orders.assign(is_cancelled=orders["status"].eq("cancelled")).groupby("payment_method").agg(n=("order_id","size"),share=("is_cancelled","mean"))</code>.')
    ]
  });

  course.lessons.push({
    id:'pandas-join-recipes',title:'pandas: соединение файлов и проверка ответа',level:'Средний',
    lead:'Когда нужен concat, когда merge, как проверить ключ, число строк и итоговую сумму.',
    blocks:[
      h('Склеить строки или сопоставить объекты?'),
      p('Январь и февраль с одинаковыми столбцами ставь друг под другом через <code>pd.concat([jan,feb],ignore_index=True)</code>. Если у заказа есть customer_id, а в другом файле по нему хранится район, сопоставь строки через <code>merge</code>. <code>concat(axis=1)</code> ставит столбцы рядом по индексу; ID внутри столбца не участвует в сопоставлении.'),
      table(['Задача','Операция','Проверка'],[
        ['Добавить волну опроса','<code>pd.concat([sep,oct_],ignore_index=True)</code>','Строки складываются'],
        ['Добавить район к заказу','<code>orders.merge(customers,on="customer_id",how="left")</code>','Заказы не размножились'],
        ['Поставить две Series рядом','<code>pd.concat([left,right],axis=1)</code>','Индексы совпадают по смыслу'],
        ['Найти минимум у каждой строки','<code>table.min(axis=1)</code>','Ручной расчёт 1–2 строк']
      ]),
      h('Рабочий merge на CSV'),
      p('Скачай <a href="students/practice/data/orders.csv" download>заказы</a> и <a href="students/practice/data/customers.csv" download>клиентов</a>. Один клиент может иметь много заказов, а строка клиента в справочнике должна быть одна. Это связь «многие к одному». <code>validate="many_to_one"</code> проверяет её; <code>indicator=True</code> показывает совпадения.'),
      code(['import pandas as pd','orders = pd.read_csv("students/practice/data/orders.csv")','customers = pd.read_csv("students/practice/data/customers.csv")','print(customers["customer_id"].is_unique)','joined = orders.merge(','    customers[["customer_id","district"]],','    on="customer_id",how="left",validate="many_to_one",indicator=True',')','print(len(orders),len(joined))','print(joined["_merge"].value_counts().to_dict())'].join('\n'),'Ключ уникален: True; до и после 1400 строк; все получили совпадение both.'),
      p('Если строк стало больше, проверь повторы ключа справа. Если появились left_only, часть заказов не нашла клиента. Разберись с причиной до удаления строк. После проверки убери служебный _merge через <code>drop(columns="_merge")</code>.'),
      h('Два уровня таблицы — две разные суммы'),
      p('После <code>orders.merge(items,on="order_id")</code> заказ превращается в несколько строк товаров. Если на каждой повторится paid_rub всего заказа, сумма по объединённой таблице посчитает деньги несколько раз. Для выручки по ресторанам используй таблицу заказов; для количества товаров — таблицу позиций.'),
      table(['После операции','Проверка кодом'],[
        ['Фильтр','<code>len(filtered)</code> и выбранные ID'],
        ['Новый столбец','<code>len(df)</code> не изменилось; ручной расчёт двух строк'],
        ['Вертикальный concat','<code>len(result)==len(a)+len(b)</code> до очистки'],
        ['Merge','Уникальность ключа, validate, _merge, число строк'],
        ['Groupby','Сумма размеров групп и денежных итогов'],
        ['Экспорт','<code>to_csv(...,index=False)</code>, повторное чтение']
      ]),
      tip('Перевод задания в код','Для вопроса «доля по районам» уточни, доля каких строк нужна, в каком файле район и какая связь между файлами. Затем выбирай фильтр, merge и groupby.'),
      task('Три проверки merge','Напиши assert для неизменного числа заказов, отсутствия пустого района и уникальности ключа клиента справа.','Проверь длину, notna и is_unique.','<code>assert len(joined)==len(orders)</code>; <code>assert joined["district"].notna().all()</code>; <code>assert customers["customer_id"].is_unique</code>.')
    ]
  });
  course.lessons.push({
    id:'pandas-map-apply',title:'pandas: map, replace, apply и explode',level:'Средний',
    lead:'Как заменить коды понятными названиями, применить функцию к строкам и развернуть списки.',
    blocks:[
      h('Перевести код категории в название'),
      p('<code>map</code> подставляет значение из словаря для каждого элемента Series. Если кода в словаре нет, результатом будет пропуск: это удобно для поиска неизвестных кодов. <code>replace</code> заменяет перечисленные значения, а остальные оставляет как были. Выбирай по смыслу задачи: неизвестная категория должна стать заметной или сохраниться исходным кодом?'),
      code(['import pandas as pd','df = pd.DataFrame({','    "id": [1, 2, 3],','    "district": ["C", "N", "X"],','    "score": [70, 80, 90],','    "tags": ["a,b", "a", "b,c"],','})','names = {"C": "Центр", "N": "Север"}','df["district_name"] = df["district"].map(names)','print(df[["district", "district_name"]].to_string(index=False))'].join('\n'),'C → Центр, N → Север, X → пропуск: кода X нет в словаре.'),
      table(['Метод','Когда полезен','Что проверить'],[
        ['<code>series.map(dictionary)</code>','Перевод кодов, простое соответствие','Не появились ли новые пропуски'],
        ['<code>series.replace(dictionary)</code>','Замена отдельных значений','Оставшиеся значения не изменились'],
        ['<code>series.str.strip()</code>','Убрать пробелы вокруг текста','Не слились ли разные категории'],
        ['<code>series.str.split(",")</code>','Разбить строку на список','Проверить одну строку вручную']
      ]),
      h('Функция для каждого значения и для каждой строки'),
      p('<code>Series.apply(function)</code> вызывает функцию для каждого значения одного столбца. <code>DataFrame.apply(function, axis=1)</code> передаёт функции по одной целой строке. Для простой арифметики используй прямые операции со столбцами: <code>df["score"] + 5</code> короче и обычно быстрее. <code>apply</code> пригодится, когда правило сложно выразить обычными операциями.'),
      code(['def label_score(x):','    return "сдал" if x >= 75 else "не сдал"','df["result"] = df["score"].apply(label_score)','df["adjusted"] = df["score"] + 5','print(df[["id", "result", "adjusted"]].to_string(index=False))'].join('\n'),'Статусы: не сдал, сдал, сдал. Баллы после +5: 75, 85, 95.'),
      h('Один список в ячейке — несколько строк'),
      p('После <code>.str.split(",")</code> в ячейке может лежать список. <code>explode</code> делает отдельную строку для каждого элемента списка. Одна исходная строка может превратиться в несколько: перед суммированием денег подумай, не повторилось ли значение всей исходной строки.'),
      code(['df["tag"] = df["tags"].str.split(",")','long = df[["id", "tag"]].explode("tag", ignore_index=True)','print(len(df), len(long))','print(long.to_string(index=False))'].join('\n'),'Было 3 строки, стало 5: id 1 и 3 встречаются по два раза.'),
      tip('Проверка формы','<code>map</code> и <code>apply</code> в этих примерах сохраняют число строк. <code>explode</code> увеличивает его. Назови единицу наблюдения новой таблицы: после explode это уже одна метка одного объекта, а не один объект.'),
      task('Коды и пропуски','Добавь код Y четвёртой строкой. Сравни, что дадут <code>map(names)</code> и <code>replace(names)</code> для этого кода.','Посмотри на значение, которого нет в словаре names.','<code>map</code> даст NaN; <code>replace</code> оставит Y. Выбор зависит от того, как нужно обрабатывать неизвестные коды.')
    ]
  });
})();
