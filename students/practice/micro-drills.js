(function () {
  const trainer = window.COURSES.find(c => c.id === 'trainer');
  const existing = {
    'python-drills':[['Переменные и условия','python/python-basics-drills']],
    'python-loops':[['Списки','python/python-lists-drills'],['Циклы','python/python-loops-drills']],
    'python-functions':[['Функции','python/python-functions-drills']],
    'pandas-start':[['Таблица','pandas/pandas-table-basics'],['Фильтры','pandas/pandas-filter-search'],['Новые столбцы','pandas/pandas-add-sort']],
    'pandas-case':[['План кейса','pandas/case-pipeline'],['concat','pandas/concat'],['merge','pandas/merge-audit']],
    'pandas-groupby':[['groupby и transform','pandas/groupby-advanced']],
    'pandas-joins':[['merge','pandas/merge-audit'],['pivot и crosstab','pandas/reshape']],
    'pandas-time':[['Строки и даты','pandas/strings-dates'],['Временные ряды','pandas/time-series']],
    'numpy-arrays':[['Списки Python','python/python-lists-drills'],['Оси axis','pandas/pandas-concat-min-axis']],
    'plots':[['Графики','pandas/plots']],
    'scipy-tests':[['Гипотезы','statistics/hypothesis'],['ANOVA и χ²','statistics/anova-chi']],
    'sklearn-regression':[['База регрессии','statistics/regression-basic'],['Статистика весов','statistics/regression-inference']]
  };
  for (const lesson of trainer.lessons) lesson.references = existing[lesson.id] || [];

  const file = (name,url) => ({name,url});
  const orders = [file('Заказы · 1400 строк','students/practice/data/orders.csv')];
  const delivery = [...orders,file('Клиенты','students/practice/data/customers.csv'),file('Рестораны','students/practice/data/restaurants.csv'),file('Позиции','students/practice/data/order_items.csv')];
  const add = (id,title,level,lead,references,datasets,intro,starter,sets) => {
    const stages=['Простые','Средние','Сложные'];
    const stageTitles=['Разогрев: одна операция','Закрепление: несколько шагов','Применение: маленькая задача'];
    trainer.lessons.push({id,title,level,lead,references,datasets,blocks:[
      {type:'p',html:intro},
      {type:'callout',label:'Как проходить',html:'Каждый пункт решай отдельно: перед следующим снова запусти стартовый код. Так изменения списка или таблицы в одной задаче не повлияют на другую. Отмечай пункт после того, как проверил вывод.'},
      {type:'code',language:'python',code:starter},
      ...sets.map((items,i)=>({type:'drillset',difficulty:stages[i],title:stageTitles[i],items}))
    ]});
  };

  add('micro-python-lists','Мини-задачи Python: списки','База','24 упражнения на индексы, срезы, изменение и вложенные списки.',
    [['Списки как массивы','python/python-lists-drills'],['Циклы по спискам','python/python-loops-drills']],[],
    'Работай без pandas и NumPy. После каждого пункта выведи результат. Проверь, меняется ли исходный список.',
    'nums = [4, 7, 2, 7, 9]\nnames = ["Аня", "Борис", "Вера", "Глеб", "Дина"]\ngrid = [[1, 2, 3], [4, 5, 6]]',[
      ['Выведи первый элемент nums.','Выведи последний элемент nums двумя способами.','Получи срез [7, 2, 7].','Получи первые три и последние два имени.','Выведи каждый второй элемент nums.','Замени 2 на 20 по индексу.','Добавь 11 в конец nums через append().','Выведи число 5 из grid через два индекса.'],
      ['Создай копию nums, измени её и докажи, что оригинал не изменился.','Найди индекс первой семёрки через index().','Посчитай семёрки через count().','Удали первую семёрку через remove().','Удали последний элемент через pop() и сохрани его.','Получи nums без первого и последнего элемента.','Сравни [1, 2] + [3] и [1, 2] * 2.','Замени число 5 в grid на 50.'],
      ['Циклом собери квадраты элементов nums в новый список.','Собери nums без всех семёрок циклом и append().','Найди второе по величине различное число в nums.','Соедини names и nums в пары через zip().','Разверни nums циклом без reverse() и [::-1].','Сделай плоский список из grid вложенными циклами.','Создай пять нулей и замени элементы с чётным индексом на 1.','Безопасно возьми элемент по индексу i: при неверном индексе выведи «нет индекса».']
    ]);

  add('micro-python-loops','Мини-задачи Python: циклы','База','24 задачи на for, while, enumerate, суммы, счётчики и поиск индекса.',
    [['Циклы по спискам','python/python-loops-drills'],['Списки','python/python-lists-drills']],[],
    'Сначала решай обычным циклом, даже если знаешь sum() или max(). Так понятнее, что делают готовые методы.',
    'scores = [58, 73, 91, 73, 64, 88]\ngroups = ["A", "B", "A", "B", "A", "B"]',[
      ['Выведи каждый балл через for.','Посчитай сумму scores циклом без sum().','Посчитай баллы не меньше 70.','Выведи баллы группы A, проходя по двум спискам.','Выведи 1–5 через range().','Собери новый список баллов +5.','Посчитай число чётных баллов.','Выведи индекс и балл через enumerate().'],
      ['Найди максимальный балл без max().','Найди индекс первого максимума без max().','Найди индексы всех баллов 73: [1, 3].','Сделай словарь частот баллов.','Через zip() посчитай суммы групп A и B.','Проверь циклом, что все баллы в диапазоне 0–100.','Найди первый балл выше 85 и остановись через break.','Через while найди минимальное n с суммой 1+...+n > 20.'],
      ['Найди индексы первого минимума и максимума одним проходом.','Собери словарь {"A": [баллы A], "B": [баллы B]}.','Найди средние A и B без pandas.','Отсортируй индексы scores по убыванию балла.','Найди длину самой длинной подряд серии баллов >= 70.','Построй список накопленных сумм scores.','Найди пары индексов разных элементов, сумма которых > 160.','Циклом while удали по одному элементу из копии списка до пустоты.']
    ]);

  add('micro-python-functions','Мини-задачи Python: функции','База','24 задачи на параметры, return и функции с циклами внутри.',
    [['Функции на списках','python/python-functions-drills'],['Циклы','python/python-loops-drills']],[],
    'Для каждой функции сделай хотя бы два вызова. Используй return для результата; print лишь показывает его.',
    'values = [3, 8, 5, 8]\npoints = [(0, 0), (3, 4), (6, 8)]\n# Напиши функции ниже',[
      ['Напиши double(x): для 4 верни 8, для -3 верни -6.','Напиши is_even(n), возвращающую bool.','Напиши add(a, b), возвращающую сумму.','Напиши greet(name), возвращающую приветствие.','Напиши passed(score, threshold=60) с порогом по умолчанию.','Напиши square_list(numbers), не меняющую вход.','Напиши first_or_none(items) для пустого списка.','Напиши within(x, left, right) для отрезка включительно.'],
      ['Напиши count_above(numbers, threshold).','Напиши total(numbers) без sum(); для [] верни 0.','Напиши average(numbers); для [] верни None.','Напиши index_of_max(numbers); для [] верни None.','Напиши unique_in_order(items), сохранив порядок.','Напиши frequencies(items): словарь частот.','Напиши distance(x1, y1, x2, y2); проверь точки (0,0) и (3,4).','Напиши take_top(numbers, n=3), не меняющую вход.'],
      ['Напиши nearest_station(point, stations): индекс ближайшей; при равенстве первый.','Напиши group_means(values, groups) с проверкой одинаковой длины.','Напиши moving_average(numbers, window).','Напиши classify(scores, threshold=60): список bool.','Напиши safe_divide(a, b): при b=0 верни None.','Напиши median(numbers) без statistics.median().','Напиши normalize(numbers): вычти среднее; для [] верни [].','Разбей поиск ближайшей станции на функции distance() и nearest_station().']
    ]);
  add('micro-pandas-select','Мини-задачи pandas: выбор и поиск','База','24 шага от shape и loc до составных фильтров, idxmax и nlargest.',
    [['Таблица и индексы','pandas/pandas-table-basics'],['Фильтры и поиск','pandas/pandas-filter-search']],orders,
    'Одна строка orders.csv — один заказ. После каждого фильтра выведи число строк и несколько ID: так ты увидишь, что выбрал.',
    'import pandas as pd\norders = pd.read_csv("orders.csv")\n# Из корня проекта: students/practice/data/orders.csv',[
      ['Выведи первые 3 и последние 2 строки.','Выведи число строк и столбцов из shape.','Получи Series paid_rub и DataFrame из order_id и paid_rub.','Возьми первую строку через iloc.','Оставь только delivered заказы.','Оставь заказы с paid_rub >= 1500.','Выведи уникальные status через unique().','Посчитай заказы каждого status через value_counts().'],
      ['Оставь delivered заказы с paid_rub > 1500.','Найди заказы двух выбранных статусов через isin().','Найди строки с непустым promo_code через notna().','Найди оплаты от 800 до 1200 включительно через between().','Найди payment_method со словом card через .str.contains().','Оставь в результате только order_id, status и paid_rub через loc.','Найди индекс максимального paid_rub и выведи всю строку.','Получи пять наибольших оплат через nlargest().'],
      ['Найди delivered заказы с рейтингом 5 и временем доставки <= 30.','Найди заказы без промокода, но с ненулевой скидкой.','Сравни число строк для A & B и A | B на двух своих условиях.','Исключи два самых частых способа оплаты.','Найди полный заказ с максимальной оплатой для каждого способа оплаты.','Сравни топ-3 по оплате отдельно среди delivered и cancelled.','Проверь уникальность order_id; при повторе выведи все строки.','Составь маску ошибок: paid_rub < 0 или delivery_min < 0.']
    ]);

  add('micro-pandas-columns','Мини-задачи pandas: столбцы и очистка','База','24 действия с assign, fillna, датами, сортировкой и проверкой качества.',
    [['Новые столбцы','pandas/pandas-add-sort'],['Пропуски и дубли','pandas/cleaning'],['Строки и даты','pandas/strings-dates']],orders,
    'Создай копию таблицы для изменений. Не заменяй отсутствующий рейтинг нулём: «не оценили» и оценка 0 различаются.',
    'import pandas as pd\norders = pd.read_csv("orders.csv")\nwork = orders.copy()',[
      ['Выведи dtypes всех столбцов.','Посчитай пропуски по столбцам через isna().sum().','Добавь is_delivered как булев столбец.','Добавь has_promo через promo_code.notna().','Добавь gross_rub = items_total_rub + delivery_fee_rub.','Отсортируй по paid_rub по убыванию.','Переименуй paid_rub в payment_rub в копии.','Посчитай полные дубли строк через duplicated().sum().'],
      ['Добавь expected_rub = items_total_rub - discount_rub + delivery_fee_rub для доставленных.','Найди отклонения paid_rub от expected_rub.','Добавь slow по delivery_min > 60, сохранив неизвестное время как пропуск.','Преобразуй ordered_at в datetime и добавь дату без времени.','Добавь hour через .dt.hour.','Создай discount_share, заранее проверив нулевой знаменатель.','Сортируй по status и paid_rub: внутри статуса дорогие первыми.','Через assign() добавь два признака без изменения исходного orders.'],
      ['Найди cancelled заказы с paid_rub > 0.','Раздели delivery_min на интервалы через pd.cut().','Через pd.to_numeric(errors="coerce") подготовь числовой rating.','Сравни дубли по order_id и полные дубли строк.','Удали только полные дубли и сравни размер.','Проверь assert: у delivered paid_rub не отрицателен.','Собери отдельную таблицу проблемных строк с колонкой reason.','Сохрани копию в CSV без индекса и перечитай для проверки.']
    ]);

  add('micro-pandas-groups','Мини-задачи pandas: groupby и transform','Средний','24 задачи от простого подсчёта до именных agg и показателей каждой строки.',
    [['groupby, agg, transform','pandas/groupby-advanced'],['Сводка кейса','pandas/case-report']],orders,
    'Перед группировкой выбери нужную подвыборку. Рядом со средним всегда показывай размер группы.',
    'import pandas as pd\norders = pd.read_csv("orders.csv")\ndelivered = orders.loc[orders["status"] == "delivered"].copy()',[
      ['Посчитай заказы по status через groupby().size().','Найди средний paid_rub по payment_method среди delivered.','Найди сумму paid_rub по restaurant_id среди delivered.','Посчитай известные rating по status через count().','Сравни size() и count() на rating.','Найди медианное delivery_min по ресторанам.','Отсортируй рестораны по выручке.','Оставь рестораны с 20+ доставленными заказами.'],
      ['Одним agg() получи n, revenue и mean_check по ресторану.','Добавь median_delivery и число известных rating.','Сгруппируй по restaurant_id и payment_method.','Верни ключи из индекса через reset_index().','Посчитай долю доставленных заказов по способу оплаты.','Добавь каждому заказу средний чек ресторана через transform("mean").','Вычисли отклонение чека от среднего ресторана.','Через transform("size") добавь каждому заказу число заказов клиента.'],
      ['Найди полную строку заказа с максимальной оплатой для каждого ресторана.','Посчитай долю чека в выручке ресторана через transform("sum").','Найди 90-й процентиль delivery_min по ресторану.','Оставь рестораны с 25+ доставками и 20+ известными оценками.','Сравни средний чек способов оплаты с общей средней оплатой.','Сделай wide-таблицу restaurant_id × status с числом заказов.','Добавь в wide-таблицу share_cancelled, обрабатывая отсутствие категории.','Собери CSV по ресторанам: n, revenue, median_delivery, share_cancelled; проверь сумму n.']
    ]);

  add('micro-pandas-combine','Мини-задачи pandas: concat, merge и axis','Средний','24 задачи на соединение таблиц, контроль ключей и построчный минимум.',
    [['concat и axis','pandas/pandas-concat-min-axis'],['Склеивание таблиц','pandas/concat'],['Проверка merge','pandas/merge-audit'],['Сводные таблицы','pandas/reshape']],delivery,
    'Назови единицу наблюдения: orders — заказ, customers — клиент, restaurants — ресторан, items — позиция заказа. После merge проверяй число строк.',
    'import pandas as pd\norders = pd.read_csv("orders.csv")\ncustomers = pd.read_csv("customers.csv")\nrestaurants = pd.read_csv("restaurants.csv")\nitems = pd.read_csv("order_items.csv")',[
      ['Создай Series left=[5,3,8] и right=[2,7,4] и поставь рядом через concat(axis=1).','Найди минимум в каждой строке через min(axis=1).','Найди минимум каждого столбца через min(axis=0).','Найди название ближайшей станции через idxmin(axis=1).','Проверь уникальность customer_id в customers.','Проверь уникальность restaurant_id в restaurants.','Добавь к orders район клиента через merge.','Сравни длину orders до и после merge.'],
      ['Раздели orders на две части, склей вертикально и проверь число строк.','Добавь название ресторана через merge(validate="many_to_one").','Сделай left merge с indicator=True и посчитай значения _merge.','Найди клиентов без заказов по ключу customer_id.','В items вычисли line_total_rub = quantity * unit_price_rub.','Сложи line_total_rub по order_id и добавь к orders.','Сравни сумму позиций с items_total_rub.','Сделай crosstab payment_method × status и доли по строкам.'],
      ['Соедини orders с items и покажи, почему сумма paid_rub выросла.','Посчитай правильную выручку по cuisine на уровне заказа.','Собери таблицу клиентов: число заказов, число доставленных, общая оплата.','Перед каждым merge укажи ожидаемую связь ключей и проверь validate.','Из трёх Series расстояний получи ближайшую станцию и расстояние.','Поменяй порядок индексов Series и докажи, что concat совмещает по меткам.','Построй pivot_table cuisine × payment_method со средним чеком.','Сохрани таблицу в CSV, перечитай и сравни ключи, строки и сумму оплаты.']
    ]);
  const extraReferences = {
    'pandas-start':[['Все базовые операции','pandas/pandas-core-recipes']],
    'pandas-groupby':[['Разбор группировок','pandas/pandas-group-recipes']],
    'pandas-joins':[['Проверки соединения','pandas/pandas-join-recipes']],
    'micro-pandas-select':[['Все базовые операции','pandas/pandas-core-recipes']],
    'micro-pandas-columns':[['Все базовые операции','pandas/pandas-core-recipes'],['map, apply, explode','pandas/pandas-map-apply']],
    'micro-pandas-groups':[['Разбор группировок','pandas/pandas-group-recipes']],
    'micro-pandas-combine':[['Проверки соединения','pandas/pandas-join-recipes']]
  };
  for (const lesson of trainer.lessons) lesson.references?.push(...(extraReferences[lesson.id] || []));
  trainer.subtitle = 'Решай короткие задачи от простых до сложных. Открывай конспект перед блоком, отмечай выполненное и переходи к следующей теме. В отдельных блоках есть большая работа с CSV.';
})();
