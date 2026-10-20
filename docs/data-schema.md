# Data schema

Generated from the Payload config by `pnpm generate:schema-doc`; do not edit by hand.
Field names are the API names. Labels (Dutch) follow the colon. `→` marks a relationship.
Access rules live in code and are not listed here. Collections marked *dashboard only* are not in the CMS; they are used by the member dashboard.

## Collections

### users

Gebruiker · auth

- `name` (text): Naam
- `generateSlug` (checkbox, default true): Generate Slug
- `slug` (text): Slug
- `status` (select, required, one of: active, inactive, default "active"): Status
- `roles` (select, required, many, one of: admin, editor, user, coach, default "user"): Rollen
- `isCoach` (checkbox, default false): Is Coach
- `avatar` (upload, → media): Foto
- `subtitle` (text): Ondertitel
- `about` (textarea): Over
- `position` (number): Positie
- `content` (richText): Content
- `updatedAt` (date)
- `createdAt` (date)
- `email` (email, required): E-mail
- `resetPasswordRequestedAt` (date)

### media

Media item · upload

- `alt` (text, required): Alt tekst
- `objectPositionDesktop` (select, one of: center, top, bottom, left, right, default "top"): Afbeelding uitsnij positie (desktop)
- `objectPositionMobile` (select, one of: center, top, bottom, left, right, default "center"): Afbeelding uitsnij positie (mobiel)
- `poster` (upload, → media): Video poster
- `prefix` (text, default "images_dev/"): Prefix
- `_objectKey` (text): _object Key
- `updatedAt` (date)
- `createdAt` (date)
- `url` (text): URL
- `thumbnailURL` (text): Thumbnail URL
- `filename` (text)
- `mimeType` (text): MIME Type
- `filesize` (number)
- `width` (number)
- `height` (number)
- `focalX` (number)
- `focalY` (number)

### documents

Document · upload

- `title` (text, required): Titel
- `prefix` (text, default "documents_dev/"): Prefix
- `_objectKey` (text): _object Key
- `updatedAt` (date)
- `createdAt` (date)
- `url` (text): URL
- `thumbnailURL` (text): Thumbnail URL
- `filename` (text)
- `mimeType` (text): MIME Type
- `filesize` (number)
- `width` (number)
- `height` (number)
- `focalX` (number)
- `focalY` (number)

### pages

Pagina · drafts

- `parent` (relationship, → pages): Valt onder
- `title` (text, required): Titel
- `hasHero` (checkbox, required, default false): Met Hero
- `hero` (group)
  - `media` (upload, required, → media): Afbeelding / Video
  - `text` (richText): Content
  - `contentPosition` (select, one of: left, center, default "left"): Content positie
