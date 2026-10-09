import LegalText, { LegalSection } from '@/components/LegalText'

const sections: LegalSection[] = [
  {
    id: 'prevadzkovatel',
    title: '1. Prevádzkovateľ',
    body: [
      'Sieť Librosophia (librosophia.sk) prevádzkuje Samuel Koriťák, Bratislava, Slovensko. Kontaktným miestom pre členov aj úrady podľa nariadenia (EÚ) 2022/2065 o digitálnych službách je e-mail info@librosophia.sk; komunikujeme po slovensky.',
    ],
  },
  {
    id: 'pravidla',
    title: '2. Pravidlá siete',
    body: [
      '1. Librosophia je súkromná sociálna sieť určená predovšetkým na vzájomné požičiavanie kresťanských kníh v rámci mesta.',
      '2. Registráciou užívateľ súhlasí s pravidlami siete. Tak ako veríme v dobrotu Boha, veríme aj v skazenosť človeka, a preto neočakávame, že každý, kto príde, bude pravidlá rešpektovať.',
      '3. Sieť slúži na požičiavanie a propagáciu kníh, ktoré smerujú k uctievaniu Trojjediného Boha, t. j. Otca, Syna – Ježiša Krista a Ducha Svätého.',
      '3a. Knihy nekresťanské alebo propagujúce iné božstvá vrátane mariánskeho kultu, uctievania anjelov, svätých a pod. sú nežiaduce.',
      '3b. Taktiež nie sú žiaduce knihy o nebiblických a rozdeľujúcich náukách, ako je krst neveriacich, t. j. krst nemluvniat, zachovávanie soboty, pápežstvo, apokryfy a pod.',
      '4. Nie je tu miesto na propagovanie politiky! Naopak, povzbudenia z Božieho Slova a svedectvá na slávu Boha sú viac než vítané.',
      '5. Vulgarizmy a osobné útoky nebudú tolerované.',
      '6. Nerešpektovanie pravidiel má za následok zrušenie konta a zablokovanie registrovanej e-mailovej adresy.',
    ],
  },
  {
    id: 'clenstvo',
    title: '3. Členstvo',
    body: [
      'Členom sa môže stať osoba od 16 rokov, ktorá sa zaregistruje, potvrdí svoj e-mail a súhlasí s týmito pravidlami a so spracúvaním osobných údajov. Členstvo je bezplatné.',
      'Člen zodpovedá za obsah, ktorý zverejní, a za ochranu svojho hesla. Konto môže kedykoľvek zrušiť v časti Upraviť profil; do 30 dní ho natrvalo vymažeme.',
    ],
  },
  {
    id: 'pozicky',
    title: '4. Požičiavanie kníh',
    body: [
      'Sieť len sprostredkúva kontakt medzi členmi. Požičanie knihy je dohoda medzi členmi; prevádzkovateľ nie je jej stranou a nezodpovedá za stav, vrátenie ani stratu kníh.',
    ],
  },
  {
    id: 'zakazany-obsah',
    title: '5. Zakázaný obsah',
    body: [
      'Okrem obsahu v rozpore s pravidlami v časti 2 je zakázaný akýkoľvek protiprávny obsah, najmä:',
      [
        'obsah porušujúci autorské práva (napr. zdieľanie celých kníh alebo ich kópií)',
        'urážky, vyhrážky, obťažovanie a nenávistné prejavy',
        'zverejňovanie osobných údajov iných ľudí bez ich súhlasu',
        'podvody, reklama a spam',
      ],
    ],
  },
  {
    id: 'nahlasenie',
    title: '6. Nahlásenie obsahu',
    body: [
      'Obsah, ktorý porušuje pravidlá alebo zákon, môže ktokoľvek nahlásiť e-mailom na info@librosophia.sk. Uveďte, prosím, odkaz na obsah alebo jeho presný opis, dôvod, prečo ho považujete za protiprávny alebo v rozpore s pravidlami, a svoje meno a e-mail (okrem nahlásení týkajúcich sa sexuálneho zneužívania detí). O prijatí nahlásenia a o rozhodnutí vás budeme informovať.',
    ],
  },
  {
    id: 'moderovanie',
    title: '7. Moderovanie',
    body: [
      'Nahlásený obsah posudzuje správca siete individuálne, nepoužívame automatizované rozhodovanie. Pri porušení pravidiel môže správca obsah skryť alebo vymazať, prípadne konto dočasne alebo natrvalo zablokovať. Pri riešení nahlásenia môže správca nahliadnuť aj do súkromných správ, ktorých sa nahlásenie týka.',
      'Ak obmedzíme váš obsah alebo konto, pošleme vám e-mailom zdôvodnenie: čo sme urobili, prečo a na základe ktorého pravidla alebo zákona. Proti rozhodnutiu môžete namietať odpoveďou na tento e-mail alebo na info@librosophia.sk; námietku posúdime a odpovieme vám. Máte tiež právo obrátiť sa na súd.',
    ],
  },
  {
    id: 'zmeny',
    title: '8. Zmeny pravidiel',
    body: [
      'Pravidlá môžeme meniť; o podstatných zmenách budeme členov vopred informovať e-mailom. Toto znenie je účinné od 9. 10. 2026. Ochranu osobných údajov opisuje stránka Ochrana osobných údajov (librosophia.sk/privacy).',
    ],
  },
]

const RulesPage = () => (
  <LegalText label="Pravidlá a podmienky používania" effective="Účinné od 9. 10. 2026" sections={sections} />
)

export default RulesPage
