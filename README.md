# HeroFightClub

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.5.

## Installation

node v14.7.0 is recommended

```bash
$ npm install
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Rembember to have the backend runing on port 3000.

## Troubleshooting

if ng command is not recognized:

```bash
$ npm link @angular/cli@10.0.5
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Notes

The hero API returns null stats for some heroes, in that case it was assumed that the hero had a stat of 0 in said field.

In every round of the fight, all attack are simultaneous, so a hero might have his HP frop to 0 and still be able to land an attack on said round.

Since there are 3 different hero alignments (good, bad and neutral), a team is considered neutral if neither good or bad heroes have a majority.



