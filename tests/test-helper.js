import Application from 'jexl-playground/app';
import config from 'jexl-playground/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
