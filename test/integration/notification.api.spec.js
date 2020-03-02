import { clear, expect } from '@lykmapipo/mongoose-test-helpers';

import {
  CHANNEL_EMAIL,
  ENABLE_SYNC_TRANSPORT,
  NOTIFICATION_CHANNELS,
  Campaign,
  sendCampaign,
} from '../../src/api/notification.api';

describe.only('Notification', () => {
  before(done => clear(done));

  it('should parse & expose common config', () => {
    expect(CHANNEL_EMAIL).to.exist;
    expect(ENABLE_SYNC_TRANSPORT).to.exist;
    expect(NOTIFICATION_CHANNELS).to.exist;
  });

  it('should send a campaign', done => {
    const message = Campaign.fake().toObject();
    sendCampaign(message, (error, sent) => {
      expect(error).to.not.exist;
      expect(sent).to.exist;
      done(error, sent);
    });
  });

  after(done => clear(done));
});
