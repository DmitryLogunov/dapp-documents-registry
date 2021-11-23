export type TokenType = {
  accessToken: string,
  userId: number,
  isActive: boolean
}

export type ValidationPayloadType = {
  sub: number,
  username: string,
  firstName: string,
  secondName: string,
  middleName: string,
  department: string,
  position: string,
  phone: string,
  internalTelephone: string,
  mobilePhone: string,
  email: string,
  userRole: string
};

export type ValidationPayloadResponseType = {
  id: number,
  username: string,
  firstName: string,
  secondName: string,
  middleName: string,
  department: string,
  position: string,
  phone: string,
  internalTelephone: string,
  mobilePhone: string,
  email: string,
  role: string
}