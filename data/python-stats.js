window.COURSES.push({
  id:'python-stats',number:'04',title:'Статистика в Python',icon:'ƒ',tint:'#f2e9e1',
  lead:'Как провести тесты и регрессию кодом, а затем правильно прочитать числа.',
  subtitle:'Рецепты на SciPy и statsmodels с пояснением каждого шага.',
  lessons:[
    {id:'scipy-t',title:'t-тесты в SciPy',lead:'SciPy возвращает статистику и p-value. Сначала выбери дизайн исследования.',blocks:[
      {type:'p',html:'Одна группа против числа → <code>ttest_1samp</code>. Две независимые группы → <code>ttest_ind(..., equal_var=False)</code>, то есть тест Уэлча. Одни и те же объекты до и после → <code>ttest_rel</code>.'},
      {type:'code',language:'python',code:'from scipy import stats\n\none = stats.ttest_1samp([9, 10, 11, 12, 13], popmean=10)\nprint(one.statistic, one.pvalue)\n\na = [12, 14, 13, 16]\nb = [10, 11, 15, 12]\nindependent = stats.ttest_ind(a, b, equal_var=False)\npaired = stats.ttest_rel(a, b)',output:'Результаты содержат statistic и pvalue. Для парного теста элементы двух списков должны соответствовать одним и тем же объектам.'},
      {type:'p',html:'Заранее сформулируй H₀ и альтернативу. Малое p-value говорит о несовместимости данных с H₀ при допущениях теста; оно не показывает вероятность истинности H₀.'},
      {type:'example',title:'Один набор измерений',given:'Время работы: 9, 10, 11, 12, 13 часов. H₀: среднее 10.',find:'Функцию SciPy.',steps:['Один числовой набор сравниваем с фиксированным числом.','Выбираем stats.ttest_1samp.','Передаём массив и popmean=10, читаем statistic и pvalue.'],answer:'<code>stats.ttest_1samp([9,10,11,12,13], popmean=10)</code>.'},
      {type:'exercise',title:'Выбери функцию',prompt:'Есть баллы одних и тех же студентов до и после курса. Какой вызов SciPy нужен?',hint:'Нужен тест для связанных выборок.',solution:'<code>stats.ttest_rel(after, before)</code>, если списки согласованы по студентам.'}
    ]},
    {id:'scipy-anova',title:'ANOVA и χ² в SciPy',lead:'Разным данным нужны разные тесты и разное толкование.',blocks:[
      {type:'p',html:'Для средних трёх независимых числовых групп применяют <code>stats.f_oneway</code>. Для связи двух категориальных признаков по таблице частот — <code>stats.chi2_contingency</code>.'},
      {type:'code',language:'python',code:'from scipy import stats\n\nclass_a = [72, 75, 70, 78]\nclass_b = [68, 71, 73, 69]\nclass_c = [80, 83, 77, 81]\nanova = stats.f_oneway(class_a, class_b, class_c)\nprint(anova.statistic, anova.pvalue)\n\ntable = [[30, 20], [20, 30]]\nchi = stats.chi2_contingency(table, correction=False)\nprint(chi.statistic, chi.pvalue, chi.expected_freq)',output:'ANOVA даёт F-статистику; chi2_contingency — χ²-статистику и ожидаемые частоты.'},
      {type:'p',html:'У ANOVA H₀: средние всех групп одинаковы. У χ² независимости H₀: категориальные признаки независимы. Смысл p-value зависит от выбранной H₀.'},
      {type:'callout',label:'Где ошибаются',html:'<code>chi2_contingency</code> ожидает таблицу <em>количеств</em>, не сырые числовые баллы. Для ANOVA нужны отдельные числовые массивы по группам.'},
      {type:'example',title:'Два типа задачи',given:'Сравнить средние трёх классов; проверить связь пола и выбора факультатива.',find:'Функции SciPy.',steps:['В первом случае результат числовой, групп три.','Во втором случае оба признака категориальные, нужна таблица частот.'],answer:'Сначала <code>stats.f_oneway</code>, затем <code>stats.chi2_contingency</code>.'},
      {type:'exercise',title:'Подготовь таблицу',prompt:'Для частот [[12, 8], [9, 11]] вызови χ²-тест независимости и выведи ожидаемые частоты.',hint:'Результат содержит <code>expected_freq</code>.',solution:'<code>result = stats.chi2_contingency([[12,8],[9,11]])</code>; затем <code>print(result.expected_freq)</code>.'}
    ]},
    {id:'ols',title:'Регрессия и статистика весов',lead:'Для стандартных ошибок и доверительных интервалов удобен statsmodels.',blocks:[
      {type:'p',html:'<code>statsmodels.OLS</code> оценивает модель методом наименьших квадратов. Результат содержит коэффициенты, стандартные ошибки, t-статистики, p-value и доверительные интервалы.'},
      {type:'code',language:'python',code:'import statsmodels.api as sm\n\nx = [0, 1, 2, 3, 4]\ny = [1, 2, 2, 4, 5]\nX = sm.add_constant(x)\nmodel = sm.OLS(y, X).fit()\n\nprint(model.params)\nprint(model.bse)\nprint(model.tvalues)\nprint(model.pvalues)\nprint(model.conf_int(alpha=0.05))',output:'Параметры идут в порядке [свободный член, вес x]. conf_int(alpha=0.05) даёт 95% интервал.'},
      {type:'p',html:'<code>add_constant</code> добавляет столбец единиц для свободного члена. Без него модель может проходить через ноль. <code>model.summary()</code> показывает сводную таблицу; читай знак, величину и единицы веса наряду с p-value.'},
      {type:'example',title:'Чтение строки коэффициента',given:'Вес x равен 1, SE ≈ 0,163, 95% интервал [0,48; 1,52].',find:'Смысл оценки и интервала.',steps:['При росте x на 1 средний прогноз y растёт примерно на 1.','Интервал показывает неопределённость веса.','Ноль не входит в интервал: H₀ о нулевом весе отвергают на уровне 0,05.'],answer:'Есть свидетельство ненулевого линейного коэффициента. Причинность из этого не следует.'},
      {type:'exercise',title:'Найди нужное поле',prompt:'Как вывести только стандартные ошибки коэффициентов из результата OLS?',hint:'Поле называется <code>bse</code>.',solution:'<code>print(model.bse)</code>.'}
    ]},
    {id:'interpretation',title:'Как не ошибиться в выводе',lead:'Хороший анализ заканчивается смыслом чисел, а не таблицей p-value.',blocks:[
      {type:'p',html:'Перед тестом проверь тип данных, независимость наблюдений, пропуски и сильные выбросы. После теста прочитай <strong>размер эффекта</strong> и доверительный интервал. Статистическая значимость не означает практическую важность.'},
      {type:'p',html:'Для регрессии посмотри на остатки. Если они образуют дугу или их разброс растёт вместе с прогнозом, простая модель может описывать данные плохо, а классические стандартные ошибки — быть ненадёжными.'},
      {type:'code',language:'python',code:'import matplotlib.pyplot as plt\n\nplt.scatter(model.fittedvalues, model.resid)\nplt.axhline(0, color="gray")\nplt.xlabel("Прогноз")\nplt.ylabel("Остаток")\nplt.show()',output:'Ищи структуру: остатки должны выглядеть как разброс вокруг нуля, а не как очевидная кривая.'},
      {type:'example',title:'Фраза о p-value',given:'Для веса при часах подготовки получили p = 0,03.',find:'Корректный вывод.',steps:['H₀ говорит, что вес равен нулю.','При H₀ столь сильное отклонение встречалось бы примерно в 3% случаев.','На уровне 0,05 H₀ отвергают; причинный вывод не делают.'],answer:'Данные дают свидетельство ненулевого коэффициента. Нельзя говорить «вероятность H₀ равна 3%».'},
      {type:'exercise',title:'Исправь вывод',prompt:'Автор пишет: «p = 0,2 доказало отсутствие связи». Что неверно?',hint:'Большое p-value не доказывает H₀.',solution:'Данные не дали достаточно оснований отвергнуть H₀ на выбранном уровне. Возможны малая выборка или неточная оценка.'}
    ]}
  ]
});
