import LegalText, { LegalSection } from '@/components/LegalText'

// Section ids double as anchors, e.g. /privacy#cookies from the cookie banner.
const sections: LegalSection[] = [
  {
    id: 'prevadzkovatel',
    title: '1. Prevádzkovateľ',
    body: [
      'Prevádzkovateľom siete Librosophia a prevádzkovateľom vašich osobných údajov je Samuel Koriťák, Bratislava, Slovensko (súkromná osoba, sieť nie je komerčná).',
      'Kontakt: info@librosophia.sk',
    ],
  },
  {
    id: 'clenstvo',
    title: '2. Členstvo a profil',
    body: [
      'Údaje: e-mail, meno, používateľské meno, heslo (uložené len v zašifrovanej podobe), popis „O vás“, profilová a titulná fotografia, koho sledujete a kto sleduje vás.',
      'Librosophia je sieť na požičiavanie kresťanských kníh, preto už samotné členstvo a obsah, ktorý zdieľate, môžu prezrádzať vaše náboženské presvedčenie (osobitná kategória údajov podľa čl. 9 GDPR). Údaje preto spracúvame na základe vášho výslovného súhlasu, ktorý udeľujete pri registrácii (čl. 6 ods. 1 písm. a) a čl. 9 ods. 2 písm. a) GDPR). Registrovať sa môžu osoby od 16 rokov.',
      'Názov, autor, obálka a dostupnosť ponúkaných kníh sú viditeľné aj bez prihlásenia, bez údajov o tom, kto knihu ponúka; profil, príspevky, popisy kníh a komentáre vidia len prihlásení členovia. Vašu e-mailovú adresu ostatným členom nezobrazujeme; používa sa na prihlásenie.',
      'Súhlas môžete kedykoľvek odvolať zrušením konta (Upraviť profil → Zrušiť konto) alebo e-mailom na info@librosophia.sk. Konto sa hneď zablokuje a váš obsah sa skryje; natrvalo ho vymažeme najneskôr do 30 dní. Odvolanie nemá vplyv na zákonnosť spracúvania pred ním.',
      'Doba uchovávania: do zrušenia konta, po žiadosti o zrušenie najviac 30 dní.',
    ],
  },
  {
    id: 'obsah',
    title: '3. Príspevky, knihy, komentáre a sledovanie',
    body: [
      'Ukladáme príspevky, komentáre, ponúkané knihy (názov, autor, recenzia, obrázok, dostupnosť), označenia „páči sa mi“, sledovanie a notifikácie o nich. Slúžia na fungovanie siete, na základe vášho súhlasu z časti 2. Obsah môžete sami kedykoľvek vymazať; pri zrušení konta sa hneď skryje a do 30 dní vymaže celý.',
    ],
  },
  {
    id: 'spravy',
    title: '4. Súkromné správy',
    body: [
      'Správy a obrázky, ktoré pošlete v chate, vidia len účastníci konverzácie. Na doručovanie správ v reálnom čase používame službu Ably; samotné správy sa ukladajú v databáze siete.',
      'Správca siete môže do správ nahliadnuť len vtedy, keď rieši nahlásenie porušenia pravidiel alebo protiprávneho obsahu (oprávnený záujem na bezpečnosti siete, čl. 6 ods. 1 písm. f) GDPR).',
      'Správy sa vymažú, keď vymažete konverzáciu, alebo do 30 dní od žiadosti o zrušenie konta. Pri zrušení konta sa vymažú celé konverzácie vo dvojici, teda aj odpovede druhého účastníka.',
    ],
  },
  {
    id: 'emaily',
    title: '5. E-maily pri registrácii a obnove hesla',
    body: [
      'Na potvrdenie registrácie a obnovenie hesla vám pošleme e-mail s jednorazovým odkazom, ktorý platí 15 minút. Na odoslanie použijeme vaše meno a e-mail.',
    ],
  },
  {
    id: 'moderovanie',
    title: '6. Moderovanie a nahlásenia',
    body: [
      'Ak niekto nahlási obsah alebo porušenie pravidiel, spracúvame údaje z nahlásenia a dotknutý obsah na posúdenie a prípadné skrytie obsahu či zablokovanie konta (oprávnený záujem a plnenie povinností podľa nariadenia (EÚ) 2022/2065 o digitálnych službách). Záznamy o nahláseniach a rozhodnutiach uchovávame najviac 1 rok.',
    ],
  },
  {
    id: 'navsteva',
    title: '7. Návšteva webu',
    body: [
      'Pri každej návšteve spracúvajú poskytovateľ hostingu (Vercel) a Cloudflare technické údaje potrebné na doručenie stránky a ochranu pred útokmi: IP adresu, typ prehliadača a čas požiadavky (oprávnený záujem na bezpečnom fungovaní webu). Tieto záznamy sa uchovávajú len krátko, spravidla niekoľko dní až týždňov.',
    ],
  },
  {
    id: 'cookies',
    title: '8. Cookies a meranie návštevnosti',
    body: [
      'Nevyhnutné (bez súhlasu):',
      [
        'CookieConsent – zapamätá si vašu voľbu v lište cookies, 365 dní',
        'prihlasovacie cookies (next-auth) – udržia vás prihláseného a chránia formuláre, do odhlásenia alebo vypršania relácie',
        'technické údaje chatu (Ably) v úložisku prehliadača – na obnovenie spojenia počas relácie',
      ],
      'Meranie návštevnosti (len s vaším súhlasom): Umami – nástroj na meranie návštevnosti na serveri v Nemecku (Contabo GmbH), ktorý prevádzkuje Pictusweb s.r.o. Nepoužíva cookies, neukladá IP adresu a nevytvára profil návštevníka; vidno len súhrnné štatistiky. Spustí sa až po kliknutí na „Súhlasím“. Ak meranie odmietnete, prehliadač si to zapamätá (umami.disabled).',
      'Nepoužívame Google Analytics, reklamné ani sledovacie cookies.',
      'Súhlas môžete kedykoľvek zmeniť alebo odvolať odkazom „Nastavenia cookies“ v pätičke webu. Pravidlá pre cookies vychádzajú z § 109 ods. 8 zákona č. 452/2021 Z. z. o elektronických komunikáciách.',
    ],
  },
  {
    id: 'prijemcovia',
    title: '9. Kto má k údajom prístup',
    body: [
      'Údaje nepredávame ani nepoužívame na reklamu. Prístup k nim majú len títo poskytovatelia, v rozsahu potrebnom pre ich službu:',
      [
        'Pictusweb s.r.o., Nábrežná 4895/42, 940 02 Nové Zámky – vývoj a správa siete, odosielanie e-mailov a meranie návštevnosti',
        'Vercel Inc. (USA) – hosting webu, servery vo Frankfurte',
        'Cloudflare, Inc. (USA) – doručovanie webu a ochrana pred útokmi',
        'MongoDB, Inc. (USA) – databáza (služba MongoDB Atlas)',
        'Cloudinary Ltd. (Izrael) – ukladanie fotografií a obrázkov',
        'Ably Realtime Ltd. (Spojené kráľovstvo) – doručovanie správ v chate',
        'Contabo GmbH (Nemecko) – server na odosielanie e-mailov a meranie návštevnosti',
        'Hostinger / Titan Mail – e-mailová schránka info@librosophia.sk a odosielanie e-mailov',
      ],
    ],
  },
  {
    id: 'prenos',
    title: '10. Prenos údajov mimo EÚ',
    body: [
      'Vercel, Cloudflare, MongoDB a Titan Mail sú spoločnosti so sídlom alebo materskou spoločnosťou v USA; prenos sa uskutočňuje na základe rámca EÚ – USA na ochranu osobných údajov (EU-U.S. Data Privacy Framework) alebo štandardných zmluvných doložiek Európskej komisie. Pre Spojené kráľovstvo (Ably) a Izrael (Cloudinary) platí rozhodnutie Európskej komisie o primeranosti ochrany.',
    ],
  },
  {
    id: 'prava',
    title: '11. Vaše práva',
    body: [
      'Máte právo na prístup k svojim údajom, ich opravu a vymazanie, na obmedzenie spracúvania, na prenosnosť údajov, právo namietať proti spracúvaniu na základe oprávneného záujmu a právo kedykoľvek odvolať súhlas. Profil upravíte sami, zrušenie konta požiadate v časti Upraviť profil (natrvalo ho vymažeme do 30 dní); ostatné žiadosti vybavíme na info@librosophia.sk bez zbytočného odkladu, najneskôr do 1 mesiaca.',
      'Ak sa domnievate, že vaše údaje spracúvame nezákonne, môžete podať návrh na Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, www.dataprotection.gov.sk.',
    ],
  },
  {
    id: 'zmeny',
    title: '12. Zmeny',
    body: [
      'Tieto zásady aktualizujeme, keď sa zmenia používané služby alebo spôsob spracúvania. O podstatných zmenách vás budeme informovať e-mailom. Toto znenie je účinné od 9. 10. 2026.',
    ],
  },
]

const PrivacyPage = () => (
  <LegalText
    label="Ochrana osobných údajov"
    effective="Účinné od 9. 10. 2026"
    intro="Tu nájdete, aké osobné údaje sieť Librosophia spracúva, prečo, ako dlho, kto k nim má prístup a aké máte práva podľa nariadenia (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z. o ochrane osobných údajov."
    sections={sections}
  />
)

export default PrivacyPage
