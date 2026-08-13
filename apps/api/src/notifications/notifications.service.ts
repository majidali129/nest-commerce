import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Order } from 'src/orders/order.entity'
import { SlackService } from './slack/slack.service'
import { User } from 'src/users/user.entity'

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)

  constructor(
    private readonly slackService: SlackService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserNotification(user: User, message: string) {
    const name = user.name ?? user.email
    const email = user.email ?? 'unknown'
    const notificationMessage = `🤖 *New User Signup!* \n*Name:* ${name} \n*Email:* ${email}`;
    try {
        await this.slackService.sendMessage(notificationMessage)
    } catch (error) {
      this.logger.error(
        `Slack message failed: ${user.name} - ${user.email} - ${message} - ${error instanceof Error ? error.stack : String(error)}`,
        error instanceof Error ? error.stack : String(error),
      )
      throw error
    }
  }

  async sendOrderConfirmation(order: Order) {
    const email =
      order.user?.email ?? order.shippingAddress?.email ?? 'unknown'
    const currency = (order.currency || 'usd').toUpperCase()
    const total = `${order.totalAmount} ${currency}`
    const frontendUrl = (
      this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000'
    ).replace(/\/$/, '')
    const adminOrderUrl = `${frontendUrl}/admin/orders/${order.id}`
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=4A154B&color=fff&size=128`

    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎉 Order Confirmed!',
          emoji: true,
        },
      },
      { type: 'divider' },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `👥 *Customer Details*\n*Email:* \`${email}\`\n*Account Type:* Verified Buyer`,
        },
        accessory: {
          type: 'image',
          image_url: avatarUrl,
          alt_text: 'Customer Profile',
        },
      },
      { type: 'divider' },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `📦 *Order Reference:*\n\`${order.orderNumber}\` (#${order.id})`,
          },
          {
            type: 'mrkdwn',
            text: `💰 *Total Revenue:*\n*${total}*`,
          },
          {
            type: 'mrkdwn',
            text: `⚙️ *Fulfillment Status:*\n\`${order.status}\``,
          },
          {
            type: 'mrkdwn',
            text: '💳 *Payment Method:*\nStripe Checkout',
          },
        ],
      },
      { type: 'divider' },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '🔎 View In Admin Portal',
              emoji: true,
            },
            value: `view_order_${order.id}`,
            url: adminOrderUrl,
          },
        ],
      },
    ]

    try {
      await this.slackService.sendBlocks(
        blocks,
        `Order confirmed: ${order.orderNumber} — ${email} — ${total}`,
      )
    } catch (error) {
      this.logger.error(
        `Slack order confirmation failed for order ${order.id}`,
        error instanceof Error ? error.stack : String(error),
      )
      throw error
    }
  }
}
