# User Stories OrchardMap

## Rollen
- **Admin**: Algemene administrator die alles kan.
- **Orchard Manager**: Beheerder van 1 of meerdere boomgaarden
- **Orchard Worker**: Werkt mee in 1 of meerdere boomgaarden
- **Species Manager**: Beheerder van de boomsoorten
- **Registered User**: Geregistreerde gebruiker, gelinkt aan 1 of meerdere boomgaarden
- **Guest**: Niet geregistreerde gebruiker, kan enkel publieke boomgaarden zien

## User Stories

### Boomgaardbeheer (Orchard Management)
- Als een Orchard Manager, wil ik een nieuwe boomgaard kunnen aanmaken met naam, locatie, omschrijving en GPS-coördinaten, zodat ik mijn boomgaarden kan beheren.
- Als een Orchard Manager, wil ik kunnen kiezen of mijn boomgaard publiek of privé is, zodat ik de zichtbaarheid kan bepalen.
- Als een Orchard Manager, wil ik Orchard Workers kunnen toevoegen aan mijn boomgaard, zodat zij kunnen helpen met het beheer.
- Als een Registered User, wil ik een lijst van publieke boomgaarden kunnen bekijken, zodat ik kan zien welke boomgaarden beschikbaar zijn.

### Boombeheer (OrchardTree Management)
- Als een Orchard Manager of Orchard Worker, wil ik bomen kunnen toevoegen aan een boomgaard met rij, kolom en GPS-locatie, zodat ik de exacte positie van elke boom weet.
- Als een Orchard Manager of Orchard Worker, wil ik de plantdatum, toestand (Geplant, Nog niet productief, Vruchtdragend, Slapend), gezondheidsstatus (Gezond, Minder gezond, Ziek, Quarantaine), onderhoudsstatus (Gepland voor snoei, Gepland voor verwijdering), bloeistatus (in bloei, vruchtdragend, plukrijp, ...) en eventuele opmerkingen kunnen vastleggen per boom, zodat ik het beheer kan optimaliseren.
- Als een Orchard Manager of Orchard Worker, wil ik een datum kunnen instellen waarop een boom uit de boomgaard verdwijnt, zodat ik het overzicht behoud.
- Als een Registered User, wil ik bomen als favoriet kunnen markeren, zodat ik ze snel kan terugvinden.

### Boomsoortenbeheer (TreeSpecies Management)
- Als een Species Manager, wil ik boomsoorten kunnen beheren (toevoegen, bewerken, valideren), zodat alleen gevalideerde boomsoorten zichtbaar zijn voor gebruik in boomgaarden.
- Als een Species Manager, wil ik het type fruit en andere kenmerken van een boomsoort kunnen vastleggen, zodat ik volledige informatie heb over elke soort.

### Zoeken & Navigatie
- Als een Registered User of Guest, wil ik bomen kunnen zoeken op basis van eigenschappen (fruitsoort, smaak, bloeistatus, ...), zodat ik snel een interessante boom vind.
- Als een Registered User of Guest, wil ik via GPS-navigatie de route kunnen vinden naar een specifieke boom, zodat ik deze gemakkelijk kan bereiken.
- Als een Registered User met de juiste rechten, wil ik ook in private boomgaarden kunnen zoeken, zodat ik toegang heb tot alle relevante bomen.

### Toegangsbeheer & Rollen
- Als een Orchard Manager, wil ik rollen kunnen toewijzen aan gebruikers (Orchard Worker, Registered User), zodat ik de toegang en rechten kan beheren.
- Als een Registered User, wil ik alleen toegang hebben tot boomgaarden en bomen waarvoor ik rechten heb, zodat privacy en veiligheid gewaarborgd zijn.

### Accountbeheer & Authenticatie
- Als een Guest, wil ik me kunnen registreren als Registered User, zodat ik toegang krijg tot extra functionaliteiten.
- Als een Registered User, wil ik kunnen inloggen en uitloggen, zodat mijn sessie veilig is.
- Als een Registered User, wil ik mijn profiel kunnen bewerken (naam, email, wachtwoord), zodat mijn gegevens actueel blijven.
- Als een Admin, wil ik gebruikers kunnen beheren (activeren, deactiveren, rollen wijzigen), zodat ik het systeem kan modereren.