- `layout` (blocks, required): Layout
  - block `content`
    - `backgroundColor` (select, required, one of: backgroundDark, backgroundLight, backgroundWhite, default "backgroundDark"): Achtergrondkleur
    - `blockHeight` (select, required, one of: fixed, auto, default "fixed"): Hoogte
    - `title` (text): Titel
    - `introduction` (richText): Introductie
    - `columns` (array): Kolommen
      - `backgroundColor` (select, one of: backgroundDark, backgroundLight, backgroundWhite): Achtergrondkleur
      - `contentPosition` (select, required, one of: contentOnly, contentBottom, contentRight, contentLeft, default "contentRight"): Content Type
      - `media` (upload, required, → media): Afbeelding
      - `imageSize` (select, required, one of: imageTopCut, imageFull, imageCenter, default "imageCenter"): Afbeeldingsgrootte
      - `richText` (richText, required): Content
      - `id` (text): ID
    - `id` (text): ID
    - `blockName` (text): Block Name
  - block `carousel`
    - `title` (text, required): Titel
    - `subtitle` (text, required): Subtitel
    - `backgroundColor` (select, required, one of: backgroundDark, backgroundLight, backgroundWhite, default "backgroundDark"): Achtergrondkleur
    - `carouselItems` (array): Carousel Items
      - `media` (upload, → media): Avatar
      - `text` (textarea, required): Tekst
      - `name` (text, required): Naam
      - `google_url` (text): Google Review URL
      - `id` (text): ID
    - `id` (text): ID
    - `blockName` (text): Block Name
  - block `team`
    - `title` (text, required): Titel
    - `limit` (number, default 0): Limiet
    - `sortBy` (select, required, one of: name, -name, -createdAt, createdAt, position, default "name"): Sortering
    - `type` (select, required, one of: carousel, grid, default "carousel"): Type
    - `backgroundColor` (select, required, one of: backgroundDark, backgroundLight, backgroundWhite, default "backgroundDark"): Achtergrondkleur
    - `selectedCoaches` (relationship, many, → users): Geselecteerde coaches
    - `enableLink` (checkbox): Heeft een link
    - `link` (group): Link
      - `type` (radio, one of: reference, custom, default "reference"): Link type
      - `newTab` (checkbox): Openen in nieuw tabblad
      - `addLabel` (checkbox): Label toevoegen
      - `reference` (relationship, required, → pages | posts | users): Interne link
      - `url` (text, required): Externe URL
      - `label` (text, required): Label
      - `labelColor` (select, one of: default, beige, orange, neutral, white, default "default"): Label kleur
    - `id` (text): ID
    - `blockName` (text): Block Name
  - block `instagram`
    - `title` (text, required): Titel
    - `content` (richText, required): Content
    - `type` (select, required, one of: carousel, grid, default "carousel"): Type
    - `backgroundColor` (select, required, one of: backgroundDark, backgroundLight, backgroundWhite, default "backgroundDark"): Achtergrondkleur
    - `images` (array): Foto's
      - `media` (upload, → media): Afbeelding
      - `enableLink` (checkbox): Heeft een link
      - `link` (group): Link
        - `type` (radio, one of: reference, custom, default "reference"): Link type
        - `newTab` (checkbox): Openen in nieuw tabblad
        - `addLabel` (checkbox): Label toevoegen
        - `reference` (relationship, required, → pages | posts | users): Interne link
        - `url` (text, required): Externe URL
        - `label` (text, required): Label
        - `labelColor` (select, one of: default, beige, orange, neutral, white, default "default"): Label kleur
      - `id` (text): ID
    - `id` (text): ID
    - `blockName` (text): Block Name
  - block `cycleTimeline`
    - `backgroundColor` (select, required, one of: backgroundDark, backgroundLight, backgroundWhite, default "backgroundDark"): Achtergrondkleur
    - `title` (text, required): Titel
    - `subtitle` (text): Subtitel
    - `stages` (array, required): Fases
      - `image` (upload, → media): Afbeelding
      - `weekLabel` (text, required): Weeklabel
      - `phaseTitle` (text, required): Fase titel
      - `description` (textarea, required): Beschrijving
      - `id` (text): ID
    - `footerText` (text): Voettekst
    - `footerContent` (richText): Voettekst content
    - `id` (text): ID
    - `blockName` (text): Block Name
  - block `mediaCarousel`
    - `backgroundColor` (select, required, one of: backgroundDark, backgroundLight, backgroundWhite, default "backgroundLight"): Achtergrondkleur
    - `title` (text, required): Titel
    - `mainMedia` (upload, required, → media): Hoofdmedia (video of afbeelding)
    - `galleryImages` (array, required): Carousel afbeeldingen
      - `media` (upload, required, → media): Afbeelding
      - `caption` (text): Beschrijving
      - `id` (text): ID
    - `quote` (group): Quote (optioneel)
      - `text` (textarea): Quote
      - `author` (text): Auteur
    - `id` (text): ID
    - `blockName` (text): Block Name
