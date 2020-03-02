import { uniq } from '@lykmapipo/common';
import { getStringSet, getBoolean, isProduction } from '@lykmapipo/env';
import { CHANNEL_EMAIL, Campaign } from '@lykmapipo/postman';

export { CHANNEL_EMAIL, Campaign };

export const ENABLE_SYNC_TRANSPORT = getBoolean('ENABLE_SYNC_TRANSPORT', false);

export const NOTIFICATION_CHANNELS = getStringSet('NOTIFICATION_CHANNELS', [
  CHANNEL_EMAIL,
]);

// TODO
// sendMessage
// sendChangeLog
// sendAction
// sendEvent

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
