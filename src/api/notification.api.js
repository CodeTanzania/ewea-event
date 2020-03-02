import { get, map } from 'lodash';
import { uniq, parseTemplate } from '@lykmapipo/common';
import { getStringSet, getBoolean, isProduction } from '@lykmapipo/env';
import { CHANNEL_EMAIL, Campaign } from '@lykmapipo/postman';

export { CHANNEL_EMAIL, Campaign };

export const ENABLE_SYNC_TRANSPORT = getBoolean('ENABLE_SYNC_TRANSPORT', false);

export const NOTIFICATION_CHANNELS = getStringSet('NOTIFICATION_CHANNELS', [
  CHANNEL_EMAIL,
]);

/* templates */
export const TEMPLATES_EVENT_NOTIFICATION_TITLE =
  '{level} Advisory: {type} {stage} - #{number}';
export const TEMPLATES_EVENT_NOTIFICATION_MESSAGE =
  'Description: {description} \n\n Instructions: {instructions} \n\n Areas: {areas} \n\n Places: {places}';

// TODO
// sendMessage
// sendChangeLogNotification
// sendActionNotification

export const sendCampaign = (message, done) => {
  // prepare campaign
  const isCampaignInstance = message instanceof Campaign;
  let campaign = isCampaignInstance ? message.toObject() : message;

  // ensure campaign channels
  campaign.channels = uniq(
    [].concat(NOTIFICATION_CHANNELS).concat(message.channels)
  );

  // instantiate campaign
  campaign = new Campaign(message);

  // queue campaign in production
  // or if is asynchronous send
  if (isProduction() && !ENABLE_SYNC_TRANSPORT) {
    campaign.queue();
    done(null, campaign);
  }

  // direct send campaign in development & test
  else {
    campaign.send(done);
  }
};

export const sendEventNotification = (event, done) => {
  // prepare recipient criteria
  let areaIds = map([].concat(event.areas), area => {
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
  let areaNames = map([].concat(event.areas), area => {
    return get(area, 'strings.name.en', 'N/A');
  });
  areaNames = uniq(areaNames);

  // prepare notification body
  const message = parseTemplate(TEMPLATES_EVENT_NOTIFICATION_MESSAGE, {
    description: get(event, 'description', 'N/A'),
    instructions: get(event, 'instructions', 'N/A'),
    areas: areaNames.join(', '),
    places: get(event, 'places', 'N/A'),
  });

  // sent campaign
  sendCampaign({ criteria, subject, message }, done);
};