- `meta` (group)
  - `overview` (ui): Overview
  - `title` (text): Title
  - `image` (upload, → media): Meta Image
  - `description` (textarea): Description
  - `preview` (ui): Preview
  - `richSnippets` (array): Rich Snippets
    - `jsonLd` (json): Rich Snippet JSON-LD
    - `id` (text): ID
- `publishedAt` (date): Published At
- `generateSlug` (checkbox, default true): Generate Slug
- `slug` (text, required): Slug
- `updatedAt` (date)
- `createdAt` (date)

### posts

Bericht · drafts

- `title` (text, required): Titel
- `intro` (text, required): Intro
- `thumbnailImage` (upload, required, → media): Thumbnail
- `heroImage` (upload, → media): Hero Image
- `content` (richText, required)
- `relatedPosts` (relationship, many, → posts): Related Posts
- `meta` (group)
  - `overview` (ui): Overview
  - `title` (text): Title
  - `image` (upload, → media): Meta Image
  - `description` (textarea): Description
  - `preview` (ui): Preview
- `publishedAt` (date): Published At
- `authors` (relationship, many, → users): Auteurs
- `populatedAuthors` (array): Populated Authors
  - `id` (text): Id
  - `name` (text): Name
- `generateSlug` (checkbox, default true): Generate Slug
- `slug` (text, required): Slug
- `updatedAt` (date)
- `createdAt` (date)

### lessons

Les

- `importCsv` (ui): Import Csv
- `template` (relationship, → lesson-templates): Sjabloon
- `program` (relationship, → programs): Programma
- `title` (text, required): Titel
- `type` (select, required, one of: pt, semi_pt, group, open_gym): Type
- `status` (select, required, one of: open, closed, default "closed"): Status
- `startDate` (date): Startdatum & -tijd
- `endDate` (date): Einddatum & -tijd
- `spots` (number): Aantal plekken
- `image` (upload, → media): Afbeelding
- `coaches` (relationship, many, → users): Coaches
- `workoutBlocks` (array): Workoutblokken
  - `name` (text, required): Workout naam
  - `description` (textarea): Workout omschrijving
  - `duration` (number): Tijd (in minuten)
  - `timerMode` (select, one of: countdown, emom, amrap, rounds, intervals, default "countdown"): Timermodus
  - `highlightExercises` (checkbox, default false): Actieve oefening markeren
  - `intervalSeconds` (number, min 1): Interval (seconden)
  - `rounds` (number, min 1): Aantal rondes
  - `roundTypes` (array): Rondetypes
    - `type` (select, required, one of: work, rest, active_rest, default "work"): Type
    - `seconds` (number, required, min 1): Tijd (seconden)
    - `id` (text): ID
  - `poa` (text): POA's
  - `exercises` (array): Oefeningen
    - `name` (text, required): Naam
    - `description` (textarea): Omschrijving
    - `rotating` (checkbox, default false): Wisselt per ronde
    - `id` (text): ID
  - `id` (text): ID
- `updatedAt` (date)
- `createdAt` (date)

### lesson-templates

Les sjabloon

- `isActive` (checkbox, default true): Actief
- `title` (text, required): Naam
- `type` (select, required, one of: pt, semi_pt, group, open_gym): Type
- `spots` (number): Aantal plekken
- `schedule` (array, required): Vaste momenten
  - `dayOfWeek` (select, required, one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday): Dag van de week
  - `time` (date): Starttijd
  - `endTime` (date): Eindtijd
  - `id` (text): ID
