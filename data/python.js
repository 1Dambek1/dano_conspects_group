window.COURSES = window.COURSES || [];
window.COURSES.push({
  id:'python',number:'02',title:'Python с нуля',icon:'{ }',tint:'#e9e9f1',
  lead:'Переменные, типы данных, списки, циклы и функции — спокойно и на коротких примерах.',
  subtitle:'Базовый синтаксис с понятными примерами и небольшими задачами.',
  lessons:[
    {id:'variables',title:'Переменные и типы',lead:'Переменная — имя для значения. Python определяет тип по самому значению.',blocks:[
      {type:'p',html:'Слева от <strong>=</strong> стоит имя, справа — значение или выражение. Запись <code>x = 5</code> означает «сохрани 5 под именем x», а не математическое уравнение.'},
      {type:'code',language:'python',code:'age = 16\nname = "Аня"\nheight = 1.72\npassed = True\n\nprint(name, age)',output:'Аня 16'},
      {type:'p',html:'Базовые типы: <strong>int</strong> — целые числа, <strong>float</strong> — числа с дробной частью, <strong>str</strong> — строки, <strong>bool</strong> — True/False, <strong>None</strong> — отсутствие значения. Тип узнают через <code>type(x)</code>.'},
      {type:'callout',label:'Частая ошибка',html:'<code>"5"</code> — строка, а <code>5</code> — число. Преобразования: <code>int("5")</code>, <code>float("3.2")</code>, <code>str(5)</code>. Результат <code>input()</code> всегда строка.'},
      {type:'example',title:'Почему «2» + «3» не равно 5',given:'<code>a = "2"</code>, <code>b = "3"</code>.',find:'Получить число 5.',steps:['Строки при сложении соединяются: "2" + "3" даёт "23".','Преобразуем обе строки в целые числа.','Складываем числа.'],answer:'<code>int(a) + int(b)</code> даёт 5.'},
      {type:'exercise',title:'Одна строка кода',prompt:'Создай переменную <code>price</code> со значением 120 и выведи цену после скидки 25%.',hint:'Остаётся 75% цены.',solution:'<code>price = 120</code>; затем <code>print(price * 0.75)</code>. Получится 90.0.'}
    ]},
    {id:'conditions',title:'Условия и сравнения',lead:'Условие позволяет выполнить разные действия для разных случаев.',blocks:[
      {type:'p',html:'После <code>if</code> пишут выражение True/False и двоеточие. Строки с отступом образуют блок. <code>elif</code> проверяет следующий вариант, <code>else</code> — все оставшиеся.'},
      {type:'code',language:'python',code:'score = 72\n\nif score >= 80:\n    print("отлично")\nelif score >= 50:\n    print("зачёт")\nelse:\n    print("попробуй ещё")',output:'зачёт'},
      {type:'p',html:'Сравнения: <code>==</code> равно, <code>!=</code> не равно, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Условия соединяют словами <code>and</code>, <code>or</code>, <code>not</code>.'},
      {type:'callout',label:'Важно',html:'<code>=</code> присваивает значение. <code>==</code> сравнивает. В условии часто нужна именно двойная запись.'},
      {type:'example',title:'Проверка диапазона',given:'Балл должен быть от 0 до 100 включительно.',find:'Условие Python.',steps:['Нижняя граница: score >= 0.','Верхняя граница: score <= 100.','Соедини через and или цепочку сравнений.'],answer:'<code>0 <= score <= 100</code>.'},
      {type:'exercise',title:'Чётное или нечётное',prompt:'Напиши условие, печатающее «чётное» для чётного <code>n</code> и «нечётное» иначе.',hint:'Остаток от деления — оператор <code>%</code>.',solution:'<code>if n % 2 == 0:</code> печатай «чётное», в <code>else</code> — «нечётное».'}
    ]},
    {id:'lists-loops',title:'Списки и циклы',lead:'Список хранит значения, а цикл повторяет действие.',blocks:[
      {type:'p',html:'Список создают квадратными скобками. Индекс первого элемента равен 0. <code>nums[0]</code> — первый элемент, <code>nums[-1]</code> — последний. <code>append</code> добавляет элемент в конец.'},
      {type:'code',language:'python',code:'nums = [2, 5, 3]\nnums.append(4)\n\nfor number in nums:\n    print(number * 2)',output:'4\n10\n6\n8'},
      {type:'p',html:'<strong>for</strong> проходит по готовой последовательности. <strong>while</strong> повторяет блок, пока условие истинно. У while важно изменять переменную внутри цикла, иначе он может не закончиться.'},
      {type:'code',language:'python',code:'count = 0\nwhile count < 3:\n    print(count)\n    count += 1',output:'0\n1\n2'},
      {type:'interactive',kind:'python-stepper'},
      {type:'example',title:'Сумма без sum()',given:'Список [2, 5, 3].',find:'Сумму при помощи цикла.',steps:['Создай total = 0.','Для каждого числа добавляй его к total.','После цикла total содержит сумму.'],answer:'<code>total = 0<br>for number in nums:<br>&nbsp;&nbsp;&nbsp;&nbsp;total += number</code><br>Результат — 10.'},
      {type:'exercise',title:'Маленькая практика',prompt:'Для списка [3, 8, 2, 5] выведи только числа больше 4.',hint:'Внутри for поставь if.',solution:'Цикл for с условием <code>if number > 4</code> оставит 8 и 5.'}
    ]},
    {id:'functions',title:'Функции',lead:'Функция даёт имя повторяемому действию и возвращает результат.',blocks:[
      {type:'p',html:'Функцию объявляют через <code>def</code>. Значения в скобках — параметры. <code>return</code> отдаёт результат вызывающему коду и завершает функцию. <code>print</code> лишь показывает текст в консоли.'},
      {type:'code',language:'python',code:'def double(x):\n    return x * 2\n\nresult = double(7)\nprint(result)',output:'14'},
      {type:'p',html:'Переменная, созданная внутри функции, обычно доступна только в ней. Функцию легче проверять, если она делает одно понятное действие.'},
      {type:'example',title:'Среднее значение',given:'Функция получает список [2, 4, 6].',find:'Вернуть среднее и обработать пустой список.',steps:['Если список пуст, верни None: нельзя делить на ноль.','Иначе раздели сумму элементов на их количество.','Вызов average([2,4,6]) вернёт 4.'],answer:'<code>def average(items):<br>&nbsp;&nbsp;&nbsp;&nbsp;if not items: return None<br>&nbsp;&nbsp;&nbsp;&nbsp;return sum(items) / len(items)</code>'},
      {type:'exercise',title:'Функция для проверки',prompt:'Напиши <code>is_even(n)</code>, возвращающую True для чётного числа и False для нечётного.',hint:'Остаток от деления на 2 равен нулю.',solution:'<code>def is_even(n): return n % 2 == 0</code>.'}
    ]}
  ]
});
