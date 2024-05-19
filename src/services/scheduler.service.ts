import scheduler from 'node-schedule';
import nodemailer from 'nodemailer';
import { SubscriptionsService } from './subscription.service';
import { config } from '../config';
import { ExchangerService } from './exhanger.service';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

export class SchedulerService {
  public static init(): void {
    console.log('Going to login to google api');
    const oauth2Client = new OAuth2(
      config.api.emailServer.OAUTH_CLIENT_ID,
      config.api.emailServer.OAUTH_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground',
    );

    // set refresh token
    oauth2Client.setCredentials({
      refresh_token: config.api.emailServer.OAUTH_REFRESH_TOKEN,
    });

        console.log('Going to get access token');

    // get access token using promise
    const accessToken = oauth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: config.api.emailServer.OAUTH_EMAIL,
        clientId: config.api.emailServer.OAUTH_CLIENT_ID,
        clientSecret: config.api.emailServer.OAUTH_CLIENT_SECRET,
        refreshToken: config.api.emailServer.OAUTH_REFRESH_TOKEN,
        accessToken: accessToken.toString(),
      },
    });
    let emailOptions: { from: string; to?: string; subject: string; message?: string } = {
      from: config.api.emailServer.OAUTH_EMAIL,
      subject: 'Currency Rate USD to UAH',
    };
    const subscriptionService = new SubscriptionsService();
    scheduler.scheduleJob('*/1 * * * *', async () => {
      console.log(`${new Date()} going to send emails to subsribed user`);
      const subcriptions = await subscriptionService.getAll();
      const currentRate = await ExchangerService.getCurrentRate();
      const emailAddresses = subcriptions.map((subscr) => subscr.email);
      for (const emailAddress of emailAddresses) {
        emailOptions = { ...emailOptions, to: emailAddress, message: `${currentRate}` };
        try {
          await transporter.sendMail(emailOptions);
        } catch (error) {
          console.log('Error sending currency exchange rate: ', error);
        }
      }
    });
  }

  public static async shutdown(): Promise<void> {
    await scheduler.gracefulShutdown();
  }
}