### Uitgebreid Boomgaardbeheer
- Als een Orchard Manager, wil ik mijn boomgaard kunnen bewerken (naam, beschrijving, zichtbaarheid), zodat de informatie actueel blijft.
- Als een Orchard Manager, wil ik mijn boomgaard kunnen verwijderen, zodat ik oude boomgaarden kan opruimen.
- Als een Orchard Manager, wil ik rechten kunnen intrekken van Orchard Workers of Registered Users, zodat ik de toegang kan beheren.
- Als een Orchard Manager, wil ik een overzicht kunnen zien van alle bomen in mijn boomgaard(en), zodat ik het totaalbeeld heb.

### Uitgebreid Boombeheer
- Als een Orchard Manager of Orchard Worker, wil ik boomgegevens kunnen bewerken, zodat ik de informatie actueel kan houden.
- Als een Orchard Manager of Orchard Worker, wil ik bomen kunnen verwijderen of als "verwijderd" kunnen markeren, zodat ik de administratie kloppend houd.
- Als een Orchard Manager of Orchard Worker, wil ik meerdere bomen tegelijk kunnen bewerken (bulk operations), zodat ik efficiënt kan werken.
- Als een Registered User, wil ik de geschiedenis van een boom kunnen bekijken (wijzigingen, onderhoud), zodat ik de evolutie kan volgen.

### Notificaties & Communicatie
- Als een Orchard Manager, wil ik notificaties ontvangen over belangrijke gebeurtenissen (nieuwe aanvragen, onderhoudsmeldingen), zodat ik op de hoogte blijf.
- Als een Orchard Worker, wil ik taken kunnen rapporteren als voltooid, zodat de Orchard Manager op de hoogte is.
- Als een Registered User, wil ik notificaties kunnen ontvangen over wijzigingen aan mijn favoriete bomen, zodat ik geïnformeerd blijf.

### Rapportage & Analytics
- Als een Orchard Manager, wil ik rapporten kunnen genereren over de status van mijn boomgaard (aantal bomen per status, gezondheid, productiviteit), zodat ik data-gedreven beslissingen kan nemen.
- Als een Admin, wil ik systeemstatistieken kunnen bekijken (aantal gebruikers, boomgaarden, bomen), zodat ik het systeemgebruik kan monitoren.

### Mobiele & Offline Functionaliteit
- Als een Orchard Worker in het veld, wil ik de app offline kunnen gebruiken voor basis operaties, zodat ik ook zonder internetverbinding kan werken.
- Als een gebruiker, wil ik de app responsief kunnen gebruiken op verschillende apparaten (smartphone, tablet, desktop), zodat ik flexibel kan werken.

### Import/Export & Integratie
- Als een Orchard Manager, wil ik boomgegevens kunnen importeren via CSV/Excel, zodat ik bestaande data gemakkelijk kan overzetten.
- Als een Orchard Manager, wil ik rapporten kunnen exporteren naar verschillende formaten (PDF, Excel, CSV), zodat ik data kan delen.

### Uitgebreid Zoeken & Filtering
- Als een gebruiker, wil ik geavanceerde zoekfilters kunnen gebruiken (combinaties van criteria, bereik filters), zodat ik precies vind wat ik zoek.
- Als een gebruiker, wil ik zoekresultaten kunnen sorteren en pagineren, zodat ik overzichtelijk door grote datasets kan bladeren.
- Als een Registered User, wil ik zoekopdrachten kunnen opslaan en hergebruiken, zodat ik efficiënt kan werken.

### Overige
- Als een Orchard Manager of Orchard Worker, wil ik onderhoudstaken kunnen plannen en beheren, zodat het onderhoud van de bomen efficiënt verloopt.
- Als een Registered User, wil ik opmerkingen kunnen toevoegen aan bomen, zodat ik relevante informatie kan delen of bewaren.
- Als een systeem, wil ik audit logs bijhouden van belangrijke acties, zodat er traceerbaarheid is.
- Als een gebruiker, wil ik hulp en documentatie kunnen raadplegen, zodat ik de app goed kan gebruiken.