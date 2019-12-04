import { connect, clear, drop } from '@lykmapipo/mongoose-test-helpers';

process.env.NODE_ENV = 'test';
process.env.DEFAULT_LOCALE = 'en';
process.env.LOCALES = 'en,sw';
process.env.PREDEFINE_NAMESPACES =
  'PartyRole,PartyGroup,EventAction,EventFunction,EventGroup,EventType,EventCertainty,EventSeverity,EventStatus,EventUrgency,FeatureType,Feature,AdministrativeLevel,AdministrativeArea';
process.env.PREDEFINE_RELATIONS_IGNORED =
  'PartyRole,PartyGroup,EventAction,EventFunction,EventGroup,EventType,EventCertainty,EventSeverity,EventStatus,EventUrgency,FeatureType,Feature,AdministrativeLevel,AdministrativeArea';
process.env.PREDEFINE_RELATIONS =
  '{"permissions":{"ref":"Permission","array":true},"agency":{"ref":"Party"},"group":{"ref":"Predefine"}}';

before(done => connect(done));

before(done => clear(done));

after(done => drop(done));
