import 'mocha';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { ArtifactArchiver, configure } from '@serenity-js/core';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import { Actors } from '../../src';


configure({
    actors: new Actors(),
    crew: [
        new SerenityBDDReporter(),
        ConsoleReporter.withDefaultColourSupport(),
        ArtifactArchiver.storingArtifactsAt(__dirname, '../../target/site/serenity'),
    ]
});
