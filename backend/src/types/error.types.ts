export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
}

export const ErrorMessages = {
  [HttpStatusCode.BAD_REQUEST]: 'Requisição inválida',
  [HttpStatusCode.UNAUTHORIZED]: 'Não autorizado',
  [HttpStatusCode.FORBIDDEN]: 'Acesso negado',
  [HttpStatusCode.NOT_FOUND]: 'Recurso não encontrado',
  [HttpStatusCode.CONFLICT]: 'Conflito',
  [HttpStatusCode.INTERNAL_SERVER_ERROR]: 'Erro interno do servidor',
  [HttpStatusCode.NOT_IMPLEMENTED]: 'Funcionalidade não implementada',
  [HttpStatusCode.BAD_GATEWAY]: 'Erro de gateway',
} as const;

export const AppErrorMessages = {
  // Autenticação
  USER_ALREADY_EXISTS: 'Usuário já cadastrado',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  TOKEN_NOT_FOUND: 'Token não encontrado',
  INVALID_TOKEN: 'Token inválido',

  // Empresas
  COMPANY_NOT_FOUND: 'Empresa não encontrada',
  USER_NOT_MEMBER: 'Você não é membro desta empresa',
  NO_PERMISSION_TO_INVITE:
    'Você não tem permissão para convidar usuários nesta empresa',
  USER_ALREADY_MEMBER: 'Usuário já é membro desta empresa',
  NO_PERMISSION_TO_EDIT: 'Você não tem permissão para editar esta empresa',
  ONLY_OWNER_CAN_DELETE: 'Apenas o criador pode deletar a empresa',
  MEMBER_REMOVAL_NOT_ALLOWED: 'Você não pode remover este membro',
  CANNOT_REMOVE_OWNER: 'OWNER não pode ser removido da empresa',
  CANNOT_UPDATE_OWNER_ROLE: 'OWNER não pode ter seu role alterado',
  CANNOT_PROMOTE_TO_OWNER: 'Não é possível promover membro para OWNER',

  // Convites
  INVITE_NOT_FOUND: 'Convite não encontrado',
  INVITE_INVALID: 'Convite inválido',
  INVITE_EXPIRED: 'Convite expirado',
  INVITE_EMAIL_MISMATCH: 'Convite não corresponde ao seu e-mail',
  INVITE_ALREADY_ACCEPTED: 'Convite já foi aceito',
} as const;

export const AppErrorCodeMap: Record<
  keyof typeof AppErrorMessages,
  HttpStatusCode
> = {
  // Autenticação
  USER_ALREADY_EXISTS: HttpStatusCode.CONFLICT,
  INVALID_CREDENTIALS: HttpStatusCode.UNAUTHORIZED,
  TOKEN_NOT_FOUND: HttpStatusCode.UNAUTHORIZED,
  INVALID_TOKEN: HttpStatusCode.UNAUTHORIZED,

  // Empresas
  COMPANY_NOT_FOUND: HttpStatusCode.NOT_FOUND,
  USER_NOT_MEMBER: HttpStatusCode.FORBIDDEN,
  NO_PERMISSION_TO_INVITE: HttpStatusCode.FORBIDDEN,
  USER_ALREADY_MEMBER: HttpStatusCode.CONFLICT,
  NO_PERMISSION_TO_EDIT: HttpStatusCode.FORBIDDEN,
  ONLY_OWNER_CAN_DELETE: HttpStatusCode.FORBIDDEN,
  MEMBER_REMOVAL_NOT_ALLOWED: HttpStatusCode.FORBIDDEN,
  CANNOT_REMOVE_OWNER: HttpStatusCode.FORBIDDEN,
  CANNOT_UPDATE_OWNER_ROLE: HttpStatusCode.FORBIDDEN,
  CANNOT_PROMOTE_TO_OWNER: HttpStatusCode.BAD_REQUEST,

  // Convites
  INVITE_NOT_FOUND: HttpStatusCode.NOT_FOUND,
  INVITE_INVALID: HttpStatusCode.NOT_FOUND,
  INVITE_EXPIRED: HttpStatusCode.BAD_REQUEST,
  INVITE_EMAIL_MISMATCH: HttpStatusCode.BAD_REQUEST,
  INVITE_ALREADY_ACCEPTED: HttpStatusCode.CONFLICT,
} as const;