- `coaches` (relationship, many, → users): Coaches
- `image` (upload, → media): Afbeelding
- `defaultWorkoutBlocks` (array): Standaard workoutblokken
  - `name` (text, required): Workout naam
  - `description` (textarea): Workout omschrijving
  - `duration` (number): Tijd (in minuten)
  - `timerMode` (select, one of: countdown, emom, amrap, rounds, intervals, default "countdown"): Timermodus
  - `highlightExercises` (checkbox, default false): Actieve oefening markeren
  - `intervalSeconds` (number, min 1): Interval (seconden)
  - `rounds` (number, min 1): Aantal rondes
  - `roundTypes` (array): Rondetypes
    - `type` (select, required, one of: work, rest, active_rest, default "work"): Type
    - `seconds` (number, required, min 1): Tijd (seconden)
    - `id` (text): ID
  - `poa` (text): POA's
  - `exercises` (array): Oefeningen
    - `name` (text, required): Naam
    - `description` (textarea): Omschrijving
    - `rotating` (checkbox, default false): Wisselt per ronde
    - `id` (text): ID
  - `id` (text): ID
- `updatedAt` (date)
- `createdAt` (date)

### events

Evenement

- `title` (text, required): Titel
- `eventType` (select, required, one of: running, hyrox, special): Type
- `bannerImage` (upload, → media): Banner afbeelding
- `startsAt` (date, required): Startdatum
- `endsAt` (date): Einddatum
- `location` (text): Locatie
- `capacity` (number): Capaciteit
- `signupOpenAt` (date): Inschrijven geopend vanaf
- `signupCloseAt` (date): Inschrijven gesloten vanaf
- `generateSlug` (checkbox, default true): Generate Slug
- `slug` (text): Slug
- `updatedAt` (date)
- `createdAt` (date)

### exercises

Oefening

- `name` (text, required): Naam
- `description` (textarea): Omschrijving
- `updatedAt` (date)
- `createdAt` (date)

### programs

Programma

- `title` (text, required): Titel
- `startDate` (date, required): Startdatum
- `endDate` (date, required): Einddatum
- `bannerImage` (upload, required, → media): Banner afbeelding
- `description` (richText, required): Beschrijving
- `lessons` (join): Lessen
- `finalEvent` (relationship, → events): Eindevent
- `generateSlug` (checkbox, default true): Generate Slug
- `slug` (text): Slug
- `updatedAt` (date)
- `createdAt` (date)

### lesson-enrollments

Les deelname

- `user` (relationship, required, → users): Gebruiker
- `lesson` (relationship, required, → lessons): Les
- `status` (select, required, one of: assigned, started, completed, cancelled, default "assigned"): Status
- `addedBy` (relationship, → users): Toegevoegd door
- `updatedAt` (date)
- `createdAt` (date)

### lesson-exercise-tracking

Les oefening voortgang

- `user` (relationship, required, → users): Gebruiker
- `lesson` (relationship, required, → lessons): Les
- `workoutBlocks` (array): Workoutblokken
  - `lessonBlockId` (text, required): Les workoutblok ID
  - `workoutName` (text, required): Workout naam
  - `workoutDescription` (textarea): Workout omschrijving
  - `duration` (number): Tijd (in minuten)
  - `exercises` (array): Oefeningen
    - `lessonExerciseId` (text, required): Les oefening ID
    - `exerciseName` (text, required): Oefening naam
    - `exerciseDescription` (textarea): Oefening omschrijving
    - `sets` (number): Sets
    - `reps` (text): Reps
    - `notes` (textarea): Notities
    - `completed` (checkbox, default false): Afgerond
    - `id` (text): ID
  - `id` (text): ID
- `lastLoggedAt` (date): Bijgewerkt op
- `updatedAt` (date)
- `createdAt` (date)

### program-enrollments

Programma deelname

- `user` (relationship, required, → users): Gebruiker
- `program` (relationship, required, → programs): Programma
- `status` (select, required, one of: enrolled, active, completed, dropped, default "enrolled"): Status
- `addedBy` (relationship, → users): Toegevoegd door
- `updatedAt` (date)
- `createdAt` (date)

### event-registrations

Event inschrijving

- `user` (relationship, required, → users): Gebruiker
- `event` (relationship, required, → events): Event
- `status` (select, required, one of: registered, waitlist, cancelled, attended, default "registered"): Status
- `addedBy` (relationship, → users): Toegevoegd door
- `updatedAt` (date)
- `createdAt` (date)

