import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, MessageCircle, Star, Globe2, Menu, X, ChevronRight } from "lucide-react";
import "./styles.css";

const WHATSAPP_NUMBER = "905387045999";
const PHONE_DISPLAY = "+90 538 704 59 99";
const COMPANY_ADDRESS = "Sarıtaş Hotel Yanı, Tosmur, Ahmet Tokuş Blv. No:13, 07400 Alanya/Antalya, Türkiye";
const GOOGLE_MAPS_URL = "https://maps.google.com/?q=Sarıtaş%20Hotel%20Yanı%2C%20Tosmur%2C%20Ahmet%20Tokuş%20Blv.%20No%3A13%2C%2007400%20Alanya%2FAntalya";
const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=ALANYA+TOUR+ORGANIZATIONS+reviews";

const translations = {
  en: {
    navTours: "Tours", navLanguage: "Language", navAbout: "About us", navContacts: "Contacts",
    heroTitle: "Discover Alanya with trusted local tour organizers",
    heroText: "Daily excursions, sea trips, canyon adventures, historical routes and family-friendly experiences across Alanya and Antalya region.",
    heroCta: "Book on WhatsApp", toursTitle: "Excursions in Alanya",
    toursSubtitle: "Typical programs available in the region. Exact price depends on season, hotel location and group size.",
    priceFrom: "from", included: "Included", extra: "Extra payment", program: "Program",
    aboutTitle: "About ALANYA TOUR ORGANIZATIONS",
    aboutText: "We help guests choose reliable excursions in Alanya: sea tours, jeep safaris, canyons, rafting, Turkish bath, historical routes and family activities. Our goal is clear communication, transparent prices, hotel pickup where available, and fast support before and after booking.",
    contactsTitle: "Contacts", address: "Address", hours: "Working hours",
    hoursValue: "Every day: 08:00–01:00 | Online support: 24/7",
    phone: "Phone / WhatsApp", location: "Location", reviews: "Google reviews", openMaps: "Open map", openReviews: "Open Google page",
    whatsappPopup: "Need help choosing a tour? Write to us on WhatsApp.",
    message: "Hello! I want to book an excursion in Alanya.", selectLanguage: "Select language", details: "View details"
  },
  ru: {
    navTours: "Экскурсии", navLanguage: "Язык", navAbout: "О компании", navContacts: "Контакты",
    heroTitle: "Откройте Аланию с местными организаторами экскурсий",
    heroText: "Ежедневные экскурсии, морские прогулки, каньоны, рафтинг, исторические маршруты и семейные программы по Алании и региону Анталии.",
    heroCta: "Забронировать в WhatsApp", toursTitle: "Экскурсии в Алании",
    toursSubtitle: "Типовые программы региона. Точная цена зависит от сезона, района отеля и размера группы.",
    priceFrom: "от", included: "Входит", extra: "Дополнительно оплачивается", program: "Программа",
    aboutTitle: "О компании ALANYA TOUR ORGANIZATIONS",
    aboutText: "Мы помогаем гостям выбрать надежные экскурсии в Алании: морские туры, джип-сафари, каньоны, рафтинг, турецкий хамам, исторические маршруты и семейные активности. Наша задача — понятная коммуникация, прозрачные цены, трансфер из отеля там, где он предусмотрен, и быстрая поддержка до и после бронирования.",
    contactsTitle: "Контакты", address: "Адрес", hours: "Часы работы",
    hoursValue: "Ежедневно: 08:00–01:00 | Онлайн-поддержка: 24/7",
    phone: "Телефон / WhatsApp", location: "Локация", reviews: "Отзывы Google", openMaps: "Открыть карту", openReviews: "Открыть Google-страницу",
    whatsappPopup: "Нужна помощь с выбором экскурсии? Напишите нам в WhatsApp.",
    message: "Здравствуйте! Хочу забронировать экскурсию в Алании.", selectLanguage: "Выберите язык", details: "Подробнее"
  },
  tr: {
    navTours: "Turlar", navLanguage: "Dil", navAbout: "Hakkımızda", navContacts: "İletişim",
    heroTitle: "Alanya’yı yerel tur organizatörleriyle keşfedin",
    heroText: "Alanya ve Antalya bölgesinde günlük turlar, tekne gezileri, kanyon maceraları, tarihi rotalar ve aile dostu aktiviteler.",
    heroCta: "WhatsApp’tan rezervasyon", toursTitle: "Alanya turları",
    toursSubtitle: "Bölgede sunulan tipik programlar. Net fiyat sezona, otel konumuna ve grup büyüklüğüne göre değişir.",
    priceFrom: "başlangıç", included: "Dahil", extra: "Ekstra ödeme", program: "Program",
    aboutTitle: "ALANYA TOUR ORGANIZATIONS hakkında",
    aboutText: "Alanya’da deniz turları, jeep safari, kanyonlar, rafting, hamam, tarihi rotalar ve aile aktiviteleri için güvenilir seçenekler sunuyoruz. Amacımız net iletişim, şeffaf fiyat, uygun turlarda otelden transfer ve hızlı destek sağlamaktır.",
    contactsTitle: "İletişim", address: "Adres", hours: "Çalışma saatleri",
    hoursValue: "Her gün: 08:00–01:00 | Online destek: 24/7",
    phone: "Telefon / WhatsApp", location: "Konum", reviews: "Google yorumları", openMaps: "Haritayı aç", openReviews: "Google sayfasını aç",
    whatsappPopup: "Tur seçimi için yardıma mı ihtiyacınız var? WhatsApp’tan yazın.",
    message: "Merhaba! Alanya’da tur rezervasyonu yapmak istiyorum.", selectLanguage: "Dil seçin", details: "Detaylar"
  },
  de: {
    navTours: "Ausflüge", navLanguage: "Sprache", navAbout: "Über uns", navContacts: "Kontakt",
    heroTitle: "Entdecken Sie Alanya mit lokalen Tour-Organisatoren",
    heroText: "Tägliche Ausflüge, Bootstouren, Canyon-Abenteuer, historische Routen und familienfreundliche Aktivitäten in Alanya und der Region Antalya.",
    heroCta: "Über WhatsApp buchen", toursTitle: "Ausflüge in Alanya",
    toursSubtitle: "Typische Programme der Region. Der genaue Preis hängt von Saison, Hotellage und Gruppengröße ab.",
    priceFrom: "ab", included: "Inklusive", extra: "Extra zu zahlen", program: "Programm",
    aboutTitle: "Über ALANYA TOUR ORGANIZATIONS",
    aboutText: "Wir helfen Gästen, zuverlässige Ausflüge in Alanya zu wählen: Bootstouren, Jeep-Safari, Canyons, Rafting, türkisches Bad, historische Routen und Familienaktivitäten.",
    contactsTitle: "Kontakt", address: "Adresse", hours: "Öffnungszeiten",
    hoursValue: "Täglich: 08:00–01:00 | Online-Support: 24/7",
    phone: "Telefon / WhatsApp", location: "Standort", reviews: "Google-Bewertungen", openMaps: "Karte öffnen", openReviews: "Google-Seite öffnen",
    whatsappPopup: "Brauchen Sie Hilfe bei der Tourauswahl? Schreiben Sie uns auf WhatsApp.",
    message: "Hallo! Ich möchte einen Ausflug in Alanya buchen.", selectLanguage: "Sprache wählen", details: "Details"
  }
};

