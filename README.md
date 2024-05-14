# Guest Flow - Visitor Management System

## Overview

>Guest Flow is a web application designed to manage and display visitor schedules on facility screens. This application utilizes React for the frontend and Express for the backend, providing a full-stack solution for real-time visitor management.

# Användar- och Besökshanteringssystem

## Översikt

Detta system hanterar användarregistrering, autentisering, och CRUD-operationer för besök. Systemet använder Express.js för att definiera API-endpoints och Prisma för att interagera med databasen. Autentisering och åtkomstkontroll hanteras med JWT och middleware-funktioner.

## Endpoints och Åtkomstkontroll

### Användarhantering

#### Registering av användare
- **Endpoint:** `POST /api/users`
- **Beskrivning:** Registrerar en ny användare.
- **Åtkomst:** Endast administratörer (ADMIN).
- **Krav:** Användaruppgifter (användarnamn, lösenord, fullständigt namn, roll).

#### Inloggning av användare
- **Endpoint:** `POST /api/users/login`
- **Beskrivning:** Loggar in en användare och genererar en JWT-token.
- **Åtkomst:** Offentlig.
- **Krav:** Användarnamn och lösenord.

#### Hämtning av alla användare
- **Endpoint:** `GET /api/users`
- **Beskrivning:** Hämtar en lista över alla användare.
- **Åtkomst:** Endast administratörer (ADMIN).

#### Radering av användare
- **Endpoint:** `DELETE /api/users`
- **Beskrivning:** Raderar en användare.
- **Åtkomst:** Endast administratörer (ADMIN).
- **Krav:** Användarnamn på användaren som ska raderas.

#### Utloggning av användare
- **Endpoint:** `POST /api/users/logout`
- **Beskrivning:** Loggar ut en användare genom att rensa JWT-token från cookies.
- **Åtkomst:** Offentlig.

#### Uppdatering av användarprofil
- **Endpoint:** `PUT /api/users/profile`
- **Beskrivning:** Uppdaterar användarens profilinformation.
- **Åtkomst:** Endast administratörer (ADMIN).
- **Krav:** Användarnamn och andra uppdaterade uppgifter (fullständigt namn, lösenord).

### Besökshantering

#### Hämtning av alla besök
- **Endpoint:** `GET /api/visits`
- **Beskrivning:** Hämtar en lista över alla schemalagda besök.
- **Åtkomst:** Offentlig.

#### Lägg till ett nytt besök
- **Endpoint:** `POST /api/visits`
- **Beskrivning:** Lägger till ett nytt besök med detaljer.
- **Åtkomst:** Endast autentiserade användare (användare måste vara inloggade).
- **Krav:** Besöksuppgifter (företag, företagsinformation, företagslogotyp, antal besökare, besökande avdelningar, schemalagd ankomst, etc.).

#### Uppdatera ett befintligt besök
- **Endpoint:** `PUT /api/visits/:id`
- **Beskrivning:** Uppdaterar detaljer för ett befintligt besök.
- **Åtkomst:** Endast autentiserade användare (användare måste vara inloggade).
- **Krav:** Besöks-ID och uppdaterade besöksuppgifter.

#### Radera ett besök
- **Endpoint:** `DELETE /api/visits/:id`
- **Beskrivning:** Raderar ett befintligt besök.
- **Åtkomst:** Endast autentiserade användare (användare måste vara inloggade).
- **Krav:** Besöks-ID.

## Middleware

### AuthMiddleware
- **Funktion:** `protect`
- **Beskrivning:** Verifierar JWT-token och lägger till användarinformation till förfrågan. Alla skyddade rutter måste anropa denna middleware för att säkerställa att användaren är autentiserad.

### AdminMiddleware
- **Funktion:** `admin`
- **Beskrivning:** Kontrollerar att användaren har rollen `ADMIN`. Denna middleware ska anropas efter `protect`-middleware för att säkerställa att användaren har administrativa rättigheter.

## Systemflöde

1. **Registrering av Användare:** Administratörer kan registrera nya användare genom att skicka en POST-förfrågan till `/api/users`.
2. **Inloggning av Användare:** Användare loggar in genom att skicka en POST-förfrågan till `/api/users/login`, vilket genererar en JWT-token.
3. **Skyddade Rutter:** Alla rutter som kräver autentisering använder `protect`-middleware för att verifiera JWT-token.
4. **Administrativa Rutter:** Rutter som endast administratörer kan komma åt använder både `protect`- och `admin`-middleware.
5. **Besökshantering:** Autentiserade användare kan lägga till, uppdatera och radera besök. Offentliga användare kan se listan över alla besök.

## Slutsats

Detta system säkerställer att endast autentiserade användare kan utföra vissa åtgärder, medan administratörer har fullständig kontroll över användarregistrering och hantering. Middleware-funktioner spelar en viktig roll i att upprätthålla säkerheten och åtkomstkontrollen inom systemet.