### health-measurements *(dashboard only)*

Gezondheidsmeting

- `user` (relationship, required, → users): Gebruiker
- `measuredAt` (date, required): Gemeten op
- `height` (number, min 50, max 250): Lengte
- `weight` (number, min 20, max 400): Gewicht
- `bodyFatPercentage` (number, min 1, max 80): Vetpercentage
- `muscleMass` (number, min 5, max 200): Spiermassa
- `visceralFat` (number, min 1, max 59): Visceraal vet
- `boneMass` (number, min 0.5, max 10): Botmassa
- `bmi` (number, min 5, max 100): BMI
- `bmr` (number, min 500, max 6000): Basaal metabolisme (BMR)
- `metabolicAge` (number, min 5, max 120): Metabolische leeftijd
- `bodyWaterPercentage` (number, min 10, max 90): Vochtpercentage
- `updatedAt` (date)
- `createdAt` (date)

### redirects

Redirect

- `from` (text, required)
- `to` (group)
  - `type` (radio, one of: reference, custom, default "reference")
  - `reference` (relationship, required, → pages | posts)
  - `url` (text, required)
- `updatedAt` (date)
- `createdAt` (date)

### forms

Formulier

- `title` (text, required): Titel
- `fields` (blocks)
  - block `checkbox`
    - `name` (text, required)
    - `label` (text)
    - `width` (number)
    - `required` (checkbox)
    - `defaultValue` (checkbox)
    - `id` (text): ID
    - `blockName` (text): Block Name
  - block `email`
    - `name` (text, required)
    - `label` (text)
    - `width` (number)
    - `required` (checkbox)
    - `id` (text): ID
    - `blockName` (text): Block Name
  - block `message`
    - `message` (richText): Message
    - `id` (text): ID
    - `blockName` (text): Block Name
  - block `number`
    - `name` (text, required)
    - `label` (text)
    - `width` (number)
    - `defaultValue` (number)
    - `required` (checkbox)
    - `id` (text): ID
    - `blockName` (text): Block Name
  - block `select`
    - `name` (text, required)
    - `label` (text)
    - `width` (number)
    - `defaultValue` (text)
    - `placeholder` (text)
    - `options` (array)
      - `label` (text, required)
      - `value` (text, required)
      - `id` (text): ID
    - `required` (checkbox)
    - `id` (text): ID
    - `blockName` (text): Block Name
  - block `text`
    - `name` (text, required)
    - `label` (text)
    - `width` (number)
    - `defaultValue` (text)
    - `required` (checkbox)
    - `id` (text): ID
    - `blockName` (text): Block Name
  - block `textarea`
    - `name` (text, required)
    - `label` (text)
    - `width` (number)
    - `defaultValue` (text)
    - `required` (checkbox)
    - `id` (text): ID
    - `blockName` (text): Block Name
- `submitButtonLabel` (text): Bevestigknop tekst
- `confirmationType` (radio, one of: message, redirect, default "message"): Bevestig type
- `confirmationMessage` (richText, required): Bevestigingsbericht
- `redirect` (group)
  - `url` (text, required)
- `emails` (array): Emails
  - `emailTo` (text)
  - `cc` (text)
  - `bcc` (text)
  - `replyTo` (text)
  - `emailFrom` (text)
  - `subject` (text, required, default "You've received a new message.")
  - `message` (richText)
  - `id` (text): ID
- `updatedAt` (date)
- `createdAt` (date)

### form-submissions

Formulier Submissie

- `form` (relationship, required, → forms): Form
- `submissionData` (array): Submission Data
  - `field` (text, required): Field
  - `value` (textarea, required): Value
  - `id` (text): ID
- `updatedAt` (date)
- `createdAt` (date)

## Globals

### header

