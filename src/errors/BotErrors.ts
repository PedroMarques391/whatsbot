export enum ErrorType {
  VALIDATION = "Validation",
  INTERNAL = "Internal",
  EXTERNAL_API = "ExternalAPI",
  PERMISSION = "Permission",
}

export class BotError extends Error {
  private _errorType: ErrorType;
  private _originalError?: Error;
  private _userMessage: string;
  private _message: string;

  constructor(
    logMessage: string,
    userMessage: string,
    errorType: ErrorType = ErrorType.INTERNAL,
    originalError?: Error,
  ) {
    super(logMessage);
    this.name = "BotError";
    this._errorType = errorType;
    this._message = logMessage;
    this._userMessage = userMessage;
    this._originalError = originalError;
  }

  get message(): string {
    return this._message;
  }

  get errorType(): ErrorType {
    return this._errorType;
  }

  get userMessage(): string {
    return (
      this._userMessage ||
      "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde."
    );
  }

  get originalError(): Error | undefined {
    return this._originalError;
  }

  static validation(userMessage: string, logMessage?: string) {
    return new BotError(
      logMessage || userMessage,
      userMessage,
      ErrorType.VALIDATION,
    );
  }

  static permission(userMessage: string, logMessage?: string) {
    return new BotError(
      logMessage || userMessage,
      userMessage,
      ErrorType.PERMISSION,
    );
  }

  static internal(
    logMessage: string,
    originalError: Error,
    userMessage?: string,
  ) {
    return new BotError(
      logMessage,
      userMessage ||
        "Algo falhou internamente. Avise meu desenvolvedor — de preferência com menos drama e mais contexto.",
      ErrorType.INTERNAL,
      originalError,
    );
  }

  static externalApi(
    logMessage: string,
    originalError: Error,
    userMessage?: string,
  ) {
    return new BotError(
      logMessage,
      userMessage ||
        "O serviço externo decidiu não colaborar agora. Tente novamente mais tarde, se ainda importar.",
      ErrorType.EXTERNAL_API,
      originalError,
    );
  }
}
