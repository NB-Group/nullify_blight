import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'], // To get user's private emails
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ): Promise<any> {
    try {
      const { id, username, emails } = profile;
      
      if (!emails || emails.length === 0) {
        console.error('GitHub OAuth: No email found in profile');
        return done(new Error('No email found in GitHub profile'), null);
      }

      const user = {
        githubId: id,
        email: emails[0].value,
        name: username || emails[0].value.split('@')[0], // fallback to email prefix
      };
      
      console.log('GitHub OAuth success:', { id, username, email: emails[0].value });
      done(null, user);
    } catch (error) {
      console.error('GitHub OAuth validation error:', error);
      done(error, null);
    }
  }
}