- `headerLogo` (upload, required, → media): Logo
- `navItems` (array): Navigatie items
  - `initiallyVisible` (checkbox, default true): Standaard zichtbaar
  - `link` (group): Link
    - `type` (radio, one of: reference, custom, default "reference"): Link type
    - `newTab` (checkbox): Openen in nieuw tabblad
    - `addLabel` (checkbox): Label toevoegen
    - `reference` (relationship, required, → pages | posts | users): Interne link
    - `url` (text, required): Externe URL
    - `label` (text, required): Label
    - `labelColor` (select, one of: default, beige, orange, neutral, white, default "default"): Label kleur
  - `id` (text): ID
- `updatedAt` (date)
- `createdAt` (date)

### footer

- `title` (text, required): Titel
- `description` (text, required): Subtitel
- `link` (group): Contactlink
  - `type` (radio, one of: reference, custom, default "reference"): Link type
  - `newTab` (checkbox): Openen in nieuw tabblad
  - `addLabel` (checkbox): Label toevoegen
  - `reference` (relationship, required, → pages | posts | users): Interne link
  - `url` (text, required): Externe URL
  - `label` (text, required): Label
  - `labelColor` (select, one of: default, beige, orange, neutral, white, default "default"): Label kleur
- `footerLogo` (upload, required, → media): Logo
- `contactText` (richText): Contact Informatie
- `socialMediaLinks` (array): Social Media Links
  - `platform` (select, required, one of: facebook, twitter, instagram, youtube, tiktok): Platform
  - `url` (text, required): URL
  - `id` (text): ID
- `footerColumns` (array): Footer Kolommen
  - `columnTitle` (text, required): Kolom Titel
  - `contentType` (radio, required, one of: links, richText, default "links"): Inhoudstype
  - `links` (array): Links
    - `link` (group): Link
      - `type` (radio, one of: reference, custom, default "reference"): Link type
      - `newTab` (checkbox): Openen in nieuw tabblad
      - `addLabel` (checkbox): Label toevoegen
      - `reference` (relationship, required, → pages | posts | users): Interne link
      - `url` (text, required): Externe URL
      - `label` (text, required): Label
      - `labelColor` (select, one of: default, beige, orange, neutral, white, default "default"): Label kleur
    - `id` (text): ID
  - `richText` (richText): Rich Text
  - `id` (text): ID
- `updatedAt` (date)
- `createdAt` (date)

### whatsApp

- `phoneNumber` (text, required): Telefoonnummer
- `textPreFilled` (text, required): Tekst vooraf ingevuld
- `buttonText` (text, required): Tekst voor knop
- `updatedAt` (date)
- `createdAt` (date)

### organization

- `name` (text, required): Naam
- `url` (text, required): URL
- `logo` (upload, → media): Logo
- `email` (email): E-mailadres
- `description` (textarea): Omschrijving
- `contactPoint` (group): Contactpersoon
  - `telephone` (text): Telefoonnummer
  - `contactType` (text): Type contact
- `address` (group): Adres
  - `streetAddress` (text): Straat + huisnummer
  - `addressLocality` (text): Stad
  - `postalCode` (text): Postcode
  - `addressCountry` (text, default "NL"): Landcode
- `geo` (group): Coördinaten
  - `latitude` (number): Breedtegraad (latitude)
  - `longitude` (number): Lengtegraad (longitude)
- `sameAs` (array): Social media
  - `url` (text, required): URL
  - `id` (text): ID
- `priceRange` (text): Prijsniveau
- `openingHours` (array): Openingstijden
  - `dayOfWeek` (select, required, one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday): Dag van de week
  - `opens` (text, required): Openingstijd
  - `closes` (text, required): Sluitingstijd
  - `id` (text): ID
- `images` (array): Afbeeldingen
  - `image` (upload, → media): Afbeelding
  - `id` (text): ID
- `updatedAt` (date)
- `createdAt` (date)
