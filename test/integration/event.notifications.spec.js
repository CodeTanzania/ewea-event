import { clear, create, expect } from '@lykmapipo/mongoose-test-helpers';
import { Predefine } from '@lykmapipo/predefine';
import { Event } from '../../src';

import {
  CHANNEL_EMAIL,
  TEMPLATES_EVENT_NOTIFICATION_TITLE,
  TEMPLATES_EVENT_NOTIFICATION_MESSAGE,
  Campaign,
  sendCampaign,
  sendEventNotification,
} from '../../src/event.notifications';

describe('Notification', () => {
  const level = Predefine.fake();
  const type = Predefine.fake();
  const areas = Predefine.fake(2);

  const event = Event.fake();
  event.set({ level, type, areas });

  before((done) => clear(done));
  before((done) => create([level, type, ...areas], done));
  before((done) => create(event, done));

  it('should parse & expose common config', () => {
    expect(CHANNEL_EMAIL).to.exist;
    expect(TEMPLATES_EVENT_NOTIFICATION_TITLE).to.exist;
    expect(TEMPLATES_EVENT_NOTIFICATION_MESSAGE).to.exist;
  });

  it('should send a campaign', (done) => {
    const message = Campaign.fake().toObject();
    sendCampaign(message, (error, sent) => {
      expect(error).to.not.exist;
      expect(sent).to.exist;
      done(error, sent);
    });
  });

  it('should send event alert', (done) => {
    sendEventNotification(event, (error, sent) => {
      expect(error).to.not.exist;
      expect(sent).to.exist;
      done(error, sent);
    });
  });

  after((done) => clear(done));
});
