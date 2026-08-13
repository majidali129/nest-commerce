import { ConfigService } from '@nestjs/config'
import { Injectable, Logger } from '@nestjs/common'

export type SlackBlock = Record<string, unknown>

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name)
  private readonly channel: string;
  private readonly oauthToken: string;
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.channel = this.configService.get<string>('SLACK_CHANNEL') ?? ''
    this.oauthToken = this.configService.get<string>('SLACK_OAUTH_TOKEN') ?? ''
    this.apiUrl = this.configService.get<string>('SLACK_API_URL') ?? ''
  }

  async sendMessage(text: string) {
    await this.post({ text })
  }

  async sendBlocks(blocks: SlackBlock[], fallbackText: string) {
    await this.post({ text: fallbackText, blocks })
  }

  private async post(payload: {
    text: string
    blocks?: SlackBlock[]
  }) {
    if (!this.apiUrl) {
      this.logger.warn('SLACK_API_URL is not set — skipping Slack message')
      return
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.oauthToken}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        channel: `#${this.channel}`,
      }),
    })

    const body = await response.text()
    if (!response.ok) {
      throw new Error(`Slack webhook failed (${response.status}): ${body}`)
    }
  }
}