const tours = [
  ["pirate-boat","Sea",{en:"Alanya Pirate Boat Tour",ru:"Пиратская яхта в Алании",tr:"Alanya Korsan Tekne Turu",de:"Piratenboot-Tour Alanya"},"€20–35","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",{en:"Hotel pickup, Alanya harbor, sea caves, swimming stops, lunch on board, foam party, return transfer.",ru:"Трансфер из отеля, порт Алании, морские пещеры, остановки для купания, обед на борту, пенная вечеринка, обратный трансфер.",tr:"Otelden transfer, Alanya limanı, deniz mağaraları, yüzme molaları, teknede öğle yemeği, köpük partisi, dönüş transferi.",de:"Hoteltransfer, Hafen von Alanya, Meereshöhlen, Badestopps, Mittagessen an Bord, Schaumparty, Rücktransfer."},["Hotel transfer","Lunch","Soft drinks on many boats","Insurance"],["Alcohol","Photos/video","Imported drinks"]],
  ["jeep-safari","Adventure",{en:"Jeep Safari & Dim River",ru:"Джип-сафари и река Димчай",tr:"Jeep Safari ve Dim Çayı",de:"Jeep Safari & Dim Fluss"},"€20–35","https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",{en:"Mountain roads, panoramic viewpoints, villages, water fights, Dim River lunch, optional Dim Cave visit.",ru:"Горные дороги, панорамные площадки, деревни, водные игры, обед на реке Димчай, по желанию пещера Дим.",tr:"Dağ yolları, panoramik noktalar, köyler, su savaşları, Dim Çayı’nda öğle yemeği, isteğe bağlı Dim Mağarası.",de:"Bergstraßen, Aussichtspunkte, Dörfer, Wasserspiele, Mittagessen am Dim Fluss, optionale Dim-Höhle."},["Hotel transfer","Lunch","Guide","Insurance"],["Drinks","Dim Cave ticket","Photos/video"]],
  ["sapadere","Nature",{en:"Sapadere Canyon",ru:"Каньон Сападере",tr:"Sapadere Kanyonu",de:"Sapadere Canyon"},"€25–40","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",{en:"Scenic drive to Sapadere, canyon walk, waterfall, free time for photos and swimming, lunch, return to hotel.",ru:"Дорога в Сападере, прогулка по каньону, водопад, свободное время для фото и купания, обед, возвращение в отель.",tr:"Sapadere’ye yolculuk, kanyon yürüyüşü, şelale, fotoğraf ve yüzme molası, öğle yemeği, otele dönüş.",de:"Fahrt nach Sapadere, Canyon-Spaziergang, Wasserfall, Zeit für Fotos und Schwimmen, Mittagessen, Rückfahrt."},["Hotel transfer","Lunch","Guide"],["Entrance tickets","Drinks","Photos"]],
  ["rafting","Adventure",{en:"Rafting in Köprülü Canyon",ru:"Рафтинг в каньоне Кёпрюлю",tr:"Köprülü Kanyon Rafting",de:"Rafting im Köprülü Canyon"},"€20–35","https://images.unsplash.com/photo-1508166466920-a4b461e39e15?auto=format&fit=crop&w=1200&q=80",{en:"Transfer to Köprülü Canyon, safety briefing, rafting route, swimming break, lunch, return transfer.",ru:"Трансфер в каньон Кёпрюлю, инструктаж, маршрут на рафтах, купание, обед, обратный трансфер.",tr:"Köprülü Kanyon’a transfer, güvenlik bilgilendirmesi, rafting parkuru, yüzme molası, öğle yemeği, dönüş transferi.",de:"Transfer zum Köprülü Canyon, Sicherheitseinweisung, Raftingstrecke, Badestopp, Mittagessen, Rücktransfer."},["Transfer","Equipment","Lunch","Instructor"],["Drinks","Water shoes","Photos/video","Zipline/quad if selected"]],
  ["green-canyon","Nature",{en:"Green Canyon Boat Tour",ru:"Зелёный каньон",tr:"Green Canyon Tekne Turu",de:"Green Canyon Bootstour"},"€30–45","https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=80",{en:"Transfer to Oymapınar area, boat trip on emerald lake, swimming breaks, lunch by the lake, return.",ru:"Трансфер в район Оймапынар, прогулка на лодке по изумрудному озеру, купание, обед у воды, возвращение.",tr:"Oymapınar bölgesine transfer, zümrüt renkli gölde tekne turu, yüzme molaları, göl kenarında öğle yemeği, dönüş.",de:"Transfer nach Oymapınar, Bootsfahrt auf dem smaragdgrünen See, Badestopps, Mittagessen am See, Rückfahrt."},["Hotel transfer","Boat tour","Lunch","Soft drinks on many programs"],["Alcohol","Photos","Personal expenses"]],
  ["turkish-bath","Relax",{en:"Turkish Bath / Hamam",ru:"Турецкий хамам",tr:"Türk Hamamı",de:"Türkisches Bad / Hamam"},"€17–35","https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",{en:"Hotel transfer, sauna, steam room, peeling, foam massage, oil massage depending on package, return transfer.",ru:"Трансфер, сауна, парная, пилинг, пенная массажная процедура, масляный массаж по пакету, обратный трансфер.",tr:"Transfer, sauna, buhar odası, kese, köpük masajı, pakete göre yağ masajı, dönüş transferi.",de:"Transfer, Sauna, Dampfbad, Peeling, Schaummassage, je nach Paket Ölmassage, Rücktransfer."},["Transfer","Basic hamam program","Towels in many spas"],["Longer massage","Face mask","Special packages","Drinks"]],
  ["demre-myra-kekova","History",{en:"Demre – Myra – Kekova",ru:"Демре — Мира — Кекова",tr:"Demre – Myra – Kekova",de:"Demre – Myra – Kekova"},"€45–70","https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",{en:"Early departure, St. Nicholas Church area, ancient Myra, boat trip over Kekova sunken city, lunch, return.",ru:"Ранний выезд, район церкви Святого Николая, античный город Мира, прогулка к затонувшему городу Кекова, обед, возвращение.",tr:"Erken çıkış, Aziz Nikolaos Kilisesi bölgesi, antik Myra, Kekova batık şehir tekne turu, öğle yemeği, dönüş.",de:"Frühe Abfahrt, Gebiet der St.-Nikolaus-Kirche, antikes Myra, Bootsfahrt zur versunkenen Stadt Kekova, Mittagessen, Rückfahrt."},["Transfer","Guide","Lunch","Boat trip depending on package"],["Entrance tickets","Drinks","Breakfast","Personal expenses"]],
  ["pamukkale","History",{en:"Pamukkale & Hierapolis",ru:"Памуккале и Иераполис",tr:"Pamukkale & Hierapolis",de:"Pamukkale & Hierapolis"},"€55–85","https://images.unsplash.com/photo-1602339752474-f77aa7bcaecd?auto=format&fit=crop&w=1200&q=80",{en:"Early departure, travertine terraces, Hierapolis ancient city, free time, lunch/dinner depending on program, return.",ru:"Ранний выезд, травертиновые террасы, античный Иераполис, свободное время, питание по программе, возвращение.",tr:"Erken çıkış, travertenler, Hierapolis antik kenti, serbest zaman, programa göre yemek, dönüş.",de:"Frühe Abfahrt, Travertinterrassen, antikes Hierapolis, Freizeit, Mahlzeiten je nach Programm, Rückfahrt."},["Transfer","Guide","Meal depending on package"],["Entrance tickets","Cleopatra Pool","Drinks","Breakfast"]],
  ["cappadocia","Multi-day",{en:"Cappadocia 2–3 Day Tour",ru:"Каппадокия 2–3 дня",tr:"Kapadokya 2–3 Gün",de:"Kappadokien 2–3 Tage"},"€75–150","https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1200&q=80",{en:"Multi-day route to Cappadocia, valleys, panoramic points, underground city, hotel stay, optional hot air balloon flight.",ru:"Многодневный маршрут в Каппадокию: долины, панорамные точки, подземный город, проживание в отеле, по желанию полёт на шаре.",tr:"Kapadokya’ya çok günlük tur: vadiler, panorama noktaları, yeraltı şehri, otel konaklaması, isteğe bağlı balon uçuşu.",de:"Mehrtägige Route nach Kappadokien: Täler, Aussichtspunkte, unterirdische Stadt, Hotel, optional Ballonfahrt."},["Transfer","Hotel accommodation","Guide","Some meals"],["Balloon flight","Entrance tickets","Single room","Drinks"]],
  ["land-of-legends","Family",{en:"The Land of Legends",ru:"The Land of Legends",tr:"The Land of Legends",de:"The Land of Legends"},"€55–75","https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80",{en:"Transfer to theme park in Belek, free time for water slides/shows/shopping, evening return.",ru:"Трансфер в тематический парк в Белеке, свободное время для горок, шоу и шопинга, вечернее возвращение.",tr:"Belek’teki tema parka transfer, su kaydırakları/gösteriler/alışveriş için serbest zaman, akşam dönüş.",de:"Transfer zum Freizeitpark in Belek, Freizeit für Rutschen, Shows und Shopping, Rückfahrt am Abend."},["Transfer","Entrance ticket depending on package"],["Food","Drinks","Locker","Personal expenses"]],
  ["paragliding","Adventure",{en:"Paragliding over Cleopatra Beach",ru:"Параглайдинг над пляжем Клеопатры",tr:"Kleopatra Plajı Yamaç Paraşütü",de:"Paragliding über Kleopatra-Strand"},"€40–80","https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",{en:"Transfer to take-off point, safety briefing, tandem flight, landing near Cleopatra Beach.",ru:"Трансфер к точке старта, инструктаж, полёт тандемом, приземление рядом с пляжем Клеопатры.",tr:"Kalkış noktasına transfer, güvenlik bilgilendirmesi, tandem uçuş, Kleopatra Plajı yakınında iniş.",de:"Transfer zum Startpunkt, Sicherheitseinweisung, Tandemflug, Landung nahe Kleopatra-Strand."},["Transfer","Instructor","Equipment","Insurance"],["Photos/video","Entrance/transport fee if charged","Personal expenses"]],
  ["quad-buggy","Adventure",{en:"Quad / Buggy Safari",ru:"Квадро / багги-сафари",tr:"Quad / Buggy Safari",de:"Quad / Buggy Safari"},"€25–45","https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&w=1200&q=80",{en:"Transfer to safari area, briefing, off-road route, photo stops, return transfer.",ru:"Трансфер в зону сафари, инструктаж, маршрут по бездорожью, фото-остановки, обратный трансфер.",tr:"Safari alanına transfer, bilgilendirme, off-road parkur, fotoğraf molaları, dönüş transferi.",de:"Transfer zum Safari-Gebiet, Einweisung, Offroad-Strecke, Fotostopps, Rücktransfer."},["Transfer","Helmet","Briefing","Insurance"],["Dust mask/glasses","Drinks","Photos/video"]]
].map(([id, category, title, price, image, program, included, extra]) => ({ id, category, title, price, image, program, included, extra }));

