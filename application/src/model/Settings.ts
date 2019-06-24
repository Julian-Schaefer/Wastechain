export interface Settings {
    postUrl: string;
}

export const SettingsSchema = {
    type: 'object',
    required: ['postUrl'],
    properties: {
        postUrl: {
            type: 'string'
        }
    }
}