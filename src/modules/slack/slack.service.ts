import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { UserService } from '../user/user.service';
import { Order } from 'src/entities/order.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from 'src/entities/user.entity';

dotenv.config();

@Injectable()
export class SlackService {
  constructor(
    private readonly userService: UserService,
    private readonly em: EntityManager
  ) {}

  // Handle Slack Login
  async handleSlackCallback(code: string) {
    try {
      const authData = await this.getAuthData(code);
      const userData = await this.getUserData(
        authData.access_token,
        authData.authed_user.id
      );

      let user = await this.userService.findUser(userData.slackId);
      if (!user) user = await this.userService.createUser(userData);

      return userData;
    } catch (error) {
      throw new Error('Authentication failed: ' + error.message);
    }
  }

  // Get the auth data of the user
  private async getAuthData(code: string) {
    try {
      const response = await axios.post(
        'https://slack.com/api/oauth.v2.access',
        null,
        {
          params: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            redirect_uri: `${process.env.REDIRECT_URI}/slack/callback`,
          },
        }
      );

      if (!response.data.ok) {
        throw new Error(`Slack API error: ${response.data.error}`);
      }

      return response.data;
    } catch (error) {
      throw new Error('Failed to get access token: ' + error.message);
    }
  }

  // Get the profile information of the authed user
  private async getUserData(accessToken: string, slackId: string) {
    try {
      const userInfoResponse = await axios.get(
        'https://slack.com/api/users.info',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            user: slackId,
          },
        }
      );

      const profileResponse = await axios.get(
        'https://slack.com/api/users.profile.get',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            user: slackId,
          },
        }
      );

      const profilePic = profileResponse.data.profile.image_192;
      const fetchedUser = userInfoResponse.data.user;

      return {
        slackId: fetchedUser.id,
        firstName: fetchedUser.profile.first_name,
        lastName: fetchedUser.profile.last_name,
        email: fetchedUser.profile.email,
        profilePic: profilePic,
        token: accessToken,
      };
    } catch (error) {
      throw new Error('Failed to get user data: ' + error.message);
    }
  }

  async sendSlackMessage(message: string, token: string) {
    try {
      const response = await axios.post(
        'https://slack.com/api/chat.postMessage',
        {
          channel: process.env.CHANNEL_ID,
          text: message,
          mrkdwn: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.ok) {
        return response.data.ts;
      }
    } catch (error) {
      throw new Error('Failed to send slack message: ' + error.message);
    }
  }

  async updateSlackMessage(message: string, timeStamp: string, token: string) {
    try {
      await axios.post(
        'https://slack.com/api/chat.update',
        {
          channel: process.env.CHANNEL_ID,
          ts: timeStamp,
          text: message,
          mrkdwn: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      throw new Error('Failed to update slack message: ' + error.message);
    }
  }

  async deleteSlackMessage(timeStamp: string, token: string) {
    try {
      const response = await axios.post(
        'https://slack.com/api/chat.delete',
        {
          channel: process.env.CHANNEL_ID,
          ts: timeStamp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Failed to delete slack message: ', error);
    }
  }

  generateOrderMessage(order): string {
    const hours = order.expiryDate.getHours().toString().padStart(2, '0');
    const minutes = order.expiryDate.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    let overallTotal = 0;

    let message = `> <@${order.createdBy.slackId}> hat eine Bestellung von *${
      order.provider.name
    }* gestartet: ${
      order.isActive ? `(Aktiv bis *${timeString} Uhr*)` : `*(geschlossen)*`
    }\n> \n> \n`;

    for (const participant of order.participants) {
      message += `> <@${participant.slackId}>\n`;
      let total = 0;

      for (const userDish of participant.dishes.filter(
        (userDish) => userDish.dish.provider.name === order.provider.name
      )) {
        message += `>    ${userDish.quantity} × ${userDish.dish.name}  -  *jeweils € ${userDish.dish.price}*\n`;
        total += userDish.quantity * +userDish.dish.price;
      }
      message += `> *Gesamt: € ${total.toFixed(2)}*\n> \n> \n`;
      overallTotal += total;
    }
    message += `> *Insgesamt: € ${overallTotal.toFixed(2)}*\n`;

    if (order.isActive) {
      if (order.deliveryMethod.toLowerCase() === 'pick-up')
        message += `> Die Bestellung muss *abgeholt* werden!`;
      else message += `> Die Bestellung wird *geliefert!*`;
    } else {
      const user = this.getRandomUser(order);
      if (user) {
        if (order.deliveryMethod.toLowerCase() === 'pick-up')
          message += `> <@${user.slackId}> muss die Bestellung *abholen!*`;
        else
          message += `> <@${user.slackId}> muss bei *${order.provider.name} bestellen!*`;
      }
    }
    return message;
  }

  getRandomUser(order: Order): User {
    const participants = order.participants;

    if (participants.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * participants.length);
    return participants[randomIndex];
  }
}
