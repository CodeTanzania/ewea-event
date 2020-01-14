process.env.NODE_ENV = 'test';
process.env.DEFAULT_LOCALE = 'en';
process.env.LOCALES = 'en,sw';
process.env.GEO_BBOX =
  '39.18239593505859,-6.866780089745249,39.280242919921875,-6.76553393902715';
process.env.PREDEFINE_NAMESPACES =
  'PartyRole,PartyGroup,EventAction,EventFunction,EventGroup,EventType,EventCertainty,EventSeverity,EventStatus,EventUrgency,FeatureType,Feature,AdministrativeLevel,AdministrativeArea,EventIndicator,EventQuestion,Unit';
process.env.PREDEFINE_RELATIONS_IGNORED =
  'PartyRole,PartyGroup,EventAction,EventFunction,EventGroup,EventType,EventCertainty,EventSeverity,EventStatus,EventUrgency,FeatureType,Feature,AdministrativeLevel,AdministrativeArea,EventIndicator,EventQuestion,Unit';
process.env.PREDEFINE_RELATIONS =
  '{"permissions":{"ref":"Permission","array":true},"agency":{"ref":"Party"},"group":{"ref":"Predefine"}}';
