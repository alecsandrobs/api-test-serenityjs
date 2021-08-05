import * as dotenv from "dotenv"

let path: string = `${__dirname}/environments/.env.`
switch (process.env.ENV) {
  case 'local':
  case 'production':
    path += process.env.ENV
    break
  default:
    path += `production`
    break
}

dotenv.config({ path: path })

export const BASE_URL: any = process.env.BASE_URL
export const TIMEOUT: any = process.env.TIMEOUT

export class Properties {
  public static appHost: string = BASE_URL
  public static timeout: number = +TIMEOUT
}
