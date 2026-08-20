(() => {
  'use strict';

  const API_URL = '/api/ato-assistant';
  const MANAGER_WA = '905387045999';
  const STORAGE_KEY = 'ato_assistant_history_v1';
  const SESSION_KEY = 'ato_assistant_session_v1';
  const MAX_HISTORY = 12;
  const AGENT_STATE_KEY = 'ato_sales_agent_state_v2';
  const CONTACT_KEY = 'ato_sales_agent_contact_v1';

  const I18N = {
    en:{
      ask:'ASK SOMETHING', title:'ASSISTANT', status:'AI ASSISTANT · MANAGER READY',
      intro:'Hello. I can help with tours, prices, children, transfers, schedules and booking.',
      placeholder:'Ask about tours, prices, children…', send:'Send', manager:'Talk to Manager',
      chips:['Find a tour','With children','Prices','Pickup & transfer','What do you recommend?'],
      thinking:'Looking into it…', unavailable:'The assistant is being connected. A manager can help you now.',
      retry:'Please try again.', close:'Close', reset:'New chat', managerLead:'Send this conversation to ATO Manager'
    },
    ru:{
      ask:'СПРОСИТЬ', title:'АССИСТЕНТ', status:'AI-ПОМОЩНИК · МЕНЕДЖЕР НА СВЯЗИ',
      intro:'Здравствуйте. Я помогу с турами, ценами, детьми, трансфером, расписанием и бронированием.',
      placeholder:'Спросите о турах, ценах, детях…', send:'Отправить', manager:'Связаться с менеджером',
      chips:['Подобрать тур','С детьми','Цены','Трансфер','Что посоветуете?'],
      thinking:'Уточняю…', unavailable:'Ассистент сейчас подключается. Менеджер может помочь вам прямо сейчас.',
      retry:'Попробуйте ещё раз.', close:'Закрыть', reset:'Новый чат', managerLead:'Передать этот диалог менеджеру ATO'
    },
    tr:{
      ask:'BİR ŞEY SORUN', title:'ASİSTAN', status:'AI ASİSTAN · YÖNETİCİ HAZIR',
      intro:'Merhaba. Turlar, fiyatlar, çocuklar, transfer, program ve rezervasyon konusunda yardımcı olabilirim.',
      placeholder:'Turlar, fiyatlar, çocuklar hakkında sorun…', send:'Gönder', manager:'Yöneticiye Bağlan',
      chips:['Tur bul','Çocuklarla','Fiyatlar','Transfer','Ne önerirsiniz?'],
      thinking:'Kontrol ediyorum…', unavailable:'Asistan bağlantısı hazırlanıyor. Yöneticimiz şimdi yardımcı olabilir.',
      retry:'Lütfen tekrar deneyin.', close:'Kapat', reset:'Yeni sohbet', managerLead:'Bu konuşmayı ATO yöneticisine gönder'
    },
    de:{
      ask:'ETWAS FRAGEN', title:'ASSISTENT', status:'AI-ASSISTENT · MANAGER BEREIT',
      intro:'Hallo. Ich helfe bei Touren, Preisen, Kindern, Transfer, Zeitplan und Buchung.',
      placeholder:'Fragen Sie nach Touren, Preisen, Kindern…', send:'Senden', manager:'Mit Manager sprechen',
      chips:['Tour finden','Mit Kindern','Preise','Transfer','Was empfehlen Sie?'],
      thinking:'Ich prüfe das…', unavailable:'Der Assistent wird gerade verbunden. Unser Manager kann jetzt helfen.',
      retry:'Bitte versuchen Sie es erneut.', close:'Schließen', reset:'Neuer Chat', managerLead:'Diesen Chat an den ATO Manager senden'
    },
    pl:{
      ask:'ZAPYTAJ', title:'ASYSTENT', status:'ASYSTENT AI · MENEDŻER GOTOWY',
      intro:'Dzień dobry. Pomogę w sprawie wycieczek, cen, dzieci, transferu, terminów i rezerwacji.',
      placeholder:'Zapytaj o wycieczki, ceny, dzieci…', send:'Wyślij', manager:'Połącz z menedżerem',
      chips:['Znajdź wycieczkę','Z dziećmi','Ceny','Transfer','Co polecacie?'],
      thinking:'Sprawdzam…', unavailable:'Asystent jest właśnie podłączany. Menedżer może pomóc od razu.',
      retry:'Spróbuj ponownie.', close:'Zamknij', reset:'Nowy czat', managerLead:'Wyślij tę rozmowę do menedżera ATO'
    }
  };

  const $ = (s, root=document) => root.querySelector(s);
  const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function lang(){
    const raw=(localStorage.getItem('atoLanguage') || document.documentElement.lang || localStorage.getItem('siteLanguage') || localStorage.getItem('language') || 'en').toLowerCase();
    const l=raw.slice(0,2);
    return I18N[l] ? l : 'en';
  }
  function T(){ return I18N[lang()]; }

  // Current visitor message can use a different language than the site UI.
  function messageLangHint(text){
    const s=String(text||'').trim();
    if(!s) return 'auto';
    if(/[\u3040-\u30ff]/u.test(s)) return 'ja';
    if(/[\uac00-\ud7af]/u.test(s)) return 'ko';
    if(/[\u4e00-\u9fff]/u.test(s)) return 'zh';
    if(/[\u0600-\u06ff]/u.test(s)) return 'ar';
    if(/[\u0590-\u05ff]/u.test(s)) return 'he';
    if(/[\u0370-\u03ff]/u.test(s)) return 'el';
    if(/[\u0900-\u097f]/u.test(s)) return 'hi';
    if(/[\u0e00-\u0e7f]/u.test(s)) return 'th';
    if(/[\u10a0-\u10ff]/u.test(s)) return 'ka';
    if(/[\u0530-\u058f]/u.test(s)) return 'hy';
    if(/[іїєґІЇЄҐ]/u.test(s)) return 'uk';
    if(/[А-Яа-яЁё]/u.test(s)) return 'ru';
    return 'auto';
  }



  const CONTEXT_I18N = {
    en:{
      home:{title:'TRAVEL ASSISTANT',status:'AI TRAVEL COMPANION · ATO',intro:'Tell me what kind of day you want. I can narrow the site to the experiences that fit you.',chips:['Find my perfect tour','Family with children','Best tours for my budget','Build a 3-day plan','What do you recommend?']},
      category:{title:'CHOICE ASSISTANT',status:'AI · CHOOSE WITH CONFIDENCE',intro:'I can compare the experiences on this page and help you narrow the choice.',chips:['Best for families','Best value','Shortest transfer','Compare top options','Which one fits me?']},
      tour:{title:'TOUR ASSISTANT',status:'AI · THIS EXPERIENCE',intro:'Ask me about this exact experience — price rules, children, transfer, timing, inclusions or what to bring.',chips:['Is it good with children?','What is included?','Pickup & transfer','What should I bring?','Compare this tour']},
      map:{title:'ASK THE MAP',status:'AI · MAP CONTEXT',intro:'I can help you use the map as a travel decision tool — nearby experiences, transfer logic and combinations.',chips:['What is closest to me?','Tours within 30 minutes','Best nearby with children','What can I combine?','Show me quieter options']},
      planner:{title:'TRIP PLANNER AI',status:'AI · BUILD MY ITINERARY',intro:'I can turn your selected tours into a balanced itinerary and flag weak combinations.',chips:['Build my itinerary','Review my selected tours','Balance active and relaxed days','What should I remove?','Plan around children']},
      compare:{title:'COMPARE WITH AI',status:'AI · DECISION SUPPORT',intro:'I can analyse the tours you selected and explain the trade-offs instead of just repeating the table.',chips:['Which one should I choose?','Best for a family','Best value','Least tiring option','Compare transfer and duration']},
      offer:{title:'OFFER ASSISTANT',status:'AI · SPECIAL OFFERS',intro:'I can explain Group & Event Offers, Journey of the Heart and Gift Certificates without inventing a discount.',chips:['Find my best offer','Group & Event Offer','Journey of the Heart','Gift Certificate','Calculate the logic for my group']},
      booking:{title:'BOOKING ASSISTANT',status:'AI · BOOKING HELP',intro:'I can explain the booking steps and the information ATO needs. Final availability and confirmation stay with ATO.',chips:['What happens next?','Pickup information','Children in booking','Cancellation rules','Talk to manager']},
      ticket:{title:'TRIP ASSISTANT',status:'AI · YOUR CONFIRMED TRIP',intro:'I can help you prepare for the experience shown on this e-ticket using its trip details and verified tour information.',chips:['What time is pickup?','What should I bring?','Tour-day checklist','Explain my tour','Contact ATO']},
      generic:{title:'AI ASSISTANT',status:'AI TRAVEL COMPANION · ATO',intro:'I can help you navigate ATO, choose experiences and understand the booking process.',chips:['Find a tour','With children','Prices','Pickup & transfer','What do you recommend?']}
    },
    ru:{
      home:{title:'TRAVEL ASSISTANT',status:'AI TRAVEL COMPANION · ATO',intro:'Скажите, какой отдых вы хотите. Я помогу быстро сузить выбор до подходящих впечатлений.',chips:['Подбери мне идеальный тур','Мы с детьми','Лучшее в моём бюджете','Составь план на 3 дня','Что посоветуешь?']},
      category:{title:'ПОМОЩНИК ВЫБОРА',status:'AI · ВЫБИРАЙТЕ УВЕРЕННО',intro:'Я могу сравнить варианты на этой странице и отсеять слабые для вашей ситуации.',chips:['Лучшее для семьи','Лучшее по цене','Самый короткий трансфер','Сравни лучшие варианты','Что подходит мне?']},
      tour:{title:'ПОМОЩНИК ПО ТУРУ',status:'AI · ЭТА ЭКСКУРСИЯ',intro:'Спросите именно об этой экскурсии: цены, дети, трансфер, время, что включено и что взять.',chips:['Подойдёт с детьми?','Что включено?','Трансфер и посадка','Что взять с собой?','Сравни эту экскурсию']},
      map:{title:'СПРОСИТЬ КАРТУ',status:'AI · КОНТЕКСТ КАРТЫ',intro:'Я помогу использовать карту для выбора: что ближе, сколько ехать и что логично совместить.',chips:['Что ближе всего ко мне?','Туры до 30 минут','Лучшее рядом с детьми','Что можно совместить?','Покажи спокойные варианты']},
      planner:{title:'AI TRIP PLANNER',status:'AI · СОБЕРЁМ МАРШРУТ',intro:'Я превращу выбранные экскурсии в сбалансированный план и укажу слабые сочетания.',chips:['Составь мой маршрут','Проверь выбранные туры','Чередуй активный и спокойный отдых','Что лучше убрать?','Спланируй с детьми']},
      compare:{title:'СРАВНИТЬ С AI',status:'AI · ПОМОЩЬ В РЕШЕНИИ',intro:'Я разберу выбранные туры по сути и объясню компромиссы, а не просто повторю таблицу.',chips:['Что выбрать?','Лучшее для семьи','Лучшее по цене','Наименее утомительный','Сравни трансфер и длительность']},
      offer:{title:'ПОМОЩНИК ПО ОФФЕРАМ',status:'AI · SPECIAL OFFERS',intro:'Я объясню Group & Event Offers, Journey of the Heart и Gift Certificate без выдуманных скидок.',chips:['Найди лучший оффер','Group & Event Offer','Journey of the Heart','Gift Certificate','Рассчитай логику для группы']},
      booking:{title:'ПОМОЩНИК БРОНИРОВАНИЯ',status:'AI · ПОМОЩЬ С ЗАЯВКОЙ',intro:'Я объясню шаги бронирования и какие данные нужны ATO. Наличие и финальное подтверждение остаются за ATO.',chips:['Что будет дальше?','Информация о трансфере','Дети в бронировании','Правила отмены','Связаться с менеджером']},
      ticket:{title:'TRIP ASSISTANT',status:'AI · ВАША ПОЕЗДКА',intro:'Я помогу подготовиться к экскурсии из этого e-ticket по данным билета и проверенной информации о туре.',chips:['Во сколько трансфер?','Что взять с собой?','Чек-лист на день тура','Расскажи о моём туре','Связаться с ATO']},
      generic:{title:'AI АССИСТЕНТ',status:'AI TRAVEL COMPANION · ATO',intro:'Я помогу найти экскурсию, разобраться в деталях и пройти бронирование.',chips:['Подобрать тур','С детьми','Цены','Трансфер','Что посоветуете?']}
    },
    tr:{
      home:{title:'SEYAHAT ASİSTANI',status:'AI TRAVEL COMPANION · ATO',intro:'Nasıl bir gün istediğinizi söyleyin; size uygun deneyimleri hızlıca daraltayım.',chips:['Bana uygun tur bul','Çocuklarla seyahat','Bütçeme en uygun','3 günlük plan yap','Ne önerirsin?']},
      category:{title:'SEÇİM ASİSTANI',status:'AI · GÜVENLE SEÇİN',intro:'Bu sayfadaki deneyimleri karşılaştırıp size uymayanları eleyebilirim.',chips:['Aileler için en iyi','En iyi fiyat/değer','En kısa transfer','En iyileri karşılaştır','Bana hangisi uygun?']},
      tour:{title:'TUR ASİSTANI',status:'AI · BU DENEYİM',intro:'Bu tur hakkında fiyat kuralları, çocuklar, transfer, süre, dahil olanlar ve hazırlık konusunda sorun.',chips:['Çocuklarla uygun mu?','Neler dahil?','Pickup ve transfer','Yanıma ne almalıyım?','Bu turu karşılaştır']},
      map:{title:'HARİTAYA SOR',status:'AI · HARİTA BAĞLAMI',intro:'Haritayı karar aracı olarak kullanmanıza yardım ederim: yakın turlar, transfer ve kombinasyonlar.',chips:['Bana en yakın ne var?','30 dakika içindeki turlar','Çocuklarla yakındaki en iyi','Neleri birleştirebilirim?','Daha sakin seçenekler']},
      planner:{title:'AI TRIP PLANNER',status:'AI · ROTA OLUŞTUR',intro:'Seçtiğiniz turları dengeli bir programa dönüştürür, zayıf kombinasyonları işaretlerim.',chips:['Programımı oluştur','Seçimlerimi incele','Aktif ve sakin günleri dengele','Neyi çıkarmalıyım?','Çocuklarla planla']},
      compare:{title:'AI İLE KARŞILAŞTIR',status:'AI · KARAR DESTEĞİ',intro:'Seçilen turların gerçek farklarını ve ödünleşimleri açıklayabilirim.',chips:['Hangisini seçmeliyim?','Aile için en iyi','En iyi değer','En az yorucu','Transfer ve süreyi karşılaştır']},
      offer:{title:'TEKLİF ASİSTANI',status:'AI · SPECIAL OFFERS',intro:'Group & Event Offers, Journey of the Heart ve Gift Certificate seçeneklerini doğrulanmış kurallarla açıklarım.',chips:['En iyi teklifimi bul','Group & Event Offer','Journey of the Heart','Gift Certificate','Grup mantığını hesapla']},
      booking:{title:'REZERVASYON ASİSTANI',status:'AI · REZERVASYON YARDIMI',intro:'Rezervasyon adımlarını ve ATO’nun ihtiyaç duyduğu bilgileri açıklarım. Nihai onay ATO’dadır.',chips:['Sonra ne olacak?','Transfer bilgisi','Rezervasyonda çocuklar','İptal kuralları','Yöneticiyle konuş']},
      ticket:{title:'TRIP ASSISTANT',status:'AI · SEYAHATİNİZ',intro:'Bu e-biletteki tur için bilet bilgileri ve doğrulanmış tur verileriyle hazırlanmanıza yardımcı olurum.',chips:['Pickup saatim nedir?','Ne almalıyım?','Tur günü kontrol listesi','Turumu açıkla','ATO ile iletişim']},
      generic:{title:'AI ASİSTAN',status:'AI TRAVEL COMPANION · ATO',intro:'Tur seçimi, detaylar ve rezervasyon sürecinde yardımcı olurum.',chips:['Tur bul','Çocuklarla','Fiyatlar','Transfer','Ne önerirsiniz?']}
    },
    de:{
      home:{title:'REISEASSISTENT',status:'AI TRAVEL COMPANION · ATO',intro:'Sagen Sie mir, welchen Tag Sie sich wünschen. Ich grenze die passenden Erlebnisse ein.',chips:['Meine perfekte Tour finden','Mit Kindern','Bestes in meinem Budget','3-Tage-Plan erstellen','Was empfehlen Sie?']},
      category:{title:'AUSWAHL-ASSISTENT',status:'AI · SICHER ENTSCHEIDEN',intro:'Ich kann die Optionen auf dieser Seite vergleichen und die schwächeren für Ihre Situation aussortieren.',chips:['Am besten für Familien','Bestes Preis-Leistungs-Verhältnis','Kürzester Transfer','Top-Optionen vergleichen','Was passt zu mir?']},
      tour:{title:'TOUR-ASSISTENT',status:'AI · DIESE TOUR',intro:'Fragen Sie genau zu dieser Tour: Preisregeln, Kinder, Transfer, Zeiten, Leistungen und Vorbereitung.',chips:['Gut mit Kindern?','Was ist inklusive?','Pickup & Transfer','Was mitbringen?','Diese Tour vergleichen']},
      map:{title:'KARTE FRAGEN',status:'AI · KARTENKONTEXT',intro:'Ich nutze die Karte als Entscheidungshilfe: Nähe, Transferlogik und sinnvolle Kombinationen.',chips:['Was ist mir am nächsten?','Touren innerhalb 30 Minuten','Beste Option mit Kindern','Was kann ich kombinieren?','Ruhigere Optionen']},
      planner:{title:'AI TRIP PLANNER',status:'AI · ROUTE BAUEN',intro:'Ich mache aus Ihren ausgewählten Touren einen ausgewogenen Reiseplan und markiere schwache Kombinationen.',chips:['Reiseplan erstellen','Meine Auswahl prüfen','Aktive und ruhige Tage ausgleichen','Was sollte ich streichen?','Mit Kindern planen']},
      compare:{title:'MIT AI VERGLEICHEN',status:'AI · ENTSCHEIDUNGSHILFE',intro:'Ich erkläre die echten Unterschiede Ihrer ausgewählten Touren statt nur die Tabelle zu wiederholen.',chips:['Was soll ich wählen?','Beste Familientour','Bestes Preis-Leistungs-Verhältnis','Am wenigsten anstrengend','Transfer und Dauer vergleichen']},
      offer:{title:'ANGEBOTS-ASSISTENT',status:'AI · SPECIAL OFFERS',intro:'Ich erkläre Group & Event Offers, Journey of the Heart und Gift Certificate nach verifizierten Regeln.',chips:['Bestes Angebot finden','Group & Event Offer','Journey of the Heart','Gift Certificate','Gruppenlogik berechnen']},
      booking:{title:'BUCHUNGS-ASSISTENT',status:'AI · BUCHUNGSHILFE',intro:'Ich erkläre den Buchungsablauf und welche Angaben ATO benötigt. Die endgültige Bestätigung erfolgt durch ATO.',chips:['Wie geht es weiter?','Transferinformationen','Kinder in der Buchung','Stornierungsregeln','Manager kontaktieren']},
      ticket:{title:'TRIP ASSISTANT',status:'AI · IHRE REISE',intro:'Ich helfe bei der Vorbereitung auf die Tour dieses E-Tickets anhand der Ticketdaten und verifizierter Tourinfos.',chips:['Wann ist mein Pickup?','Was mitbringen?','Wetter für mein Datum','Meine Tour erklären','ATO kontaktieren']},
      generic:{title:'AI ASSISTENT',status:'AI TRAVEL COMPANION · ATO',intro:'Ich helfe bei Tourauswahl, Details und Buchungsablauf.',chips:['Tour finden','Mit Kindern','Preise','Transfer','Was empfehlen Sie?']}
    },
    pl:{
      home:{title:'ASYSTENT PODRÓŻY',status:'AI TRAVEL COMPANION · ATO',intro:'Powiedz, jakiego dnia szukasz, a zawężę wybór do doświadczeń, które naprawdę pasują.',chips:['Znajdź idealną wycieczkę','Z dziećmi','Najlepsze w moim budżecie','Ułóż plan na 3 dni','Co polecasz?']},
      category:{title:'ASYSTENT WYBORU',status:'AI · WYBIERZ PEWNIE',intro:'Porównam opcje na tej stronie i odrzucę te słabsze dla Twojej sytuacji.',chips:['Najlepsze dla rodzin','Najlepsza wartość','Najkrótszy transfer','Porównaj najlepsze','Co pasuje do mnie?']},
      tour:{title:'ASYSTENT WYCIECZKI',status:'AI · TA WYCIECZKA',intro:'Zapytaj dokładnie o tę wycieczkę: ceny, dzieci, transfer, czas, zawartość i przygotowanie.',chips:['Dobra z dziećmi?','Co jest w cenie?','Pickup i transfer','Co zabrać?','Porównaj tę wycieczkę']},
      map:{title:'ZAPYTAJ MAPĘ',status:'AI · KONTEKST MAPY',intro:'Pomogę użyć mapy do decyzji: bliskość, transfer i sensowne połączenia.',chips:['Co jest najbliżej mnie?','Wycieczki do 30 minut','Najlepsze blisko z dziećmi','Co mogę połączyć?','Spokojniejsze opcje']},
      planner:{title:'AI TRIP PLANNER',status:'AI · ZBUDUJ PLAN',intro:'Zamienię wybrane wycieczki w zrównoważony plan i wskażę słabe połączenia.',chips:['Ułóż mój plan','Oceń wybrane wycieczki','Zbalansuj aktywne i spokojne dni','Co usunąć?','Planuj z dziećmi']},
      compare:{title:'PORÓWNAJ Z AI',status:'AI · WSPARCIE DECYZJI',intro:'Wyjaśnię realne różnice i kompromisy między wybranymi wycieczkami.',chips:['Co wybrać?','Najlepsze dla rodziny','Najlepsza wartość','Najmniej męcząca','Porównaj transfer i czas']},
      offer:{title:'ASYSTENT OFERT',status:'AI · SPECIAL OFFERS',intro:'Wyjaśnię Group & Event Offers, Journey of the Heart i Gift Certificate na podstawie zweryfikowanych zasad.',chips:['Znajdź najlepszą ofertę','Group & Event Offer','Journey of the Heart','Gift Certificate','Policz logikę grupy']},
      booking:{title:'ASYSTENT REZERWACJI',status:'AI · POMOC W REZERWACJI',intro:'Wyjaśnię kolejne kroki i dane potrzebne ATO. Ostateczne potwierdzenie pozostaje po stronie ATO.',chips:['Co dalej?','Informacje o transferze','Dzieci w rezerwacji','Zasady anulowania','Kontakt z managerem']},
      ticket:{title:'TRIP ASSISTANT',status:'AI · TWOJA PODRÓŻ',intro:'Pomogę przygotować się do wycieczki z tego e-biletu na podstawie danych biletu i zweryfikowanej wiedzy.',chips:['O której pickup?','Co zabrać?','Lista na dzień wycieczki','Wyjaśnij moją wycieczkę','Kontakt z ATO']},
      generic:{title:'ASYSTENT AI',status:'AI TRAVEL COMPANION · ATO',intro:'Pomogę wybrać wycieczkę, zrozumieć szczegóły i przejść rezerwację.',chips:['Znajdź wycieczkę','Z dziećmi','Ceny','Transfer','Co polecacie?']}
    }
  };

  function safeJSON(value,fallback){ try{return JSON.parse(value)}catch(_){return fallback} }
  function currentPath(){ return (location.pathname||'/').toLowerCase(); }
  function isManagerPath(){ return /(^|\/)(booking-manager|ato-manager|manager|admin)(\/|$)/.test(currentPath()); }
  function isSecurePayment(){
    if(document.body?.dataset?.atoAi==='off') return true;
    const p=currentPath();
    if(/(virtual[-_]?pos|secure[-_]?payment|card[-_]?payment|payment-gateway)/.test(p)) return true;
    return Boolean(document.querySelector('[data-ato-secure-payment="true"], .iyzico-checkout-form, #iyzipay-checkout-form, iframe[src*="iyzico"], iframe[src*="paytr"]'));
  }
  function assistantDisabled(){ return isManagerPath() || isSecurePayment(); }

  function plannerSubmode(){
    if(!document.querySelector('#detailedComparison')) return 'planner';
    if(location.hash==='#detailedComparison') return 'compare';
    const el=document.querySelector('#detailedComparison');
    const r=el?.getBoundingClientRect?.();
    if(r && r.top < innerHeight*.62 && r.bottom > innerHeight*.28) return 'compare';
    return 'planner';
  }

  function detectMode(){
    const explicit=(document.body?.dataset?.atoAiPage||'').toLowerCase();
    if(explicit){ if(explicit==='planner') return plannerSubmode(); return explicit==='special-offers'?'offer':explicit==='e-ticket'?'ticket':explicit; }
    const p=currentPath(), title=(document.title||'').toLowerCase();
    if(isManagerPath() || isSecurePayment()) return 'off';
    if(/e-?ticket|electronic-ticket/.test(p) || document.querySelector('[data-ticket="tour"]')) return 'ticket';
    if(/trip-planner/.test(p) || document.querySelector('#plannerTop,#detailedComparison')) return plannerSubmode();
    if(/interactive-map|explore-map/.test(p) || document.querySelector('#map,.map-shell,[data-map-root]')) return 'map';
    if(/special-offers/.test(p) || document.querySelector('#special-paths,#journey,#gift')) return 'offer';
    if(/booking|reservation|checkout/.test(p) || document.querySelector('[data-booking-form],#bookingForm,.booking-form')) return 'booking';
    if(p==='/' || /\/index(?:\.html)?$/.test(p) || /tours in alanya/.test(title)) return 'home';
    if(document.querySelector('[data-tour-id],.tour-page,.tour-hero,.tour-detail') || /\/tours\//.test(p)) return 'tour';
    if(/popular-tours|combo-deals|experiences|adventure|history-culture|water-sports|wellness|vip-service/.test(p)) return 'category';
    return 'generic';
  }

  function contextCopy(){
    const l=CONTEXT_I18N[lang()]?lang():'en';
    const mode=detectMode(), p=currentPath();
    if(mode==='category' && /vip-service|vip-services/.test(p)){
      const vip={
        en:{title:'VIP CONCIERGE',status:'AI · BESPOKE EXPERIENCE DESIGN',intro:'Tell me the occasion, guests, date, style and budget. I can shape a private ATO event around your wishes.',chips:['Plan a birthday','Romantic proposal','Private yacht event','Build a VIP day','Design around my wishes']},
        ru:{title:'VIP CONCIERGE',status:'AI · ИНДИВИДУАЛЬНОЕ МЕРОПРИЯТИЕ',intro:'Расскажите повод, дату, гостей, стиль и бюджет — я соберу приватное мероприятие ATO вокруг ваших пожеланий.',chips:['Организовать день рождения','Романтическое предложение','Мероприятие на яхте','Собрать VIP-день','Сделать под мои пожелания']},
        tr:{title:'VIP CONCIERGE',status:'AI · ÖZEL ETKİNLİK TASARIMI',intro:'Etkinliği, tarihi, misafirleri, stili ve bütçeyi anlatın; ATO VIP gününü isteklerinize göre tasarlayayım.',chips:['Doğum günü planla','Romantik evlilik teklifi','Özel yat etkinliği','VIP gün oluştur','İsteklerime göre tasarla']},
        de:{title:'VIP CONCIERGE',status:'AI · INDIVIDUELLE EVENTPLANUNG',intro:'Nennen Sie Anlass, Datum, Gäste, Stil und Budget – ich gestalte daraus Ihr privates ATO-VIP-Erlebnis.',chips:['Geburtstag planen','Romantischer Antrag','Privates Yacht-Event','VIP-Tag gestalten','Nach meinen Wünschen']},
        pl:{title:'VIP CONCIERGE',status:'AI · INDYWIDUALNE WYDARZENIE',intro:'Podaj okazję, datę, gości, styl i budżet — ułożę prywatne wydarzenie ATO zgodnie z Twoimi życzeniami.',chips:['Zaplanuj urodziny','Romantyczne zaręczyny','Prywatny event na jachcie','Ułóż dzień VIP','Zaprojektuj pod moje życzenia']}
      }; return vip[l]||vip.en;
    }
    if(mode==='category' && /combo-deals/.test(p)){
      const combo={
        en:{title:'COMBO DEALS AI',status:'AI · MORE EXPERIENCE FOR YOUR BUDGET',intro:'I can compare ATO package experiences and find the strongest value for your group without stacking unapproved discounts.',chips:['Best value combo','Family combo','Most experiences for budget','Compare combos','Add the best to my trip']},
        ru:{title:'COMBO DEALS AI',status:'AI · БОЛЬШЕ ВПЕЧАТЛЕНИЙ ЗА БЮДЖЕТ',intro:'Я сравню пакетные Combo Deals и найду самый сильный вариант для вашей группы без двойных неподтверждённых скидок.',chips:['Самый выгодный Combo','Combo для семьи','Максимум впечатлений за бюджет','Сравнить Combo','Добавить лучший в поездку']},
        tr:{title:'COMBO DEALS AI',status:'AI · BÜTÇEYLE DAHA FAZLA DENEYİM',intro:'ATO paket deneyimlerini karşılaştırıp grubunuz için en iyi değeri bulurum; onaysız çifte indirim uygulamam.',chips:['En iyi değer Combo','Aile Combo','Bütçeye en çok deneyim','Combo karşılaştır','En iyisini plana ekle']},
        de:{title:'COMBO DEALS AI',status:'AI · MEHR ERLEBNIS FÜRS BUDGET',intro:'Ich vergleiche ATO-Combo-Pakete und finde den stärksten Gegenwert für Ihre Gruppe – ohne unbestätigte Doppelrabatte.',chips:['Bestes Combo-Angebot','Familien-Combo','Meiste Erlebnisse fürs Budget','Combos vergleichen','Bestes zum Reiseplan']},
        pl:{title:'COMBO DEALS AI',status:'AI · WIĘCEJ WRAŻEŃ W BUDŻECIE',intro:'Porównam pakiety Combo Deals i znajdę najlepszą wartość dla grupy bez niezatwierdzonego podwójnego rabatu.',chips:['Najlepszy Combo','Combo dla rodziny','Najwięcej wrażeń w budżecie','Porównaj Combo','Dodaj najlepszy do planu']}
      }; return combo[l]||combo.en;
    }
    if(mode==='category' && /popular-tours/.test(p)){
      const popular={
        en:{title:'POPULAR TOURS AI',status:'AI · TRAVELLERS’ FAVOURITES, FILTERED FOR YOU',intro:'I can start with ATO’s most popular experiences, then narrow them by your family, dates, budget and travel style.',chips:['Best popular tour for us','Popular under my budget','Family favourites','Compare top 3','Build my stay from popular tours']},
        ru:{title:'POPULAR TOURS AI',status:'AI · ХИТЫ ПУТЕШЕСТВЕННИКОВ ДЛЯ ВАС',intro:'Начну с самых популярных впечатлений ATO и отфильтрую их под вашу семью, даты, бюджет и стиль отдыха.',chips:['Лучший популярный тур для нас','Популярные в мой бюджет','Хиты для семьи','Сравнить топ-3','Собрать отдых из популярных']},
        tr:{title:'POPULAR TOURS AI',status:'AI · SİZE UYGUN POPÜLER FAVORİLER',intro:'ATO’nun en popüler deneyimlerinden başlayıp aile, tarih, bütçe ve tatil tarzınıza göre daraltırım.',chips:['Bize en uygun popüler tur','Bütçeme uygun popülerler','Aile favorileri','İlk 3’ü karşılaştır','Popülerlerden tatil planla']},
        de:{title:'POPULAR TOURS AI',status:'AI · BELIEBTE FAVORITEN FÜR SIE',intro:'Ich starte mit den beliebtesten ATO-Erlebnissen und filtere sie nach Familie, Daten, Budget und Reisestil.',chips:['Bestes beliebtes Erlebnis für uns','Beliebt in meinem Budget','Familienfavoriten','Top 3 vergleichen','Urlaub aus Favoriten planen']},
        pl:{title:'POPULAR TOURS AI',status:'AI · POPULARNE HITY DOPASOWANE DO CIEBIE',intro:'Zacznę od najpopularniejszych atrakcji ATO i zawężę je według rodziny, dat, budżetu i stylu wypoczynku.',chips:['Najlepszy popularny dla nas','Popularne w moim budżecie','Hity rodzinne','Porównaj top 3','Ułóż pobyt z popularnych']}
      }; return popular[l]||popular.en;
    }
    return CONTEXT_I18N[l][mode] || CONTEXT_I18N[l].generic;
  }

  function currentTour(){
    const body=document.body;
    const h1=document.querySelector('main h1,.tour-hero h1,.page-hero h1,h1');
    const path=(location.pathname||'').split('/').filter(Boolean).pop()||'';
    return {
      id: body?.dataset?.tourId || body?.dataset?.atoTourId || path.replace(/\.html?$/i,''),
      name: body?.dataset?.tourName || body?.dataset?.atoTourName || (h1?.textContent||'').replace(/\s+/g,' ').trim().slice(0,160),
      url: location.pathname
    };
  }

  function selectedTours(){
    const keys=['atoTripPlannerPool','atoCompareTours','atoSelectedTours'];
    for(const k of keys){
      const value=safeJSON(localStorage.getItem(k)||'[]',[]);
      if(Array.isArray(value) && value.length) return value.slice(0,8).map(x=>typeof x==='string'?x:(x?.url||x?.title||x?.name||'')).filter(Boolean);
    }
    return [];
  }

  function ticketContext(){
    const read=(key)=>document.querySelector(`[data-ticket="${key}"]`)?.textContent?.replace(/\s+/g,' ').trim().slice(0,220)||'';
    return {tour:read('tour'),date:read('date'),pickup:read('pickup'),time:read('time'),guests:read('guests'),hotel:read('hotel')};
  }

  function offerContext(){
    const val=(id)=>document.getElementById(id)?.textContent?.replace(/\s+/g,' ').trim().slice(0,160)||'';
    return {group_guests:val('groupGuestTotalValue'),group_total:val('groupOfferTotal'),heart_discount:val('heartDiscountValue'),heart_price:val('heartOfferPrice')};
  }

  function loadAgentState(){
    try{ const x=JSON.parse(sessionStorage.getItem(AGENT_STATE_KEY)||'{}'); return x&&typeof x==='object'?x:{}; }catch(e){return{};}
  }
  function saveAgentState(data){
    if(!data||typeof data!=='object') return;
    const prev=loadAgentState();
    const incoming=data.lead_profile&&typeof data.lead_profile==='object'?data.lead_profile:{};
    const oldProfile=prev.lead_profile||{};
    const profile={...oldProfile};
    for(const [k,v] of Object.entries(incoming)){
      const meaningful = Array.isArray(v) ? (v.length>0 || (k==='children_ages' && incoming.children_count===0)) : (v!==null && v!==undefined && v!=='');
      if(meaningful) profile[k]=v;
    }
    const recommendations=Array.isArray(data.recommendations)&&data.recommendations.length?data.recommendations:prev.recommendations||[];
    const comparison=Array.isArray(data.comparison)&&data.comparison.length?data.comparison:prev.comparison||[];
    const hasSelection=Array.isArray(profile.selected_tour_ids)&&profile.selected_tour_ids.length>0;
    let decisionTurns=Math.max(0,Number(prev.decision_turns_without_selection)||0);
    if(hasSelection) decisionTurns=0;
    else if((recommendations.length||comparison.length) && !['offer_itinerary','review_itinerary','ready_to_request_booking','manager_handoff'].includes(data.next_action)) decisionTurns=Math.min(8,decisionTurns+1);
    const itinerary=data.itinerary&&typeof data.itinerary==='object'&&data.itinerary.status&&data.itinerary.status!=='none'?data.itinerary:(prev.itinerary||null);
    const offerRescue=data.offer_rescue&&typeof data.offer_rescue==='object'&&data.offer_rescue.status&&data.offer_rescue.status!=='none'?data.offer_rescue:(prev.offer_rescue||null);
    const eventProfile=data.event_profile&&typeof data.event_profile==='object'?{...(prev.event_profile||{}),...Object.fromEntries(Object.entries(data.event_profile).filter(([k,v])=>Array.isArray(v)?v.length>0:(v!==null&&v!==undefined&&v!=='')))}:(prev.event_profile||null);
    const eventPlan=data.event_plan&&typeof data.event_plan==='object'&&data.event_plan.status&&data.event_plan.status!=='none'?data.event_plan:(prev.event_plan||null);
    const next={...prev,lead_profile:profile,event_profile:eventProfile,event_plan:eventPlan,recommendations,comparison,weather:data.weather&&typeof data.weather==='object'&&Array.isArray(data.weather.days)&&data.weather.days.length?data.weather:prev.weather||null,itinerary,offer_rescue:offerRescue,decision_turns_without_selection:decisionTurns,itinerary_offer_shown:Boolean(prev.itinerary_offer_shown||data.next_action==='offer_itinerary'||data.itinerary?.status==='offered'),price_rescue_shown:Boolean(prev.price_rescue_shown||data.next_action==='offer_special_offer'||data.offer_rescue?.status==='offered'),next_action:data.next_action||prev.next_action||'continue_discovery'};
    try{sessionStorage.setItem(AGENT_STATE_KEY,JSON.stringify(next));}catch(e){}
  }
  function agentLabels(){
    const l=lang();
    const map={
      en:{best:'BEST WEATHER DAY',view:'VIEW TOUR',why:'WHY IT FITS',compare:'AI COMPARISON',weather:'LIVE WEATHER',ready:'READY REQUEST',budget:'BUDGET',adults:'Adults',children:'Children',profile:'YOUR TRIP PROFILE',dates:'Dates',hotel:'Hotel',prefs:'Preferences',missing:'Still useful to know',compareAdd:'ADD TO COMPARE',compareAll:'COMPARE THESE',sendReady:'SEND READY REQUEST',edit:'CONTINUE PLANNING',added:'ADDED',itinerary:'YOUR HOLIDAY PLAN',buildPlan:'YES — BUILD MY PLAN',openPlan:'OPEN READY PLAN IN TRIP PLANNER',proposed:'PROPOSED · ATO CONFIRMS AVAILABILITY',rest:'REST / FREE DAY',specialOffer:'SPECIAL OFFERS CHECK',potentialSave:'POTENTIAL SAVINGS',before:'CURRENT TOTAL',after:'POTENTIAL OFFER TOTAL',checkOffer:'YES — CHECK SPECIAL OFFERS',openOffers:'OPEN SPECIAL OFFERS',lowerBudget:'MAKE IT CHEAPER',offerPending:'ATO CONFIRMS OFFER ELIGIBILITY',event:'YOUR PRIVATE EVENT',eventBrief:'EVENT BRIEF',buildEvent:'YES — DESIGN MY EVENT',eventProposed:'BESPOKE CONCEPT · ATO CONFIRMS SERVICES & QUOTE',eventSend:'SEND EVENT REQUEST',guests:'Guests',style:'Style',must:'Must-haves',eventDate:'Date',eventFor:'For',eventOptions:'CONCEPT OPTIONS',chooseConcept:'CHOOSE'},
      ru:{best:'ЛУЧШИЙ ДЕНЬ ПО ПОГОДЕ',view:'ОТКРЫТЬ ТУР',why:'ПОЧЕМУ ПОДХОДИТ',compare:'СРАВНЕНИЕ AI',weather:'ПОГОДА ОНЛАЙН',ready:'ГОТОВАЯ ЗАЯВКА',budget:'БЮДЖЕТ',adults:'Взрослые',children:'Дети',profile:'ВАШ ПРОФИЛЬ ПОЕЗДКИ',dates:'Даты',hotel:'Отель',prefs:'Пожелания',missing:'Ещё полезно уточнить',compareAdd:'В СРАВНЕНИЕ',compareAll:'СРАВНИТЬ ЭТИ ВАРИАНТЫ',sendReady:'ОТПРАВИТЬ ГОТОВУЮ ЗАЯВКУ',edit:'ПРОДОЛЖИТЬ ПОДБОР',added:'ДОБАВЛЕНО',itinerary:'ВАШ ПЛАН ОТДЫХА',buildPlan:'ДА — СОСТАВЬ МОЙ ПЛАН',openPlan:'ОТКРЫТЬ ГОТОВЫЙ ПЛАН В TRIP PLANNER',proposed:'ПРЕДЛОЖЕНИЕ · НАЛИЧИЕ ПОДТВЕРЖДАЕТ ATO',rest:'ОТДЫХ / СВОБОДНЫЙ ДЕНЬ',specialOffer:'ПРОВЕРКА SPECIAL OFFERS',potentialSave:'ВОЗМОЖНАЯ ЭКОНОМИЯ',before:'ТЕКУЩАЯ СТОИМОСТЬ',after:'ВОЗМОЖНАЯ ЦЕНА ПО ОФФЕРУ',checkOffer:'ДА — ПРОВЕРЬ SPECIAL OFFERS',openOffers:'ОТКРЫТЬ SPECIAL OFFERS',lowerBudget:'СДЕЛАТЬ ЕЩЁ ДЕШЕВЛЕ',offerPending:'ОФФЕР И ФИНАЛЬНУЮ ЦЕНУ ПОДТВЕРЖДАЕТ ATO',event:'ВАШЕ VIP-МЕРОПРИЯТИЕ',eventBrief:'БРИФ МЕРОПРИЯТИЯ',buildEvent:'ДА — СОСТАВЬ МОЁ МЕРОПРИЯТИЕ',eventProposed:'ИНДИВИДУАЛЬНАЯ КОНЦЕПЦИЯ · УСЛУГИ И СМЕТУ ПОДТВЕРЖДАЕТ ATO',eventSend:'ОТПРАВИТЬ EVENT-ЗАЯВКУ',guests:'Гости',style:'Стиль',must:'Обязательно',eventDate:'Дата',eventFor:'Для кого',eventOptions:'ВАРИАНТЫ КОНЦЕПЦИИ',chooseConcept:'ВЫБРАТЬ'},
      tr:{best:'HAVA İÇİN EN İYİ GÜN',view:'TURU AÇ',why:'NEDEN UYGUN',compare:'AI KARŞILAŞTIRMA',weather:'CANLI HAVA',ready:'HAZIR TALEP',budget:'BÜTÇE',adults:'Yetişkin',children:'Çocuk',profile:'SEYAHAT PROFİLİNİZ',dates:'Tarihler',hotel:'Otel',prefs:'Tercihler',missing:'Bilmek faydalı olur',compareAdd:'KARŞILAŞTIRMAYA EKLE',compareAll:'BUNLARI KARŞILAŞTIR',sendReady:'HAZIR TALEBİ GÖNDER',edit:'PLANLAMAYA DEVAM',added:'EKLENDİ',itinerary:'TATİL PLANINIZ',buildPlan:'EVET — PLANIMI OLUŞTUR',openPlan:'HAZIR PLANI TRIP PLANNER’DA AÇ',proposed:'ÖNERİ · MÜSAİTLİĞİ ATO ONAYLAR',rest:'DİNLENME / SERBEST GÜN',specialOffer:'SPECIAL OFFERS KONTROLÜ',potentialSave:'OLASI TASARRUF',before:'MEVCUT TOPLAM',after:'OLASI TEKLİF TOPLAMI',checkOffer:'EVET — SPECIAL OFFERS KONTROL ET',openOffers:'SPECIAL OFFERS AÇ',lowerBudget:'DAHA UCUZA YENİDEN PLANLA',offerPending:'TEKLİF UYGUNLUĞUNU ATO ONAYLAR',event:'ÖZEL VIP ETKİNLİĞİNİZ',eventBrief:'ETKİNLİK BRİFİ',buildEvent:'EVET — ETKİNLİĞİMİ TASARLA',eventProposed:'ÖZEL KONSEPT · HİZMETLERİ VE TEKLİFİ ATO ONAYLAR',eventSend:'ETKİNLİK TALEBİNİ GÖNDER',guests:'Misafir',style:'Stil',must:'Olmazsa olmazlar',eventDate:'Tarih',eventFor:'Kimin için',eventOptions:'KONSEPT SEÇENEKLERİ',chooseConcept:'SEÇ'},
      de:{best:'BESTER WETTERTAG',view:'TOUR ÖFFNEN',why:'WARUM PASSEND',compare:'AI-VERGLEICH',weather:'LIVE-WETTER',ready:'FERTIGE ANFRAGE',budget:'BUDGET',adults:'Erwachsene',children:'Kinder',profile:'IHR REISEPROFIL',dates:'Daten',hotel:'Hotel',prefs:'Wünsche',missing:'Noch hilfreich',compareAdd:'ZUM VERGLEICH',compareAll:'DIESE VERGLEICHEN',sendReady:'FERTIGE ANFRAGE SENDEN',edit:'WEITER PLANEN',added:'HINZUGEFÜGT',itinerary:'IHR URLAUBSPLAN',buildPlan:'JA — MEINEN PLAN ERSTELLEN',openPlan:'FERTIGEN PLAN IM TRIP PLANNER ÖFFNEN',proposed:'VORSCHLAG · VERFÜGBARKEIT DURCH ATO',rest:'RUHE- / FREIER TAG',specialOffer:'SPECIAL-OFFERS-PRÜFUNG',potentialSave:'MÖGLICHE ERSPARNIS',before:'AKTUELLER GESAMTPREIS',after:'MÖGLICHER ANGEBOTSPREIS',checkOffer:'JA — SPECIAL OFFERS PRÜFEN',openOffers:'SPECIAL OFFERS ÖFFNEN',lowerBudget:'NOCH GÜNSTIGER PLANEN',offerPending:'ANGEBOT UND ENDPREIS BESTÄTIGT ATO',event:'IHR PRIVATES VIP-EVENT',eventBrief:'EVENT-BRIEFING',buildEvent:'JA — MEIN EVENT PLANEN',eventProposed:'INDIVIDUELLES KONZEPT · SERVICES & ANGEBOT DURCH ATO',eventSend:'EVENT-ANFRAGE SENDEN',guests:'Gäste',style:'Stil',must:'Must-haves',eventDate:'Datum',eventFor:'Für',eventOptions:'KONZEPTOPTIONEN',chooseConcept:'WÄHLEN'},
      pl:{best:'NAJLEPSZY DZIEŃ POGODOWY',view:'OTWÓRZ WYCIECZKĘ',why:'DLACZEGO PASUJE',compare:'PORÓWNANIE AI',weather:'POGODA NA ŻYWO',ready:'GOTOWE ZAPYTANIE',budget:'BUDŻET',adults:'Dorośli',children:'Dzieci',profile:'TWÓJ PROFIL PODRÓŻY',dates:'Daty',hotel:'Hotel',prefs:'Preferencje',missing:'Warto jeszcze wiedzieć',compareAdd:'DODAJ DO PORÓWNANIA',compareAll:'PORÓWNAJ TE OPCJE',sendReady:'WYŚLIJ GOTOWE ZAPYTANIE',edit:'KONTYNUUJ PLANOWANIE',added:'DODANO',itinerary:'TWÓJ PLAN POBYTU',buildPlan:'TAK — UŁÓŻ MÓJ PLAN',openPlan:'OTWÓRZ GOTOWY PLAN W TRIP PLANNER',proposed:'PROPOZYCJA · DOSTĘPNOŚĆ POTWIERDZA ATO',rest:'ODPOCZYNEK / DZIEŃ WOLNY',specialOffer:'SPRAWDZENIE SPECIAL OFFERS',potentialSave:'MOŻLIWA OSZCZĘDNOŚĆ',before:'OBECNA SUMA',after:'MOŻLIWA CENA OFERTOWA',checkOffer:'TAK — SPRAWDŹ SPECIAL OFFERS',openOffers:'OTWÓRZ SPECIAL OFFERS',lowerBudget:'ZAPLANUJ TANIEJ',offerPending:'OFERTĘ I CENĘ KOŃCOWĄ POTWIERDZA ATO',event:'TWOJE PRYWATNE WYDARZENIE VIP',eventBrief:'BRIEF WYDARZENIA',buildEvent:'TAK — ZAPROJEKTUJ MOJE WYDARZENIE',eventProposed:'INDYWIDUALNA KONCEPCJA · USŁUGI I WYCENĘ POTWIERDZA ATO',eventSend:'WYŚLIJ ZAPYTANIE EVENT',guests:'Goście',style:'Styl',must:'Must-have',eventDate:'Data',eventFor:'Dla kogo',eventOptions:'WARIANTY KONCEPCJI',chooseConcept:'WYBIERZ'}
    }; return map[l]||map.en;
  }

  function contactLabels(){
    const map={
      en:{title:'FINAL CONTACT',name:'Your name',phone:'WhatsApp number',submit:'SAVE REQUEST IN ATO MANAGER',saving:'Saving request…',saved:'Request saved in ATO Manager',needTour:'Please choose at least one tour before sending the request.',fallback:'Automatic save was unavailable. I will open the same prepared request in WhatsApp.'},
      ru:{title:'ФИНАЛЬНЫЙ КОНТАКТ',name:'Ваше имя',phone:'Номер WhatsApp',submit:'СОХРАНИТЬ ЗАЯВКУ В ATO MANAGER',saving:'Сохраняю заявку…',saved:'Заявка сохранена в ATO Manager',needTour:'Сначала выберите хотя бы одну экскурсию.',fallback:'Автоматическое сохранение недоступно. Открою эту же готовую заявку в WhatsApp.'},
      tr:{title:'SON İLETİŞİM',name:'Adınız',phone:'WhatsApp numarası',submit:'TALEBİ ATO MANAGER’A KAYDET',saving:'Talep kaydediliyor…',saved:'Talep ATO Manager’a kaydedildi',needTour:'Talebi göndermeden önce en az bir tur seçin.',fallback:'Otomatik kayıt kullanılamadı. Aynı hazır talebi WhatsApp’ta açacağım.'},
      de:{title:'LETZTER KONTAKT',name:'Ihr Name',phone:'WhatsApp-Nummer',submit:'ANFRAGE IM ATO MANAGER SPEICHERN',saving:'Anfrage wird gespeichert…',saved:'Anfrage im ATO Manager gespeichert',needTour:'Bitte wählen Sie vor dem Senden mindestens eine Tour.',fallback:'Automatisches Speichern war nicht verfügbar. Ich öffne dieselbe fertige Anfrage in WhatsApp.'},
      pl:{title:'DANE KONTAKTOWE',name:'Twoje imię',phone:'Numer WhatsApp',submit:'ZAPISZ ZAPYTANIE W ATO MANAGER',saving:'Zapisywanie zapytania…',saved:'Zapytanie zapisane w ATO Manager',needTour:'Przed wysłaniem wybierz co najmniej jedną wycieczkę.',fallback:'Automatyczny zapis był niedostępny. Otworzę to samo gotowe zapytanie w WhatsApp.'}
    }; return map[lang()]||map.en;
  }
  function loadContact(){ try{const x=JSON.parse(sessionStorage.getItem(CONTACT_KEY)||'{}');return x&&typeof x==='object'?x:{};}catch(_){return{};} }
  function saveContact(name,phone){ const c={name:String(name||'').trim().slice(0,180),phone:String(phone||'').trim().slice(0,80)}; try{sessionStorage.setItem(CONTACT_KEY,JSON.stringify(c));}catch(_){} return c; }

  function profileMissing(profile={}){
    const out=[];
    if(profile.adults==null) out.push('adults');
    if(profile.children_count==null) out.push('children');
    if(!Array.isArray(profile.preferred_dates)||!profile.preferred_dates.length) out.push('dates');
    if(profile.budget_amount==null) out.push('budget');
    if(!profile.hotel) out.push('hotel');
    return out;
  }

  function plannerPool(){
    try{ const x=JSON.parse(localStorage.getItem('atoTripPlannerPool')||'[]'); return Array.isArray(x)?x:[]; }catch(_){ return []; }
  }
  function normalizeTourUrl(url){
    try{ return new URL(String(url||''),location.href).pathname.replace(/^\//,''); }catch(_){ return String(url||'').replace(/^\//,''); }
  }
  function addToPlannerCompare(url){
    const u=normalizeTourUrl(url); if(!u) return false;
    try{
      let pool=plannerPool().map(normalizeTourUrl);
      if(!pool.includes(u)) pool.push(u);
      pool=[...new Set(pool)].slice(0,4);
      localStorage.setItem('atoTripPlannerPool',JSON.stringify(pool));
      window.dispatchEvent(new CustomEvent('ato:trip-planner-pool-change',{detail:{pool}}));
      return true;
    }catch(_){ return false; }
  }
  function addRecommendationsToCompare(recs=[]){
    let count=0;
    for(const r of recs.slice(0,4)) if(r?.url&&addToPlannerCompare(r.url)) count++;
    return count;
  }
  function openPlannerCompare(){
    const href=(document.querySelector('a[href*="trip-planner"]')?.getAttribute('href')||'/trip-planner.html').split('#')[0];
    location.href=`${href}#detailedComparison`;
  }
  function plannerHrefKey(url){
    try{return new URL(String(url||''),location.href).pathname.split('/').filter(Boolean).pop()||'';}catch(_){return String(url||'').split('?')[0].split('#')[0].split('/').pop()||'';}
  }
  function applyItineraryToTripPlanner(state){
    const itinerary=state?.itinerary||{}, p=state?.lead_profile||{};
    const tourDays=Array.isArray(itinerary.days)?itinerary.days.filter(d=>d?.type==='tour'&&d?.tour_id).slice(0,4):[];
    const refs=[...(state?.recommendations||[]),...(state?.comparison||[])];
    const byId=new Map(refs.filter(x=>x?.id).map(x=>[String(x.id),x]));
    const pool=[], schedule={};
    for(const d of tourDays){
      const ref=byId.get(String(d.tour_id))||{};
      const href=plannerHrefKey(ref.url||`/tours/${String(d.tour_id).replace(/[^a-z0-9_-]/gi,'')}.html`);
      if(!href||pool.includes(href)) continue;
      pool.push(href); if(/^\d{4}-\d{2}-\d{2}$/.test(String(d.date||''))) schedule[href]=d.date;
    }
    if(!pool.length) return false;
    const itineraryDates=(itinerary.days||[]).map(d=>String(d?.date||'')).filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)).sort();
    const profileDates=Array.isArray(p.preferred_dates)?p.preferred_dates.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(String(x))).sort():[];
    const dates=itineraryDates.length?itineraryDates:profileDates;
    let prefs={}; try{prefs=JSON.parse(localStorage.getItem('atoTripPlannerPrefs')||'{}')||{};}catch(_){}
    const children=p.children_count===0?'':(Array.isArray(p.children_ages)&&p.children_ages.length?p.children_ages.join(', '):(p.children_count!=null?String(p.children_count):''));
    prefs={...prefs,travelStart:dates[0]||prefs.travelStart||'',travelEnd:dates[dates.length-1]||prefs.travelEnd||'',adults:p.adults??prefs.adults??2,children,pace:prefs.pace||'balanced',road:prefs.road||'medium',restDays:(itinerary.days||[]).some(d=>d?.type==='rest'||d?.type==='free'),interests:Array.isArray(p.preferences)&&p.preferences.length?p.preferences:(prefs.interests||[])};
    try{
      localStorage.setItem('atoTripPlannerPool',JSON.stringify(pool));
      localStorage.setItem('atoTripPlannerDetail',JSON.stringify(pool));
      localStorage.setItem('atoTripPlannerPrefs',JSON.stringify(prefs));
      localStorage.setItem('atoTripPlannerSchedule',JSON.stringify(schedule));
      localStorage.setItem('atoTripPlannerGuideStep','5');
      window.dispatchEvent(new CustomEvent('ato:trip-planner-pool-change',{detail:{pool}}));
      return true;
    }catch(_){return false;}
  }
  function itineraryAcceptPrompt(){
    const l=lang();
    return l==='ru'?'Да. Составь мне конкретный план отдыха по нашим датам: распредели экскурсии по дням, оставь разумные дни отдыха, учти детей, бюджет, дорогу и погоду.':l==='tr'?'Evet. Tarihlerimize göre net bir tatil planı oluştur: turları günlere dağıt, uygun dinlenme günleri bırak, çocukları, bütçeyi, yol süresini ve havayı dikkate al.':l==='de'?'Ja. Erstelle bitte einen konkreten Urlaubsplan für unsere Reisedaten: verteile die Ausflüge auf passende Tage, plane sinnvolle Ruhetage ein und berücksichtige Kinder, Budget, Fahrzeit und Wetter.':l==='pl'?'Tak. Ułóż konkretny plan pobytu na nasze daty: rozłóż wycieczki na dni, zostaw rozsądne dni odpoczynku i uwzględnij dzieci, budżet, dojazdy oraz pogodę.':'Yes. Build a concrete holiday plan for our travel dates: distribute the excursions across suitable days, leave sensible rest days, and account for children, budget, road time and weather.';
  }

  function confirmedPaymentUrl(){
    const el=document.querySelector('[data-ato-confirmed-payment-url]');
    const url=el?.getAttribute('data-ato-confirmed-payment-url')||'';
    return /^https?:\/\//i.test(url)||/^\//.test(url)?url:'';
  }

  function sessionId(){
    let id=sessionStorage.getItem(SESSION_KEY);
    if(!id){
      id=(crypto.randomUUID ? crypto.randomUUID() : `ato-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      sessionStorage.setItem(SESSION_KEY,id);
    }
    return id;
  }

  function loadHistory(){
    try{
      const x=JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'[]');
      return Array.isArray(x) ? x.slice(-MAX_HISTORY) : [];
    }catch(e){ return []; }
  }
  let history=loadHistory();
  let busy=false;
  let launchToneBound=false;
  let launchToneRaf=0;

  function save(){
    try{ sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_HISTORY))); }catch(e){}
  }

  function pageContext(){
    const meta=document.querySelector('meta[name="description"]')?.content || '';
    const scope=document.querySelector('main, article, .tour-page, .page-content, #main') || document.body;
    let txt=(scope?.innerText||'')
      .replace(/\s+/g,' ')
      .replace(/ATO ASSISTANT/gi,'')
      .trim();
    if(txt.length>4200) txt=txt.slice(0,4200);
    const mode=detectMode();
    return {
      mode,
      title: document.title || '',
      url: location.href,
      path: location.pathname,
      description: meta.slice(0,600),
      current_tour: mode==='tour'?currentTour():null,
      selected_tours: selectedTours(),
      ticket: mode==='ticket'?ticketContext():null,
      offer: mode==='offer'?offerContext():null,
      visible_text: txt
    };
  }

  function launchTone(){
    const launch=$('#atoAssistantLaunch');
    if(!launch) return;

    const r=launch.getBoundingClientRect();
    const x=Math.max(1,Math.min(window.innerWidth-2,r.left+r.width*.52));
    const y=Math.max(1,Math.min(window.innerHeight-2,r.top+r.height*.52));

    const stack=document.elementsFromPoint(x,y)
      .filter(el=>!el.closest?.('#atoAssistantRoot'));

    const under=stack[0] || document.body;
    let tone='default';

    if(under.closest?.('#atoLivingHero')) tone='hero';
    else if(under.closest?.('#main-categories')) tone='categories';
    else if(under.closest?.('.vip-service-premium,.vip-service-premium-link')) tone='vip';
    else if(under.closest?.('#about')) tone='about';
    else if(under.closest?.('#contacts')) tone='contact';
    else if(under.closest?.('.footer-strip')) tone='footer';

    launch.dataset.tone=tone;
  }

  function scheduleLaunchTone(){
    if(launchToneRaf) return;
    launchToneRaf=requestAnimationFrame(()=>{
      launchToneRaf=0;
      launchTone();
    });
  }

  function initLaunchTone(){
    launchTone();
    if(launchToneBound) return;
    launchToneBound=true;
    window.addEventListener('scroll',scheduleLaunchTone,{passive:true});
    window.addEventListener('resize',scheduleLaunchTone,{passive:true});
  }


  const ORB_HINT_KEY='ato_ai_orb_hint_v1';

  function injectOrbStyles(){
    if(document.getElementById('atoAssistantOrbStyles')) return;

    const style=document.createElement('style');
    style.id='atoAssistantOrbStyles';
    style.textContent=`
      :root{
        --ato-orb-blue-deep:#0b2948;
        --ato-orb-blue:#1f5f95;
        --ato-orb-blue-soft:#5d87ac;
        --ato-orb-gold:#d7a83e;
        --ato-orb-gold-bright:#e8b64f;
        --ato-orb-champagne:#f0cf89;
        --ato-orb-ivory:#fff9ef;
        --ato-orb-ease:cubic-bezier(.22,.61,.36,1);
      }

      /* The existing REAL launch button becomes the orb.
         No proxy element. No click forwarding. */
      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch{
        position:fixed!important;
        right:24px!important;
        bottom:22px!important;
        width:52px!important;
        min-width:52px!important;
        max-width:52px!important;
        height:52px!important;
        min-height:52px!important;
        max-height:52px!important;
        margin:0!important;
        padding:0!important;
        display:flex!important;
        align-items:center!important;
        justify-content:flex-start!important;
        gap:10px!important;
        overflow:hidden!important;
        border-radius:999px!important;
        border:1px solid rgba(215,168,62,.28)!important;
        background:
          radial-gradient(circle at 25px 50%,rgba(49,112,164,.22),transparent 46%),
          linear-gradient(135deg,rgba(8,27,44,.58),rgba(12,52,84,.42))!important;
        -webkit-backdrop-filter:blur(13px) saturate(118%)!important;
        backdrop-filter:blur(13px) saturate(118%)!important;
        box-shadow:
          0 8px 24px rgba(2,9,17,.18),
          inset 0 1px 0 rgba(255,249,239,.05),
          0 0 16px rgba(31,95,149,.08)!important;
        color:var(--ato-orb-ivory)!important;
        cursor:pointer!important;
        z-index:900!important;
        opacity:1!important;
        visibility:visible!important;
        pointer-events:auto!important;
        transform:translateZ(0)!important;
        transition:
          width 280ms var(--ato-orb-ease),
          max-width 280ms var(--ato-orb-ease),
          min-width 280ms var(--ato-orb-ease),
          border-color 230ms ease,
          box-shadow 230ms ease,
          background 230ms ease,
          opacity 180ms ease,
          transform 180ms var(--ato-orb-ease)!important;
        -webkit-tap-highlight-color:transparent!important;
      }

      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="hero"],
      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="vip"],
      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="footer"]{
        background:
          radial-gradient(circle at 25px 50%,rgba(56,126,180,.25),transparent 46%),
          linear-gradient(135deg,rgba(11,42,68,.62),rgba(16,71,112,.46))!important;
        border-color:rgba(232,182,79,.31)!important;
      }

      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="categories"],
      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="about"],
      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="contact"]{
        background:
          radial-gradient(circle at 25px 50%,rgba(39,92,139,.23),transparent 46%),
          linear-gradient(135deg,rgba(7,26,44,.67),rgba(11,48,79,.56))!important;
      }

      @media (hover:hover) and (pointer:fine){
        html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch:hover,
        html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch:focus-visible,
        html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch.ato-ai-orb-hint{
          width:164px!important;
          min-width:164px!important;
          max-width:164px!important;
          border-color:rgba(232,182,79,.43)!important;
          box-shadow:
            0 10px 28px rgba(2,9,17,.20),
            inset 0 1px 0 rgba(255,249,239,.06),
            0 0 19px rgba(31,95,149,.11)!important;
        }
      }

      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch.is-hidden{
        opacity:0!important;
        visibility:hidden!important;
        pointer-events:none!important;
        transform:scale(.96)!important;
      }

      .ato-ai-orb-shell{
        position:relative!important;
        width:52px!important;
        min-width:52px!important;
        height:52px!important;
        flex:0 0 52px!important;
        display:grid!important;
        place-items:center!important;
        pointer-events:none!important;
      }

      .ato-ai-orb-symbol{
        width:36px!important;
        height:36px!important;
        display:block!important;
        overflow:visible!important;
        pointer-events:none!important;
        filter:drop-shadow(0 0 5px rgba(232,182,79,.10))!important;
      }

      .ato-ai-orbit{
        fill:none!important;
        stroke-linecap:round!important;
        transform-box:view-box!important;
        transform-origin:32px 32px!important;
        vector-effect:non-scaling-stroke!important;
      }
      .ato-ai-orbit--a{
        stroke:rgba(240,207,137,.96)!important;
        stroke-width:1.10!important;
        animation:atoOrbA 13.2s linear infinite!important;
      }
      .ato-ai-orbit--b{
        stroke:rgba(75,140,193,.96)!important;
        stroke-width:1.05!important;
        animation:atoOrbB 10.8s linear infinite!important;
      }
      .ato-ai-orbit--c{
        stroke:rgba(232,182,79,.92)!important;
        stroke-width:.98!important;
        animation:atoOrbC 8.7s linear infinite!important;
      }
      .ato-ai-orbit--d{
        stroke:rgba(31,95,149,.98)!important;
        stroke-width:.92!important;
        animation:atoOrbD 12.0s linear infinite!important;
      }

      @keyframes atoOrbA{
        0%{transform:rotate(10deg) scaleY(.70)}
        50%{transform:rotate(190deg) scaleY(.50)}
        100%{transform:rotate(370deg) scaleY(.70)}
      }
      @keyframes atoOrbB{
        0%{transform:rotate(122deg) scaleY(.54)}
        50%{transform:rotate(-58deg) scaleY(.88)}
        100%{transform:rotate(-238deg) scaleY(.54)}
      }
      @keyframes atoOrbC{
        0%{transform:rotate(-38deg) scaleY(.82)}
        50%{transform:rotate(142deg) scaleY(.56)}
        100%{transform:rotate(322deg) scaleY(.82)}
      }
      @keyframes atoOrbD{
        0%{transform:rotate(82deg) scaleY(.44)}
        50%{transform:rotate(-98deg) scaleY(.76)}
        100%{transform:rotate(-278deg) scaleY(.44)}
      }

      .ato-ai-orb-particle{
        transform-box:view-box!important;
        transform-origin:32px 32px!important;
      }
      .ato-ai-orb-particle--1{animation:atoOrbCW 12.4s linear infinite!important}
      .ato-ai-orb-particle--2{animation:atoOrbCCW 9.7s linear infinite!important}
      .ato-ai-orb-particle--3{animation:atoOrbCW 8.0s linear infinite!important}
      .ato-ai-orb-particle--4{animation:atoOrbCCW 13.8s linear infinite!important}
      .ato-ai-orb-particle--5{animation:atoOrbCW 10.3s linear infinite!important}
      .ato-ai-orb-particle--6{animation:atoOrbCCW 11.5s linear infinite!important}
      @keyframes atoOrbCW{to{transform:rotate(360deg)}}
      @keyframes atoOrbCCW{to{transform:rotate(-360deg)}}

      .ato-ai-orb-core{
        transform-box:view-box!important;
        transform-origin:32px 32px!important;
        animation:atoOrbBreathe 5.3s ease-in-out infinite!important;
      }
      @keyframes atoOrbBreathe{
        0%,100%{opacity:.88;transform:scale(.986)}
        50%{opacity:.98;transform:scale(1.03)}
      }

      .ato-ai-orb-pass{
        fill:none!important;
        stroke:rgba(240,207,137,.72)!important;
        stroke-width:1.18!important;
        stroke-linecap:round!important;
        stroke-dasharray:2 54!important;
        opacity:0!important;
        animation:atoOrbPass 10.8s ease-in-out infinite!important;
      }
      @keyframes atoOrbPass{
        0%,74%,100%{opacity:0;stroke-dashoffset:0}
        79%{opacity:.32}
        89%{opacity:.05;stroke-dashoffset:-56}
        91%{opacity:0}
      }

      .ato-ai-orb-label{
        flex:0 0 auto!important;
        margin-left:-1px!important;
        padding-right:14px!important;
        color:rgba(255,249,239,.95)!important;
        font-family:"Cormorant Garamond",Georgia,"Times New Roman",serif!important;
        font-size:14px!important;
        font-weight:500!important;
        letter-spacing:.018em!important;
        line-height:1!important;
        white-space:nowrap!important;
        opacity:0!important;
        transform:translateX(-5px)!important;
        pointer-events:none!important;
        text-shadow:0 1px 8px rgba(0,0,0,.14)!important;
        transition:
          opacity 210ms ease,
          transform 270ms var(--ato-orb-ease)!important;
      }

      @media (hover:hover) and (pointer:fine){
        #atoAssistantLaunch.ato-ai-orb-launch:hover .ato-ai-orb-label,
        #atoAssistantLaunch.ato-ai-orb-launch:focus-visible .ato-ai-orb-label,
        #atoAssistantLaunch.ato-ai-orb-launch.ato-ai-orb-hint .ato-ai-orb-label{
          opacity:1!important;
          transform:translateX(0)!important;
        }
        #atoAssistantLaunch.ato-ai-orb-launch:hover .ato-ai-orb-symbol{
          filter:
            brightness(1.08)
            drop-shadow(0 0 6px rgba(232,182,79,.12))!important;
        }
      }

      #atoAssistantLaunch.ato-ai-orb-press .ato-ai-orb-shell{
        transform:scale(.96)!important;
      }

      #atoAssistantLaunch.ato-ai-orb-launch:focus-visible{
        outline:1px solid rgba(240,207,137,.56)!important;
        outline-offset:3px!important;
      }

      @media (max-width:980px){
        html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch{
          right:calc(14px + env(safe-area-inset-right,0px))!important;
          bottom:calc(14px + env(safe-area-inset-bottom,0px))!important;
          width:50px!important;
          min-width:50px!important;
          max-width:50px!important;
          height:50px!important;
          min-height:50px!important;
          max-height:50px!important;
        }
        .ato-ai-orb-shell{
          width:50px!important;
          min-width:50px!important;
          height:50px!important;
          flex-basis:50px!important;
        }
        .ato-ai-orb-symbol{
          width:34px!important;
          height:34px!important;
        }
        .ato-ai-orb-label{
          display:none!important;
        }
      }


      /* ============================================================
         ASSISTANT PANEL — VISIBILITY BRIDGE ONLY
         IMPORTANT: no desktop color / typography / spacing redesign here.
         The approved desktop V7/V8/V9 surface in index.html owns the look.
         This bridge only guarantees that the native panel can become visible.
         ============================================================ */
      html body #atoAssistantPanel.is-open{
        display:flex!important;
        visibility:visible!important;
        opacity:1!important;
        pointer-events:auto!important;
      }

      html body #atoAssistantPanel[aria-hidden="true"]:not(.is-open){
        visibility:hidden!important;
        opacity:0!important;
        pointer-events:none!important;
      }

      /* ============================================================
         V3.1 MICRO POLISH — HEADER SOFT SHADOWS + PERMANENT INPUT GLOW
         Visual only. No API / booking / language / header changes.
         ============================================================ */

      /* Soft, clean shadow on the three Assistant header text lines. */
      html body #atoAssistantPanel .ato-assistant-eyebrow,
      html body #atoAssistantPanel .ato-assistant-head h3,
      html body #atoAssistantPanel .ato-assistant-status{
        text-shadow:
          0 1px 1px rgba(0,0,0,.30),
          0 3px 8px rgba(0,0,0,.20)!important;
      }

      /* Input stays permanently in the approved blue/emerald illuminated state.
         Static glow only — no pulse, no blinking. */
      html body #atoAssistantPanel #atoAssistantInput,
      html body .ato-desktop-assistant-v7-surface .ato-v7-input{
        border-color:rgba(112,197,208,.76)!important;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.035),
          0 0 0 1px rgba(222,179,88,.095),
          0 0 0 3px rgba(64,164,198,.075),
          0 0 24px rgba(53,150,203,.135),
          0 0 38px rgba(22,137,105,.095)!important;
        background:
          linear-gradient(100deg,rgba(8,35,53,.76),rgba(5,55,49,.61))!important;
        outline:none!important;
        transition:
          border-color .22s ease,
          box-shadow .22s ease,
          background .22s ease!important;
      }

      html body #atoAssistantPanel #atoAssistantInput::placeholder,
      html body .ato-desktop-assistant-v7-surface .ato-v7-input::placeholder{
        color:rgba(225,237,239,.70)!important;
        opacity:1!important;
      }



      /* MASTER CONTEXTUAL PANEL — self-contained on every ATO client screen. */
      html body #atoAssistantRoot{position:relative!important;z-index:2147483500!important;font-family:Arial,Helvetica,sans-serif!important}
      html body #atoAssistantRoot *{box-sizing:border-box}
      html body #atoAssistantPanel.ato-assistant-panel{
        position:fixed!important;left:50%!important;top:50%!important;right:auto!important;bottom:auto!important;
        width:min(640px,calc(100vw - 48px))!important;height:min(620px,calc(100vh - 110px))!important;
        min-width:0!important;min-height:460px!important;max-width:640px!important;max-height:760px!important;
        transform:translate(-50%,-50%) scale(.985)!important;
        display:flex!important;flex-direction:column!important;overflow:hidden!important;
        border-radius:25px!important;border:1px solid rgba(222,180,93,.34)!important;
        background:linear-gradient(145deg,rgba(5,22,37,.985),rgba(7,43,57,.97) 58%,rgba(6,51,45,.965))!important;
        box-shadow:0 34px 90px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.055),0 0 44px rgba(31,95,149,.10)!important;
        color:#f8f5ed!important;z-index:2147483600!important;
        transition:opacity .18s ease,transform .22s cubic-bezier(.22,.61,.36,1),visibility .18s ease!important;
      }
      html body #atoAssistantPanel.is-open{transform:translate(-50%,-50%) scale(1)!important}
      html body #atoAssistantPanel .ato-assistant-head{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:18px!important;padding:23px 25px 18px!important;border-bottom:1px solid rgba(255,255,255,.07)!important;background:linear-gradient(180deg,rgba(255,255,255,.025),transparent)!important}
      html body #atoAssistantPanel .ato-assistant-eyebrow{font-size:10px!important;font-weight:800!important;letter-spacing:.11em!important;text-transform:uppercase!important;color:#f7f2e8!important}
      html body #atoAssistantPanel .ato-assistant-brand-main{color:#ddb45d!important}
      html body #atoAssistantPanel .ato-assistant-brand-org{color:#f7f2e8!important}
      html body #atoAssistantPanel .ato-assistant-head h3{margin:7px 0 5px!important;font:600 25px/1.05 Georgia,'Times New Roman',serif!important;letter-spacing:.02em!important;color:#fffaf0!important}
      html body #atoAssistantPanel .ato-assistant-status{display:flex!important;align-items:center!important;gap:7px!important;font-size:8.5px!important;font-weight:800!important;letter-spacing:.12em!important;text-transform:uppercase!important;color:rgba(218,234,236,.72)!important}
      html body #atoAssistantPanel .ato-assistant-status span{width:6px!important;height:6px!important;border-radius:50%!important;background:#56cba5!important;box-shadow:0 0 10px rgba(86,203,165,.55)!important}
      html body #atoAssistantPanel .ato-assistant-head__actions{display:flex!important;gap:8px!important}
      html body #atoAssistantPanel .ato-assistant-head__actions button{width:36px!important;height:36px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.10)!important;background:rgba(255,255,255,.035)!important;color:#fff!important;font-size:18px!important;cursor:pointer!important}
      html body #atoAssistantPanel .ato-assistant-head__actions button:hover{border-color:rgba(221,180,93,.55)!important;color:#edc86f!important;background:rgba(221,180,93,.08)!important}
      html body #atoAssistantPanel .ato-assistant-thread{flex:1 1 auto!important;min-height:0!important;overflow:auto!important;padding:22px 25px 12px!important;scrollbar-width:thin!important;scrollbar-color:rgba(221,180,93,.28) transparent!important}
      html body #atoAssistantPanel .ato-assistant-msg{max-width:86%!important;margin:0 0 13px!important}
      html body #atoAssistantPanel .ato-assistant-msg--user{margin-left:auto!important;text-align:right!important}
      html body #atoAssistantPanel .ato-assistant-msg__label{margin:0 0 5px!important;font-size:8px!important;font-weight:800!important;letter-spacing:.14em!important;color:rgba(221,180,93,.82)!important}
      html body #atoAssistantPanel .ato-assistant-msg__body{display:inline-block!important;text-align:left!important;padding:12px 14px!important;border-radius:15px!important;border:1px solid rgba(255,255,255,.075)!important;background:rgba(255,255,255,.035)!important;color:rgba(249,248,244,.94)!important;font-size:13px!important;line-height:1.5!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important}
      html body #atoAssistantPanel .ato-assistant-msg--user .ato-assistant-msg__body{border-color:rgba(221,180,93,.20)!important;background:linear-gradient(135deg,rgba(221,180,93,.105),rgba(19,91,85,.25))!important}
      html body #atoAssistantPanel .ato-assistant-msg.is-temporary .ato-assistant-msg__body{opacity:.62!important}
      html body #atoAssistantPanel .ato-assistant-chips{display:flex!important;gap:8px!important;flex-wrap:wrap!important;padding:7px 25px 14px!important}
      html body #atoAssistantPanel .ato-assistant-chips button{appearance:none!important;border:1px solid rgba(112,197,208,.22)!important;border-radius:999px!important;background:rgba(15,86,82,.22)!important;color:rgba(242,248,246,.92)!important;padding:8px 11px!important;font:700 9px/1.15 Arial,sans-serif!important;letter-spacing:.03em!important;cursor:pointer!important;transition:.18s ease!important}
      html body #atoAssistantPanel .ato-assistant-chips button:hover{border-color:rgba(221,180,93,.56)!important;background:linear-gradient(135deg,rgba(221,180,93,.16),rgba(12,83,76,.34))!important;color:#fff8ec!important;transform:translateY(-1px)!important}
      html body #atoAssistantPanel .ato-assistant-handoff{padding:0 25px 12px!important}
      html body #atoAssistantPanel .ato-assistant-handoff button{width:100%!important;min-height:42px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;border-radius:13px!important;border:1px solid rgba(221,180,93,.26)!important;background:linear-gradient(90deg,rgba(221,180,93,.07),rgba(14,88,77,.23))!important;color:#f8f2e5!important;padding:0 14px!important;font-size:10px!important;font-weight:800!important;letter-spacing:.06em!important;text-transform:uppercase!important;cursor:pointer!important}
      html body #atoAssistantPanel .ato-assistant-handoff button:hover{border-color:rgba(221,180,93,.62)!important;background:linear-gradient(90deg,rgba(221,180,93,.14),rgba(14,88,77,.34))!important}
      html body #atoAssistantPanel .ato-assistant-compose{display:grid!important;grid-template-columns:1fr 48px!important;gap:9px!important;padding:0 25px 10px!important;align-items:end!important}
      html body #atoAssistantPanel #atoAssistantInput{display:block!important;width:100%!important;min-height:44px!important;max-height:112px!important;resize:none!important;border-radius:14px!important;padding:12px 14px!important;color:#fff!important;font:500 13px/1.45 Arial,sans-serif!important}
      html body #atoAssistantPanel #atoAssistantSend{width:48px!important;height:44px!important;border-radius:13px!important;border:1px solid rgba(112,197,208,.38)!important;background:linear-gradient(145deg,rgba(31,95,149,.52),rgba(9,98,80,.72))!important;color:#f6d58f!important;font-size:20px!important;cursor:pointer!important;box-shadow:0 8px 24px rgba(0,0,0,.16)!important}
      html body #atoAssistantPanel #atoAssistantSend:hover{border-color:rgba(221,180,93,.66)!important;box-shadow:0 0 22px rgba(221,180,93,.10),0 8px 24px rgba(0,0,0,.18)!important}
      html body #atoAssistantPanel #atoAssistantSend:disabled{opacity:.45!important;cursor:wait!important}
      html body #atoAssistantPanel .ato-assistant-fineprint{padding:0 25px 16px!important;text-align:center!important;color:rgba(218,229,229,.48)!important;font-size:7.5px!important;font-weight:800!important;letter-spacing:.11em!important;text-transform:uppercase!important}
      html body #atoAssistantPanel .ato-agent-extras{display:grid!important;gap:10px!important;margin:2px 25px 14px!important}
      html body #atoAssistantPanel .ato-agent-weather,html body #atoAssistantPanel .ato-agent-compare,html body #atoAssistantPanel .ato-agent-offer-rescue,html body #atoAssistantPanel .ato-agent-recommendations article{border:1px solid rgba(221,180,93,.18)!important;background:linear-gradient(145deg,rgba(7,32,49,.78),rgba(10,72,67,.46))!important;border-radius:15px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.03)!important}
      html body #atoAssistantPanel .ato-agent-profile{padding:12px!important;border:1px solid rgba(221,180,93,.18)!important;background:linear-gradient(145deg,rgba(8,38,54,.78),rgba(10,70,67,.42))!important;border-radius:15px!important}
      html body #atoAssistantPanel .ato-agent-profile>header{font:800 8px/1.2 Arial,sans-serif!important;letter-spacing:.15em!important;color:#e0b95e!important;text-transform:uppercase!important;margin-bottom:9px!important}
      html body #atoAssistantPanel .ato-agent-profile-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important}.ato-agent-profile-grid div{padding:8px 9px!important;border-radius:10px!important;background:rgba(255,255,255,.035)!important}.ato-agent-profile-grid small{display:block!important;font:700 7px Arial,sans-serif!important;letter-spacing:.08em!important;color:rgba(224,185,94,.74)!important;text-transform:uppercase!important;margin-bottom:3px!important}.ato-agent-profile-grid b{display:block!important;font:700 9px/1.35 Arial,sans-serif!important;color:#f4f7f6!important;word-break:break-word!important}.ato-agent-profile-missing{margin:8px 0 0!important;font:600 8px/1.35 Arial,sans-serif!important;color:rgba(237,244,243,.62)!important}
      html body #atoAssistantPanel .ato-agent-actions{display:flex!important;gap:7px!important;flex-wrap:wrap!important;margin-top:9px!important}.ato-agent-actions button{appearance:none!important;min-height:34px!important;padding:0 11px!important;border-radius:10px!important;border:1px solid rgba(226,185,92,.34)!important;background:rgba(226,185,92,.075)!important;color:#f3d48d!important;font:800 7.8px/1 Arial,sans-serif!important;letter-spacing:.07em!important;text-transform:uppercase!important;cursor:pointer!important}.ato-agent-actions button[data-primary="true"]{background:linear-gradient(135deg,rgba(209,161,60,.94),rgba(233,196,104,.90))!important;color:#09283a!important;border-color:rgba(255,230,158,.62)!important}.ato-agent-actions button:hover{filter:brightness(1.08)!important}.ato-agent-recommendations .ato-agent-card-actions{display:flex!important;gap:6px!important;align-items:center!important;flex-wrap:wrap!important}.ato-agent-recommendations button{appearance:none!important;border:0!important;background:transparent!important;padding:0!important;font:800 8px Arial,sans-serif!important;letter-spacing:.06em!important;color:#b8d8d2!important;cursor:pointer!important}.ato-agent-recommendations button.is-added{color:#70d8b9!important}
      html body #atoAssistantPanel .ato-agent-offer-rescue{padding:12px!important}
      html body #atoAssistantPanel .ato-agent-offer-rescue>header{display:flex!important;justify-content:space-between!important;gap:10px!important;align-items:center!important;margin-bottom:9px!important;font:800 8px Arial,sans-serif!important;letter-spacing:.09em!important;color:#efd083!important}
      html body #atoAssistantPanel .ato-agent-offer-rescue>header span{font-size:7px!important;color:#a8cfca!important;text-align:right!important}
      html body #atoAssistantPanel .ato-agent-offer-totals{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important;margin:7px 0 9px!important}
      html body #atoAssistantPanel .ato-agent-offer-totals div{padding:8px!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:10px!important;background:rgba(255,255,255,.025)!important}
      html body #atoAssistantPanel .ato-agent-offer-totals small{display:block!important;font:700 6.5px Arial,sans-serif!important;letter-spacing:.06em!important;color:rgba(221,235,232,.58)!important}
      html body #atoAssistantPanel .ato-agent-offer-totals b{display:block!important;margin-top:4px!important;font:800 13px Arial,sans-serif!important;color:#fff5dd!important}
      html body #atoAssistantPanel .ato-agent-offer-totals .is-save b{color:#72d9b4!important}
      html body #atoAssistantPanel .ato-agent-offer-lines{display:grid!important;gap:5px!important}
      html body #atoAssistantPanel .ato-agent-offer-lines div{display:grid!important;grid-template-columns:1fr auto!important;gap:8px!important;padding:7px 0!important;border-top:1px solid rgba(255,255,255,.055)!important;font:600 8px/1.35 Arial,sans-serif!important;color:rgba(235,243,241,.76)!important}
      html body #atoAssistantPanel .ato-agent-offer-lines b{color:#edd087!important;white-space:nowrap!important}
      html body #atoAssistantPanel .ato-agent-offer-rescue>small{display:block!important;margin-top:8px!important;font:500 7.2px/1.45 Arial,sans-serif!important;color:rgba(226,237,235,.55)!important}
      html body #atoAssistantPanel .ato-agent-contact{padding:12px!important;border:1px solid rgba(221,180,93,.24)!important;background:linear-gradient(145deg,rgba(8,35,52,.92),rgba(10,65,62,.72))!important;border-radius:15px!important}
      html body #atoAssistantPanel .ato-agent-contact>header{font:800 8px/1.2 Arial,sans-serif!important;letter-spacing:.15em!important;color:#e0b95e!important;text-transform:uppercase!important;margin-bottom:9px!important}.ato-agent-contact form{display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important}.ato-agent-contact label{display:grid!important;gap:4px!important;font:700 7px Arial,sans-serif!important;letter-spacing:.07em!important;color:rgba(226,191,112,.78)!important;text-transform:uppercase!important}.ato-agent-contact input{width:100%!important;min-width:0!important;height:36px!important;border-radius:9px!important;border:1px solid rgba(255,255,255,.11)!important;background:rgba(255,255,255,.045)!important;color:#fff!important;padding:0 10px!important;outline:none!important;font:600 10px Arial,sans-serif!important}.ato-agent-contact input:focus{border-color:rgba(224,185,94,.55)!important;box-shadow:0 0 0 2px rgba(224,185,94,.08)!important}.ato-agent-contact button{grid-column:1/-1!important;min-height:36px!important;border-radius:10px!important;border:1px solid rgba(255,230,158,.62)!important;background:linear-gradient(135deg,rgba(209,161,60,.94),rgba(233,196,104,.90))!important;color:#09283a!important;font:900 8px Arial,sans-serif!important;letter-spacing:.07em!important;text-transform:uppercase!important;cursor:pointer!important}.ato-agent-contact small{grid-column:1/-1!important;font:500 8px/1.35 Arial,sans-serif!important;color:rgba(233,241,239,.62)!important}.ato-agent-contact .is-error{color:#ffd0d0!important}.ato-agent-contact .is-success{color:#a9ebd4!important}
      @media(max-width:560px){html body #atoAssistantPanel .ato-agent-contact form{grid-template-columns:1fr!important}.ato-agent-contact button,.ato-agent-contact small{grid-column:1!important}}
      html body #atoAssistantPanel .ato-agent-weather{padding:12px!important}
      html body #atoAssistantPanel .ato-agent-weather>header,html body #atoAssistantPanel .ato-agent-compare>header{font:800 8px/1.2 Arial,sans-serif!important;letter-spacing:.15em!important;color:#e0b95e!important;text-transform:uppercase!important;margin-bottom:9px!important}
      html body #atoAssistantPanel .ato-agent-weather>p{display:grid!important;gap:3px!important;margin:0 0 10px!important;padding:9px 10px!important;border-radius:11px!important;background:rgba(221,180,93,.08)!important}
      html body #atoAssistantPanel .ato-agent-weather>p strong{font:800 10px/1.3 Arial,sans-serif!important;color:#fff3d7!important}.ato-agent-weather>p span{font:500 10px/1.35 Arial,sans-serif!important;color:rgba(239,245,243,.72)!important}
      html body #atoAssistantPanel .ato-agent-weather-days{display:flex!important;gap:7px!important;overflow-x:auto!important;scrollbar-width:none!important}.ato-agent-weather-days>div{min-width:92px!important;display:grid!important;gap:2px!important;padding:8px!important;border-radius:10px!important;background:rgba(255,255,255,.035)!important}.ato-agent-weather-days b{font:800 9px Arial,sans-serif!important;color:#f1ce7b!important}.ato-agent-weather-days span{font:500 9px Arial,sans-serif!important;color:#eef5f4!important}.ato-agent-weather-days em{font:800 11px Arial,sans-serif!important;font-style:normal!important;color:white!important}.ato-agent-weather-days small{font:500 7.5px Arial,sans-serif!important;color:rgba(220,234,231,.6)!important}
      html body #atoAssistantPanel .ato-agent-recommendations{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.ato-agent-recommendations article{padding:11px!important;min-width:0!important}.ato-agent-card-top{display:flex!important;gap:6px!important;justify-content:space-between!important;align-items:flex-start!important}.ato-agent-card-top span{font:800 7px Arial,sans-serif!important;letter-spacing:.1em!important;color:#dfb75b!important}.ato-agent-card-top b{font:700 8px Arial,sans-serif!important;color:#dfeeed!important;max-width:55%!important;text-align:right!important}.ato-agent-recommendations h4{margin:7px 0 5px!important;font:800 12px/1.25 Arial,sans-serif!important;color:#fff!important}.ato-agent-recommendations p{margin:0 0 8px!important;font:500 9.5px/1.4 Arial,sans-serif!important;color:rgba(234,243,241,.72)!important}.ato-agent-recommendations a{font:800 8px Arial,sans-serif!important;letter-spacing:.06em!important;color:#efd083!important;text-decoration:none!important}
      html body #atoAssistantPanel .ato-agent-compare{padding:12px!important}.ato-agent-compare>div{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}.ato-agent-compare article{padding:9px!important;border-radius:10px!important;background:rgba(255,255,255,.035)!important}.ato-agent-compare h4{margin:0 0 5px!important;font:800 10px/1.3 Arial,sans-serif!important;color:white!important}.ato-agent-compare b,.ato-agent-compare small{display:block!important;font:700 8px/1.35 Arial,sans-serif!important;color:#e5c36e!important}.ato-agent-compare p{margin:5px 0 0!important;font:500 9px/1.35 Arial,sans-serif!important;color:rgba(235,244,242,.7)!important}
      html body #atoAssistantPanel .ato-agent-itinerary{padding:12px!important;border:1px solid rgba(221,180,93,.22)!important;background:linear-gradient(145deg,rgba(8,36,53,.88),rgba(10,70,64,.58))!important;border-radius:15px!important}.ato-agent-itinerary>header{display:flex!important;justify-content:space-between!important;gap:8px!important;align-items:center!important;margin-bottom:8px!important}.ato-agent-itinerary>header b{font:800 8px Arial,sans-serif!important;letter-spacing:.14em!important;color:#e0b95e!important;text-transform:uppercase!important}.ato-agent-itinerary>header span{font:700 7px Arial,sans-serif!important;color:rgba(230,240,237,.6)!important;text-align:right!important}.ato-agent-itinerary>p{margin:0 0 9px!important;font:500 9.5px/1.4 Arial,sans-serif!important;color:rgba(239,246,244,.76)!important}.ato-agent-itinerary-days{display:grid!important;gap:6px!important}.ato-agent-itinerary-day{display:grid!important;grid-template-columns:58px 1fr!important;gap:8px!important;padding:8px!important;border-radius:10px!important;background:rgba(255,255,255,.035)!important}.ato-agent-itinerary-day>time{font:800 8px/1.25 Arial,sans-serif!important;color:#e8c66f!important}.ato-agent-itinerary-day h5{margin:0 0 2px!important;font:800 9.5px/1.25 Arial,sans-serif!important;color:#fff!important}.ato-agent-itinerary-day p{margin:0!important;font:500 8.5px/1.35 Arial,sans-serif!important;color:rgba(233,242,240,.68)!important}.ato-agent-itinerary-note{display:block!important;margin-top:8px!important;font:600 7.5px/1.35 Arial,sans-serif!important;color:rgba(229,238,235,.55)!important}
      .ato-agent-event{margin:10px 0 0!important;border:1px solid rgba(232,182,79,.24)!important;border-radius:15px!important;background:linear-gradient(145deg,rgba(22,45,65,.84),rgba(8,31,48,.91))!important;padding:12px!important;box-shadow:0 14px 30px rgba(0,0,0,.16)!important}.ato-agent-event header{display:flex!important;justify-content:space-between!important;gap:10px!important;align-items:flex-start!important;margin-bottom:8px!important}.ato-agent-event header b{font:800 10px/1.2 Arial,sans-serif!important;letter-spacing:.11em!important;color:#f1cd78!important}.ato-agent-event header span{font:700 7px/1.25 Arial,sans-serif!important;text-align:right!important;color:rgba(241,205,120,.68)!important}.ato-agent-event>p{margin:0 0 10px!important;font:500 10px/1.45 Arial,sans-serif!important;color:rgba(240,247,246,.83)!important}.ato-agent-event-step{display:grid!important;grid-template-columns:48px 1fr!important;gap:9px!important;padding:8px 0!important;border-top:1px solid rgba(255,255,255,.06)!important}.ato-agent-event-step time{font:800 8px/1.25 Arial,sans-serif!important;color:#e6ba58!important}.ato-agent-event-step h5{margin:0 0 3px!important;font:800 10px/1.25 Arial,sans-serif!important;color:#fff!important}.ato-agent-event-step small{display:block!important;margin-bottom:3px!important;font:700 7px/1.25 Arial,sans-serif!important;color:rgba(112,197,208,.8)!important;text-transform:uppercase!important;letter-spacing:.08em!important}.ato-agent-event-step p{margin:0!important;font:500 9px/1.4 Arial,sans-serif!important;color:rgba(232,242,240,.72)!important}.ato-agent-event-meta{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;margin:8px 0!important}.ato-agent-event-meta div{padding:7px!important;border:1px solid rgba(255,255,255,.06)!important;border-radius:9px!important;background:rgba(255,255,255,.025)!important}.ato-agent-event-meta small{display:block!important;font:700 6.5px/1.2 Arial,sans-serif!important;color:rgba(236,244,242,.48)!important;text-transform:uppercase!important}.ato-agent-event-meta b{display:block!important;margin-top:2px!important;font:700 8px/1.3 Arial,sans-serif!important;color:#f5f8f7!important;word-break:break-word!important}.ato-agent-event-note{display:block!important;margin-top:7px!important;font:600 7.5px/1.35 Arial,sans-serif!important;color:rgba(229,238,235,.58)!important}.ato-agent-event-must{margin:8px 0 2px!important;padding:7px 8px!important;border:1px solid rgba(232,182,79,.10)!important;border-radius:9px!important;font:600 8px/1.4 Arial,sans-serif!important;color:rgba(240,247,246,.72)!important}.ato-agent-event-alts{display:grid!important;gap:6px!important;margin-top:10px!important}.ato-agent-event-alts>small{font:800 7px/1.2 Arial,sans-serif!important;letter-spacing:.11em!important;color:rgba(241,205,120,.7)!important}.ato-agent-event-alt{display:grid!important;grid-template-columns:1fr auto!important;gap:8px!important;align-items:center!important;padding:8px!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:10px!important;background:rgba(255,255,255,.02)!important}.ato-agent-event-alt b{display:block!important;font:800 9px/1.25 Arial,sans-serif!important;color:#fff!important}.ato-agent-event-alt p{margin:2px 0 0!important;font:500 8px/1.35 Arial,sans-serif!important;color:rgba(232,242,240,.65)!important}.ato-agent-event-alt button{border:1px solid rgba(232,182,79,.32)!important;border-radius:999px!important;background:rgba(232,182,79,.06)!important;color:#f0cb75!important;padding:6px 8px!important;font:800 6.5px/1 Arial,sans-serif!important;letter-spacing:.08em!important;cursor:pointer!important}
      @media(max-width:980px){
        html body #atoAssistantPanel.ato-assistant-panel{left:12px!important;right:12px!important;top:auto!important;bottom:calc(12px + env(safe-area-inset-bottom,0px))!important;width:auto!important;height:min(78vh,650px)!important;min-height:430px!important;max-height:calc(100vh - 24px - env(safe-area-inset-top,0px))!important;transform:translateY(8px) scale(.99)!important;border-radius:22px!important}
        html body #atoAssistantPanel.is-open{transform:translateY(0) scale(1)!important}
        html body #atoAssistantPanel .ato-assistant-head{padding:18px 17px 14px!important}
        html body #atoAssistantPanel .ato-assistant-head h3{font-size:21px!important}
        html body #atoAssistantPanel .ato-assistant-thread{padding:16px 17px 8px!important}
        html body #atoAssistantPanel .ato-agent-extras{margin:2px 17px 10px!important}
        html body #atoAssistantPanel .ato-agent-recommendations{grid-template-columns:1fr!important}
        html body #atoAssistantPanel .ato-agent-compare>div{grid-template-columns:1fr!important}
        html body #atoAssistantPanel .ato-assistant-chips{padding:6px 17px 11px!important;gap:6px!important;overflow-x:auto!important;flex-wrap:nowrap!important;scrollbar-width:none!important}
        html body #atoAssistantPanel .ato-assistant-chips button{flex:0 0 auto!important;white-space:nowrap!important}
        html body #atoAssistantPanel .ato-assistant-handoff{padding:0 17px 10px!important}
        html body #atoAssistantPanel .ato-assistant-compose{padding:0 17px 8px!important}
        html body #atoAssistantPanel .ato-assistant-fineprint{padding:0 17px 12px!important;font-size:6.8px!important}
      }

      @media (prefers-reduced-motion:reduce){
        .ato-ai-orbit,
        .ato-ai-orb-particle,
        .ato-ai-orb-core,
        .ato-ai-orb-pass{
          animation:none!important;
        }
        #atoAssistantLaunch.ato-ai-orb-launch,
        .ato-ai-orb-label{
          transition-duration:120ms!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function orbMarkup(){
    return `
      <span class="ato-ai-orb-shell" aria-hidden="true">
        <svg class="ato-ai-orb-symbol" viewBox="0 0 64 64" focusable="false" aria-hidden="true">
          <defs>
            <radialGradient id="atoNativeOrbHalo" cx="50%" cy="50%" r="62%">
              <stop offset="0" stop-color="#fff9ef" stop-opacity=".95"/>
              <stop offset=".18" stop-color="#f0cf89" stop-opacity=".82"/>
              <stop offset=".46" stop-color="#1f5f95" stop-opacity=".48"/>
              <stop offset="1" stop-color="#0b2948" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="atoNativeOrbCore" cx="40%" cy="36%" r="74%">
              <stop offset="0" stop-color="#fff9ef"/>
              <stop offset=".24" stop-color="#f6d58f"/>
              <stop offset=".58" stop-color="#e8b64f"/>
              <stop offset="1" stop-color="#b97818"/>
            </radialGradient>
            <linearGradient id="atoNativeOrbRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#fff9ef" stop-opacity=".96"/>
              <stop offset=".36" stop-color="#f0cf89" stop-opacity=".88"/>
              <stop offset="1" stop-color="#1f5f95" stop-opacity=".66"/>
            </linearGradient>
          </defs>

          <ellipse class="ato-ai-orbit ato-ai-orbit--a" cx="32" cy="32" rx="24.6" ry="8.0"/>
          <ellipse class="ato-ai-orbit ato-ai-orbit--b" cx="31.4" cy="31.8" rx="21.5" ry="10.8"/>
          <ellipse class="ato-ai-orbit ato-ai-orbit--c" cx="32.8" cy="31.4" rx="17.6" ry="6.0"/>
          <ellipse class="ato-ai-orbit ato-ai-orbit--d" cx="31.8" cy="32.6" rx="25.8" ry="9.2"/>
          <ellipse class="ato-ai-orb-pass" cx="32" cy="32" rx="24.6" ry="8.0"/>

          <g class="ato-ai-orb-particle ato-ai-orb-particle--1"><circle cx="32" cy="8" r="1.12" fill="#e8b64f"/></g>
          <g class="ato-ai-orb-particle ato-ai-orb-particle--2"><circle cx="53.2" cy="25.6" r=".96" fill="#5d87ac"/></g>
          <g class="ato-ai-orb-particle ato-ai-orb-particle--3"><circle cx="17.4" cy="13.9" r=".80" fill="#fff9ef"/></g>
          <g class="ato-ai-orb-particle ato-ai-orb-particle--4"><circle cx="12.4" cy="42.2" r=".86" fill="#d7a83e"/></g>
          <g class="ato-ai-orb-particle ato-ai-orb-particle--5"><circle cx="44.6" cy="51.6" r=".92" fill="#1f5f95"/></g>
          <g class="ato-ai-orb-particle ato-ai-orb-particle--6"><circle cx="47.6" cy="16" r=".78" fill="#f0cf89"/></g>

          <g class="ato-ai-orb-core">
            <circle cx="32" cy="32" r="13.8" fill="url(#atoNativeOrbHalo)" opacity=".94"/>
            <circle cx="32" cy="32" r="8.9" fill="url(#atoNativeOrbHalo)" opacity=".38"/>
            <circle cx="32" cy="32" r="6.4" fill="none" stroke="url(#atoNativeOrbRing)" stroke-width=".88" stroke-opacity=".74"/>
            <circle cx="32" cy="32" r="5.6" fill="url(#atoNativeOrbCore)"/>
            <circle cx="32" cy="32" r="2.7" fill="#fff9ef" opacity=".24"/>
            <circle cx="31.15" cy="31.0" r=".78" fill="#fff9ef" opacity=".95"/>
          </g>
        </svg>
      </span>
      <span class="ato-ai-orb-label" aria-hidden="true">AI Assistant</span>
    `;
  }

  function initOrbHint(){
    const launch=$('#atoAssistantLaunch');
    if(!launch || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    let seen=false;
    try{ seen=sessionStorage.getItem(ORB_HINT_KEY)==='1'; }catch(e){}
    if(seen) return;

    setTimeout(()=>{
      const b=$('#atoAssistantLaunch');
      if(!b || b.getAttribute('aria-expanded')==='true') return;
      b.classList.add('ato-ai-orb-hint');
      setTimeout(()=>b?.classList.remove('ato-ai-orb-hint'),2400);
      try{ sessionStorage.setItem(ORB_HINT_KEY,'1'); }catch(e){}
    },5600);
  }

  function buildUI(){
    if(assistantDisabled()) return;
    injectOrbStyles();
    // Remove the old generic WhatsApp/Concierge popup without editing legacy markup.
    document.querySelectorAll('.whatsapp-popup, .ato-concierge').forEach(el=>el.remove());
    if($('#atoAssistantRoot')) return;

    const t=T();
    const c=contextCopy();
    const root=document.createElement('div');
    root.id='atoAssistantRoot';
    root.className='ato-assistant';
    root.innerHTML=`
      <button class="ato-assistant-launch ato-ai-orb-launch" id="atoAssistantLaunch" type="button"
              aria-label="Open AI Assistant" aria-expanded="false">
        ${orbMarkup()}
      </button>

      <section class="ato-assistant-panel" id="atoAssistantPanel" aria-hidden="true" aria-label="${esc(c.title)}">
        <header class="ato-assistant-head">
          <div>
            <div class="ato-assistant-eyebrow"><span class="ato-assistant-brand-main">ALANYA TOUR</span> <span class="ato-assistant-brand-org">ORGANIZATIONS</span></div>
            <h3 id="atoAssistantContextTitle">${esc(c.title)}</h3>
            <div class="ato-assistant-status"><span></span><b id="atoAssistantContextStatus">${esc(c.status||t.status)}</b></div>
          </div>
          <div class="ato-assistant-head__actions">
            <button type="button" id="atoAssistantReset" title="${esc(t.reset)}" aria-label="${esc(t.reset)}">↺</button>
            <button type="button" id="atoAssistantClose" title="${esc(t.close)}" aria-label="${esc(t.close)}">×</button>
          </div>
        </header>

        <div class="ato-assistant-thread" id="atoAssistantThread" aria-live="polite"></div>
        <div class="ato-assistant-chips" id="atoAssistantChips"></div>

        <div class="ato-assistant-handoff">
          <button type="button" id="atoAssistantManager">
            <span>${esc(t.manager)}</span><b>→</b>
          </button>
        </div>

        <form class="ato-assistant-compose" id="atoAssistantForm">
          <textarea id="atoAssistantInput" rows="1" maxlength="900" placeholder="${esc(t.placeholder)}" aria-label="${esc(t.placeholder)}"></textarea>
          <button type="submit" id="atoAssistantSend" aria-label="${esc(t.send)}">↗</button>
        </form>
        <div class="ato-assistant-fineprint">AI ASSISTANT · FINAL AVAILABILITY & BOOKING CONFIRMED BY ATO MANAGER</div>
      </section>`;
    document.body.appendChild(root);
    initLaunchTone();

    renderHistory();
    renderChips();
    bind();
    initOrbHint();
  }

  function bubble(role,text, temporary=false){
    const wrap=document.createElement('div');
    wrap.className=`ato-assistant-msg ato-assistant-msg--${role}${temporary?' is-temporary':''}`;
    wrap.innerHTML=`<div class="ato-assistant-msg__label">${role==='user'?'YOU':'ATO'}</div><div class="ato-assistant-msg__body">${esc(text).replace(/\n/g,'<br>')}</div>`;
    return wrap;
  }

  function renderHistory(){
    const thread=$('#atoAssistantThread'); if(!thread) return;
    thread.innerHTML='';
    if(!history.length) thread.appendChild(bubble('assistant',contextCopy().intro));
    history.forEach(m=>thread.appendChild(bubble(m.role,m.text)));
    thread.scrollTop=thread.scrollHeight;
  }

  function renderChips(){
    const el=$('#atoAssistantChips'); if(!el) return;
    el.innerHTML=contextCopy().chips.map(x=>`<button type="button" data-ato-prompt="${esc(x)}">${esc(x)}</button>`).join('');
  }

  function add(role,text){
    history.push({role,text:String(text).slice(0,1800)});
    history=history.slice(-MAX_HISTORY);
    save();
    const thread=$('#atoAssistantThread');
    thread.appendChild(bubble(role,text));
    thread.scrollTop=thread.scrollHeight;
  }

  function renderAgentExtras(data){
    const thread=$('#atoAssistantThread'); if(!thread||!data) return;
    const L=agentLabels();
    const wrap=document.createElement('div'); wrap.className='ato-agent-extras';
    const state=loadAgentState();
    const p={...(state.lead_profile||{}),...(data.lead_profile||{})};
    const hasProfile=p.adults!=null || (p.children_ages||[]).length || p.hotel || (p.preferred_dates||[]).length || p.budget_amount!=null || (p.preferences||[]).length;
    if(hasProfile){
      const missing=profileMissing(p);
      const card=document.createElement('section'); card.className='ato-agent-profile';
      const children=p.children_count===0?'0':(Array.isArray(p.children_ages)&&p.children_ages.length?p.children_ages.join(', '):(p.children_count!=null?String(p.children_count):'—'));
      const dates=Array.isArray(p.preferred_dates)&&p.preferred_dates.length?p.preferred_dates.join(', '):'—';
      const prefs=Array.isArray(p.preferences)&&p.preferences.length?p.preferences.join(', '):'—';
      const budget=p.budget_amount!=null?`${p.budget_amount} ${p.budget_currency||'EUR'}`:'—';
      card.innerHTML=`<header>${esc(L.profile)}</header><div class="ato-agent-profile-grid"><div><small>${esc(L.adults)}</small><b>${esc(p.adults??'—')}</b></div><div><small>${esc(L.children)}</small><b>${esc(children)}</b></div><div><small>${esc(L.dates)}</small><b>${esc(dates)}</b></div><div><small>${esc(L.budget)}</small><b>${esc(budget)}</b></div><div><small>${esc(L.hotel)}</small><b>${esc(p.hotel||'—')}</b></div><div><small>${esc(L.prefs)}</small><b>${esc(prefs)}</b></div></div>${missing.length?`<p class="ato-agent-profile-missing">${esc(L.missing)}: ${esc(missing.join(' · '))}</p>`:''}`;
      wrap.appendChild(card);
    }
    const weather=data.weather;
    if(weather&&Array.isArray(weather.days)&&weather.days.length){
      const card=document.createElement('section'); card.className='ato-agent-weather';
      const best=weather.best_weather_day?`<strong>${esc(L.best)} · ${esc(weather.best_weather_day)}</strong><span>${esc(weather.best_day_reason||'')}</span>`:'';
      const days=weather.days.slice(0,7).map(d=>`<div><b>${esc(d.date.slice(5))}</b><span>${esc(d.summary)}</span><em>${esc(String(Math.round(d.max_c)))}° / ${esc(String(Math.round(d.min_c)))}°</em><small>☂ ${esc(String(Math.round(d.precip_probability_percent)))}% · ↝ ${esc(String(Math.round(d.wind_max_kmh)))} km/h</small></div>`).join('');
      card.innerHTML=`<header>${esc(L.weather)} · ${esc(weather.location||'')}</header>${best?`<p>${best}</p>`:''}<div class="ato-agent-weather-days">${days}</div>`; wrap.appendChild(card);
    }
    if(Array.isArray(data.recommendations)&&data.recommendations.length){
      const grid=document.createElement('section'); grid.className='ato-agent-recommendations';
      grid.innerHTML=data.recommendations.slice(0,4).map(r=>{const added=plannerPool().map(normalizeTourUrl).includes(normalizeTourUrl(r.url));return `<article><div class="ato-agent-card-top"><span>${esc(r.best_for||'ATO PICK')}</span><b>${esc(r.price_label||'')}</b></div><h4>${esc(r.title)}</h4><p>${esc(r.reason)}</p><div class="ato-agent-card-actions">${r.url?`<a href="${esc(r.url)}">${esc(L.view)} →</a><button type="button" class="${added?'is-added':''}" data-ato-add-compare="${esc(r.url)}">${esc(added?L.added:L.compareAdd)}</button>`:''}</div></article>`}).join(''); wrap.appendChild(grid);
    }
    if(Array.isArray(data.comparison)&&data.comparison.length>1){
      const comp=document.createElement('section'); comp.className='ato-agent-compare'; comp.innerHTML=`<header>${esc(L.compare)}</header><div>${data.comparison.slice(0,4).map(x=>`<article><h4>${esc(x.title)}</h4><b>${esc(x.price_label||'')}</b><small>${esc(x.duration||'')}</small><p>${esc(x.why_it_fits||'')}</p></article>`).join('')}</div>`; wrap.appendChild(comp);
    }
    const itinerary=data.itinerary&&typeof data.itinerary==='object'?data.itinerary:null;
    if(itinerary&&itinerary.status==='proposed'&&Array.isArray(itinerary.days)&&itinerary.days.length){
      const sec=document.createElement('section'); sec.className='ato-agent-itinerary';
      const days=itinerary.days.slice(0,14).map(d=>`<div class="ato-agent-itinerary-day"><time>${esc((d.date||'').slice(5)||d.date||'—')}</time><div><h5>${esc(d.type==='tour'?(d.title||'ATO Tour'):L.rest)}</h5><p>${esc(d.reason||'')}</p></div></div>`).join('');
      sec.innerHTML=`<header><b>${esc(L.itinerary)}</b><span>${esc(L.proposed)}</span></header><p>${esc(itinerary.summary||itinerary.title||'')}</p><div class="ato-agent-itinerary-days">${days}</div>${itinerary.budget_note?`<small class="ato-agent-itinerary-note">${esc(itinerary.budget_note)}</small>`:''}${itinerary.disclaimer?`<small class="ato-agent-itinerary-note">${esc(itinerary.disclaimer)}</small>`:''}`;
      wrap.appendChild(sec);
    }
    const eventPlan=data.event_plan&&typeof data.event_plan==='object'?data.event_plan:null;
    const eventProfile=data.event_profile&&typeof data.event_profile==='object'?data.event_profile:(state.event_profile||null);
    if(eventPlan&&eventPlan.status==='proposed'&&Array.isArray(eventPlan.components)&&eventPlan.components.length){
      const sec=document.createElement('section'); sec.className='ato-agent-event';
      const must=Array.isArray(eventProfile?.must_haves)&&eventProfile.must_haves.length?eventProfile.must_haves.join(', '):'—';
      const steps=eventPlan.components.slice(0,8).map(x=>`<div class="ato-agent-event-step"><time>${esc(x.time||'FLEX')}</time><div><small>${esc(x.role||'VIP SERVICE')}</small><h5>${esc(x.title||x.service_id||'ATO VIP')}</h5><p>${esc(x.reason||'')}</p><p><b>${esc(x.price_label||'On request')}</b></p></div></div>`).join('');
      const alts=Array.isArray(eventPlan.alternatives)&&eventPlan.alternatives.length?`<div class="ato-agent-event-alts"><small>${esc(L.eventOptions)}</small>${eventPlan.alternatives.slice(0,3).map(a=>`<div class="ato-agent-event-alt"><div><b>${esc(a.name||'Option')}</b><p>${esc(a.description||'')} ${a.changes?`· ${esc(a.changes)}`:''}</p></div><button type="button" data-ato-event-alternative="${esc(a.name||'Option')}">${esc(L.chooseConcept)}</button></div>`).join('')}</div>`:'';
      sec.innerHTML=`<header><b>${esc(L.event)}</b><span>${esc(L.eventProposed)}</span></header><div class="ato-agent-event-meta"><div><small>${esc(L.eventDate)}</small><b>${esc(eventProfile?.event_date||'—')}</b></div><div><small>${esc(L.guests)}</small><b>${esc(eventProfile?.guest_count??'—')}</b></div><div><small>${esc(L.style)}</small><b>${esc(eventProfile?.style||'—')}</b></div></div><div class="ato-agent-event-must"><b>${esc(L.must)}:</b> ${esc(must)}${eventProfile?.occasion_for?` · <b>${esc(L.eventFor)}:</b> ${esc(eventProfile.occasion_for)}`:''}</div><p>${esc(eventPlan.summary||eventPlan.title||'')}</p>${steps}${alts}${eventPlan.budget_note?`<small class="ato-agent-event-note">${esc(eventPlan.budget_note)}</small>`:''}${eventPlan.disclaimer?`<small class="ato-agent-event-note">${esc(eventPlan.disclaimer)}</small>`:''}`;
      wrap.appendChild(sec);
    }

    const offer=data.offer_rescue&&typeof data.offer_rescue==='object'?data.offer_rescue:null;
    if(offer&&['potential_calculated','partial','manager_confirmation'].includes(offer.status)){
      const sec=document.createElement('section'); sec.className='ato-agent-offer-rescue';
      const money=v=>v==null?'—':`€${Number(v).toFixed(2).replace(/\.00$/,'')}`;
      const exact=offer.original_total_eur!=null&&offer.discounted_total_eur!=null&&offer.savings_eur!=null;
      const totals=exact?`<div class="ato-agent-offer-totals"><div><small>${esc(L.before)}</small><b>${esc(money(offer.original_total_eur))}</b></div><div><small>${esc(L.after)}</small><b>${esc(money(offer.discounted_total_eur))}</b></div><div class="is-save"><small>${esc(L.potentialSave)}</small><b>${esc(money(offer.savings_eur))}</b></div></div>`:'';
      const lines=Array.isArray(offer.lines)?offer.lines.slice(0,4).map(x=>`<div><span>${esc(x.title||x.tour_id||'ATO Tour')}${x.discount_percent!=null?` · ${esc(String(x.discount_percent))}%`:''}</span><b>${x.after_discount_eur!=null?esc(money(x.after_discount_eur)):esc(L.offerPending)}</b></div>`).join(''):'';
      sec.innerHTML=`<header><b>${esc(L.specialOffer)}</b><span>${esc(L.offerPending)}</span></header>${totals}${lines?`<div class="ato-agent-offer-lines">${lines}</div>`:''}<small>${esc(offer.note||L.offerPending)}</small>`;
      wrap.appendChild(sec);
    }
    const actions=document.createElement('div'); actions.className='ato-agent-actions';
    if(Array.isArray(data.recommendations)&&data.recommendations.length>1){ actions.innerHTML+=`<button type="button" data-ato-compare-all>${esc(L.compareAll)}</button>`; }
    if(data.next_action==='offer_itinerary'||data.itinerary?.status==='offered'){ actions.innerHTML+=`<button type="button" data-primary="true" data-ato-build-itinerary>${esc(L.buildPlan)}</button>`; }
    if(data.next_action==='review_itinerary'&&data.itinerary?.status==='proposed'){ actions.innerHTML+=`<button type="button" data-primary="true" data-ato-open-itinerary>${esc(L.openPlan)}</button>`; }
    if(data.next_action==='offer_vip_event'||data.event_plan?.status==='offered'){ actions.innerHTML+=`<button type="button" data-primary="true" data-ato-build-event>${esc(L.buildEvent)}</button>`; }
    if(data.next_action==='review_vip_event'&&data.event_plan?.status==='proposed'){ actions.innerHTML+=`<button type="button" data-primary="true" data-ato-ready-request>${esc(L.eventSend)}</button>`; }
    if(data.next_action==='offer_special_offer'||data.offer_rescue?.status==='offered'){ actions.innerHTML+=`<button type="button" data-primary="true" data-ato-check-special-offer>${esc(L.checkOffer)}</button>`; }
    if(data.next_action==='review_special_offer'&&data.offer_rescue&&data.offer_rescue.status!=='offered'){ actions.innerHTML+=`<button type="button" data-primary="true" data-ato-open-special-offers>${esc(L.openOffers)}</button><button type="button" data-ato-lower-budget>${esc(L.lowerBudget)}</button>`; }
    if(['ready_to_request_booking','manager_handoff'].includes(data.next_action)){ actions.innerHTML+=`<button type="button" data-primary="true" data-ato-ready-request>${esc(L.sendReady)}</button>`; }
    if(data.next_action==='payment_after_confirmation'&&confirmedPaymentUrl()){ actions.innerHTML+=`<button type="button" data-primary="true" data-ato-payment>${esc(T().send)}</button>`; }
    if(actions.childElementCount) wrap.appendChild(actions);
    if(!wrap.childElementCount) return;
    thread.appendChild(wrap); thread.scrollTop=thread.scrollHeight;
  }

  function refreshContextUI(){
    if(assistantDisabled()){ $('#atoAssistantRoot')?.remove(); return; }
    const c=contextCopy();
    const root=$('#atoAssistantRoot');
    if(root) root.dataset.mode=detectMode();
    const title=$('#atoAssistantContextTitle'); if(title) title.textContent=c.title;
    const status=$('#atoAssistantContextStatus'); if(status) status.textContent=c.status||T().status;
    const panel=$('#atoAssistantPanel'); if(panel) panel.setAttribute('aria-label',c.title);
    renderChips();
    if(!history.length) renderHistory();
  }

  function openPanel(){
    refreshContextUI();
    const p=$('#atoAssistantPanel'), b=$('#atoAssistantLaunch');
    if(!p || !b) return;

    p.classList.add('is-open');
    p.setAttribute('aria-hidden','false');
    b.setAttribute('aria-expanded','true');

    /* The panel now has self-contained geometry/visibility CSS.
       Hide the orb only after the open state has been applied. */
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        if(!p.classList.contains('is-open')) return;
        b.classList.add('is-hidden');
        setTimeout(()=>$('#atoAssistantInput')?.focus(),180);
      });
    });
  }

  function closePanel(){
    const p=$('#atoAssistantPanel'), b=$('#atoAssistantLaunch');
    if(!p || !b) return;

    p.classList.remove('is-open');
    p.setAttribute('aria-hidden','true');
    b.classList.remove('is-hidden');
    b.setAttribute('aria-expanded','false');
  }

  function autoresize(el){
    el.style.height='auto';
    el.style.height=Math.min(112, Math.max(42,el.scrollHeight))+'px';
  }

  async function send(text){
    text=String(text||'').trim();
    if(!text || busy) return;
    busy=true;
    const prior=history.slice(-8);
    add('user',text);
    const thread=$('#atoAssistantThread');
    const temp=bubble('assistant',T().thinking,true); thread.appendChild(temp); thread.scrollTop=thread.scrollHeight;
    $('#atoAssistantSend').disabled=true;

    try{
      const r=await fetch(API_URL,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          message:text,
          history:prior,
          language:lang(),
          message_language:messageLangHint(text),
          session_id:sessionId(),
          agent_state:loadAgentState(),
          page:pageContext()
        })
      });
      const data=await r.json().catch(()=>({}));
      temp.remove();
      if(!r.ok || !data.answer){
        add('assistant', r.status===503 ? T().unavailable : (data.error || T().retry));
      }else{
        add('assistant',data.answer);
        saveAgentState(data);
        renderAgentExtras(data);
        if(Array.isArray(data.suggested_questions)&&data.suggested_questions.length){
          const chips=$('#atoAssistantChips'); if(chips) chips.innerHTML=data.suggested_questions.slice(0,5).map(x=>`<button type="button" data-ato-prompt="${esc(x)}">${esc(x)}</button>`).join('');
        }
      }
    }catch(e){
      temp.remove();
      add('assistant',T().retry);
    }finally{
      busy=false;
      $('#atoAssistantSend').disabled=false;
      $('#atoAssistantInput')?.focus();
    }
  }

  function loadExternalScript(src,id){
    return new Promise((resolve,reject)=>{
      if(id&&document.getElementById(id)) return resolve();
      const existing=[...document.scripts].find(x=>x.src&&x.src.includes(src.replace(location.origin,'')));
      if(existing){ if(existing.dataset.atoLoaded==='1'||existing.readyState==='complete') return resolve(); existing.addEventListener('load',resolve,{once:true}); existing.addEventListener('error',reject,{once:true}); return; }
      const el=document.createElement('script'); if(id)el.id=id; el.src=src; el.async=false; el.onload=()=>{el.dataset.atoLoaded='1';resolve();}; el.onerror=()=>reject(new Error('Script load failed: '+src)); document.head.appendChild(el);
    });
  }
  async function ensureBookingBridge(){
    if(window.ATOBooking?.createTripRequest) return true;
    try{
      if(!window.ATO_CONFIG) await loadExternalScript('/assets/js/ato-config.js','atoAiConfigLoader');
      if(!window.supabase?.createClient) await loadExternalScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','atoAiSupabaseLoader');
      if(!window.ATO_CONFIG){
        try{await loadExternalScript('/interactive-map/booking-config.js','atoAiMapConfigLoader');}catch(_){}
        if(window.ATO_BOOKING_CONFIG){ window.ATO_CONFIG={supabaseUrl:window.ATO_BOOKING_CONFIG.supabaseUrl||'',supabasePublishableKey:window.ATO_BOOKING_CONFIG.supabaseAnonKey||'',siteBaseUrl:location.origin}; }
      }
      await loadExternalScript('/assets/js/booking-system.js','atoAiBookingBridgeLoader');
    }catch(e){ console.warn('ATO AI booking bridge unavailable',e); }
    return Boolean(window.ATOBooking?.createTripRequest);
  }
  function isoDate(v){ const x=String(v||'').trim(); return /^\d{4}-\d{2}-\d{2}$/.test(x)?x:''; }
  function requestTourItems(state){
    const p=state.lead_profile||{};
    const ids=Array.isArray(p.selected_tour_ids)?p.selected_tour_ids.filter(Boolean).slice(0,4):[];
    const recs=[...(state.recommendations||[]),...(state.comparison||[])];
    const byId=new Map(recs.filter(x=>x?.id).map(x=>[String(x.id),x]));
    const date=(p.preferred_dates||[]).map(isoDate).find(Boolean)||'';
    const items=ids.map(id=>{ const x=byId.get(String(id))||{}; return {href:x.url||`/tours/${encodeURIComponent(id)}.html`,title:x.title||String(id).replace(/[-_]+/g,' '),category:x.category||'AI selected tour',image:'',requested_date:date,confirmed_date:'',pickup:'',time:'',confirmed_price:'',price_display:x.price_label||'Manager confirmation',duration:x.duration||'See tour page',what_to_bring:[],weather_profile:'general'}; });
    if(!items.length && state.event_plan?.status==='proposed' && Array.isArray(state.event_plan.components)){
      for(const x of state.event_plan.components){ if(!x?.service_id) continue; if(items.some(y=>y.href===x.url)) continue; items.push({href:x.url||`/${encodeURIComponent(x.service_id)}.html`,title:x.title||String(x.service_id).replace(/[-_]+/g,' '),category:'VIP Services',image:'',requested_date:isoDate(state.event_profile?.event_date)||date,confirmed_date:'',pickup:'',time:x.time||'',confirmed_price:'',price_display:x.price_label||'Manager quote',duration:'Custom event component',what_to_bring:[],weather_profile:'general'}); if(items.length>=4) break; }
    }
    if(!items.length && detectMode()==='tour' && ['ready_to_request_booking','manager_handoff'].includes(state.next_action)){
      const t=currentTour(); if(t.id||t.name) items.push({href:t.url||location.pathname,title:t.name||t.id,category:'Current tour',image:'',requested_date:date,confirmed_date:'',pickup:'',time:'',confirmed_price:'',price_display:'Manager confirmation',duration:'See tour page',what_to_bring:[],weather_profile:'general'});
    }
    return items.slice(0,4);
  }
  function buildManagerPayload(state,contact){
    const p=state.lead_profile||{}, dates=(p.preferred_dates||[]).map(isoDate).filter(Boolean).sort();
    const children=p.children_count===0?'No':(p.children_count!=null?`${p.children_count} child(ren)${Array.isArray(p.children_ages)&&p.children_ages.length?` — ages ${p.children_ages.join(', ')}`:''}`:(Array.isArray(p.children_ages)&&p.children_ages.length?`${p.children_ages.length} child(ren) — ages ${p.children_ages.join(', ')}`:''));
    const notes=[
      'ATO AI Travel Sales Agent lead.',
      p.budget_amount!=null?`Budget: ${p.budget_amount} ${p.budget_currency||'EUR'}`:'',
      Array.isArray(p.preferences)&&p.preferences.length?`Preferences: ${p.preferences.join(', ')}`:'',
      p.mobility_notes?`Mobility / special notes: ${p.mobility_notes}`:'',
      state.weather?.best_weather_day?`AI weather-comfort suggestion: ${state.weather.best_weather_day}${state.weather.location?` — ${state.weather.location}`:''}. This is not availability confirmation.`:'',
      state.itinerary?.status==='proposed'?`AI proposed itinerary: ${(state.itinerary.days||[]).map(d=>`${d.date||'?'} ${d.type==='tour'?(d.title||d.tour_id):'REST/FREE'}`).join(' | ')}`:'',
      state.offer_rescue&&state.offer_rescue.status!=='none'?`Special Offers check: ${state.offer_rescue.status}${state.offer_rescue.savings_eur!=null?` · potential savings €${state.offer_rescue.savings_eur}`:''}`:'',
      state.event_profile?`VIP event brief: ${state.event_profile.event_type||'private event'} · date ${state.event_profile.event_date||'to confirm'} · guests ${state.event_profile.guest_count||'to confirm'} · style ${state.event_profile.style||'to confirm'} · must-haves ${(state.event_profile.must_haves||[]).join(', ')||'none stated'} · avoid ${(state.event_profile.avoid||[]).join(', ')||'none stated'}`:'',
      state.event_plan?.status==='proposed'?`VIP event concept: ${(state.event_plan.components||[]).map(x=>`${x.time||'flex'} ${x.title||x.service_id}`).join(' | ')}`:'',
      'Manager must confirm availability, pickup, Special Offer eligibility and final price before payment.'
    ].filter(Boolean).join('\n').slice(0,1200);
    return {
      source:state.event_plan?.status==='proposed'?'ai-vip-event':'ai-sales-agent',travel_start:isoDate(state.event_profile?.event_date)||dates[0]||'',travel_end:state.event_plan?.status==='proposed'?(isoDate(state.event_profile?.event_date)||dates[0]||''):(dates.length>1?dates[dates.length-1]:''),
      guest_name:contact.name,phone:contact.phone,hotel:p.hotel||'',room:'',adults:Math.max(1,Number(p.adults||1)),children,
      pregnancy:false,elderly:false,mobility:p.mobility_notes||'No',language:lang().toUpperCase(),notes,
      prefs:{source:state.event_plan?.status==='proposed'?'ai-vip-event':'ai-sales-agent',session_id:sessionId(),budget_amount:p.budget_amount??null,budget_currency:p.budget_currency||null,preferences:Array.isArray(p.preferences)?p.preferences:[],selected_tour_ids:Array.isArray(p.selected_tour_ids)?p.selected_tour_ids:[],weather_best_day:state.weather?.best_weather_day||null,weather_location:state.weather?.location||null,itinerary:state.itinerary?.status==='proposed'?state.itinerary:null,special_offer_check:state.offer_rescue||null,event_profile:state.event_profile||null,event_plan:state.event_plan?.status==='proposed'?state.event_plan:null},
      tours:requestTourItems(state)
    };
  }
  function showReadyContactForm(){
    const thread=$('#atoAssistantThread'); if(!thread) return;
    const existing=thread.querySelector('.ato-agent-contact'); if(existing){existing.scrollIntoView({block:'nearest',behavior:'smooth'});return;}
    const C=contactLabels(), saved=loadContact(), state=loadAgentState();
    const p=state.lead_profile||{};
    if(!requestTourItems(state).length){ add('assistant',C.needTour); return; }
    if(p.adults==null || p.children_count==null){ send(lang()==='ru'?'Перед заявкой уточни состав нашей группы: сколько взрослых и есть ли дети?':lang()==='tr'?'Talebi göndermeden önce grubumuzu netleştirelim: kaç yetişkin ve çocuk var mı?':lang()==='de'?'Klär bitte vor der Anfrage unsere Gruppe: Wie viele Erwachsene und gibt es Kinder?':lang()==='pl'?'Przed wysłaniem zapytania ustalmy grupę: ilu dorosłych i czy są dzieci?':'Before sending the request, confirm our group: how many adults and are there any children?'); return; }
    const sec=document.createElement('section'); sec.className='ato-agent-contact';
    sec.innerHTML=`<header>${esc(C.title)}</header><form><label>${esc(C.name)}<input name="name" autocomplete="name" required maxlength="180" value="${esc(saved.name||'')}"></label><label>${esc(C.phone)}<input name="phone" autocomplete="tel" inputmode="tel" required minlength="7" maxlength="80" value="${esc(saved.phone||'')}"></label><button type="submit">${esc(C.submit)}</button><small></small></form>`;
    thread.appendChild(sec); thread.scrollTop=thread.scrollHeight;
    sec.querySelector('form').addEventListener('submit',async e=>{
      e.preventDefault(); const fd=new FormData(e.currentTarget), contact=saveContact(fd.get('name'),fd.get('phone')), note=sec.querySelector('small'), btn=sec.querySelector('button');
      if(!contact.name||!contact.phone) return;
      if(contact.phone.replace(/\D/g,'').length<7){ note.className='is-error'; note.textContent=C.phone; return; }
      btn.disabled=true; note.className=''; note.textContent=C.saving;
      const stateNow=loadAgentState(), payload=buildManagerPayload(stateNow,contact);
      if(!payload.tours.length){ note.className='is-error'; note.textContent=C.needTour; btn.disabled=false; return; }
      let requestNo='', saveError=null;
      try{
        const bridge=await ensureBookingBridge();
        if(!bridge) throw new Error('ATOBooking bridge is not configured.');
        const result=await window.ATOBooking.createTripRequest(payload); const data=result?.data||null;
        requestNo=data?.request_no||data?.requestNo||''; if(!requestNo) throw new Error('ATO Manager did not return a request number.');
        try{sessionStorage.setItem('atoLastAiRequest',JSON.stringify({request_no:requestNo,createdAt:new Date().toISOString()}));}catch(_){}
        note.className='is-success'; note.textContent=`${C.saved}: ${requestNo}`;
      }catch(err){ saveError=err; console.error('ATO AI manager save failed',err); note.className='is-error'; note.textContent=C.fallback; }
      btn.disabled=false;
      managerHandoff({requestNo,savedToManager:Boolean(requestNo),saveError:saveError?.message||'',contact});
    });
  }

  function managerHandoff(options={}){
    const t=T();
    const transcript=history.slice(-8).map(m=>`${m.role==='user'?'CLIENT':'ATO ASSISTANT'}: ${m.text}`).join('\n\n').slice(0,2600);
    const state=loadAgentState();
    const p=state.lead_profile||{};
    const contact=options.contact||loadContact();
    const leadLines=[
      `Adults: ${p.adults??'—'}`,
      `Children: ${p.children_count??'—'}`,
      `Children ages: ${Array.isArray(p.children_ages)&&p.children_ages.length?p.children_ages.join(', '):(p.children_count===0?'none':'—')}`,
      `Hotel: ${p.hotel||'—'}`,
      `Preferred dates: ${Array.isArray(p.preferred_dates)&&p.preferred_dates.length?p.preferred_dates.join(', '):'—'}`,
      `Budget: ${p.budget_amount!=null?`${p.budget_amount} ${p.budget_currency||''}`.trim():'—'}`,
      `Preferences: ${Array.isArray(p.preferences)&&p.preferences.length?p.preferences.join(', '):'—'}`,
      `Selected tour IDs: ${Array.isArray(p.selected_tour_ids)&&p.selected_tour_ids.length?p.selected_tour_ids.join(', '):'—'}`,
      `Next action: ${state.next_action||'—'}`,
      `Recommendations: ${Array.isArray(state.recommendations)&&state.recommendations.length?state.recommendations.map(x=>x.title||x.id).filter(Boolean).join(' | '):'—'}`,
      `Best weather day: ${state.weather?.best_weather_day||'—'}${state.weather?.location?` (${state.weather.location})`:''}`,
      `AI itinerary: ${state.itinerary?.status==='proposed'?(state.itinerary.days||[]).map(d=>`${d.date||'?'} ${d.type==='tour'?(d.title||d.tour_id):'REST/FREE'}`).join(' | '):'—'}`,
      `Special Offers check: ${state.offer_rescue?.status||'—'}${state.offer_rescue?.savings_eur!=null?` · potential savings €${state.offer_rescue.savings_eur}`:''}`,
      `VIP event: ${state.event_profile?`${state.event_profile.event_type||'private event'} · ${state.event_profile.event_date||'date to confirm'} · ${state.event_profile.guest_count||'guest count to confirm'} guests · ${state.event_profile.style||'style to confirm'}`:'—'}`,
      `VIP event concept: ${state.event_plan?.status==='proposed'?(state.event_plan.components||[]).map(x=>`${x.time||'flex'} ${x.title||x.service_id}`).join(' | '):'—'}`
    ];
    const msg=[
      state.event_plan?.status==='proposed'?'ATO AI VIP EVENT CONCIERGE — READY EVENT HANDOFF':'ATO AI TRAVEL SALES AGENT — READY CLIENT HANDOFF',
      options.requestNo?`Request No: ${options.requestNo}`:'Request No: not saved automatically',
      `Saved in ATO Manager: ${options.savedToManager?'YES':'NO'}`,
      options.saveError?`Save note: ${options.saveError}`:'',
      `Client name: ${contact.name||'—'}`,
      `Client WhatsApp: ${contact.phone||'—'}`,
      `Language: ${lang().toUpperCase()}`,
      `Page: ${location.href}`,
      `Assistant mode: ${detectMode()}`,
      `Current tour: ${currentTour().name || '—'}`,
      `Selected tours: ${selectedTours().join(', ') || '—'}`,
      '',
      'STRUCTURED CLIENT PROFILE',
      ...leadLines,
      '',
      transcript || t.managerLead,
      '',
      'Please continue this conversation as ATO Manager.'
    ].join('\n');
    window.open(`https://wa.me/${MANAGER_WA}?text=${encodeURIComponent(msg)}`,'_blank','noopener');
  }

  function vipEventAlternativePrompt(name){
    const l=lang(), n=String(name||'').trim();
    if(l==='ru') return `Выбираю концепцию «${n}». Перестрой VIP-мероприятие в этом направлении, сохрани мои уже названные дату, гостей, бюджет и пожелания.`;
    if(l==='tr') return `“${n}” konseptini seçiyorum. VIP etkinliği bu yönde geliştir; verdiğim tarih, misafir, bütçe ve istekleri koru.`;
    if(l==='de') return `Ich wähle das Konzept „${n}“. Verfeinere das VIP-Event in diese Richtung und behalte Datum, Gäste, Budget und Wünsche bei.`;
    if(l==='pl') return `Wybieram koncepcję „${n}”. Dopracuj wydarzenie VIP w tym kierunku, zachowując moją datę, gości, budżet i życzenia.`;
    return `I choose the “${n}” concept. Refine the VIP event in that direction while keeping my known date, guests, budget and wishes.`;
  }

  function vipEventAcceptPrompt(){
    const l=lang();
    if(l==='ru') return 'Да. Составь моё VIP-мероприятие как concierge: используй мои уже названные дату, гостей, бюджет, стиль, пожелания и ограничения. Подбери только проверенные VIP-услуги ATO, выстрой их по времени и предложи цельную концепцию. Не выдумывай финальную смету — услуги On Request и From должен подтвердить ATO Manager.';
    if(l==='tr') return 'Evet. VIP etkinliğimi concierge gibi tasarla: söylediğim tarih, misafir, bütçe, stil, istek ve kısıtları kullan. Yalnızca doğrulanmış ATO VIP hizmetlerini zaman akışında birleştir. Nihai fiyat uydurma; On Request/From hizmetlerini ATO Manager onaylasın.';
    if(l==='de') return 'Ja. Plane mein VIP-Event wie ein Concierge anhand meiner bereits genannten Daten, Gästezahl, Budget, Stil, Wünsche und Einschränkungen. Verwende nur verifizierte ATO-VIP-Services und ordne sie sinnvoll zeitlich. Keine Endsumme erfinden; From/On-Request-Services bestätigt ATO Manager.';
    if(l==='pl') return 'Tak. Zaprojektuj moje wydarzenie VIP jak concierge, korzystając z podanej daty, liczby gości, budżetu, stylu, życzeń i ograniczeń. Łącz tylko zweryfikowane usługi VIP ATO w logiczny harmonogram. Nie wymyślaj ceny końcowej; From/On Request potwierdza ATO Manager.';
    return 'Yes. Design my VIP event like a concierge using the date, guests, budget, style, wishes and constraints I already gave. Combine only verified ATO VIP services into a realistic timeline. Do not invent a final quote; From/On Request services must be confirmed by ATO Manager.';
  }

  function specialOfferAcceptPrompt(){
    const l=lang();
    if(l==='ru') return 'Да. Проверь наши Special Offers и пересчитай мой текущий выбранный или предложенный план. Не обещай скидку заранее: покажи только реально рассчитываемую потенциальную экономию и что должен подтвердить ATO.';
    if(l==='tr') return 'Evet. Special Offers seçeneklerini kontrol et ve mevcut seçili/önerilen planımı yeniden hesapla. İndirimi garanti etme; yalnızca hesaplanabilen olası tasarrufu ve ATO onayı gereken kısmı göster.';
    if(l==='de') return 'Ja. Prüfe unsere Special Offers und rechne meinen aktuellen ausgewählten/vorgeschlagenen Plan neu. Keine Rabatte versprechen: nur berechenbare mögliche Ersparnis und was ATO bestätigen muss.';
    if(l==='pl') return 'Tak. Sprawdź nasze Special Offers i przelicz mój obecny wybrany/proponowany plan. Nie gwarantuj rabatu; pokaż tylko możliwą do obliczenia oszczędność i co musi potwierdzić ATO.';
    return 'Yes. Check our Special Offers and recalculate my current selected or proposed plan. Do not promise a discount; show only safely calculable potential savings and what ATO must confirm.';
  }
  function lowerBudgetPrompt(){
    const l=lang();
    if(l==='ru') return 'Даже после Special Offers для меня это дорого. Сохрани мои главные пожелания и перестрой план дешевле. Если мой максимальный общий бюджет тебе ещё неизвестен, спроси только эту сумму.';
    if(l==='tr') return 'Special Offers sonrasında bile bu benim için pahalı. Ana tercihlerimi koru ve planı daha düşük bütçeyle yeniden kur. Maksimum toplam bütçemi bilmiyorsan sadece onu sor.';
    if(l==='de') return 'Auch nach den Special Offers ist mir das zu teuer. Behalte meine wichtigsten Wünsche und baue den Plan günstiger um. Wenn mein maximales Gesamtbudget noch fehlt, frag nur danach.';
    if(l==='pl') return 'Nawet po Special Offers to dla mnie za drogo. Zachowaj moje najważniejsze preferencje i ułóż tańszy plan. Jeśli nie znasz mojego maksymalnego budżetu całkowitego, zapytaj tylko o tę kwotę.';
    return 'Even after Special Offers this is too expensive for me. Keep my main preferences and rebuild the plan cheaper. If you do not know my maximum total budget yet, ask only for that amount.';
  }
  function openSpecialOffersFromAI(){
    try{
      const st=loadAgentState();
      sessionStorage.setItem('atoAiSpecialOfferContext',JSON.stringify({source:'ai-sales-agent',lead_profile:st.lead_profile||{},offer_rescue:st.offer_rescue||null,itinerary:st.itinerary||null,createdAt:new Date().toISOString()}));
    }catch(_){}
    location.href='/special-offers.html#special-paths';
  }

  function resetChat(){
    history=[]; try{sessionStorage.removeItem(AGENT_STATE_KEY);sessionStorage.removeItem(CONTACT_KEY);}catch(e){} save(); renderHistory(); renderChips();
  }

  function bind(){
    const launch=$('#atoAssistantLaunch');
    launch.addEventListener('pointerdown',()=>{
      launch.classList.add('ato-ai-orb-press');
      setTimeout(()=>launch.classList.remove('ato-ai-orb-press'),170);
    });
    launch.addEventListener('click',openPanel);
    $('#atoAssistantClose').addEventListener('click',closePanel);
    $('#atoAssistantReset').addEventListener('click',resetChat);
    $('#atoAssistantManager').addEventListener('click',managerHandoff);
    $('#atoAssistantChips').addEventListener('click',e=>{
      const b=e.target.closest('[data-ato-prompt]'); if(b) send(b.dataset.atoPrompt);
    });
    $('#atoAssistantThread').addEventListener('click',e=>{
      const addBtn=e.target.closest('[data-ato-add-compare]');
      if(addBtn){ e.preventDefault(); if(addToPlannerCompare(addBtn.dataset.atoAddCompare)){ addBtn.classList.add('is-added'); addBtn.textContent=agentLabels().added; } return; }
      if(e.target.closest('[data-ato-compare-all]')){ const st=loadAgentState(); addRecommendationsToCompare(st.recommendations||[]); openPlannerCompare(); return; }
      if(e.target.closest('[data-ato-build-itinerary]')){ send(itineraryAcceptPrompt()); return; }
      if(e.target.closest('[data-ato-open-itinerary]')){ const st=loadAgentState(); if(applyItineraryToTripPlanner(st)){ const href=(document.querySelector('a[href*="trip-planner"]')?.getAttribute('href')||'/trip-planner.html').split('#')[0]; location.href=`${href}#planDates`; } return; }
      const eventAlt=e.target.closest('[data-ato-event-alternative]'); if(eventAlt){ send(vipEventAlternativePrompt(eventAlt.getAttribute('data-ato-event-alternative')||'')); return; }
      if(e.target.closest('[data-ato-build-event]')){ send(vipEventAcceptPrompt()); return; }
      if(e.target.closest('[data-ato-check-special-offer]')){ send(specialOfferAcceptPrompt()); return; }
      if(e.target.closest('[data-ato-open-special-offers]')){ openSpecialOffersFromAI(); return; }
      if(e.target.closest('[data-ato-lower-budget]')){ send(lowerBudgetPrompt()); return; }
      if(e.target.closest('[data-ato-ready-request]')){ showReadyContactForm(); return; }
      if(e.target.closest('[data-ato-payment]')){ const url=confirmedPaymentUrl(); if(url) location.href=url; return; }
    });
    $('#atoAssistantForm').addEventListener('submit',e=>{
      e.preventDefault(); const input=$('#atoAssistantInput'); const v=input.value; input.value=''; autoresize(input); send(v);
    });
    $('#atoAssistantInput').addEventListener('input',e=>autoresize(e.target));
    $('#atoAssistantInput').addEventListener('keydown',e=>{
      if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); $('#atoAssistantForm').requestSubmit(); }
    });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') closePanel(); });
  }

  function refreshLanguage(){
    const wasOpen=$('#atoAssistantPanel')?.classList.contains('is-open');
    $('#atoAssistantRoot')?.remove();
    buildUI();
    if(wasOpen) openPanel();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',buildUI,{once:true});
  else buildUI();

  const obs=new MutationObserver(m=>{ if(m.some(x=>x.type==='attributes'&&x.attributeName==='lang')) refreshLanguage(); });
  obs.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('hashchange',()=>{ if($('#atoAssistantRoot')) refreshContextUI(); },{passive:true});
  window.addEventListener('popstate',()=>{ if($('#atoAssistantRoot')) refreshContextUI(); },{passive:true});
  window.ATOAssistant={open:openPanel,close:closePanel,context:pageContext,mode:detectMode};
})();
