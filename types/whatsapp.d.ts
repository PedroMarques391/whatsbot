import type * as WhatsApp from "whatsapp-web.js";

declare module "whatsapp-web.js" {
    interface GroupChat {
        pastParticipants: {
            id: { user: string };
            leaveTimestamp: number;
            leaveReason?: string;
        }[];
    }
    interface Message {
        _data: {
            id: {
                fromMe: boolean
            },
            notifyName: string;
            isViewOnce: boolean
        },

    }
}