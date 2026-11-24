# Практикум

[Открыть практикум на сайте](https://1dambek1.github.io/dano_conspects_group/#trainer)

Двенадцать блоков содержат 154 короткие задачи на написание кода и 12 больших самостоятельных работ. Есть отдельный блок сборки кейса из двух волн опроса через `pd.concat`, `merge`, `agg`, `transform` и `pivot`, а также блоки NumPy (`axis`, `argmax`, `argmin`, broadcasting) и Matplotlib. Ответы к большим работам не опубликованы. Галочки у микрозадач сохраняются в браузере, где они были поставлены.

## Данные доставки

| CSV | Строки | Смысл строки |
| --- | ---: | --- |
| [customers.csv](data/customers.csv) | 240 | клиент |
| [restaurants.csv](data/restaurants.csv) | 32 | ресторан |
| [orders.csv](data/orders.csv) | 1400 | заказ |
| [order_items.csv](data/order_items.csv) | 3535 | позиция заказа |

Связи: `orders.customer_id → customers.customer_id`, `orders.restaurant_id → restaurants.restaurant_id`, `order_items.order_id → orders.order_id`. Позиции отменённых заказов есть в файле, но их `paid_rub` равен нулю. После соединения заказа с позициями одна сумма `paid_rub` повторяется на нескольких строках. Пропуски возраста, оценки и времени доставки задуманы как часть практики.

## Данные для сборки кейса pandas

| CSV | Строки | Смысл строки |
| --- | ---: | --- |
| [survey_september.csv](data/survey_september.csv) | 120 | ответ человека в сентябре |
| [survey_october.csv](data/survey_october.csv) | 121 | ответ человека в октябре, включая один точный повтор |
| [survey_districts.csv](data/survey_districts.csv) | 8 | один район города |

`respondent_id` — ID человека, `district_id` — код района, `mode` — транспорт, `travel_min` / `travel_minutes` — время поездки, `satisfaction` — оценка от 1 до 5. В октябре название колонки времени отличается намеренно. В справочнике есть `district_name`, `zone`, `population`; код района 99 из некоторых октябрьских ответов в справочнике отсутствует. После удаления точного повтора 90 человек присутствуют в обеих волнах; число пар с двумя известными временами меньше из-за пропусков.

Сначала пройдите [цепочку уроков pandas](https://1dambek1.github.io/dano_conspects_group/#pandas/case-pipeline), затем [20 задач и большую работу](https://1dambek1.github.io/dano_conspects_group/#trainer/pandas-case). Файлы можно воспроизвести через `python students/tools/generate_pandas_case.py` из корня сайта.

Значения синтетические. Данные по маршрутам, жителям, квартирам и парадоксу Симпсона берутся из [общего набора студентов](../README.md). В каждом блоке сайта показаны только нужные для него ссылки.

## Как работать

Скачайте данные нужного блока, скопируйте стартовый код, решите микрозадачи в `.py` или ноутбуке, затем большую работу. Для задач с графиками подпишите оси и единицы измерения. Нужные библиотеки: `pandas`, `numpy`, `matplotlib`, `scipy`, `scikit-learn`, `statsmodels`. Код можно присылать на проверку по одной задаче.
