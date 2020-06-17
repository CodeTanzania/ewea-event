import { get, map } from 'lodash';
import { uniq, parseTemplate } from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';
import { CHANNEL_EMAIL, Campaign, sendCampaign } from '@lykmapipo/postman';

export { CHANNEL_EMAIL, Campaign, sendCampaign };

export const SMTP_FROM_NAME = getString('SMTP_FROM_NAME', 'EWEA Notification');

// TODO event notification channels
// TODO event changelog notification channels
// TODO use localized templates
// TODO per changelog field message template

/* templates */
export const TEMPLATES_EVENT_NOTIFICATION_FOOTER = '\n\nRegards,\n{sender}';
export const TEMPLATES_EVENT_NOTIFICATION_TITLE =
  '{level} Advisory: {type} {stage} - No. {number}';
export const TEMPLATES_EVENT_NOTIFICATION_MESSAGE =
  'Causes: {causes} \n\nDescription: {description} \n\nInstructions: {instructions} \n\nAreas: {areas} \n\nPlaces: {places}';
export const TEMPLATES_EVENT_STATUS_UPDATE_TITLE =
  'Status Update: {type} {stage} - No. {number}';
export const TEMPLATES_EVENT_STATUS_UPDATE_MESSAGE =
  'Causes: {causes} \n\nDescription: {description} \n\nInstructions: {instructions} \n\nAreas: {areas} \n\nPlaces: {places} \n\nUpdates: {updates}';

// TODO
// sendMessage
// sendActionNotification
// sendActionsNotification

// send create event notification
export const sendEventNotification = (event, done) => {
  // prepare recipient criteria
  // TODO: handle agencies, focals
  let areaIds = map([].concat(event.areas), (area) => {
    return get(area, '_id');
  });
  areaIds = uniq(areaIds).concat(null);
  const criteria = { area: { $in: areaIds } };

  // prepare notification title/subject
  const subject = parseTemplate(TEMPLATES_EVENT_NOTIFICATION_TITLE, {
    level: get(event, 'level.strings.name.en'),
    type: get(event, 'type.strings.name.en'),
    stage: event.stage,
    number: event.number,
  });

  // prepare notification areas body
  let areaNames = map([].concat(event.areas), (area) => {
    return get(area, 'strings.name.en', 'N/A');
  });
  areaNames = uniq(areaNames);

  // prepare notification body
  const body = parseTemplate(TEMPLATES_EVENT_NOTIFICATION_MESSAGE, {
    causes: get(event, 'causes', 'N/A'),
    description: get(event, 'description', 'N/A'),
    instructions: get(event, 'instructions', 'N/A'),
    areas: areaNames.join(', '),
    places: get(event, 'places', 'N/A'),
  });

  // prepare notification footer
  const footer = parseTemplate(TEMPLATES_EVENT_NOTIFICATION_FOOTER, {
    sender: SMTP_FROM_NAME,
  });

  // prepare notification message
  const message = body + footer;

  // send campaign
  sendCampaign({ criteria, subject, message }, done);
};

// send event changes/changelogs notifications
export const sendEventUpdates = (event, changelog, done) => {
  // prepare recipient criteria
  // TODO: handle agencies, focals
  let areaIds = map([].concat(event.areas), (area) => {
    return get(area, '_id');
  });
  areaIds = uniq(areaIds).concat(null);
  const criteria = { area: { $in: areaIds } };

  // prepare notification title/subject
  const subject = parseTemplate(TEMPLATES_EVENT_STATUS_UPDATE_TITLE, {
    type: get(event, 'type.strings.name.en'),
    stage: event.stage,
    number: event.number,
  });

  // prepare notification areas body
  let areaNames = map([].concat(event.areas), (area) => {
    return get(area, 'strings.name.en', 'N/A');
  });
  areaNames = uniq(areaNames);

  // prepare updates
  // TODO: compute updates from other changelog attributes i.e
  // agencies, focals, areas, effect, need, impacts etc
  // TODO: changes from event instructions, interventions,
  // impacts, constraints, remarks,
  const updates = changelog.comment || 'N/A';

  // prepare notification body
  const body = parseTemplate(TEMPLATES_EVENT_STATUS_UPDATE_MESSAGE, {
    causes: get(event, 'causes', 'N/A'),
    description: get(event, 'description', 'N/A'),
    instructions: get(event, 'instructions', 'N/A'),
    areas: areaNames.join(', '),
    places: get(event, 'places', 'N/A'),
    updates,
  });

  // prepare notification footer
  const footer = parseTemplate(TEMPLATES_EVENT_NOTIFICATION_FOOTER, {
    sender: SMTP_FROM_NAME,
  });

  // prepare notification message
  const message = body + footer;

  // send campaign
  sendCampaign({ criteria, subject, message }, done);
};