const languages = [{ code: "en", label: "English" }, { code: "ru", label: "Русский" }, { code: "tr", label: "Türkçe" }, { code: "de", label: "Deutsch" }];
function detectLanguage() { const browser = (navigator.language || "en").slice(0,2).toLowerCase(); return translations[browser] ? browser : "en"; }
function Button({ children, className = "", variant = "primary", ...props }) { return <button className={`btn ${variant === "secondary" ? "btnSecondary" : "btnPrimary"} ${className}`} {...props}>{children}</button>; }

function App() {
  const [lang, setLang] = useState("ru");
  const [menuOpen, setMenuOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  useEffect(() => { const saved = localStorage.getItem("ato_lang"); setLang(saved && translations[saved] ? saved : detectLanguage()); }, []);
  const t = translations[lang] || translations.ru;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t.message)}`;
  const categories = useMemo(() => ["All", ...Array.from(new Set(tours.map((tour) => tour.category)))], []);
  const visibleTours = activeCategory === "All" ? tours : tours.filter((tour) => tour.category === activeCategory);
  const changeLang = (value) => { setLang(value); localStorage.setItem("ato_lang", value); };
  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return <div className="page">
    <header className="header"><div className="headerInner">
      <button onClick={() => scrollTo("home")} className="brand"><div>ALANYA TOUR</div><span>ORGANIZATIONS</span></button>
      <nav className="nav" dir="rtl"><button onClick={() => scrollTo("tours")}>{t.navTours}</button><button onClick={() => scrollTo("language")}>{t.navLanguage}</button><button onClick={() => scrollTo("about")}>{t.navAbout}</button><button onClick={() => scrollTo("contacts")}>{t.navContacts}</button></nav>
      <div className="desktopActions"><select value={lang} onChange={(e) => changeLang(e.target.value)}>{languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}</select><a href={whatsappUrl} target="_blank"><Button><MessageCircle size={18}/> WhatsApp</Button></a></div>
      <button className="mobileMenu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </div>{menuOpen && <div className="mobileNav"><button onClick={() => scrollTo("tours")}>{t.navTours}</button><button onClick={() => scrollTo("language")}>{t.navLanguage}</button><button onClick={() => scrollTo("about")}>{t.navAbout}</button><button onClick={() => scrollTo("contacts")}>{t.navContacts}</button><select value={lang} onChange={(e) => changeLang(e.target.value)}>{languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}</select></div>}</header>
    <main id="home">
      <section className="hero"><div className="heroBg"></div><div className="heroInner"><motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.65}}><div className="badge"><Star size={17}/> Local tours in Alanya, Antalya</div><h1>{t.heroTitle}</h1><p>{t.heroText}</p><div className="heroButtons"><a href={whatsappUrl} target="_blank"><Button><MessageCircle size={20}/>{t.heroCta}</Button></a><Button onClick={() => scrollTo("tours")} variant="secondary">{t.navTours}<ChevronRight size={20}/></Button></div></motion.div></div></section>
      <section id="tours" className="section"><div className="sectionTop"><div><h2>{t.toursTitle}</h2><p>{t.toursSubtitle}</p></div><div className="chips">{categories.map(c => <button key={c} onClick={() => setActiveCategory(c)} className={activeCategory===c ? "chip active" : "chip"}>{c}</button>)}</div></div><div className="tourGrid">{visibleTours.map(tour => <article className="tourCard" key={tour.id}><div className="tourImage"><img src={tour.image} alt={tour.title[lang] || tour.title.en}/><span className="cat">{tour.category}</span><span className="price">{t.priceFrom} {tour.price}</span></div><div className="tourBody"><h3>{tour.title[lang] || tour.title.en}</h3><p><b>{t.program}:</b> {tour.program[lang] || tour.program.en}</p><div className="infoCols"><div className="included"><b>{t.included}</b>{tour.included.map(i => <span key={i}>• {i}</span>)}</div><div className="extra"><b>{t.extra}</b>{tour.extra.map(i => <span key={i}>• {i}</span>)}</div></div><a href={`${whatsappUrl}%20Tour:%20${encodeURIComponent(tour.title.en)}`} target="_blank"><Button className="full">{t.details} / WhatsApp</Button></a></div></article>)}</div></section>
      <section id="language" className="language"><div className="languageCard"><div><div className="orange"><Globe2 size={20}/>{t.navLanguage}</div><h2>{t.selectLanguage}</h2><p>The website detects the visitor’s browser language automatically. Add more languages by expanding the translations object or connecting a translation API.</p></div><select value={lang} onChange={(e) => changeLang(e.target.value)}>{languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}</select></div></section>
      <section id="about" className="section about"><div><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p><div className="stats"><div><b>24/7</b><span>WhatsApp support</span></div><div><b>50+</b><span>Tour options</span></div><div><b>4+</b><span>Base languages</span></div></div></div><img src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80" alt="Travel organization"/></section>
      <section id="contacts" className="contacts"><div className="section"><h2>{t.contactsTitle}</h2><div className="contactGrid"><div><Phone/><b>{t.phone}</b><span>{PHONE_DISPLAY}</span></div><div><MapPin/><b>{t.address}</b><span>{COMPANY_ADDRESS}</span></div><div><Clock/><b>{t.hours}</b><span>{t.hoursValue}</span></div><div><Star/><b>{t.reviews}</b><a href={GOOGLE_REVIEWS_URL} target="_blank">{t.openReviews}</a></div></div><iframe title="Google Maps location" src="https://maps.google.com/maps?q=Sarıtaş%20Hotel%20Yanı%2C%20Tosmur%2C%20Ahmet%20Tokuş%20Blv.%20No%3A13%2C%2007400%20Alanya%2FAntalya&t=&z=16&ie=UTF8&iwloc=&output=embed" loading="lazy"></iframe><div className="contactButtons"><a href={GOOGLE_MAPS_URL} target="_blank"><Button variant="secondary">{t.openMaps}</Button></a><a href={whatsappUrl} target="_blank"><Button><MessageCircle size={18}/> WhatsApp</Button></a></div></div></section>
    </main>
    {popupOpen && <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="popup"><button onClick={() => setPopupOpen(false)} className="close"><X size={16}/></button><b><MessageCircle size={19}/> WhatsApp</b><p>{t.whatsappPopup}</p><a href={whatsappUrl} target="_blank"><Button className="full">WhatsApp</Button></a></motion.div>}
    <footer>© {new Date().getFullYear()} ALANYA TOUR ORGANIZATIONS. All rights reserved.</footer>
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);
