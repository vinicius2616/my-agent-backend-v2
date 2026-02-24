export type {
  IAuthRepository,
  AuthUserRecord,
  AuthSessionRecord,
} from './domain/repositories';
export type {
  IAuthSessionService,
  CreateSessionInput,
  SessionData,
  IAuthProviderService,
  SocialAuthInput as ProviderSocialAuthInput,
  SocialAuthResult as ProviderSocialAuthResult,
} from './domain/services';
export type {
  RegisterInput,
  RegisterOutput,
  LoginInput,
  LoginOutput,
  SocialAuthInput,
  SocialAuthOutput,
  GetSessionInput,
  SessionOutput,
  LogoutInput,
  LogoutOutput,
} from './application/dto';
export type {
  IRegisterUseCase,
  ILoginUseCase,
  ISocialAuthUseCase,
  IGetSessionUseCase,
  ILogoutUseCase,
} from './application/use-cases';
export {
  registerSchema,
  loginSchema,
  socialAuthSchema,
  getSessionSchema,
  logoutSchema,
} from './application/schemas';
export type {
  RegisterSchemaInput,
  LoginSchemaInput,
  SocialAuthSchemaInput,
  GetSessionSchemaInput,
  LogoutSchemaInput,
} from './application/schemas';
