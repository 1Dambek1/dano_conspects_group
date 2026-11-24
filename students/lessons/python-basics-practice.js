(function () {
  const course = window.COURSES.find(c => c.id === 'python');
  const p = html => ({type:'p', html});
  const h = text => ({type:'h', text});
  const code = (source, output) => ({type:'code', language:'python', code:source, output});
  const table = (headers, rows) => ({type:'table', headers, rows});
  const tip = (label, html) => ({type:'callout', label, html});
  const task = (title, prompt, hint, solution) => ({type:'exercise', title, prompt, hint, solution});

  course.lessons.push({
    id:'python-basics-drills', title:'Python: переменные и условия · короткие задачи', level:'База',
    lead:'Присваивание, типы, сравнения и if на маленьких примерах с проверяемым ответом.',
    blocks:[
      h('Одна переменная — одно значение сейчас'),
      p('<code>x = 5</code> сохраняет число под именем <code>x</code>. Следующая команда может заменить значение: <code>x = x + 2</code>. В <code>if</code> нужен результат <code>True</code> или <code>False</code>. Для сравнения на равенство пишут <code>==</code>, а не <code>=</code>.'),
      code(String.raw`score = 73
threshold = 60
passed = score >= threshold
print(score, type(score).__name__)
print(passed)

if passed:
    print("зачёт")
else:
    print("пересдача")`, '73 int\nTrue\nзачёт'),
      table(['Запись','Что означает'],[
        ['<code>score = 73</code>','Положить число 73 в переменную score.'],
        ['<code>score >= threshold</code>','Сравнить два числа; результат — логическое значение.'],
        ['<code>if passed:</code>','Выполнить блок с отступом, если условие истинно.'],
        ['<code>int("73")</code>','Превратить текст из ввода в целое число.']
      ]),
      tip('Как решать задачи','Сначала запиши ожидаемый вывод для одного конкретного значения. Затем напиши код и проверь границы: число на единицу ниже порога, ровно на пороге и на единицу выше.'),
      task('1 · поменяй значение','Пусть <code>x = 8</code>. Увеличь <code>x</code> на 3 и выведи результат.','Используй <code>x += 3</code> или <code>x = x + 3</code>.','<code>x = 8; x += 3; print(x)</code> → <code>11</code>.'),
      task('2 · строка или число','В переменной <code>raw = "18"</code> лежит текст. Получи число на 2 больше.','Преобразуй строку с помощью <code>int</code>.','<code>print(int(raw) + 2)</code> → <code>20</code>.'),
      task('3 · границы балла','Напиши условие, которое печатает «верно» только для балла от 0 до 100 включительно. Проверь −1, 0, 100, 101.','В Python можно записать двойное сравнение.','<code>if 0 &lt;= score &lt;= 100: print("верно")</code>. На 0 и 100 условие истинно.'),
      task('4 · три категории','Для <code>score</code> напечатай «отлично» при 80+, «зачёт» при 60–79, иначе «пересдача».','Порядок: <code>if score >= 80</code>, затем <code>elif score >= 60</code>.','<code>if score >= 80: print("отлично")</code>; <code>elif score >= 60: print("зачёт")</code>; <code>else: print("пересдача")</code>.'),
      task('5 · два условия','Человек проходит, если балл не меньше 60 <em>и</em> присутствие не меньше 75%. Напиши логическое выражение.','Соедини сравнения словом <code>and</code>.','<code>passed = score >= 60 and attendance >= 75</code>.')
    ]
  });

  course.lessons.push({
    id:'python-lists-drills', title:'Python: списки как массивы', level:'База',
    lead:'Индексы, срезы, добавление, изменение и вложенные списки — прежде чем брать pandas и NumPy.',
    blocks:[
      h('Список хранит элементы по порядку'),
      p('В базовом Python роль простого массива обычно играет <strong>список</strong> (<code>list</code>). Первый элемент имеет индекс 0. <code>scores[-1]</code> — последний. Срез <code>scores[1:3]</code> включает индексы 1 и 2, но не 3. Список изменяемый: можно заменить элемент или добавить новый.'),
      code(String.raw`scores = [58, 73, 91, 64]
print(scores[0], scores[-1])
print(scores[1:3])

scores[0] = 60
scores.append(88)
print(scores)
print(len(scores))`, '58 64\n[73, 91]\n[60, 73, 91, 64, 88]\n5'),
      table(['Действие','Пример','Результат'],[
        ['Взять элемент','<code>scores[2]</code>','Значение по индексу 2.'],
        ['Взять срез','<code>scores[:2]</code>','Новый список из первых двух элементов.'],
        ['Заменить элемент','<code>scores[0] = 60</code>','Исходный список изменится.'],
        ['Добавить в конец','<code>scores.append(88)</code>','Список станет длиннее на один элемент.'],
        ['Посчитать элементы','<code>len(scores)</code>','Длина списка.']
      ]),
      tip('Список и NumPy','Список — базовый тип Python: удобен для хранения любых элементов и изучения циклов. Массив NumPy (<code>numpy.ndarray</code>) — отдельный тип для быстрых числовых операций. Например, <code>[1, 2] * 2</code> повторит список, а <code>np.array([1, 2]) * 2</code> умножит оба числа.'),
      task('1 · индексы','Для <code>names = ["Аня", "Борис", "Вера", "Глеб"]</code> выведи первый и последний элементы.','Индексы 0 и −1.','<code>print(names[0], names[-1])</code> → <code>Аня Глеб</code>.'),
      task('2 · срез','Из списка <code>[10, 20, 30, 40, 50]</code> получи новый список <code>[20, 30, 40]</code>.','Начало включается, конец среза — нет.','<code>numbers[1:4]</code> → <code>[20, 30, 40]</code>.'),
      task('3 · изменить и добавить','Начни со списка <code>[2, 4, 6]</code>. Замени 4 на 5, добавь 8 и получи <code>[2, 5, 6, 8]</code>.','Замена по индексу, затем <code>append</code>.','<code>numbers[1] = 5; numbers.append(8)</code>.'),
      task('4 · удалить по значению и индексу','В списке <code>[5, 8, 5, 9]</code> удали первое значение 5, затем элемент с индексом 1. Что останется?','<code>remove(5)</code> удаляет первое совпадение; <code>pop(1)</code> удаляет по индексу.','После <code>remove(5)</code>: <code>[8, 5, 9]</code>; после <code>pop(1)</code>: <code>[8, 9]</code>.'),
      task('5 · вложенный список','В <code>grid = [[1, 2], [3, 4]]</code> найди число 3 и замени его на 7.','Сначала индекс строки, затем индекс внутри строки.','<code>grid[1][0]</code> равно 3; <code>grid[1][0] = 7</code>.'),
      task('6 · список и число','Предскажи результаты <code>[1, 2] * 2</code> и <code>[1, 2] + [3]</code>.','Для списков <code>*</code> повторяет, а <code>+</code> склеивает.','<code>[1, 2, 1, 2]</code> и <code>[1, 2, 3]</code>.')
    ]
  });

  course.lessons.push({
    id:'python-loops-drills', title:'Python: циклы по спискам', level:'База',
    lead:'for, range, enumerate, while, счётчик и сбор нового списка на коротких задачах.',
    blocks:[
      h('Цикл повторяет действие для элементов'),
      p('<code>for value in scores</code> берёт сами значения. <code>for i, value in enumerate(scores)</code> даёт и индекс, и значение. <code>range(5)</code> даёт числа 0, 1, 2, 3, 4. <code>while</code> используют, когда нужно повторять действие до выполнения условия.'),
      code(String.raw`scores = [58, 73, 91, 73]
total = 0
high = []

for i, score in enumerate(scores):
    total += score
    if score >= 70:
        high.append(i)

print(total)
print(high)`, '295\n[1, 2, 3]'),
      table(['Строка','Смысл'],[
        ['<code>total = 0</code>','Начальная сумма перед циклом.'],
        ['<code>enumerate(scores)</code>','На каждом шаге получаем пару: индекс и балл.'],
        ['<code>total += score</code>','Добавляем очередной балл к накопленной сумме.'],
        ['<code>high.append(i)</code>','Сохраняем индекс подходящего балла, а не сам балл.']
      ]),
      task('1 · сумма циклом','Для <code>[3, 5, 2]</code> найди сумму через <code>for</code>, не вызывая <code>sum</code>.','Заведи <code>total = 0</code> до цикла.','<code>numbers = [3, 5, 2]<br>total = 0<br>for x in numbers:<br>&nbsp;&nbsp;&nbsp;&nbsp;total += x<br>print(total)</code> → 10.'),
      task('2 · счётчик','В <code>[58, 73, 91, 73]</code> посчитай, сколько баллов не меньше 70.','Начни с <code>count = 0</code>; увеличивай при подходящем условии.','<code>count = 0</code>; в цикле <code>if score >= 70: count += 1</code>. Ответ 3.'),
      task('3 · новый список','Из <code>[1, 2, 3, 4, 5]</code> циклом собери квадраты только чётных чисел.','Заведи пустой список; внутри цикла совмести <code>if</code> и <code>append</code>.','<code>result = []</code>; внутри <code>if x % 2 == 0: result.append(x ** 2)</code>. Получится <code>[4, 16]</code>.'),
      task('4 · найди все индексы','В списке <code>[5, 7, 5, 9]</code> найди индексы всех пятёрок.','Нужен <code>enumerate</code>, потому что ответ — позиции.','<code>indices = [i for i, value in enumerate(numbers) if value == 5]</code> → <code>[0, 2]</code>. То же можно написать обычным циклом.'),
      task('5 · range','Выведи числа от 1 до 5 включительно циклом <code>for</code>.','Правая граница <code>range</code> не включается.','<code>for n in range(1, 6): print(n)</code>.'),
      task('6 · while','Найди минимальное положительное <code>n</code>, при котором <code>1 + 2 + ... + n > 10</code>.','В <code>while total <= 10</code> увеличивай <code>n</code> и <code>total</code>.','При <code>n = 4</code> сумма 10; при <code>n = 5</code> сумма 15. Ответ 5.'),
      tip('Где остановиться','Если используешь <code>while</code>, проверь, что переменная в условии действительно меняется. Иначе цикл может выполняться бесконечно.')
    ]
  });

  course.lessons.push({
    id:'python-functions-drills', title:'Python: функции на списках', level:'База',
    lead:'Параметры, return, пустой список и объединение функции с циклом.',
    blocks:[
      h('Функция получает данные и возвращает ответ'),
      p('<code>def</code> задаёт функцию. Значения в скобках при объявлении — параметры; при вызове мы передаём аргументы. <code>return</code> возвращает результат в основной код. <code>print</code> только показывает его на экране.'),
      code(String.raw`def count_passed(scores, threshold=60):
    count = 0
    for score in scores:
        if score >= threshold:
            count += 1
    return count

result = count_passed([58, 73, 91, 73])
print(result)
print(count_passed([58, 73, 91, 73], threshold=80))`, '3\n1'),
      table(['Часть','Что она делает'],[
        ['<code>scores</code>','Список, который получает функция.'],
        ['<code>threshold=60</code>','Значение по умолчанию; его можно заменить при вызове.'],
        ['<code>return count</code>','Отдаёт число вызывающему коду.'],
        ['<code>result = count_passed(...)</code>','Сохраняет возвращённый результат.']
      ]),
      task('1 · удвоить','Напиши <code>double(x)</code>, которая возвращает удвоенное число. Проверь на 4 и −3.','Внутри функции нужен <code>return</code>.','<code>def double(x): return x * 2</code>. Результаты 8 и −6.'),
      task('2 · среднее','Напиши <code>average(numbers)</code>: верни среднее, а для пустого списка — <code>None</code>.','Проверь <code>if not numbers</code> до деления.','<code>def average(numbers):</code> затем <code>if not numbers: return None</code>, иначе <code>return sum(numbers) / len(numbers)</code>.'),
      task('3 · фильтр как функция','Напиши <code>above_threshold(numbers, threshold)</code>, возвращающую список чисел не меньше порога. Для <code>[3, 8, 5]</code> и порога 5 ответ <code>[8, 5]</code>.','Создай пустой список, заполняй его в цикле и верни после цикла.','<code>result = []</code>; для каждого <code>x</code>: <code>if x >= threshold: result.append(x)</code>; затем <code>return result</code>.'),
      task('4 · максимум без max','Напиши <code>index_of_max(numbers)</code>, возвращающую индекс первого максимума. Для пустого списка верни <code>None</code>; для <code>[5, 9, 9]</code> — 1.','Храни индекс лучшего элемента; обновляй его только при строгом <code>&gt;</code>.','После проверки пустого списка начни с <code>best = 0</code>. В цикле по индексам: <code>if numbers[i] &gt; numbers[best]: best = i</code>. Верни <code>best</code>.'),
      task('5 · поиск ближайшего','Напиши <code>nearest_distance(distances)</code>: верни наименьшее число из списка расстояний, а для пустого списка — <code>None</code>.','Сначала можно использовать встроенный <code>min</code>; затем попробовать цикл.','<code>def nearest_distance(distances): return min(distances) if distances else None</code>.'),
      tip('Проверка функции','После объявления вызови функцию несколько раз: обычный случай, пустой список, граничное значение и повторяющийся максимум. Так ошибки в логике обнаружатся до большого кейса.')
    ]
  });
})();
