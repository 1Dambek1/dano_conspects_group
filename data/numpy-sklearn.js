window.COURSES.push({
  id:'numpy-sklearn',number:'05',title:'NumPy и sklearn',icon:'[ ]',tint:'#e4edf3',
  lead:'Массивы, формы данных, обучение модели и честная проверка прогноза.',
  subtitle:'Здесь код из предыдущих разделов превращается в рабочую модель.',
  lessons:[
    {id:'numpy-array',title:'Массивы NumPy',lead:'ndarray хранит много чисел и выполняет операции над всеми сразу.',blocks:[
      {type:'p',html:'<code>np.array</code> создаёт массив. <code>shape</code> показывает форму: для таблицы это (строки, столбцы). Индексы начинаются с 0. <code>a[1, 2]</code> берёт строку 1 и столбец 2.'},
      {type:'code',language:'python',code:'import numpy as np\n\na = np.array([[1, 2, 3],\n              [4, 5, 6]])\nprint(a.shape)\nprint(a[1, 2])',output:'(2, 3)\n6'},
      {type:'interactive',kind:'numpy-grid'},
      {type:'p',html:'В NumPy выражение <code>a * 2</code> умножает каждый элемент на 2. Обычный список Python при умножении на 2 повторяет свои элементы.'},
      {type:'example',title:'Выбор столбца',given:'Массив a формы (2, 3).',find:'Взять второй столбец целиком.',steps:['Двоеточие в первой позиции означает все строки.','Номер второго столбца равен 1.'],answer:'<code>a[:, 1]</code> вернёт 2 и 5.'},
      {type:'exercise',title:'Форма массива',prompt:'Какова форма <code>np.array([[2,4],[6,8],[10,12]])</code>?',hint:'Считай внешние списки и числа внутри одного списка.',solution:'Три строки и два столбца: <code>(3, 2)</code>.'}
    ]},
    {id:'numpy-ops',title:'Операции и оси',lead:'NumPy умеет считать по строкам, столбцам и всему массиву.',blocks:[
      {type:'p',html:'<code>a.mean()</code> считает среднее всех чисел. <code>axis=0</code> собирает значения по строкам и оставляет результат для каждого столбца. <code>axis=1</code> даёт результат для каждой строки.'},
      {type:'code',language:'python',code:'import numpy as np\n\na = np.array([[1, 2, 3],\n              [4, 5, 6]])\n\nprint(a.mean(axis=0))\nprint(a.mean(axis=1))\nprint(a[:, 0] + 10)',output:'[2.5 3.5 4.5]\n[2. 5.]\n[11 14]'},
      {type:'p',html:'<strong>Broadcasting</strong> помогает совместить формы массивов при операции. Например, к каждому числу столбца можно прибавить одно число. Проверяй <code>shape</code>, если результат кажется неожиданным.'},
      {type:'example',title:'Средний балл по ученикам',given:'Строки — ученики, столбцы — три работы.',find:'Среднее трёх работ для каждого ученика.',steps:['Нужно одно число для каждой строки.','Усредняем значения внутри строки, то есть axis=1.'],answer:'<code>scores.mean(axis=1)</code>.'},
      {type:'exercise',title:'Что вернётся?',prompt:'Массив имеет форму (4, 3). Какую форму имеет <code>a.sum(axis=0)</code>?',hint:'После суммирования остаётся число для каждого столбца.',solution:'Одномерный массив формы <code>(3,)</code>.'}
    ]},
    {id:'sklearn-fit',title:'Обучение LinearRegression',lead:'scikit-learn подбирает веса по признакам X и известным ответам y.',blocks:[
      {type:'p',html:'<strong>X</strong> — таблица формы (число объектов, число признаков). <strong>y</strong> — одномерный набор ответов. Даже для одного признака X остаётся таблицей: <code>[[0], [1], [2]]</code>.'},
      {type:'code',language:'python',code:'from sklearn.linear_model import LinearRegression\n\nX = [[0], [1], [2], [3], [4]]\ny = [1, 2, 2, 4, 5]\n\nmodel = LinearRegression()\nmodel.fit(X, y)\nprint(model.intercept_)\nprint(model.coef_)\nprint(model.predict([[3], [5]]))',output:'Свободный член ≈ 0.8; вес [1.]; прогнозы [3.8, 5.8].'},
      {type:'p',html:'<code>intercept_</code> — свободный член, <code>coef_</code> — веса по порядку столбцов X. Если столбцов три, весов тоже три. Каждый вес описывает изменение прогноза при росте своего признака на 1 и неизменных остальных.'},
      {type:'example',title:'Два признака',given:'Строка [50, 3] означает площадь 50 м² и 3 комнаты.',find:'Как передать один новый объект в predict?',steps:['Модель ожидает таблицу строк.','Одна строка нового объекта — [50, 3].','Добавь внешний список.'],answer:'<code>model.predict([[50, 3]])</code>, если модель обучалась на двух признаках в том же порядке.'},
      {type:'exercise',title:'Найди форму',prompt:'X содержит 80 учеников по трём признакам. Какова форма X и длина <code>coef_</code>?',hint:'Строки — ученики, столбцы — признаки.',solution:'Форма X: (80, 3). В <code>coef_</code> три веса.'}
    ]},
    {id:'evaluation',title:'Проверка качества модели',lead:'Модель должна работать на новых данных, а не запоминать обучающие.',blocks:[
      {type:'p',html:'Раздели данные на <strong>train</strong> и <strong>test</strong>. Подбирай веса только на train, а ошибки считай на test. Иначе оценка качества будет слишком оптимистичной.'},
      {type:'code',language:'python',code:'from sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_absolute_error\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.25, random_state=42\n)\nmodel = LinearRegression().fit(X_train, y_train)\npred = model.predict(X_test)\nprint(mean_absolute_error(y_test, pred))',output:'MAE — средний размер ошибки в единицах y.'},
      {type:'formula',title:'Ошибки прогноза',tex:String.raw`\mathrm{MAE}=\frac{1}{m}\sum_{i=1}^{m}|y_i-\hat y_i|,\qquad \mathrm{RMSE}=\sqrt{\frac{1}{m}\sum_{i=1}^{m}(y_i-\hat y_i)^2}`,note:'m — число проверочных объектов. RMSE сильнее реагирует на крупные промахи.'},
      {type:'p',html:'<strong>R²</strong> сравнивает модель с прогнозом постоянным средним. На тестовых данных R² может быть отрицательным. При сравнении моделей используй один и тот же test-набор.'},
      {type:'example',title:'Ручной MAE',given:'Ответы [10, 20], прогнозы [12, 17].',find:'MAE.',steps:['Абсолютные ошибки: |10−12| = 2 и |20−17| = 3.','Среднее: (2+3)/2 = 2,5.'],answer:'MAE = 2,5 единицы результата.'},
      {type:'exercise',title:'Где считать ошибку?',prompt:'Модель обучили на 60 строках, ещё 20 отложили. Где честно оценивать MAE?',hint:'Нужны строки, не участвовавшие в fit.',solution:'На 20 отложенных строках test.'}
    ]}
  ]
});
