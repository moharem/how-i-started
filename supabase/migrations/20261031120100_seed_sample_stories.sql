-- Four fictional sample stories so the interface can be tested.
-- They are marked is_sample = true and show a "Sample (fictional)" label.
-- The Arabic ones deliberately mix in English words, numbers and brand names
-- (including lines that start with an English word) to test text direction.

insert into public.stories (
  status, is_sample, published_at, lang,
  business_name, founder_name, industry, industry_other,
  location_type, governorate, city, country,
  year_started, capital_range, capital_exact, currency_note, money_source,
  work_mode, kept_job, team_size_start,
  months_to_revenue, months_to_profit, profit_not_yet, outcome,
  team_size_now, stage_now,
  q_had, q_first_spend, q_hardest, q_first_customer, q_advice
) values
(
  'published', true, now() - interval '3 days', 'ar',
  'بيتزا الحتة', 'كريم عادل', 'food', null,
  'egypt', 'alexandria', 'سيدي بشر', null,
  2019, '10k_50k', 35000, null, 'savings',
  'side', true, 2,
  1, 5, false, 'profitable',
  9, 'محل صغير وخدمة delivery في 3 أحياء',
  'كان معايا 35,000 جنيه من التحويشة، وفرن مستعمل اشتريته من OLX، وأخويا اللي كان بيعرف يعمل العجينة أحسن مني.',
  'Oven مستعمل بـ 12,000 جنيه، والباقي راح في خامات أول شهر وعلب وطباعة menu بسيطة.',
  'Delivery كان أصعب حاجة. أول شهرين كنت بوصّل الطلبات بنفسي بالليل بعد الشغل، وفي يوم الموتوسيكل عطل وخسرنا 6 طلبات مرة واحدة.',
  'Instagram كان أول مكان جبنا منه زباين، قبل ما يبقى عندنا أي محل. أول طلب كان من جارتنا، وهي اللي عملت share للصفحة على Facebook.',
  'ابدأ صغير وانت لسه في شغلك. ماتأجرش محل قبل ما تتأكد إن في ناس بتطلب منك كل أسبوع.'
),
(
  'published', true, now() - interval '2 days', 'ar',
  'كود بالمصري', null, 'education', null,
  'egypt', 'cairo', 'مدينة نصر', null,
  2021, 'zero', 0, null, 'none',
  'side', true, 1,
  3, 4, false, 'profitable',
  4, 'كورسات online وورش للشركات',
  'Laptop قديم ونت البيت، ده كل اللي كان عندي. والمهارة: كنت شغال Data Analyst وبعرف Excel و SQL كويس.',
  'مصرفتش فلوس في الأول خالص. أول 2,000 جنيه دخلوا، اشتريت بيهم microphone كويس عشان الصوت كان وحش.',
  'أول course نزلته محدش اشتراه خالص لمدة شهر. كنت فاكر إن YouTube لوحده هيجيب ناس، وده محصلش.',
  'WhatsApp groups بتاعة زمايلي في الجامعة. عملت session مجانية على Zoom، وفي آخرها 7 أشخاص دفعوا 300 جنيه للكورس الكامل.',
  'مش لازم يكون معاك فلوس عشان تبدأ لو اللي بتبيعه هو مهارة. اسأل الناس الأول هيدفعوا كام، وبعدين اعمل المحتوى.'
),
(
  'published', true, now() - interval '1 day', 'ar',
  'نوبيا هاند ميد', 'منى إدريس', 'crafts', null,
  'egypt', 'aswan', 'غرب سهيل', null,
  2017, 'under_10k', 6000, null, 'family_friends',
  'side', null, 3,
  2, 8, false, 'pivoted',
  6, 'بنبيع online لبره مصر بدل البازار',
  'كان معايا 6,000 جنيه سلف من خالتي، وأمي وأختي بيعرفوا يشتغلوا خرز وخوص من زمان.',
  'خامات: خرز وخوص وقماش. وإيجار ترابيزة صغيرة في البازار السياحي لمدة 3 شهور.',
  'سنة 2017 السياحة كانت ضعيفة جدا، وفي أسابيع كاملة مكناش بنبيع ولا قطعة. هنا قررنا نغيّر الطريقة كلها ونبيع online.',
  'سائحة ألمانية اشترت 10 قطع مرة واحدة، وبعدها بعتتلنا على Instagram تطلب تاني. ده اللي خلانا نفكر في Etsy.',
  'متتمسكش بالخطة الأولى. إحنا بدأنا بازار، ودلوقتي أغلب زباينا من أوروبا، والـ shipping بقى جزء أساسي من الشغل.'
),
(
  'published', true, now(), 'en',
  'Green Box', 'Youssef Hamdy', 'retail', null,
  'egypt', 'giza', 'Sheikh Zayed', null,
  2020, '50k_200k', 120000, null, 'mixed',
  'full_time', false, 3,
  1, null, false, 'closed',
  null, 'Closed after 2 years',
  'About 120,000 EGP: half from my savings and half from my father. I knew a few farmers in Beheira through my uncle, and I had a lot of free time because I had just quit my job.',
  'A used refrigerated van for 70,000 EGP, branded boxes, and a simple ordering page on Shopify.',
  'Fuel and packaging prices kept going up, and I could not raise the box price fast enough. Some weeks we lost money on every single delivery.',
  'A Facebook post in a Sheikh Zayed moms group. Twenty families subscribed in the first week, mostly because the vegetables came straight from the farm.',
  'Do the math on every single order before you grow. I had many customers who loved us, but each delivery cost more than it earned. I would start again, but with fewer areas and a higher price.'
);
