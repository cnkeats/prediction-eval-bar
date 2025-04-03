import { z } from 'zod'

const createEnv = () => {
  const envSchema = z.object({
    CLIENT_ID: z.string(),
    CLIENT_SECRET: z.string(),
    REDIRECT_URI: z.string().url(),
    ACCESS_TOKEN: z.string(),
    REFRESH_TOKEN: z.string(),
    BROADCASTER_ID: z.string(),
  })

  const envVars = Object.entries(import.meta.env).reduce<Record<string, string>>((acc, curr) => {
    const [key, value] = curr
    if (key.startsWith('VITE_')) {
      acc[key.replace('VITE_', '')] = value
    }
    return acc
  }, {})

  const parsedEnv = envSchema.safeParse(envVars)

  if (!parsedEnv.success) {
    const formattedErrors = Object.entries(parsedEnv.error.flatten().fieldErrors)
      .map(([key, errors]) => `- ${key}: ${errors.join(', ')}`)
      .join('\n')
    throw new Error(
      `Invalid environment configuration.\nThe following variables are missing or invalid:\n${formattedErrors}`,
    )
  }

  return parsedEnv.data
}

const env = createEnv()

export default env
